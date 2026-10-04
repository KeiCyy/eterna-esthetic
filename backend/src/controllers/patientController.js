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

const createPatient = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            phone,
            email,
            birth_date,
            notes,
        } = req.body;

        const result = await pool.query(
            `
            INSERT INTO patients (
                first_name,
                last_name,
                phone,
                email,
                birth_date,
                notes
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
            [
                first_name,
                last_name,
                phone,
                email,
                birth_date,
                notes,
            ]
        );

        res.status(200).json({
            patient: result.rows[0],
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error",
        });
    }
};

module.exports = {
    getPatients,
    createPatient,
};