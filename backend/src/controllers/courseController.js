const { validationResult } = require('express-validator');
const courseModel = require('../models/courseModel');

exports.getAll = async (req, res, next) => {
    try {
        const courses = await courseModel.getAll();
        res.json(courses);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const course = await courseModel.getById(req.params.id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json(course);
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
        const course = await courseModel.create(req.body);
        res.status(201).json(course);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const updated = await courseModel.update(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const removed = await courseModel.remove(req.params.id);
        if (!removed) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json({ message: 'Course deleted' });
    } catch (err) {
        next(err);
    }
};