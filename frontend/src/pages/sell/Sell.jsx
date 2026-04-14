// frontend/src/pages/sell/Sell.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Sell.module.css';

const CATEGORIES = [
  "Electronics & Tech",
  "Furniture & Decor",
  "Books & Study Materials",
  "Clothing & Accessories",
  "Vehicles & Bikes",
  "Appliances",
  "Sports & Fitness",
  "Miscellaneous"
];

export default function Sell() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: ''
  });
  
  const [images, setImages] = useState([]); // Stores the actual File objects
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Check limit (max 5 images)
    if (images.length + files.length > 5) {
      setError("You can only upload a maximum of 5 images.");
      return;
    }
    setError('');
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (images.length === 0) {
      setError("Please add at least one photo.");
      return;
    }
    if (!formData.category) {
      setError("Please select a category.");
      return;
    }

    setLoading(true);

    try {
      const userId = localStorage.getItem('yahora_user_id');
      const token = localStorage.getItem('yahora_session');
      
      if (!userId || !token) {
        navigate('/auth');
        return;
      }

      // We use FormData to send files + text fields together
      const submitData = new FormData();
      submitData.append('seller_id', userId);
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('category', formData.category);
      
      images.forEach(image => {
        submitData.append('images', image);
      });

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }, // Fetch handles multipart boundaries automatically
        body: submitData
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create listing');
      }

      // Success! Redirect back to dashboard to see the new item
      navigate('/dashboard');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.sellContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>List a New Item</h1>
        <p className={styles.subtitle}>Turn your unused campus gear into cash.</p>
      </div>

      {error && <div className={styles.errorMsg}>{error}</div>}

      <form onSubmit={handleSubmit}>
        
        {/* Images Section */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Photos (Max 5)</label>
          <div className={styles.imageUploadWrap}>
            {images.map((img, index) => (
              <div key={index} className={styles.previewWrap}>
                {/* Generate a temporary URL to preview the selected file */}
                <img src={URL.createObjectURL(img)} alt="preview" className={styles.previewImg} />
                <button type="button" onClick={() => removeImage(index)} className={styles.removeBtn}>✕</button>
              </div>
            ))}
            
            {images.length < 5 && (
              <div className={styles.uploadBox} onClick={() => fileInputRef.current.click()}>
                <span style={{ fontSize: '24px', marginBottom: '4px' }}>+</span>
                <span style={{ fontSize: '14px' }}>Add Photo</span>
              </div>
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

        {/* Title */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Title</label>
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

        {/* Price & Category Row */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className={styles.formGroup} style={{ flex: 1 }}>
            <label className={styles.label}>Price (₹)</label>
            <input 
              type="number" 
              name="price"
              required
              min="0"
              placeholder="0.00" 
              className={styles.input}
              value={formData.price}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.formGroup} style={{ flex: 1 }}>
            <label className={styles.label}>Category</label>
            <select 
              name="category"
              className={styles.select}
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="" disabled>Select a category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Description</label>
          <textarea 
            name="description"
            required
            placeholder="Describe the condition, age, and reason for selling..." 
            className={styles.textarea}
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Posting your item...' : 'Post Item'}
        </button>

      </form>
    </div>
  );
}