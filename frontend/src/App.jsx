import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';
import Auth from './pages/auth/Auth';
import Home from './pages/Home/Home';
import Onboarding from './pages/onboarding/onboarding'; // Add this line
import Dashboard from './pages/dashboard/Dashboard';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path= "/" element={<Home/>} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/feed" element={<div className="container mt-4"><h3>Community Feed</h3></div>} />
          <Route path="/hot" element={<div className="container mt-4"><h3>Hot Items on Campus</h3></div>} />
          <Route path="/messages" element={<div className="container mt-4"><h3>Direct Messaging</h3></div>} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>

      {/* Conditionally hide the footer ONLY on the dashboard */}
      {location.pathname !== '/dashboard' && <Footer />}
    </div>
  );
}

export default App;