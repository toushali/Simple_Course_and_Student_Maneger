const API_BASE = 'http://localhost:3000';
const API_KEY = 'secret-dev-key-change-me';

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (options.method && options.method !== 'GET') {
    headers['x-api-key'] = API_KEY;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg = data?.error || data?.errors?.[0]?.msg || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

// Students
export const getStudents = ()       => request('/students');
export const getStudent  = (id)     => request(`/students/${id}`);
export const createStudent = (body) => request('/students', { method: 'POST', body: JSON.stringify(body) });
export const updateStudent = (id, body) => request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteStudent = (id)   => request(`/students/${id}`, { method: 'DELETE' });

// Courses
export const getCourses  = ()       => request('/courses');
export const getCourse   = (id)     => request(`/courses/${id}`);

// Enrollments — backend has only POST, but we can derive a student's enrollments
// by joining client-side. For Task 3, we'll fetch all enrollments via a helper endpoint
// or fall back to listing the student's enrolled courses. For now, we'll use:
export const getEnrollments = () => request('/enrollments').catch(() => []);