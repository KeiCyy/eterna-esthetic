const validateParams = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.params);

        if (!result.success) {
            return next(result.error);
        }

        return next();
    };
};

module.exports = validateParams;