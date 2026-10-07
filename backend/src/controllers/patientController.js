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


const getPatientById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT *
            FROM patients
            WHERE id = $1
            LIMIT 1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Patient Not Found"
            });
        };

        res.status(200).json({
            patient: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });
    };
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


const updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const allowedFields = [
            "first_name",
            "last_name",
            "phone",
            "email",
            "birth_date",
            "notes",
        ];

        const fields = [];
        const values = [];

        let parameterIndex = 1;

        for (const [key, value] of Object.entries(updates)) {
            if (allowedFields.includes(key)) {
                fields.push(`${key} = $${parameterIndex}`);
                values.push(value);

                parameterIndex++;
            }
        };

        values.push(id);

        const query = `
            UPDATE patients
            SET
                ${fields.join(", ")},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $${parameterIndex}
            RETURNING *
        `;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            res.status(400).json({
                message: "Patient Not Found"
            });
        };

        res.status(200).json({
            patient: result.rows[0]
        });
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

};

const deletePatient = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            UPDATE patients
            SET
                is_active = FALSE,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Patient not found",
            });
        };

        res.status(200).json({
            message: "Patient deactivated successfully",
            patient: result.rows[0],
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });
    };
};


module.exports = {
    getPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient,
};