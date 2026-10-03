const pool = require("../config/database");

const getPatients = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM patients ORDER BY id"
        );
        res.status(200).json({
            patients: result.rows,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
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