import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import your components
import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 1. Header at the top */}
      <Navbar />
      
      {/* 2. Main content area (flex: 1 pushes the footer to the bottom) */}
      <main style={{ flex: 1 }} className="container mt-5 text-center">
        <h1 style={{ color: 'var(--purple)', fontWeight: 'bold' }}>Welcome to Yahora!</h1>
        <p className="lead text-muted">Where Every Thing Finds Its Next Story.</p>
        
        {/* Routing setup for your future pages */}
        <Routes>
          <Route path="/" element={<div className="mt-4"><h3>Home Page Content</h3></div>} />
          <Route path="/feed" element={<div className="mt-4"><h3>Community Feed</h3></div>} />
          <Route path="/hot" element={<div className="mt-4"><h3>Hot Items on Campus</h3></div>} />
          <Route path="/messages" element={<div className="mt-4"><h3>Direct Messaging</h3></div>} />
        </Routes>
      </main>

      {/* 3. Footer at the bottom */}
      <Footer />
    </div>
  );
}

export default App;