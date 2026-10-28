const prisma = require("../config/prisma");
const calculatePagination = require("../utils/pagination");

//Obtener todos los pacientes
const getAllPatients = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const where = {
        isActive: true,
    };

    if (search) {
        where.OR = [
            {
                firstName: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            {
                lastName: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        ];
    };

    const patients = await prisma.patient.findMany({
        where,
        select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
        },
        orderBy: {
            id: "asc",
        },
        skip,
        take: limit,
    });

    const total = await prisma.patient.count({
        where,
    });

    const pagination = calculatePagination(page, limit, total);

    return {
        data: patients,
        pagination: {
            page,
            limit,
            total,
            totalPages: pagination.totalPages,
        },
    };
};

//Obtener un paciente activo por su ID
const getPatientById = async (id) => {
    return prisma.patient.findFirst({
        where: {
            id,
            isActive: true,
        },
    });
};

// Crear paciente y validacion
const createPatient = async (data) => {
    const {
        firstName,
        lastName,
        phone,
        email,
        birthDate,
        notes,
    } = data;

    return prisma.patient.create({
        data: {
            firstName,
            lastName,
            phone,
            email,
            birthDate: birthDate ? new Date(birthDate) : null,
            notes,
        },
    });
};

// Modificar paciente, status activo
const updatePatient = async (id, data) => {
    const updateData = {
        ...data,
    };

    if (updateData.birthDate !== undefined) {
        updateData.birthDate = updateData.birthDate
            ? new Date(updateData.birthDate)
            : null;
    };

    updateData.updatedAt = new Date();

    const patient = await prisma.patient.updateManyAndReturn({
        where: {
            id,
            isActive: true,
        },
        data: updateData,
    });

    return patient[0] ?? null;
};

// Desactivar paciente, soft delete
const deactivatePatient = async (id) => {
    return prisma.patient.update({
        where: {
            id,
            isActive: true,
        },
        data: {
            isActive: false,
            deactivatedAt: new Date(),
            updatedAt: new Date(),
        },
    });
};

module.exports = {
    getAllPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deactivatePatient,
};