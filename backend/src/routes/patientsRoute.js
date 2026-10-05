const validate = require("../middlewares/validate");
const express = require("express");

const {
    patientCreateSchema,
} = require("../schemas/patientSchema");

const {
    getPatients,
    createPatient,
} = require("../controllers/patientController");

const router = express.Router();

router.get("/", getPatients);

router.post(
    "/",
    validate(patientCreateSchema),
    createPatient
);


module.exports = router;