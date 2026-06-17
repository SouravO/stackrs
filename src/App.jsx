import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Login from './pages/Login';
import SetPassword from './pages/SetPassword';
import LiveDraw from './pages/LiveDraw';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminUserDetail from './pages/admin/UserDetail';

function AppContent() {
  const [showNavbar, setShowNavbar] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/') {
      setShowNavbar(true);
    } else {
      setShowNavbar(false);
    }
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar show={showNavbar} />
      <main className="flex-1 w-full bg-gray-50">
          <Routes>
            <Route path="/" element={<Home onNavbarShow={setShowNavbar} />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/set-password" element={<SetPassword />} />
            <Route path="/live-draw" element={<LiveDraw />} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/users/:id" element={<AdminRoute><AdminUserDetail /></AdminRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
