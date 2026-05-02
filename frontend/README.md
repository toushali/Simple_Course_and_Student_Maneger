# React Frontend — Course Enrollment Manager

A React frontend for the course enrollment API built in Assignment 2. Demonstrates components, hooks, routing, API integration, and styling.

**Author:** Toushali Banerjee
**Course:** DBMS — Assignment 3 (React & Frontend)
**Date:** April 2026

## Prerequisites

- Node.js 18+
- The Assignment 2 backend running on `http://localhost:3000` with CORS enabled (`npm install cors` and `app.use(cors())`)

## Setup

1. Unzip the project, open a terminal in the project folder
2. Install dependencies:
npm install
3. Start the dev server:
npm run dev
4. Open `http://localhost:5173` in your browser

The frontend expects the backend on `http://localhost:3000`. (assignment-2 kept in the same folder)

## Project Structure
react-assignment3/
├── index.html
├── package.json
├── vite.config.js
└── src/
├── main.jsx                 # Entry point + Router setup
├── App.jsx                  # Top-level routes
├── styles.css               # All styling (no framework)
├── services/api.js          # Centralized API calls
├── hooks/useFetch.js        # Custom data-fetching hook
├── components/
│   ├── Navbar.jsx           # Persistent nav with active highlighting
│   ├── Spinner.jsx          # Loading indicator
│   └── ErrorMessage.jsx     # Reusable error UI with retry
└── pages/
├── Home.jsx
├── StudentDashboard.jsx # Table + search + sort + add/edit/delete
├── StudentDetail.jsx    # Single student + courses
├── CourseDashboard.jsx  # Courses table
└── NotFound.jsx         # 404 fallback

## Features

### Task 1 — Student Dashboard
- Fetches students via `useFetch` custom hook
- Real-time client-side filter by name or email
- Click any column header to toggle ascending/descending sort (▲/▼ indicator)
- Loading spinner during fetch, error box with retry button on failure

### Task 2 — CRUD Forms
- Controlled inputs for name, email, grade
- Inline validation: non-empty name, valid email regex, grade 0–100
- Edit mode replaces the row's text cells with inputs; Save sends PUT
- Delete shows browser confirm dialog before calling DELETE
- After every mutation, the list refreshes via the hook's `refetch`

### Task 3 — Routing & Layout
- Routes: `/`, `/students`, `/students/:id`, `/courses`, plus a catch-all 404
- `NavLink` highlights the active route
- Student Detail page links back and shows available courses for context
- Consistent styling across all pages via a single CSS file

## API Integration

All HTTP calls go through `src/services/api.js`. Mutations (POST/PUT/DELETE) automatically include the `x-api-key` header. Errors from the backend are unwrapped from the response JSON and surfaced as exceptions, which `useFetch` and form submissions display to the user.

## Note on Enrollments

The backend exposes only `POST /enrollments`, so the Student Detail page lists available courses rather than the student's specific enrollments. To show a student's enrolled courses, add a `GET /enrollments/student/:id` endpoint to the backend and call it from `StudentDetail.jsx`.

## AI Assistance Disclosure

This assignment was completed with guidance from Claude (Anthropic). The prompt is preserved below.

---

## Prompt Used
Build a React frontend for the Assignment 2 course enrollment API. Use Vite + React Router. Keep it simple — plain CSS, no UI framework, no state library beyond useState/useEffect.
Structure: src/{components, pages, hooks, services} plus App.jsx, main.jsx, styles.css.
Task 1 — Student Dashboard:

Page that fetches all students via a useFetch custom hook.
Table with columns Name, Email, Actions. Click any header to toggle asc/desc sort.
Search bar filtering by name or email in real time (client-side).
Loading spinner while fetching; error box with retry on failure.

Task 2 — CRUD Forms (on the same dashboard page):

AddStudentForm with controlled inputs for name, email, grade.
Client-side validation: non-empty name, email regex, grade 0–100. Show inline errors per field.
Edit mode: clicking Edit on a row swaps text cells for inputs; Save sends PUT.
Delete with window.confirm dialog before DELETE.
After every mutation, refetch the list automatically.

Task 3 — Routing:

Routes: / (Home), /students, /students/:id, /courses, * (404).
Persistent Navbar using NavLink with active-link highlighting.
StudentDetail page fetches /students/:id and shows available courses for context.
404 page for unmatched routes.

Service layer in src/services/api.js wraps fetch with a single helper that injects x-api-key on POST/PUT/DELETE and unwraps backend error messages. The custom hook in src/hooks/useFetch.js takes a fetcher function and returns { data, loading, error, refetch } so any page can refresh on demand.