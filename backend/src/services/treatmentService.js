const prisma = require("../config/prisma");
const { Prisma } = require("../generated/prisma");

//crear un nuevo tratamiento
const createTreatment = async (data) => {
    const {
        name,
        description,
        price,
        durationMinutes
    } = data;

    const treatment = await prisma.treatment.create({
        data: {
            name,
            description,
            price: new Prisma.Decimal(price),
            durationMinutes
        }
    });

    return treatment;
};

//Obtener los tratamientos activos
const getAllTreatments = async ({ page, limit, search }) => {
    const skip = (page - 1) * limit;

    const where = {
        isActive: true,
        ...(search && {
            name: {
                contains: search,
                mode: "insensitive"
            }
        })
    };

    const [treatments, total] = await prisma.$transaction([
        prisma.treatment.findMany({
            where,
            skip,
            take: limit,
            orderBy: [
                { name: "asc" },
                { id: "asc" }
            ]
        }),
        prisma.treatment.count({
            where
        })
    ]);

    return {
        data: treatments,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

//Obtener tratamiento por ID
const getTreatmentbyId = async () => {
    const treatment = await prisma.treatment.findFirst({
        where: {
            id,
            isActive: true
        }
    });

    return treatment;
};

//Actualizar un tratamiento
const updateTreatment = async (id, data) => {
    const updateData = { ...data };

    if (updateData.price !== undefined) {
        updateData.price = new Prisma.Decimal(updateData.price);
    };

    const treatments = await prisma.treatment.updateManyAndReturn({
        where: {
            id,
            isActive: true
        },
        data: updateData
    });

    return treatments[0] ?? null;
};

//Desactivar tratamiento
const deactivateTreatment = async (id) => {
    const treatments = await prisma.treatment.updateManyAndReturn({
        where: {
            id,
            isActive: true
        },
        data: {
            isActive: false
        }
    });

    return treatments[0] ?? null;
};

module.exports = {
    createTreatment,
    getAllTreatments,
    getTreatmentbyId,
    updateTreatment,
    deactivateTreatment,
};