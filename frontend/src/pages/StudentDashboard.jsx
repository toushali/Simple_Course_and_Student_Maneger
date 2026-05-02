import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../services/api';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

const emptyForm = { name: '', email: '', grade: '' };

function validate({ name, email, grade }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Name is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Valid email required';
  const g = Number(grade);
  if (grade === '' || isNaN(g) || g < 0 || g > 100) errors.grade = 'Grade must be 0–100';
  return errors;
}

export default function StudentDashboard() {
  const { data: students, loading, error, refetch } = useFetch(getStudents, []);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState({ key: 'id', dir: 'asc' });
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);

  // Filter + sort
  const visibleStudents = useMemo(() => {
    if (!students) return [];
    const term = search.toLowerCase();
    let list = students.filter(s =>
      s.name.toLowerCase().includes(term) || s.email.toLowerCase().includes(term)
    );
    list = [...list].sort((a, b) => {
      const av = a[sortBy.key], bv = b[sortBy.key];
      if (av < bv) return sortBy.dir === 'asc' ? -1 : 1;
      if (av > bv) return sortBy.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [students, search, sortBy]);

  const toggleSort = (key) => {
    setSortBy(prev =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'asc' }
    );
  };

  const sortIndicator = (key) => sortBy.key !== key ? '' : (sortBy.dir === 'asc' ? ' ▲' : ' ▼');

  // Add
  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    const errors = validate(form);
    if (Object.keys(errors).length) { setFormErrors(errors); return; }
    setFormErrors({});
    try {
      await createStudent({ name: form.name.trim(), email: form.email.trim() });
      setForm(emptyForm);
      refetch();
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  // Edit
  const startEdit = (student) => {
    setEditingId(student.id);
    setEditForm({ name: student.name, email: student.email, grade: student.grade ?? '' });
  };

  const cancelEdit = () => { setEditingId(null); setEditForm(emptyForm); };

  const saveEdit = async (id) => {
    const errors = validate(editForm);
    if (Object.keys(errors).length) { alert(Object.values(errors).join('\n')); return; }
    try {
      await updateStudent(id, { name: editForm.name.trim(), email: editForm.email.trim() });
      cancelEdit();
      refetch();
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  // Delete
  const handleDelete = async (student) => {
    if (!window.confirm(`Delete ${student.name}? This cannot be undone.`)) return;
    try {
      await deleteStudent(student.id);
      refetch();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div className="dashboard">
      <h1>Students</h1>

      {/* Add form */}
      <section className="card">
        <h2>Add Student</h2>
        <form onSubmit={handleAdd} className="add-form" noValidate>
          <div className="field">
            <input
              placeholder="Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            {formErrors.name && <span className="field-error">{formErrors.name}</span>}
          </div>
          <div className="field">
            <input
              placeholder="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
            {formErrors.email && <span className="field-error">{formErrors.email}</span>}
          </div>
          <div className="field">
            <input
              placeholder="Grade (0–100)"
              value={form.grade}
              onChange={e => setForm({ ...form, grade: e.target.value })}
            />
            {formErrors.grade && <span className="field-error">{formErrors.grade}</span>}
          </div>
          <button type="submit" className="btn-primary">Add</button>
        </form>
        {submitError && <p className="error-text">Server: {submitError}</p>}
      </section>

      {/* Search */}
      <section className="card">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            className="search-bar"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* Table */}
      {loading && <Spinner label="Loading students..." />}
      {error && <ErrorMessage message={error} onRetry={refetch} />}

      {!loading && !error && (
      <section className="card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort('id')}    className={'sortable' + (sortBy.key === 'id'    ? ' active' : '')}>ID{sortIndicator('id')}</th>
                <th onClick={() => toggleSort('name')}  className={'sortable' + (sortBy.key === 'name'  ? ' active' : '')}>Name{sortIndicator('name')}</th>
                <th onClick={() => toggleSort('email')} className={'sortable' + (sortBy.key === 'email' ? ' active' : '')}>Email{sortIndicator('email')}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleStudents.length === 0 && (
                <tr><td colSpan="4" className="empty">No students found.</td></tr>
              )}
              {visibleStudents.map(s => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  {editingId === s.id ? (
                    <>
                      <td><input value={editForm.name}  onChange={e => setEditForm({ ...editForm, name: e.target.value })} /></td>
                      <td><input value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} /></td>
                      <td>
                        <button onClick={() => saveEdit(s.id)} className="btn-primary">Save</button>
                        <button onClick={cancelEdit}            className="btn-secondary">Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td><Link to={`/students/${s.id}`}>{s.name}</Link></td>
                      <td>{s.email}</td>
                      <td>
                        <button onClick={() => startEdit(s)}    className="btn-secondary">Edit</button>
                        <button onClick={() => handleDelete(s)} className="btn-danger">Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    )}
    </div>
  );
}