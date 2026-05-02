const db = require('../config/db');

exports.getAll = async () => {
    const { rows } = await db.query('SELECT * FROM students ORDER BY id');
    return rows;
};

exports.getById = async (id) => {
    const { rows } = await db.query('SELECT * FROM students WHERE id = $1', [id]);
    return rows[0] || null;
};

exports.create = async ({ name, email }) => {
    const { rows } = await db.query(
        'INSERT INTO students (name, email) VALUES ($1, $2) RETURNING *',
        [name, email]
    );
    return rows[0];
};

exports.update = async (id, { name, email }) => {
    const { rows } = await db.query(
        `UPDATE students
         SET name = $1, email = $2
         WHERE id = $3
         RETURNING *`,
        [name, email, id]
    );
    return rows[0] || null;
};

exports.remove = async (id) => {
    const { rowCount } = await db.query(
        'DELETE FROM students WHERE id = $1',
        [id]
    );
    return rowCount > 0;
};