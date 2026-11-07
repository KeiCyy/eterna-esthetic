const { updateTreatment } = require("../services/treatmentService");
const AppError = require("../utils/AppError");

const createTreatmentController = (treatmentService) => {

    const createTreatment = async (req, res) => {
        const treatment = await treatmentService.createTreatment(
            req.body
        );
        return res.status(201).json(treatment);
    };

    const getTreatments = async (req, res) => {
        const { page, limit, search } = res.locals.validatedQuery;

        const result = await treatmentService.getAllTreatments({
            page, limit, search
        });

        return res.status(200).json(result);
    };

    const getTreatmentbyId = async (req, res) => {
        const id = Number(req.params.id);

        const treatment = await treatmentService.getTreatmentbyId(id);

        if (!treatment) {
            throw new AppError("Tratamiento no encontrado", 404);
        };

        return res.status(200).json(treatment);
    };

    const updateTreatment = async (req, res) => {
        const id = Number(req.params.id);

        const treatment = await treatmentService.updateTreatment(id, req.body);

        if (!treatment) {
            throw new AppError("Tratamiento no encontrado", 404);
        };

        return res.status(200).json(treatment);
    };

    const deactivateTreatment = async (req, res) => {
        const id = Number(req.params.id);

        const treatment = await treatmentService.deactivateTreatment(id);

        if (!treatment) {
            throw new AppError("Tratamiento no encontrado", 404);
        };

        return res.status(200).json({
            message: "Tratamiento desactivado correctamente",
            treatment
        });
    };

    return {
        createTreatment,
        getTreatments,
        getTreatmentbyId,
        updateTreatment,
        deactivateTreatment,
    };
};

module.exports = createTreatmentController;