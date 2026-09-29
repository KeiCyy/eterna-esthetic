
const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());


app.get("/", (req, res) => {
    res.status(200).json({
        message: "Eterna Esthetic API",
    });
});

app.get("/patients", (req, res) => {
    res.status(200).json({
        patients: [],
    });
});

app.post("/patients", (req, res) => {
    console.log(req.body);

    res.status(200).json({
        message: "Patient Created",
    });
});



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

