const { ZodError } = require("zod");

const errorHandler = (err, req, res, next) => {
    console.error("Error caputarado: ", err);

    if (res.headersSent) {
        return next(err);
    };

    //Errores de validacion de zod
    if (err instanceof ZodError) {
        return res.status(400).json({
            message: "Datos de entrada invalidos",
            errors: err.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    };

    //Errores controlados de nuestra aplicacion
    if (err.isOperational === true) {
        return res.status(err.statusCode).json({
            message: err.message,
        });
    };


    //Prisma: registro no encontrado
    if (err.code === "P2025") {
        return res.status(404).json({
            message: "El registro no existe o ya no esta disponible",
        });
    };

    //Prisma: restriccion de unicidad
    if (err.code === "P2002") {
        return res.status(409).json({
            message: "Ya existe un registro con esos datos unicos",
        });
    };

    //Error inesperado
    return res.status(500).json({
        message: "Error interno del servidor",
    });
};

module.exports = errorHandler;