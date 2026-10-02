const express = require("express");
const patientRoutes = require("./routes/patientsRoute.js");


const app = express();

app.use(express.json());


app.get("/", (req, res) => {
    res.status(200).json({
        message: "Eterna Esthetic API",
    });
});

app.use("/patients", patientRoutes);


module.exports = app;