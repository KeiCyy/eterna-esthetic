const test = require("node:test");
const assert = require("node:assert").strict;

const express = require("express");

const createPatientRouter = require("../src/routes/patientsRoute");
const errorHandler = require("../src/middlewares/errorHandler");
const { getPatients } = require("../src/controllers/patientController");

const fakeController = {
    getPatients: async (req, res) => {
        return res.status(200).json({
            data: [
                {
                    id: 1,
                    firstName: "Kevin",
                    lastName: "Chacon",
                    phone: "86868686",
                },
            ],
            pagination: {
                page: 1,
                limit: 10,
                total: 1,
                totalPages: 1,
            },
        });
    },

    getPatiendById: async (req, res) => {
        return res.status(404).json({
            message: "Paciente no encontrado",
        });
    },

    createPatient: async (req, res) => {
        return res.status(201).json(req.body);
    },

    updatePatient: async (req, res) => {
        return res.status(200).json(req.body);
    },

    deactivatePatient: async (req, res) => {
        return res.status(200).json({
            message: "Paciente desactivado correctamente",
        });
    },
};

const app = express();

app.use(express.json());
app.use("/patients", createPatientRouter(fakeController));
app.use(errorHandler);

test("GET /patients devuelve pacientes simulados", async () => {
    const server = app.listen(0);

    try {
        const port = server.address().port;
        const response = await fetch(
            `https://127.0.0.1:${port}/patients`
        );

        const body = await response.json();

        assert.equal(response.status, 200);
        assert.equal(body.data.length, 1);
        assert.equal(body.data[0].firstName, "Kevin");
    } finally {
        await new Promise((resolve, reject) => {
            server.close((error) => {
                if (error) reject(error);
                else resolve();
            });
        });
    }
});


test("GET /patients?page=0 devuelve 400", async () => {
    const server = app.listen(0);

    try {
        const port = server.address().port;

        const response = await fetch(
            `http://127.0.0.1:${port}/patients?page=0`
        );

        const body = await response.json();

        assert.equal(response.status, 400);
        assert.equal(body.message, "Datos de entrada inválidos");
    } finally {
        await new Promise((resolve, reject) => {
            server.close((error) => {
                if (error) reject(error);
                else resolve();
            });
        });
    }
});

