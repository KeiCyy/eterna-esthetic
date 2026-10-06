const validate = require("../middlewares/validate");
const validateParams = require("../middlewares/validateParams");
const express = require("express");

const {
    patientCreateSchema,
    patientIdSchema,
} = require("../schemas/patientSchema");

const {
    getPatients,
    createPatient,
    getPatientById
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


module.exports = router;