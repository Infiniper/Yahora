import React from 'react';

function App() {
  return (
    <div className="container mt-5 text-center">
      {/* Testing the custom Purple from your palette */}
      <h1 style={{ color: '#6C5CE7', fontWeight: 'bold' }}>Welcome to Yahora!</h1>
      <p className="lead text-muted">Because Every Item Has a Memory.</p>
      
      {/* Testing Bootstrap + the custom Blue from your palette */}
      <button 
        className="btn mt-3" 
        style={{ backgroundColor: '#2BB7FF', color: '#FFFFFF', border: 'none' }}
      >
        Bootstrap & React are working!
      </button>
    </div>
  );
}

export default App;