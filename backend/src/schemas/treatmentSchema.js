
const { z } = require("zod");

// Validación de precios monetarios.
// Ejemplos válidos: "75000", "75000.00", "29900.50"
const priceSchema = z
    .string()
    .trim()
    .regex(
        /^\d{1,10}(\.\d{1,2})?$/,
        "El precio debe ser un número positivo con máximo 2 decimales"
    )
    .refine(
        (value) => Number(value) > 0,
        "El precio debe ser mayor que cero"
    );

// Datos necesarios para crear un tratamiento.
const treatmentCreateSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "El nombre es obligatorio")
        .max(150, "El nombre no puede superar 150 caracteres"),

    description: z.string().trim().nullish(),

    price: priceSchema,

    durationMinutes: z
        .number()
        .int("La duración debe ser un número entero")
        .positive("La duración debe ser mayor que cero")
        .nullish()
}).strict();

// Permite modificar solamente los campos enviados.
const treatmentUpdateSchema = treatmentCreateSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        "Debes proporcionar al menos un campo para actualizar"
    );

// Validación del ID recibido en la URL.
const treatmentIdParamSchema = z.object({
    id: z.coerce.number().int().positive()
});

// Validar actualizacion
const treatmentQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(10),

    search: z.string().trim().max(100).default("")
}).strict();


module.exports = {
    treatmentCreateSchema,
    treatmentUpdateSchema,
    treatmentIdParamSchema,
    treatmentQuerySchema,
};
