
const test = require("node:test");
const assert = require("node:assert").strict;
const express = require("express");

const createTreatmentController = require(
    "../src/controllers/treatmentController"
);

const createTreatmentRouter = require(
    "../src/routes/treatmentsRoute"
);

const errorHandler = require(
    "../src/middlewares/errorHandler"
);


const createTestApp = (fakeService) => {
    const app = express();
    app.use(express.json());

    const controller = createTreatmentController(fakeService);

    app.use(
        "/treatments",
        createTreatmentRouter(controller)
    );

    app.use(errorHandler);

    return app;
};

const request = async (app, path, options = {}) => {
    const server = app.listen(0);

    try {
        const port = server.address().port;

        const response = await fetch(
            `http://127.0.0.1:${port}${path}`,
            options
        );

        const rawBody = await response.text();

        let body;

        try {
            body = JSON.parse(rawBody);
        } catch {
            console.error("Respuesta no JSON:", {
                status: response.status,
                contentType: response.headers.get("content-type"),
                body: rawBody.slice(0, 1000)
            });

            throw new Error(
                `El servidor devolvió una respuesta no JSON (HTTP ${response.status})`
            );
        }

        return {
            status: response.status,
            body
        };

    } finally {
        await new Promise((resolve, reject) => {
            server.close((error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    };
};


test("GET /treatments devuelve resultados paginados", async () => {
    const fakeService = {
        getAllTreatments: async ({ page, limit, search }) => {
            assert.equal(page, 1);
            assert.equal(limit, 10);
            assert.equal(search, "");

            return {
                data: [
                    {
                        id: 1,
                        name: "Subcisión",
                        price: "75000",
                        isActive: true
                    }
                ],
                pagination: {
                    page: 1,
                    limit: 10,
                    total: 1,
                    totalPages: 1
                }
            };
        }
    };

    const app = createTestApp(fakeService);

    const response = await request(app, "/treatments");

    assert.equal(response.status, 200);
    assert.equal(response.body.data.length, 1);
    assert.equal(response.body.data[0].name, "Subcisión");
    assert.equal(response.body.pagination.total, 1);
});


test("POST /treatments devuelve 201 al crear un tratamiento", async () => {
    const fakeService = {
        createTreatment: async (data) => ({
            id: 2,
            ...data,
            isActive: true
        })
    };

    const app = createTestApp(fakeService);

    const response = await request(app, "/treatments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: "Limpieza facial",
            price: "30000.00",
            durationMinutes: 60
        })
    });

    assert.equal(response.status, 201);
    assert.equal(response.body.id, 2);
    assert.equal(response.body.price, "30000.00");
});


test("POST /treatments rechaza precios negativos", async () => {
    const fakeService = {
        createTreatment: async () => {
            throw new Error("El servicio no debería ejecutarse");
        }
    };

    const app = createTestApp(fakeService);

    const response = await request(app, "/treatments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: "Tratamiento inválido",
            price: "-15000"
        })
    });

    assert.equal(response.status, 400);
});


test("GET /treatments/:id devuelve 404 si no existe", async () => {
    const fakeService = {
        getTreatmentbyId: async () => null
    };

    const app = createTestApp(fakeService);

    const response = await request(app, "/treatments/99999");

    assert.equal(response.status, 404);
    assert.equal(
        response.body.message,
        "Tratamiento no encontrado"
    );
});


test("PATCH /treatments/:id actualiza un tratamiento", async () => {
    const fakeService = {
        updateTreatment: async (id, data) => ({
            id,
            name: "Subcisión",
            ...data,
            isActive: true
        })
    };

    const app = createTestApp(fakeService);

    const response = await request(app, "/treatments/1", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            price: "85000.00"
        })
    });

    assert.equal(response.status, 200);
    assert.equal(response.body.price, "85000.00");
});


test("DELETE /treatments/:id desactiva un tratamiento", async () => {
    const fakeService = {
        deactivateTreatment: async (id) => ({
            id,
            name: "Subcisión",
            isActive: false
        })
    };

    const app = createTestApp(fakeService);

    const response = await request(app, "/treatments/1", {
        method: "DELETE"
    });

    assert.equal(response.status, 200);
    assert.equal(response.body.treatment.isActive, false);
});


test("GET /treatments acepta paginación y búsqueda", async () => {
    const fakeService = {
        getAllTreatments: async ({ page, limit, search }) => {
            assert.equal(page, 2);
            assert.equal(limit, 5);
            assert.equal(search, "laser");

            return {
                data: [],
                pagination: {
                    page: 2,
                    limit: 5,
                    total: 0,
                    totalPages: 0
                }
            };
        }
    };

    const app = createTestApp(fakeService);

    const response = await request(
        app,
        "/treatments?page=2&limit=5&search=laser"
    );

    assert.equal(response.status, 200);
    assert.deepEqual(response.body.data, []);
});


test("GET /treatments rechaza páginas inválidas", async () => {
    let serviceCalled = false;

    const fakeService = {
        getAllTreatments: async () => {
            serviceCalled = true;
            return { data: [], pagination: {} };
        }
    };

    const app = createTestApp(fakeService);

    const response = await request(
        app,
        "/treatments?page=-1"
    );

    assert.equal(response.status, 400);
    assert.equal(serviceCalled, false);
});


test("PATCH /treatments/:id rechaza un body vacío", async () => {
    let serviceCalled = false;

    const fakeService = {
        updateTreatment: async () => {
            serviceCalled = true;
            return null;
        }
    };

    const app = createTestApp(fakeService);

    const response = await request(app, "/treatments/1", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({})
    });

    assert.equal(response.status, 400);
    assert.equal(serviceCalled, false);
});
