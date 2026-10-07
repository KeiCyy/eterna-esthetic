const validateParams = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.params);

        if (!result.sucess) {
            return res.status(400).json({
                message: "Invalid input parameters",
                errors: result.errors.issues,
            });
        };

        req.params = result.data;

        next();
    };
};

module.exports = validateParams;