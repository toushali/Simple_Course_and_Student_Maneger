const express = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/enrollmentController');
const auth = require('../middleware/auth');

const router = express.Router();

const enrollmentValidators = [
    body('student_id')
        .notEmpty().withMessage('student_id is required')
        .isInt({ min: 1 }).withMessage('student_id must be a positive integer'),
    body('course_id')
        .notEmpty().withMessage('course_id is required')
        .isInt({ min: 1 }).withMessage('course_id must be a positive integer')
];

// Protected POST — require x-api-key header
router.post('/', auth, enrollmentValidators, controller.enroll);

module.exports = router;