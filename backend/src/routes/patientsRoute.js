const express = require("express");

const {
    getPatients,
    createPatient,
} = require("../controllers/patientController.js");

const router = express.Router();

router.get("/", getPatients);

router.post("/", createPatient);


module.exports = router;