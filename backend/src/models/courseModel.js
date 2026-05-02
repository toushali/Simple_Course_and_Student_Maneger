const db = require('../config/db');

exports.getAll = async () => {
    const { rows } = await db.query('SELECT * FROM courses ORDER BY id');
    return rows;
};

exports.getById = async (id) => {
    const { rows } = await db.query('SELECT * FROM courses WHERE id = $1', [id]);
    return rows[0] || null;
};

exports.create = async ({ title, description, max_capacity }) => {
    const { rows } = await db.query(
        `INSERT INTO courses (title, description, max_capacity)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [title, description || null, max_capacity]
    );
    return rows[0];
};

exports.update = async (id, { title, description, max_capacity }) => {
    const { rows } = await db.query(
        `UPDATE courses
         SET title = $1, description = $2, max_capacity = $3
         WHERE id = $4
         RETURNING *`,
        [title, description || null, max_capacity, id]
    );
    return rows[0] || null;
};

exports.remove = async (id) => {
    const { rowCount } = await db.query(
        'DELETE FROM courses WHERE id = $1',
        [id]
    );
    return rowCount > 0;
};