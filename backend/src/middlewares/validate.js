const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.sucess) {
            return next(result.error);
        };

        req.body = result.data;

        return next();
    };
};

module.exports = validate;