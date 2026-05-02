-- Schema for DBMS Assignment 2 — Node.js Advanced
-- Target: PostgreSQL 15+

DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;

CREATE TABLE students (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(120) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
    id            SERIAL PRIMARY KEY,
    title         VARCHAR(200) NOT NULL,
    description   TEXT,
    max_capacity  INT NOT NULL CHECK (max_capacity > 0)
);

CREATE TABLE enrollments (
    student_id   INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id    INT NOT NULL REFERENCES courses(id)  ON DELETE CASCADE,
    enrolled_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, course_id)
);

INSERT INTO students (name, email) VALUES
('Toushali Banerjee',  'toushali@example.com'),
('Shuvayu Chakraborty', 'shuvayu@example.com');

INSERT INTO courses (title, description, max_capacity) VALUES
('Intro to Databases', 'Relational models and SQL',   30),
('Node.js Backend',    'Building REST APIs with Node', 2);