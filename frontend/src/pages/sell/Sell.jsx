// frontend/src/pages/sell/Sell.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Laptop, Armchair, BookOpen, Shirt, Bike, Coffee, Dumbbell, Package 
} from 'lucide-react';
import ProductCard from '../../components/ProductCard/ProductCard';
import styles from './Sell.module.css';

// Premium Lucide Icons instead of emojis
const CATEGORIES = [
  { label: "Electronics & Tech",       icon: Laptop },
  { label: "Furniture & Decor",        icon: Armchair },
  { label: "Books & Study Materials",  icon: BookOpen },
  { label: "Clothing & Accessories",   icon: Shirt },
  { label: "Vehicles & Bikes",         icon: Bike },
  { label: "Appliances",               icon: Coffee },
  { label: "Sports & Fitness",         icon: Dumbbell },
  { label: "Miscellaneous",            icon: Package },
];

// Premium SVG Placeholder (No network request required)
const PLACEHOLDER_IMAGE = `data:image/svg+xml;utf8,%3Csvg width='600' height='600' viewBox='0 0 600 600' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='600' height='600' fill='%23f8fafc'/%3E%3Cg transform='translate(268,250)' stroke='%23cbd5e1' stroke-width='3' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='-24' y='-24' width='112' height='112' rx='12'/%3E%3Ccircle cx='8' cy='8' r='8'/%3E%3Cpath d='M-24 56l32-32 24 24 16-16 40 40'/%3E%3C/g%3E%3Ctext x='300' y='420' font-family='sans-serif' font-size='16' font-weight='600' fill='%2394a3b8' text-anchor='middle'%3EUpload photos to preview%3C/text%3E%3C/svg%3E`;

export default function Sell() {
  const navigate     = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '', 
  });
  const [images,  setImages]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  // Dynamic Seller Info State
  const [sellerProfile, setSellerProfile] = useState({
    full_name: 'Loading...',
    avatar_url: null
  });

  /* ── Fetch Real User Profile for Preview ── */
  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem('yahora_user_id');
      const token  = localStorage.getItem('yahora_session');
      if (!userId || !token) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/${userId}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setSellerProfile({
              full_name: data.profile.full_name || 'Anonymous Student',
              avatar_url: data.profile.avatar_url
            });
          }
        }
      } catch (err) {
        console.error("Failed to load seller profile for preview", err);
      }
    };
    fetchProfile();
  }, []);


  /* ── Handlers ── */
  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Toggle category logic
  const handleCategoryToggle = (label) => {
    setFormData(prev => ({
      ...prev,
      category: prev.category === label ? '' : label
    }));
  };

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
    if (!formData.location)  { setError('Please enter a location/hostel.'); return; }

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
      submitData.append('location',    formData.location); 
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

  /* ── Live Preview Object ── */
  const previewProduct = {
    id: null, 
    title: formData.title || 'Your Item Title',
    price: formData.price || '0',
    description: formData.description || 'Your item description will appear here...',
    category: formData.category || 'Category',
    location: formData.location || 'Campus Location',
    condition: 'Good', 
    image_urls: images.length > 0 
      ? images.map(img => URL.createObjectURL(img)) 
      : [PLACEHOLDER_IMAGE], // Uses the new SVG placeholder
    status: 'available',
    views: 0,
    likes_count: 0,
    comments_count: 0,
    created_at: new Date().toISOString(),
    is_liked: false,
    is_saved: false,
    seller: {
      full_name: sellerProfile.full_name,
      avatar_url: sellerProfile.avatar_url
    }
  };

  /* ── Render ── */
  return (
    <div className={styles.page}>

      {/* ── decorative background orbs ── */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <div className={styles.wrapper}>

        {/* ════ LEFT: branding & live preview panel ════ */}
        <aside className={styles.aside}>
          <div className={styles.asideStickyContent}>
            <div className={styles.asideBadge}>Campus Marketplace</div>
            <h2 className={styles.asideHeading}>
              Turn your
              <em> unused gear </em>
              into cash.
            </h2>

            {/* LIVE PREVIEW CARD */}
            <div className={styles.livePreviewHeader}>
              <span className={styles.pulseDot}></span>
              Live Preview
            </div>
            <div className={styles.previewWrapper}>
              <ProductCard product={previewProduct} />
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

            {/* ── Location ── */}
            <div className={styles.section}>
              <div className={styles.sectionLabel}>
                <span className={styles.sectionNum}>03</span>
                Hostel / Location
              </div>
              <input
                type="text"
                name="location"
                required
                placeholder="e.g., Hall 1 or Kalam Hostel"
                className={styles.input}
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>

            {/* ── Category ── */}
            <div className={styles.section}>
              <div className={styles.sectionLabel}>
                <span className={styles.sectionNum}>04</span>
                Category
              </div>
              <div className={styles.categoryGrid}>
                {CATEGORIES.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    type="button"
                    className={`${styles.catChip} ${formData.category === label ? styles.catActive : ''}`}
                    onClick={() => handleCategoryToggle(label)}
                  >
                    <span className={styles.catIcon}><Icon strokeWidth={1.5} size={28} /></span>
                    <span className={styles.catLabel}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Price ── */}
            <div className={styles.section}>
              <div className={styles.sectionLabel}>
                <span className={styles.sectionNum}>05</span>
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
                <span className={styles.sectionNum}>06</span>
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
            <center>
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
            </center>

          </form>
        </main>
      </div>
    </div>
  );
}