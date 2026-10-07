const validate = require("../middlewares/validate");
const validateParams = require("../middlewares/validateParams");
const express = require("express");

const {
    patientCreateSchema,
    patientIdSchema,
    patientUpdateSchema,
} = require("../schemas/patientSchema");

const {
    getPatients,
    createPatient,
    getPatientById,
    updatePatient,
} = require("../controllers/patientController");

const router = express.Router();

router.get("/", getPatients);

router.get(
    "/:id",
    validateParams(patientIdSchema),
    getPatientById);

router.post(
    "/",
    validate(patientCreateSchema),
    createPatient
);

router.patch(
    "/:id",
    validateParams(patientIdSchema),
    validate(patientUpdateSchema),
    updatePatient
);


module.exports = router;