import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UniversityModal from "../../components/modal/UniversityModal";
import "./Auth.css";

const Auth = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const videoRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.65;
    }
  }, []);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/request-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        setStep(2);
        setMessage(`Code sent to ${email}`);
      } else {
        setMessage(data.error || data.message || "Something went wrong");
      }
    } catch (error) {
      setMessage("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        },
      );
      const data = await response.json();
      // Inside frontend/src/pages/auth/Auth.jsx -> handleVerifyOtp

      if (response.ok) {
        // Save the session token
        localStorage.setItem("yahora_session", data.session.access_token);

        // Save the User ID so Onboarding.jsx (or other pages) can send it to the backend
        const userId =
          data.userProfile?.id || data.userAuth?.id || data.user?.id;
        if (userId) {
          localStorage.setItem("yahora_user_id", userId);
        }

        // --- NEW CONDITIONAL REDIRECT LOGIC ---
        // If the profile is already complete, send them to the dashboard/home.
        // Otherwise, send them to the onboarding page.
        if (data.userProfile && data.userProfile.is_profile_complete) {
          navigate("/dashboard"); // or "/" if you want to send them to the home feed first
        } else {
          navigate("/onboarding");
        }
        
      } else {
        setMessage(data.message || "Invalid verification code.");
      }
    } catch (error) {
      setMessage("Failed to verify code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* ── Left Side: Form ── */}
      <div className="auth-left">
        <div className="glow-orb purple-orb"></div>
        <div className="glow-orb pink-orb"></div>

        <div className="auth-form-wrapper">
          <div className="marketing-badge">
            <span className="dot"></span>
            Students-only marketplace — now launching
          </div>

          <h1 className="gradient-heading">Buy &amp; Sell on Your Campus.</h1>

          {/* Glass Form Card */}
          <div className="form-card">
            {/* Floating Icon inspired by the image */}
            <div className="floating-icon">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="28"
                height="28"
              >
                <path d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z" />
              </svg>
            </div>

            <h2>Join Yahora</h2>

            {step === 1 ? (
              <form onSubmit={handleRequestOtp}>
                <p className="subtitle">
                  Enter your university email to get started
                </p>

                <label className="input-label">UNIVERSITY EMAIL ADDRESS</label>
                {/* Modern Pill Input Wrapper */}
                <div className="modern-input-group">
                  <input
                    type="email"
                    placeholder="yourUniID@university.domain"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="inside-btn brand-gradient"
                    disabled={loading}
                  >
                    {loading ? "Sending…" : "Send Code"}
                  </button>
                </div>

                {message && <p className="form-message error">{message}</p>}

                <div className="text-center mt-2">
                  <button
                    type="button"
                    className="cute-btn"
                    onClick={() => setIsModalOpen(true)}
                  >
                    See Supported Universities
                  </button>
                </div>
                {/* Render the university modal */}
                <UniversityModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                />
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <p className="subtitle">
                  Enter the 6-digit code sent to{" "}
                  <strong style={{ color: "var(--purple-dark)" }}>
                    {email}
                  </strong>
                </p>

                <label className="input-label">8-DIGIT VERIFICATION CODE</label>
                <div className="modern-input-group">
                  <input
                    type="text"
                    placeholder="• • • • • • • •"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={8}
                    className="otp-input"
                  />
                  <button
                    type="submit"
                    className="inside-btn brand-gradient"
                    disabled={loading}
                  >
                    {loading ? "Verifying…" : "Verify"}
                  </button>
                </div>

                {message && (
                  <p
                    className={`form-message ${message.includes("sent") ? "success" : "error"}`}
                  >
                    {message}
                  </p>
                )}

                <button
                  type="button"
                  className="text-btn mt-2"
                  onClick={() => setStep(1)}
                >
                  ← Wrong email? Go back
                </button>
              </form>
            )}
          </div>

          {/* App Download Buttons */}
          <div className="app-downloads">
            <button className="app-btn android-btn">
              <img src="/playstore.svg" alt="playstore" />
              Android App
              <span className="coming-soon">Soon</span>
            </button>
            <button className="app-btn ios-btn">
              <img src="/apple.svg" alt="apple" />
              iOS App
              <span className="coming-soon">Soon</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Right Side: Video ── */}
      <div className="auth-right">
        <div className="video-container">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="feature-video"
            src="https://iwhtzhejyhaqctoqsolz.supabase.co/storage/v1/object/public/yahora%20videos/yahora_login_page_girl.mp4"
            // src="https://iwhtzhejyhaqctoqsolz.supabase.co/storage/v1/object/public/yahora%20videos/yahora_login_page.mp4"
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
