import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home">
      <span className="home-eyebrow">DBMS Assignment 3</span>
      <h1>Course Enrollment Manager</h1>
      <p>
        Manage students and courses.
      </p>
      <div className="home-actions">
        <Link to="/students" className="btn-primary">View Students</Link>
        <Link to="/courses"  className="btn-secondary">View Courses</Link>
      </div>
    </div>
  );
}