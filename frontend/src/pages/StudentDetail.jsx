import { useParams, Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { getStudent, getCourses } from '../services/api';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

export default function StudentDetail() {
  const { id } = useParams();
  const { data: student, loading, error, refetch } = useFetch(() => getStudent(id), [id]);
  const { data: courses } = useFetch(getCourses, []);

  if (loading) return <Spinner label="Loading student..." />;
  if (error)   return <ErrorMessage message={error} onRetry={refetch} />;
  if (!student) return <p>Student not found.</p>;

  return (
    <div className="detail">
      <Link to="/students" className="back-link">← Back to all students</Link>

      <div className="card">
        <h1>{student.name}</h1>
        <p className="page-subtitle">Student profile and enrollment context</p>
        <div className="detail-meta">
          <div className="detail-meta-item">
            <div className="detail-meta-label">Student ID</div>
            <div className="detail-meta-value">#{student.id}</div>
          </div>
          <div className="detail-meta-item">
            <div className="detail-meta-label">Email</div>
            <div className="detail-meta-value">{student.email}</div>
          </div>
          <div className="detail-meta-item">
            <div className="detail-meta-label">Member Since</div>
            <div className="detail-meta-value">
              {new Date(student.created_at).toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Available Courses</h2>
        <p className="muted" style={{ marginTop: -8, marginBottom: 16, fontSize: '0.9rem' }}>
          Courses this student can be enrolled in via the API.
        </p>
        {courses && courses.length === 0 && <p>No courses available.</p>}
        {courses && courses.length > 0 && (
          <ul className="course-list">
            {courses.map(c => (
              <li key={c.id}>
                <span><strong>{c.title}</strong>{c.description && <span className="muted"> — {c.description}</span>}</span>
                <span className="course-capacity">{c.max_capacity} seats</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}