import useFetch from '../hooks/useFetch';
import { getCourses } from '../services/api';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

export default function CourseDashboard() {
  const { data: courses, loading, error, refetch } = useFetch(getCourses, []);

  if (loading) return <Spinner label="Loading courses..." />;
  if (error)   return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="dashboard">
      <h1>Courses</h1>
      <section className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Capacity</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 && (
              <tr><td colSpan="4" className="empty">No courses available.</td></tr>
            )}
            {courses.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.title}</td>
                <td>{c.description || <span className="muted">—</span>}</td>
                <td>{c.max_capacity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}