const express = require('express');
const { body, param } = require('express-validator');
const controller = require('../controllers/courseController');
const auth = require('../middleware/auth');

const router = express.Router();

const courseBodyValidators = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 200 }).withMessage('Title too long (max 200 chars)'),
    body('description')
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('Description must be a string'),
    body('max_capacity')
        .notEmpty().withMessage('max_capacity is required')
        .isInt({ min: 1 }).withMessage('max_capacity must be a positive integer')
];

const idParamValidator = param('id')
    .isInt({ min: 1 }).withMessage('ID must be a positive integer');

// Public reads
router.get('/',    controller.getAll);
router.get('/:id', idParamValidator, controller.getById);

// Protected writes (require x-api-key header)
router.post('/',      auth, courseBodyValidators, controller.create);
router.put('/:id',    auth, idParamValidator, courseBodyValidators, controller.update);
router.delete('/:id', auth, idParamValidator, controller.remove);

module.exports = router;