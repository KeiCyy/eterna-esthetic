const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.sucess) {
            return res.status(400).json({
                message: "Invalid request data",
                errors: result.error.issues,
            });
        }

        req.body = result.data;

        next();
    };
};

module.exports = validate;