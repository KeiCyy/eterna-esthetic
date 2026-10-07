const { z } = require("zod");

const patientCreateSchema = z.object({
    first_name: z.string().trim().min(1).max(100),
    last_name: z.string().trim().min(1).max(100),
    phone: z.string().trim().max(30).optional(),
    email: z.string().trim().email().max(255).optional(),
    birth_date: z.string().optional(),
    notes: z.string().optional(),
});

const patientIdSchema = z.object({
    id: z.coerce.number().int().positive(),
});

const patientUpdateSchema = patientCreateSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field must be provided",
        }
    );

module.exports = {
    patientCreateSchema,
    patientIdSchema,
    patientUpdateSchema
};