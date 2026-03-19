import React, { useState } from 'react';
import './Auth.css';

const Auth = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Step 1: Send Email to Backend
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Connecting to Vishwajeet's backend
      const response = await fetch('http://localhost:5000/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(2); // Move to OTP screen
        setMessage(`Code sent to ${email}`);
      } else {
        setMessage(data.message || 'Error: Invalid university domain.');
      }
    } catch (error) {
      setMessage('Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Send OTP to Backend
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store session (localStorage or Context API)
        localStorage.setItem('yahora_session', data.session.access_token);
        // Redirect to onboarding/profile (Update this route later)
        window.location.href = '/onboarding'; 
      } else {
        setMessage(data.message || 'Invalid verification code.');
      }
    } catch (error) {
      setMessage('Failed to verify code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Side: Form */}
      <div className="auth-left">
        <div className="auth-form-wrapper">
          
          {/* Typography inspiration from your image */}
          <div className="marketing-badge">
             <span className="dot"></span> Students-only marketplace — now launching
          </div>
          <h1 className="gradient-heading">
            Buy & Sell on Your Campus, Safely.
          </h1>

          <div className="form-card">
            <h2>Join Yahora</h2>
            
            {step === 1 ? (
              <form onSubmit={handleRequestOtp}>
                <p className="subtitle">Enter your university email to get started</p>
                
                <div className="input-group">
                  <label>University Email</label>
                  <input
                    type="email"
                    placeholder="yourid@universitydomain"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                {message && <p className="form-message error">{message}</p>}
                
                <button type="submit" className="primary-btn" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Verification Code'}
                </button>

                <button type="button" className="text-btn mt-3">
                  See Supported Universities
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <p className="subtitle">Enter the 6-digit code sent to <strong>{email}</strong></p>
                
                <div className="input-group">
                  <label>Verification Code</label>
                  <input
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                  />
                </div>

                {message && <p className={`form-message ${message.includes('sent') ? 'success' : 'error'}`}>{message}</p>}

                <button type="submit" className="primary-btn" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>
                
                <button type="button" className="text-btn mt-3" onClick={() => setStep(1)}>
                  Wrong email? Go back
                </button>
              </form>
            )}
          </div>

          <div className="app-downloads">
            <button className="app-btn">
               Download Android App <span className="coming-soon">Soon</span>
            </button>
            <button className="app-btn">
               Download iOS App <span className="coming-soon">Soon</span>
            </button>
          </div>

        </div>
      </div>

      {/* Right Side: Video Feature (Claude style layout) */}
      <div className="auth-right">
        <div className="video-container">
          {/* Replace src with your actual Supabase storage URL */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="feature-video"
            src="https://www.w3schools.com/html/mov_bbb.mp4" 
          >
            Your browser does not support the video tag.
          </video>
          <div className="video-overlay">
            <h3>Keep the Story Going</h3>
            <p>Because Every Item Has a Memory.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;