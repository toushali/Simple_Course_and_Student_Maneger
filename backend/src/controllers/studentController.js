const { validationResult } = require('express-validator');
const studentModel = require('../models/studentModel');

exports.getAll = async (req, res, next) => {
    try {
        const students = await studentModel.getAll();
        res.json(students);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const student = await studentModel.getById(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(student);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const student = await studentModel.create(req.body);
        res.status(201).json(student);
    } catch (err) {
        // PostgreSQL unique-violation error code
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Email already exists' });
        }
        next(err);
    }
};

exports.update = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const updated = await studentModel.update(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(updated);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Email already exists' });
        }
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const removed = await studentModel.remove(req.params.id);
        if (!removed) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json({ message: 'Student deleted' });
    } catch (err) {
        next(err);
    }
};