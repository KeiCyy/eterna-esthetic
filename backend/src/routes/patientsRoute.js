
const createPatientController = require("../controllers/patientController");

const validate = require("../middlewares/validate");
const validateParams = require("../middlewares/validateParams");
const validateQuery = require("../middlewares/validateQuery");
const express = require("express");

const {
    patientCreateSchema,
    patientIdSchema,
    patientUpdateSchema,
    patientQuerySchema,
} = require("../schemas/patientSchema");

const {
    getPatients,
    createPatient,
    getPatientById,
    updatePatient,
    deactivatePatient,
} = require("../controllers/patientController");

const createPatientRouter = (controller) => {

    const router = express.Router();

    router.get(
        "/",
        validateQuery(patientQuerySchema),
        controller.getPatients);

    router.get(
        "/:id",
        validateParams(patientIdSchema),
        controller.getPatientById);

    router.post(
        "/",
        validate(patientCreateSchema),
        controller.createPatient
    );

    router.patch(
        "/:id",
        validateParams(patientIdSchema),
        validate(patientUpdateSchema),
        controller.updatePatient
    );

    router.delete(
        "/:id",
        validateParams(patientIdSchema),
        controller.deactivatePatient
    );

    return router;
};

module.exports = createPatientRouter;