# Node.js Assignment 2 — Course Enrollment API

A RESTful API for managing students, courses, and enrollments, built with Express and PostgreSQL. Demonstrates middleware composition, parameterized queries, atomic transactions, declarative validation, and MVC project structure.

**Author:** Toushali Banerjee
**Course:** DBMS — Assignment 2 (Node.js Advanced)
**Date:** April 2026

## Note on Database Choice

The assignment specifies MySQL, but this project uses **PostgreSQL 15+** with the `pg` driver. All course concepts (connection pool, parameterized queries, transactions with row locking) apply identically — only the driver API shape differs. The `pg` package provides `Pool` and `getClient()` matching the `mysql2` patterns taught in the course materials.

## Prerequisites

- Node.js 18 or newer
- PostgreSQL 15 or newer (tested on 18.3)

Verify:
node --version
psql --version

## Setup

1. **Clone/unzip the project** and open a terminal in the project root.

2. **Install dependencies:**
npm install

3. **Create the database:**
psql -U postgres -c "CREATE DATABASE dbms_course;"

4. **Apply the schema and seed data:**
psql -U postgres -d dbms_course -f schema.sql

5. **Configure environment variables:**
copy .env.example .env
   Open `.env` and replace `<your-postgres-password>` with your actual PostgreSQL password.

6. **Start the server:**
npm run dev     # auto-reload on file changes (nodemon)
npm start       # plain node

   Server starts at `http://localhost:3000`.

## Project Structure
nodejs-assignment2/
├── server.js                        # Entry point; wires middleware + routes
├── schema.sql                       # Database schema + seed data
├── package.json
├── .env / .env.example / .gitignore
├── README.md
├── logs/
│   └── requests.log                 # Auto-populated request log
└── src/
├── config/
│   └── db.js                    # PostgreSQL connection pool
├── models/
│   ├── studentModel.js          # SQL for students
│   ├── courseModel.js           # SQL for courses
│   └── enrollmentModel.js       # Transactional enrollment logic
├── controllers/
│   ├── studentController.js     # HTTP logic for students
│   ├── courseController.js
│   └── enrollmentController.js
├── routes/
│   ├── studentRoutes.js         # Routes + validation rules
│   ├── courseRoutes.js
│   └── enrollmentRoutes.js
└── middleware/
├── logger.js                # Request logger → console + file
├── auth.js                  # API key auth (x-api-key header)
├── rateLimit.js             # 100 req per IP per 15 min
└── errorHandler.js          # Global JSON error responses

## API Endpoints

All request/response bodies use JSON. Protected routes require the `x-api-key` header.

### Students

| Method | Path              | Auth | Body                              | Status |
| ------ | ----------------- | ---- | --------------------------------- | ------ |
| GET    | `/students`       | No   | —                                 | 200    |
| GET    | `/students/:id`   | No   | —                                 | 200 / 404 |
| POST   | `/students`       | Yes  | `{name, email}`                   | 201 / 400 / 409 |
| PUT    | `/students/:id`   | Yes  | `{name, email}`                   | 200 / 400 / 404 / 409 |
| DELETE | `/students/:id`   | Yes  | —                                 | 200 / 404 |

### Courses

| Method | Path              | Auth | Body                                          | Status |
| ------ | ----------------- | ---- | --------------------------------------------- | ------ |
| GET    | `/courses`        | No   | —                                             | 200    |
| GET    | `/courses/:id`    | No   | —                                             | 200 / 404 |
| POST   | `/courses`        | Yes  | `{title, description?, max_capacity}`         | 201 / 400 |
| PUT    | `/courses/:id`    | Yes  | `{title, description?, max_capacity}`         | 200 / 400 / 404 |
| DELETE | `/courses/:id`    | Yes  | —                                             | 200 / 404 |

### Enrollments

| Method | Path            | Auth | Body                          | Status |
| ------ | --------------- | ---- | ----------------------------- | ------ |
| POST   | `/enrollments`  | Yes  | `{student_id, course_id}`     | 201 / 400 / 404 / 409 |

**Enrollment business rules** (enforced atomically within a transaction):
- Student must exist (else 404)
- Course must exist (else 404)
- Course must have available capacity (else 409)
- Student cannot already be enrolled in that course (else 409)

### Example Requests
Public GET
curl.exe http://localhost:3000/students
Protected POST (note x-api-key header)
curl.exe -X POST http://localhost:3000/students ^
-H "Content-Type: application/json" ^
-H "x-api-key: secret-dev-key-change-me" ^
-d "{"name":"Chen Wei","email":"chen@example.com"}"
Enrollment (triggers transaction with row-level locking)
curl.exe -X POST http://localhost:3000/enrollments ^
-H "Content-Type: application/json" ^
-H "x-api-key: secret-dev-key-change-me" ^
-d "{"student_id":1,"course_id":1}"

## Middleware Stack

Applied in this exact order in `server.js`:

1. **`express.json()`** — parses JSON request bodies
2. **`requestLogger`** — writes `[timestamp] METHOD URL STATUS DURATION` to console and `logs/requests.log` on every request (via `res.on('finish')`)
3. **`rateLimit`** — per-IP counter with 15-minute fixed window; returns 429 with a `Retry-After` header when exceeded. Uses an in-memory `Map` with periodic cleanup.
4. **Routes** — `/students`, `/courses`, `/enrollments`. Auth middleware (`x-api-key`) is applied **per-route** to POST/PUT/DELETE only, so GETs stay public.
5. **404 handler** — returns `{error: "Route not found"}` for unmatched paths
6. **`errorHandler`** — four-parameter error middleware; reads `err.status` (defaulting to 500), returns consistent JSON, includes stack traces in non-production environments

## Environment Variables

| Key        | Purpose                                           |
| ---------- | ------------------------------------------------- |
| `DB_HOST`  | PostgreSQL host (usually `localhost`)             |
| `DB_PORT`  | PostgreSQL port (default `5432`)                  |
| `DB_USER`  | PostgreSQL user                                   |
| `DB_PASS`  | PostgreSQL password                               |
| `DB_NAME`  | Database name (`dbms_course`)                     |
| `PORT`     | HTTP server port (default `3000`)                 |
| `API_KEY`  | Shared secret expected in the `x-api-key` header  |

## Security & Correctness Notes

- **Every SQL statement uses parameterized placeholders** (`$1, $2, ...`) via `pool.query(text, params)` — no string interpolation anywhere. This is the defense against SQL injection.
- **The enrollment endpoint uses `SELECT ... FOR UPDATE`** inside a transaction to lock the course row. This prevents a race condition where two concurrent requests could both see "1 seat left" and both succeed, overfilling the course.
- **Duplicate detection is database-enforced**, not application-logic. Unique constraints on `students.email` and the composite primary key on `enrollments` cause PostgreSQL error code `23505` on violation, which the controllers translate to HTTP 409.
- **Connections are always released** via `try { ... } finally { client.release() }` in the enrollment model. Skipping this on error paths would leak connections and eventually deadlock the pool.
- **Stack traces are hidden in production** via the `NODE_ENV` check in `errorHandler.js`.

## Error Response Format

All errors return JSON with this shape:
{
"error": "Human-readable message",
"status": 404
}

Validation errors from `express-validator` include the field that failed:
{
"errors": [
{ "path": "email", "msg": "Valid email required", "location": "body" }
]
}

## AI Assistance Disclosure

This assignment was completed with guidance from Claude (Anthropic). The prompt used is preserved below.

---

## Prompt Used
Complete DBMS Assignment 2 (Node.js Advanced) — build a course enrollment API using Express and PostgreSQL (pg driver). Use MVC structure: src/{config,models,controllers,routes,middleware} plus server.js at root. Use CommonJS.
Task 1 — API + Database (40 pts):

Schema: students (id, name, email UNIQUE, created_at), courses (id, title, description, max_capacity CHECK > 0), enrollments (composite PK student_id+course_id with FKs CASCADE).
Full CRUD for students and courses — all five endpoints each with proper status codes (200/201/400/404/409).
POST /enrollments must run in a transaction using pool.connect + BEGIN/COMMIT/ROLLBACK. Lock the course row with SELECT ... FOR UPDATE, verify student exists, check COUNT vs max_capacity, insert, commit. Release the client in a finally block.
Use express-validator on all POST/PUT bodies.
Every SQL query uses parameterized placeholders ($1, $2, ...) via pool.query — no string interpolation.
Handle Postgres error 23505 as 409 Conflict.

Task 2 — Middleware (30 pts):

Request logger: logs [ISO-timestamp] METHOD URL STATUS DURATION to both console and logs/requests.log, using res.on('finish').
Auth: static API key via x-api-key header, 401 on missing or wrong key. Applied per-route to POST/PUT/DELETE only (GETs public).
Rate limiter: 100 requests per IP per 15 minutes, in-memory Map, 429 with Retry-After header. Include periodic Map cleanup with setInterval.unref().
Global error handler: four-parameter middleware, reads err.status (default 500), returns consistent JSON, suppresses stack trace unless NODE_ENV !== 'production'.

Task 3 — Deployment readiness (30 pts):

dotenv for all config; .env gitignored; .env.example committed with placeholder values.
npm scripts: start (node server.js), dev (nodemon server.js).
.gitignore excludes node_modules, .env, *.log.
schema.sql includes DROP + CREATE + seed data so the grader can recreate the DB from scratch.
README documents prerequisites, setup (including psql commands), project structure, all endpoints in tables with auth and body, middleware stack order, environment variables, security/correctness notes, and the AI prompt used.

Middleware order in server.js: express.json → requestLogger → rateLimit → routes → 404 → errorHandler.