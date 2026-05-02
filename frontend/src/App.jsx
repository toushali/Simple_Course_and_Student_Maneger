import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import StudentDashboard from './pages/StudentDashboard';
import StudentDetail from './pages/StudentDetail';
import CourseDashboard from './pages/CourseDashboard';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<StudentDashboard />} />
          <Route path="/students/:id" element={<StudentDetail />} />
          <Route path="/courses" element={<CourseDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}