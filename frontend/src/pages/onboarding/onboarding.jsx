// frontend/src/pages/onboarding/Onboarding.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { 
  User, 
  BookOpen, 
  Calendar, 
  ImagePlus, 
  Sparkles, 
  GraduationCap, 
  Award 
} from "lucide-react";
import styles from "./onboarding.module.css";

const Onboarding = () => {
  const navigate = useNavigate();
  
  // 1. Form State
  const [formData, setFormData] = useState({
    fullName: "",
    qualification: "",
    courseId: "",
    yearOfStudy: "",
    specializationId: "",
    bio: "",
    avatarUrl: ""
  });
  
  // 2. State for Backend Lists
  const [courses, setCourses] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [fetchingLists, setFetchingLists] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 3. Fetch Courses and Specializations on Mount
  useEffect(() => {
    const fetchAcademicData = async () => {
      try {
        const [coursesRes, specsRes] = await Promise.all([
          fetch("http://localhost:5000/api/academic/courses"),
          fetch("http://localhost:5000/api/academic/specializations")
        ]);

        if (coursesRes.ok && specsRes.ok) {
          const coursesData = await coursesRes.json();
          const specsData = await specsRes.json();
          setCourses(coursesData);
          setSpecializations(specsData);
        } else {
          setError("Failed to load academic options. Please refresh.");
        }
      } catch (err) {
        setError("Network error while loading academic options.");
      } finally {
        setFetchingLists(false);
      }
    };

    fetchAcademicData();
  }, []);

  // 4. Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "bio" && value.length > 250) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (selectedOption, actionMeta) => {
    setFormData((prev) => ({ ...prev, [actionMeta.name]: selectedOption.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Frontend Validation
    if (
      !formData.fullName || 
      !formData.qualification || 
      !formData.courseId || 
      !formData.yearOfStudy || 
      !formData.specializationId
    ) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("yahora_session"); 
      const userId = localStorage.getItem("yahora_user_id") || "replace-with-actual-uuid"; 
      
      const response = await fetch("http://localhost:5000/api/auth/onboarding", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          userId: userId, 
          full_name: formData.fullName,
          avatar_url: formData.avatarUrl,
          qualification: formData.qualification,
          course_id: formData.courseId,
          year_of_study: formData.yearOfStudy,
          specialization_id: formData.specializationId,
          bio: formData.bio
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/");
      } else {
        setError(data.error || data.message || "Failed to save profile.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Format data for react-select
  const courseOptions = courses.map(course => ({
    value: course.id,
    label: course.name
  }));

  const specializationOptions = specializations.map(spec => ({
    value: spec.id,
    label: spec.name
  }));

  // Reusable custom styles for react-select to match your UI
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      padding: '0.3rem',
      borderRadius: '0.8rem',
      borderColor: state.isFocused ? 'var(--purple-light)' : '#e0e0e0',
      backgroundColor: '#FAFAFA',
      fontFamily: "'Inter', sans-serif",
      boxShadow: state.isFocused ? '0 0 0 3px rgba(215, 0, 215, 0.1)' : 'none',
      cursor: 'pointer',
      '&:hover': {
        borderColor: 'var(--purple-light)'
      }
    }),
    option: (base, state) => ({
      ...base,
      fontFamily: "'Inter', sans-serif",
      backgroundColor: state.isSelected ? 'var(--purple)' : state.isFocused ? 'var(--pink-bg)' : 'white',
      color: state.isSelected ? 'white' : 'var(--black-soft)',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: 'var(--purple-light)'
      }
    }),
    placeholder: (base) => ({
      ...base,
      color: '#aaa',
      fontSize: '0.95rem'
    }),
    singleValue: (base) => ({
      ...base,
      color: 'var(--black)',
      fontSize: '0.95rem'
    })
  };

  return (
    <div className={styles.onboardingContainer}>
      {/* For multiple classes, template literals are the standard React approach */}
      <div className={`${styles.glowOrb} ${styles.purpleOrb}`}></div>
      <div className={`${styles.glowOrb} ${styles.pinkOrb}`}></div>

      <div className={styles.onboardingCard}>
        <div className={styles.onboardingHeader}>
          <h2>Complete Your Profile</h2>
          <p>Let your campus know who you are before you start buying and selling.</p>
        </div>

        {error && <div className={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.onboardingForm}>
          
          {/* Section 1: Identity */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Identity</h3>
            
            <div className={styles.avatarUploadWrapper}>
              <div className={styles.avatarPreview}>
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt="Profile preview" />
                ) : (
                  <User size={40} color="#888" />
                )}
              </div>
              <div className={styles.avatarActions}>
                <button type="button" className={`${styles.cuteBtn} ${styles.avatarBtn}`}>
                  <ImagePlus size={16} /> Upload Photo (Optional)
                </button>
                <p className={styles.helperText}>A real photo builds trust.</p>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>FULL NAME <span className={styles.required}>*</span></label>
              <div className={styles.inputWithIcon}>
                <User size={18} className={styles.inputIcon} />
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
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Academic Details</h3>
            
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>QUALIFICATION <span className={styles.required}>*</span></label>
                <div className={styles.inputWithIcon}>
                  <GraduationCap size={18} className={styles.inputIcon} />
                  <select 
                    name="qualification" 
                    value={formData.qualification} 
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select Qualification</option>
                    <option value="PhD">PhD</option>
                    <option value="Post Graduation">Post Graduation</option>
                    <option value="Graduation">Graduation</option>
                    <option value="Intermediate (12th)">Intermediate (12th)</option>
                    <option value="High School (10th)">High School (10th)</option>
                  </select>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>COURSE <span className={styles.required}>*</span></label>
                <div style={{ position: 'relative', zIndex: 50 }}>
                  <Select
                    name="courseId"
                    options={courseOptions}
                    onChange={handleDropdownChange}
                    placeholder={fetchingLists ? "Loading courses..." : "Search course..."}
                    isDisabled={fetchingLists}
                    isSearchable={true}
                    styles={customSelectStyles}
                  />
                </div>
              </div>
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>YEAR OF STUDY <span className={styles.required}>*</span></label>
                <div className={styles.inputWithIcon}>
                  <Calendar size={18} className={styles.inputIcon} />
                  <select 
                    name="yearOfStudy" 
                    value={formData.yearOfStudy} 
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select Year</option>
                    <option value="1st year">1st year</option>
                    <option value="2nd year">2nd year</option>
                    <option value="3rd year">3rd year</option>
                    <option value="4th year">4th year</option>
                    <option value="5th year">5th year</option>
                  </select>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>SPECIALIZATION <span className={styles.required}>*</span></label>
                <div style={{ position: 'relative', zIndex: 40 }}>
                  <Select
                    name="specializationId"
                    options={specializationOptions}
                    onChange={handleDropdownChange}
                    placeholder={fetchingLists ? "Loading specializations..." : "Search specialization..."}
                    isDisabled={fetchingLists}
                    isSearchable={true}
                    styles={customSelectStyles}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Personal Touch */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Personal Touch</h3>
            <div className={styles.inputGroup}>
              <label>
                SHORT BIO (Optional)
                <span className={styles.charCount}>{formData.bio.length}/250</span>
              </label>
              <div className={styles.textareaWrapper}>
                <Sparkles size={18} className={`${styles.inputIcon} ${styles.textareaIcon}`} />
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

          <div className={styles.submitWrapper}>
            <button 
              type="submit" 
              className={`${styles.btnPrimary} ${styles.fullWidth}`}
              disabled={loading || fetchingLists}
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