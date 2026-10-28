const patientService = require("../services/patientService");
const AppError = require("../utils/AppError");

const createPatientController = (patientService) => {

    const getPatients = async (req, res) => {
        const { page, limit, search } = res.locals.validatedQuery;

        const result = await patientService.getAllPatients(
            page,
            limit,
            search,
        );

        return res.status(200).json(result);
    };


    const getPatientById = async (req, res) => {

        const id = Number(req.params.id);

        const patient = await patientService.getPatientById(id);

        if (!patient) {
            throw new AppError("Paciente no encontrado", 404);
        }

        return res.status(200).json(patient);
    };


    const createPatient = async (req, res) => {
        const patient = await patientService.createPatient(req.body);

        return res.status(201).json(patient);
    };


    const updatePatient = async (req, res) => {
        const id = Number(req.params.id);

        const patient = await patientService.updatePatient(id, req.body);

        if (!patient) {
            throw new AppError("Paciente no encontrado", 404);
        };

        return res.status(200).json(patient);

    };

    const deactivatePatient = async (req, res) => {
        const id = Number(req.params.id);

        const patient = await patientService.deactivatePatient(id);

        return res.status(200).json({
            message: "Paciente desactivado correctamente",
            patient,
        });
    };


    return {
        getPatients,
        getPatientById,
        createPatient,
        updatePatient,
        deactivatePatient,
    };
};

module.exports = createPatientController;