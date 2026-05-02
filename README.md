# Simple Course and Student Manager

A full-stack course enrollment system built for the DBMS course. Combines two practical assignments:

- **Backend** — Node.js + Express + PostgreSQL REST API with middleware suite (Assignment 2)
- **Frontend** — React + Vite single-page app with React Router (Assignment 3)

**Author:** Toushali
**Date:** April 2026

## Repository Layout
.
├── backend/    # Express + PostgreSQL API (DBMS Assignment 2)
└── frontend/   # React + Vite client (DBMS Assignment 3)

Each folder has its own `README.md` with full setup instructions and the prompt used.

## Quick Start

### 1. Backend
cd backend
cp .env.example .env       # then fill in your PostgreSQL password
npm install
psql -U postgres -c "CREATE DATABASE dbms_course;"
psql -U postgres -d dbms_course -f schema.sql
npm run dev

The API runs at `http://localhost:3000`.

### 2. Frontend

In a second terminal:
cd frontend
npm install
npm run dev

The UI runs at `http://localhost:5173` and talks to the backend on port 3000.

## Features

- **Backend:** full CRUD for students and courses, atomic enrollment with row-locked transactions, parameterized queries, request logging to file, API key auth, rate limiting, MVC structure
- **Frontend:** student dashboard with search/sort, controlled CRUD forms with inline validation, edit-in-place rows, custom `useFetch` hook, multi-page routing with active-link highlighting, responsive design

## Documentation

- Backend setup, endpoints, middleware: [`backend/README.md`](./backend/README.md)
- Frontend setup, components, hooks: [`frontend/README.md`](./frontend/README.md)

## Tech Stack

| Layer | Technology |
| --- | --- |
| Database | PostgreSQL 15+ |
| Backend | Node.js, Express, pg, express-validator, dotenv |
| Frontend | React 18, Vite, React Router v6, plain CSS |

## AI Assistance Disclosure

Both assignments were completed with guidance from Claude (Anthropic). Prompts are preserved in each subfolder's README.