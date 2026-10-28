const validateQuery = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.query);

        if (!result.success) {
            return next(result.error);
        }

        res.locals.validateQuery = result.data;

        return next();
    };
};

module.exports = validateQuery;