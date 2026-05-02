import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
  const linkClass = ({ isActive }) => 'nav-link' + (isActive ? ' active' : '');

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="navbar-brand-mark">CM</span>
          <span>Course Manager</span>
        </Link>
        <div className="navbar-links">
          <NavLink to="/"          end className={linkClass}>Home</NavLink>
          <NavLink to="/students"      className={linkClass}>Students</NavLink>
          <NavLink to="/courses"       className={linkClass}>Courses</NavLink>
        </div>
      </div>
    </nav>
  );
}