const express = require('express');
const { body, param } = require('express-validator');
const controller = require('../controllers/studentController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation rules reused by POST and PUT
const studentBodyValidators = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 120 }).withMessage('Name too long (max 120 chars)'),
    body('email')
        .trim()
        .isEmail().withMessage('Valid email required')
        .normalizeEmail()
];

const idParamValidator = param('id')
    .isInt({ min: 1 }).withMessage('ID must be a positive integer');

// Public reads
router.get('/',    controller.getAll);
router.get('/:id', idParamValidator, controller.getById);

// Protected writes (require x-api-key header)
router.post('/',      auth, studentBodyValidators, controller.create);
router.put('/:id',    auth, idParamValidator, studentBodyValidators, controller.update);
router.delete('/:id', auth, idParamValidator, controller.remove);

module.exports = router;