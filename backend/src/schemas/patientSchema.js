const { z } = require("zod");

const patientCreateSchema = z.object({
    firstName: z.string().trim().min(1).max(100),
    lastName: z.string().trim().min(1).max(100),
    phone: z.string().trim().max(30).optional(),
    email: z.string().trim().email().max(255).optional(),
    birthDate: z.string().optional(),
    notes: z.string().optional(),
}).strict();

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

const patientQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().max(100).default(""),
}).strict();

module.exports = {
    patientCreateSchema,
    patientIdSchema,
    patientUpdateSchema,
    patientQuerySchema,
};