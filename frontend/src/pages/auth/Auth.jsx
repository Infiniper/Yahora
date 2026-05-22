import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UniversityModal from "../../components/modal/UniversityModal";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Auth.module.css";

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const videoRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDemoOptions, setShowDemoOptions] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

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

      if (response.ok) {
        // Clear the demo flag when a real user logs in successfully
        localStorage.removeItem("yahora_demo_user");

        // Save the real user's university ID so they aren't treated as a visitor!
        if (data.userProfile?.university_id) {
          localStorage.setItem(
            "yahora_university_id",
            data.userProfile.university_id,
          );
        }

        // Extract User ID
        const userId =
          data.userProfile?.id || data.userAuth?.id || data.user?.id;

        // 👈 NEW: Use context login function to save session & instantly update global state
        if (userId) {
          login(data.session.access_token, userId);
        }

        // --- CONDITIONAL REDIRECT LOGIC ---
        if (data.userProfile && data.userProfile.is_profile_complete) {
          navigate("/dashboard");
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

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    setMessage("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/demo-login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );
      const data = await response.json();

      if (response.ok) {
        // Set a flag in localStorage so the rest of the app knows this is a demo user
        localStorage.setItem("yahora_demo_user", "true");
        if (data.userProfile?.university_id) {
          localStorage.setItem(
            "yahora_university_id",
            data.userProfile.university_id,
          );
        }

        const userId = data.userProfile?.id || data.userAuth?.id;
        if (userId) login(data.session.access_token, userId);

        // Always route to onboarding first so they see the flow
        navigate("/onboarding");
      } else {
        setMessage(data.error || "Failed to launch demo environment.");
      }
    } catch (error) {
      setMessage("Failed to connect to server.");
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      {/* ── Left Side: Form ── */}
      <div className={styles.authLeft}>
        {/* Preserved as global classes assuming they are defined globally */}
        <div className="glow-orb purple-orb"></div>
        <div className="glow-orb pink-orb"></div>

        <div className={styles.authFormWrapper}>
          <div className={styles.marketingBadge}>
            <span className={styles.dot}></span>
            Students-only marketplace — now launching
          </div>

          <h1 className={styles.gradientHeading}>Buy &amp; Sell on Your Campus.</h1>

          {/* Glass Form Card */}
          <div className={styles.formCard}>
            {/* Floating Icon inspired by the image */}
            <div className={styles.floatingIcon}>
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
                <p className={styles.subtitle}>
                  Enter your university email to get started
                </p>

                <label className={styles.inputLabel}>UNIVERSITY EMAIL ADDRESS</label>
                <div className={styles.modernInputGroup}>
                  <input
                    type="email"
                    placeholder="yourUniID@university.domain"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className={`${styles.insideBtn} ${styles.brandGradient}`}
                    disabled={loading}
                  >
                    {loading ? "Sending…" : "Send Code"}
                  </button>
                </div>

                {message && <p className={`${styles['form-message']} ${styles.error}`}>{message}</p>}

                <div
                  className={`${styles.textCenter} ${styles.mt2}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <div className={styles.uniDemo}>
                    <button
                      type="button"
                      className={styles.cuteBtn}
                      onClick={() => setIsModalOpen(true)}
                    >
                      See Supported Universities
                    </button>

                    {/* NEW: Demo Options Wrapper */}
                    <div style={{ position: "relative" }}>
                      <button
                        type="button"
                        className={`${styles.textBtn} ${styles.mt2}`}
                        onClick={() => setShowDemoOptions(!showDemoOptions)}
                      >
                        ✨ Explore Live Demo
                      </button>
                    </div>

                    {/* The Popup */}
                    {showDemoOptions && (
                      <div className={styles.demoPopup}>
                        <button
                          type="button"
                          className={styles.demoPopupBtn}
                          onClick={handleDemoLogin}
                          disabled={demoLoading}
                        >
                          {demoLoading
                            ? "Creating Sandbox..."
                            : "🚀 Enter Interactive Sandbox"}
                        </button>
                        <a
                          href="https://www.youtube.com/watch?v=YOUR_YOUTUBE_LINK"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${styles.demoPopupBtn} ${styles.videoBtn}`}
                        >
                          📺 View Demo Video
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <UniversityModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                />
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <p className={styles.subtitle}>
                  Enter the 6-digit code sent to{" "}
                  <strong style={{ color: "var(--purple-dark)" }}>
                    {email}
                  </strong>
                </p>

                <label className={styles.inputLabel}>8-DIGIT VERIFICATION CODE</label>
                <div className={styles.modernInputGroup}>
                  <input
                    type="text"
                    placeholder="• • • • • • • •"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={8}
                    className={styles.otpInput}
                  />
                  <button
                    type="submit"
                    className={`${styles.insideBtn} ${styles.brandGradient}`}
                    disabled={loading}
                  >
                    {loading ? "Verifying…" : "Verify"}
                  </button>
                </div>

                {message && (
                  <p
                    className={`${styles.formMessage} ${
                      message.includes("sent") ? styles.success : styles.error
                    }`}
                  >
                    {message}
                  </p>
                )}

                <button
                  type="button"
                  className={`${styles.textBtn} ${styles.mt2}`}
                  onClick={() => setStep(1)}
                >
                  ← Wrong email? Go back
                </button>
              </form>
            )}
          </div>

          {/* App Download Buttons */}
          <div className={styles.appDownloads}>
            <button className={`${styles.appBtn} ${styles.androidBtn}`}>
              <img src="/playstore.svg" alt="playstore" />
              Android App
              <span className={styles.comingSoon}>Soon</span>
            </button>
            <button className={`${styles.appBtn} ${styles.iosBtn}`}>
              <img src="/apple.svg" alt="apple" />
              iOS App
              <span className={styles.comingSoon}>Soon</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Right Side: Video ── */}
      <div className={styles.authRight}>
        <div className={styles.videoContainer}>
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className={styles.featureVideo}
            src="https://iwhtzhejyhaqctoqsolz.supabase.co/storage/v1/object/public/yahora%20videos/yahora_login_page_girl.mp4"
          >
            Your browser does not support the video tag.
          </video>
          <div className={styles.videoOverlay}>
            <h3>Keep the Story Going</h3>
            <p>Because Every Item Has a Memory.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;