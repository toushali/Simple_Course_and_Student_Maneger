const { validationResult } = require('express-validator');
const enrollmentModel = require('../models/enrollmentModel');

exports.enroll = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { student_id, course_id } = req.body;
        const enrollment = await enrollmentModel.enroll(student_id, course_id);
        res.status(201).json({
            message: 'Enrollment successful',
            enrollment
        });
    } catch (err) {
        next(err);
    }
};