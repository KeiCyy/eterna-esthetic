const getPatients = (req, res) => {
    res.status(200).json({
        patients: [],
    });
};

const createPatient = (req, res) => {
    console.log(req.body);

    res.status(201).json({
        message: "Patient created",
    });
};

module.exports = {
    getPatients,
    createPatient,
};