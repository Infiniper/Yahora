import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';

// Import your new Auth page
import Auth from './pages/auth/Auth';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Add the auth route here */}
          <Route path="/auth" element={<Auth />} />
          
          <Route path="/" element={<div className="container mt-5 text-center"><h1 style={{ color: 'var(--purple)', fontWeight: 'bold' }}>Welcome to Yahora!</h1></div>} />
          <Route path="/feed" element={<div className="container mt-4"><h3>Community Feed</h3></div>} />
          <Route path="/hot" element={<div className="container mt-4"><h3>Hot Items on Campus</h3></div>} />
          <Route path="/messages" element={<div className="container mt-4"><h3>Direct Messaging</h3></div>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;