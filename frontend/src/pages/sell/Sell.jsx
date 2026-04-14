// frontend/src/pages/sell/Sell.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Sell.module.css';

const CATEGORIES = [
  { label: "Electronics & Tech",       icon: "💻" },
  { label: "Furniture & Decor",        icon: "🪑" },
  { label: "Books & Study Materials",  icon: "📚" },
  { label: "Clothing & Accessories",   icon: "👕" },
  { label: "Vehicles & Bikes",         icon: "🚲" },
  { label: "Appliances",               icon: "🍳" },
  { label: "Sports & Fitness",         icon: "🏋️" },
  { label: "Miscellaneous",            icon: "📦" },
];

export default function Sell() {
  const navigate     = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
  });
  const [images,  setImages]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  /* ── handlers (logic unchanged) ── */
  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      setError('You can only upload a maximum of 5 images.');
      return;
    }
    setError('');
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (indexToRemove) =>
    setImages(images.filter((_, i) => i !== indexToRemove));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (images.length === 0) { setError('Please add at least one photo.'); return; }
    if (!formData.category)  { setError('Please select a category.');       return; }

    setLoading(true);
    try {
      const userId = localStorage.getItem('yahora_user_id');
      const token  = localStorage.getItem('yahora_session');
      if (!userId || !token) { navigate('/auth'); return; }

      const submitData = new FormData();
      submitData.append('seller_id',   userId);
      submitData.append('title',       formData.title);
      submitData.append('description', formData.description);
      submitData.append('price',       formData.price);
      submitData.append('category',    formData.category);
      images.forEach(img => submitData.append('images', img));

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`, {
        method:  'POST',
        headers: { Authorization: `Bearer ${token}` },
        body:    submitData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create listing');
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── render ── */
  return (
    <div className={styles.page}>

      {/* ── decorative background orbs ── */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <div className={styles.wrapper}>

        {/* ════ LEFT: branding panel ════ */}
        <aside className={styles.aside}>
          <div className={styles.asideStickyContent}>
            <div className={styles.asideBadge}>Campus Marketplace</div>
            <h2 className={styles.asideHeading}>
              Turn your<br />
              <em>unused gear</em><br />
              into cash.
            </h2>
            <p className={styles.asideSub}>
              Every item you list reaches only verified students on your campus. Quick, safe, and scam-free.
            </p>

            <div className={styles.asideTips}>
              {[
                { icon: '📸', tip: 'Clear photos sell 3× faster' },
                { icon: '✍️', tip: 'Honest titles build trust'  },
                { icon: '💰', tip: 'Fair price = quicker deal'  },
              ].map(({ icon, tip }) => (
                <div key={tip} className={styles.tipRow}>
                  <span className={styles.tipIcon}>{icon}</span>
                  <span className={styles.tipText}>{tip}</span>
                </div>
              ))}
            </div>

            {/* decorative card mock */}
            <div className={styles.mockCard}>
              <div className={styles.mockImgStrip} />
              <div className={styles.mockBody}>
                <div className={styles.mockTitle} />
                <div className={styles.mockPrice} />
                <div className={styles.mockMeta} />
              </div>
            </div>
          </div>
        </aside>

        {/* ════ RIGHT: form ════ */}
        <main className={styles.formPanel}>

          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>List a New Item</h1>
            <p className={styles.formSub}>Fill in the details below — it only takes 60 seconds.</p>
          </div>

          {error && (
            <div className={styles.errorMsg}>
              <span className={styles.errorIcon}>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* ── Photos ── */}
            <div className={styles.section}>
              <div className={styles.sectionLabel}>
                <span className={styles.sectionNum}>01</span>
                Photos
                <span className={styles.sectionHint}>Up to 5 · First photo is the cover</span>
              </div>

              <div className={styles.imageGrid}>
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`${styles.previewWrap} ${idx === 0 ? styles.coverWrap : ''}`}
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`preview ${idx + 1}`}
                      className={styles.previewImg}
                    />
                    {idx === 0 && <span className={styles.coverBadge}>Cover</span>}
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className={styles.removeBtn}
                      title="Remove"
                    >✕</button>
                  </div>
                ))}

                {images.length < 5 && (
                  <button
                    type="button"
                    className={styles.uploadBox}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <span className={styles.uploadPlus}>+</span>
                    <span className={styles.uploadLabel}>
                      {images.length === 0 ? 'Add Photos' : 'Add More'}
                    </span>
                  </button>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>

            {/* ── Title ── */}
            <div className={styles.section}>
              <div className={styles.sectionLabel}>
                <span className={styles.sectionNum}>02</span>
                Title
              </div>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g., Slightly used Study Table"
                className={styles.input}
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            {/* ── Category ── */}
            <div className={styles.section}>
              <div className={styles.sectionLabel}>
                <span className={styles.sectionNum}>03</span>
                Category
              </div>
              <div className={styles.categoryGrid}>
                {CATEGORIES.map(({ label, icon }) => (
                  <button
                    key={label}
                    type="button"
                    className={`${styles.catChip} ${formData.category === label ? styles.catActive : ''}`}
                    onClick={() => setFormData({ ...formData, category: label })}
                  >
                    <span className={styles.catIcon}>{icon}</span>
                    <span className={styles.catLabel}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Price ── */}
            <div className={styles.section}>
              <div className={styles.sectionLabel}>
                <span className={styles.sectionNum}>04</span>
                Price
              </div>
              <div className={styles.priceWrap}>
                <span className={styles.priceSymbol}>₹</span>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  placeholder="0"
                  className={`${styles.input} ${styles.priceInput}`}
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* ── Description ── */}
            <div className={styles.section}>
              <div className={styles.sectionLabel}>
                <span className={styles.sectionNum}>05</span>
                Description
              </div>
              <textarea
                name="description"
                required
                placeholder="Describe the condition, age, and reason for selling…"
                className={`${styles.input} ${styles.textarea}`}
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            {/* ── Submit ── */}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.submitSpinner} />
                  Posting your item…
                </>
              ) : (
                <>
                  <span className={styles.submitArrow}>✦</span>
                  Post Item to Campus
                </>
              )}
            </button>

          </form>
        </main>
      </div>
    </div>
  );
}