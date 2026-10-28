const test = require("node:test");
const assert = require("node:assert").strict;

const express = require("express");

const createPatientController = require("../src/controllers/patientController");
const createPatientRouter = require("../src/routes/patientsRoute");
const errorHandler = require("../src/middlewares/errorHandler");
const { getPatientById, createPatient } = require("../src/services/patientService");

const createTestApp = (fakeService) => {
    const app = express();

    app.use(express.json());

    const controller = createPatientController(fakeService);

    app.use("/patients", createPatientRouter(controller));
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

        return {
            status: response.status,
            body: await response.json(),
        };
    } finally {
        await new Promise((resolve, reject) => {
            server.close((error) => {
                if (error) reject(error);
                else resolve();
            });
        });
    }
};



//pruebas
test("GET /patients/:id devuelve 200 si existe", async () => {
    const fakeService = {
        getPatientById: async (id) => ({
            id,
            firstName: "Kevin",
            lastName: "Chacon",
        }),
    };

    const app = createTestApp(fakeService);

    const response = await request(app, "/patients/15");

    assert.equal(response.status, 200);
    assert.equal(response.body.id, 15);
    assert.equal(response.body.firstName, "Kevin");
});

test("GET /patients/:id devuelve 404 si no existe", async () => {
    const fakeService = {
        getPatientById: async () => null,
    };

    const app = createTestApp(fakeService);

    const response = await request(app, "/patients/9999");

    assert.equal(response.status, 404);
    assert.equal(response.body.message, "Paciente no encontrado");
});

test("POST /patients devuelve 201 al crear un paciente", async () => {
    const fakeService = {
        createPatient: async (data) => ({
            id: 25,
            ...data,
        })
    };

    const app = createTestApp(fakeService);

    const response = await request(app, "/patients", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            firstName: "Bryan",
            lastName: "Chacon"
        })
    });

    assert.equal(response.status, 201);
    assert.equal(response.body.id, 25);
    assert.equal(response.body.firstName, "Bryan");
});

test("PATCH /patients/:id devuelve 404 si no existe", async () => {
    const fakeService = {
        updatePatient: async () => null,
    };

    const app = createTestApp(fakeService);

    const response = await request(app, "/patients/99999", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            firstName: "Nuevo nombre",
        }),
    });

    assert.equal(response.status, 404);
    assert.equal(response.body.message, "Paciente no encontrado");
});

test("Un error inesperado devuelve 500", async () => {
    const fakeService = {
        getPatientById: async () => {
            throw new Error("Error interno de prueba");
        },
    };

    const app = createTestApp(fakeService);

    const response = await request(app, "/patients/15");

    assert.equal(response.status, 500);
    assert.equal(response.body.message, "Error interno del servidor");
});