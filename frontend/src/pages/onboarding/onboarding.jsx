import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, BookOpen, Calendar, ImagePlus, Sparkles } from "lucide-react";
import "./Onboarding.css";

const Onboarding = () => {
  const navigate = useNavigate();
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    department: "",
    yearOfStudy: "",
    bio: "",
    avatarUrl: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Enforce 250 char limit for bio
    if (name === "bio" && value.length > 250) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Frontend Validation
    if (!formData.fullName || !formData.department || !formData.yearOfStudy) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      // Retrieve session to get the userId (Assuming stored during OTP verify)
      const token = localStorage.getItem("yahora_session"); 
      // Note: You might need to decode the JWT or get the userId from your auth context
      // For this example, we assume Vishwajeet's backend can extract the user from the Bearer token
      
      const response = await fetch("http://localhost:5000/api/auth/onboarding", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          // If Vishwajeet strictly needs userId in body, add it here. 
          // Otherwise, sending it via token is safer.
          full_name: formData.fullName,
          avatar_url: formData.avatarUrl,
          department: formData.department,
          year_of_study: formData.yearOfStudy,
          bio: formData.bio
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success! Redirect to home feed
        navigate("/");
      } else {
        setError(data.message || "Failed to save profile.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-container">
      {/* Background Orbs from Auth styling */}
      <div className="glow-orb purple-orb"></div>
      <div className="glow-orb pink-orb"></div>

      <div className="onboarding-card">
        <div className="onboarding-header">
          <h2>Complete Your Profile</h2>
          <p>Let your campus know who you are before you start buying and selling.</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="onboarding-form">
          
          {/* Section 1: Identity */}
          <div className="form-section">
            <h3 className="section-title">Identity</h3>
            
            <div className="avatar-upload-wrapper">
              <div className="avatar-preview">
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt="Profile preview" />
                ) : (
                  <User size={40} color="#888" />
                )}
              </div>
              <div className="avatar-actions">
                <button type="button" className="cute-btn avatar-btn">
                  <ImagePlus size={16} /> Upload Photo (Optional)
                </button>
                <p className="helper-text">A real photo builds trust.</p>
              </div>
            </div>

            <div className="input-group">
              <label>FULL NAME <span className="required">*</span></label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g., Anmol Singh"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Academic Details */}
          <div className="form-section">
            <h3 className="section-title">Academic Details</h3>
            
            <div className="input-row">
              <div className="input-group">
                <label>DEPARTMENT <span className="required">*</span></label>
                <div className="input-with-icon">
                  <BookOpen size={18} className="input-icon" />
                  <input
                    type="text"
                    name="department"
                    placeholder="e.g., CSE, ECE"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>YEAR OF STUDY <span className="required">*</span></label>
                <div className="input-with-icon">
                  <Calendar size={18} className="input-icon" />
                  <select 
                    name="yearOfStudy" 
                    value={formData.yearOfStudy} 
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Masters/PhD">Masters / PhD</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Personal Touch */}
          <div className="form-section">
            <h3 className="section-title">Personal Touch</h3>
            <div className="input-group">
              <label>
                SHORT BIO (Optional)
                <span className="char-count">{formData.bio.length}/250</span>
              </label>
              <div className="textarea-wrapper">
                <Sparkles size={18} className="input-icon textarea-icon" />
                <textarea
                  name="bio"
                  placeholder="e.g., CSE student, selling mostly electronics and books."
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="submit-wrapper">
            <button 
              type="submit" 
              className="btn-primary full-width"
              disabled={loading}
            >
              {loading ? "Saving Profile..." : "Save & Enter Yahora"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;