const express = require("express");

const validate = require("../middlewares/validate");

const validateParams = require("../middlewares/validateParams");
const validateQuery = require("../middlewares/validateQuery")

const {
    treatmentCreateSchema,
    treatmentUpdateSchema,
    treatmentIdParamSchema,
    treatmentQuerySchema,
} = require("../schemas/treatmentSchema");

const createTreatmentRouter = (controller) => {
    const router = express.Router();

    router.get(
        "/",
        validateQuery(treatmentQuerySchema),
        controller.getTreatments);

    router.post("/", validate(treatmentCreateSchema), controller.createTreatment);

    router.get(
        "/:id",
        validateParams(treatmentIdParamSchema),
        controller.getTreatmentbyId
    );

    router.patch(
        "/:id",
        validateParams(treatmentIdParamSchema),
        validate(treatmentUpdateSchema),
        controller.updateTreatment
    );

    router.delete(
        "/:id",
        validateParams(treatmentIdParamSchema),
        controller.deactivateTreatment
    );

    return router;
};

module.exports = createTreatmentRouter;