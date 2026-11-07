const express = require("express");

const patientService = require("./services/patientService");
const createPatientController = require("./controllers/patientController");
const createPatientRouter = require("./routes/patientsRoute");

const errorHandler = require("./middlewares/errorHandler");

const treatmentService = require("./services/treatmentService");
const createTreatmentController = require("./controllers/treatmentController");
const createTreatmentRouter = require("./routes/treatmentsRoute");


const app = express();

app.use(express.json());


app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Eterna Esthetic API",
    });
});

const patientController = createPatientController(patientService);

const treatmentController = createTreatmentController(treatmentService);

app.use("/patients", createPatientRouter(patientController));

app.use("/treatments", createTreatmentRouter(treatmentController));

app.use(errorHandler);


module.exports = app;