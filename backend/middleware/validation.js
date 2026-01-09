/**
 * Request Validation Middleware
 * Uses Joi to validate request payloads
 */

const Joi = require('joi');

/**
 * Validation schema for starting an interview
 */
const startInterviewSchema = Joi.object({
    role: Joi.string().optional(),
    difficulty: Joi.string().optional(),
    duration: Joi.number().min(5).max(120).optional(),
});

/**
 * Validation schema for processing an answer
 */
const processAnswerSchema = Joi.object({
    interviewId: Joi.string().required(),
    transcript: Joi.string().min(1).required(),
});

/**
 * Middleware to validate request body against a schema
 */
function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({
                error: 'Validation failed',
                details: errors,
            });
        }

        // Replace req.body with validated value
        req.body = value;
        next();
    };
}

module.exports = {
    startInterviewSchema,
    processAnswerSchema,
    validate,
};
