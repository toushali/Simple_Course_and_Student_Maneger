const db = require('../config/db');

exports.enroll = async (studentId, courseId) => {
    // Get a dedicated client so BEGIN/COMMIT/ROLLBACK all run on the same connection
    const client = await db.getClient();

    try {
        await client.query('BEGIN');

        // 1. Lock the course row and fetch capacity
        //    FOR UPDATE prevents concurrent transactions from reading until we commit
        const courseResult = await client.query(
            'SELECT max_capacity FROM courses WHERE id = $1 FOR UPDATE',
            [courseId]
        );
        if (courseResult.rows.length === 0) {
            const err = new Error('Course not found');
            err.status = 404;
            throw err;
        }
        const maxCapacity = courseResult.rows[0].max_capacity;

        // 2. Verify the student exists (no lock needed — students aren't being modified)
        const studentResult = await client.query(
            'SELECT id FROM students WHERE id = $1',
            [studentId]
        );
        if (studentResult.rows.length === 0) {
            const err = new Error('Student not found');
            err.status = 404;
            throw err;
        }

        // 3. Count current enrollments for this course
        const countResult = await client.query(
            'SELECT COUNT(*)::int AS enrolled FROM enrollments WHERE course_id = $1',
            [courseId]
        );
        const enrolledCount = countResult.rows[0].enrolled;

        if (enrolledCount >= maxCapacity) {
            const err = new Error(`Course is full (${enrolledCount}/${maxCapacity})`);
            err.status = 409;
            throw err;
        }

        // 4. Insert the enrollment
        const insertResult = await client.query(
            `INSERT INTO enrollments (student_id, course_id)
             VALUES ($1, $2)
             RETURNING student_id, course_id, enrolled_at`,
            [studentId, courseId]
        );

        // 5. All checks passed — commit
        await client.query('COMMIT');
        return insertResult.rows[0];

    } catch (err) {
        // Any error — roll back to leave the DB untouched
        await client.query('ROLLBACK');

        // Translate Postgres errors into friendlier HTTP errors
        if (err.code === '23505') {
            // Duplicate primary key: (student_id, course_id) already exists
            const e = new Error('Student is already enrolled in this course');
            e.status = 409;
            throw e;
        }
        throw err;

    } finally {
        // CRITICAL: always return the connection to the pool
        client.release();
    }
};