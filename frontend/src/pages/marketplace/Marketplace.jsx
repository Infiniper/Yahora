/**
 * Yahora — Marketplace Page
 * ==========================
 * File: frontend/src/pages/marketplace/Marketplace.jsx
 *
 * Features:
 *  ✅ Left sidebar: Categories, Price Range, Condition, My Wishlist,
 *                   Posting Date, My Listings, Clear All Filters
 *  ✅ Top bar: University name + campus switcher, Search, Sort, Grid/Swipe toggle
 *  ✅ Grid view — uses <ProductCard /> component
 *  ✅ Swipe (Tinder) view — drag-to-like / drag-to-pass
 *  ✅ Instant client-side filtering + sorting
 *  ✅ Empty state & skeleton loading state
 *  ✅ Fully responsive (desktop → tablet → mobile)
 *  ✅ Mobile: sidebar slides in as a bottom sheet
 *
 * When Vishwajeet's backend is ready, replace MOCK_PRODUCTS
 * with a real fetch() call inside the useEffect.
 *
 * API shape expected (from GET /api/marketplace?university_id=X&...):
 *   { products: Product[], total: number }
 */

import React, {
  useState, useEffect, useRef, useMemo, useCallback, memo
} from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import styles from './Marketplace.module.css';

/* ─────────────────────────────────────
   STATIC DATA
───────────────────────────────────── */
const UNIVERSITIES = [
  { id: 'uni-1', name: 'IIITDM Kurnool',   domain: 'iiitk.ac.in'  },
  { id: 'uni-2', name: 'NIET Greater Noida', domain: 'niet.co.in' },
];

const CATEGORIES = [
  { id: 'electronics',  label: 'Electronics & Tech',        icon: '💻' },
  { id: 'furniture',    label: 'Furniture & Decor',          icon: '🪑' },
  { id: 'books',        label: 'Books & Study Materials',    icon: '📚' },
  { id: 'clothing',     label: 'Clothing & Accessories',     icon: '👕' },
  { id: 'vehicles',     label: 'Vehicles & Bikes',           icon: '🚲' },
  { id: 'appliances',   label: 'Appliances',                 icon: '🔌' },
  { id: 'sports',       label: 'Sports & Fitness',           icon: '🏋️' },
  { id: 'misc',         label: 'Miscellaneous',              icon: '📦' },
];

const CONDITIONS = ['Mint', 'Like New', 'Good', 'Fair', 'Poor'];

const SORT_OPTIONS = [
  { key: 'newest',        label: 'Newest'        },
  { key: 'lowest_price',  label: 'Lowest Price'  },
  { key: 'trending',      label: 'Trending'      },
];

const POSTING_DATE_OPTIONS = [
  { key: 'today',   label: 'Today'       },
  { key: 'week',    label: 'This Week'   },
  { key: 'month',   label: 'This Month'  },
  { key: 'older',   label: 'Older'       },
];

/* ── Mock products (replace with API call) ── */
const MOCK_PRODUCTS = [
  {
    id: 'p1', title: 'Sony WH-1000XM4 Headphones', price: 8500,
    description: 'Industry-leading noise cancellation. Used for 6 months, in perfect condition.',
    category: 'electronics', condition: 'Mint', location: 'Hall 1',
    status: 'available', views: 124, likes_count: 32, comments_count: 8,
    is_liked: false, is_saved: false,
    image_urls: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600',
    ],
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    seller: { id: 's1', full_name: 'Anmol Singh', avatar_url: 'https://i.pravatar.cc/60?img=12' },
    university_id: 'uni-1',
  },
  {
    id: 'p2', title: 'Keychron K2 V2 Mechanical Keyboard', price: 4500,
    description: 'Gateron Brown switches, aluminum frame. Used 2 months, like new.',
    category: 'electronics', condition: 'Like New', location: 'C Block',
    status: 'available', views: 98, likes_count: 24, comments_count: 5,
    is_liked: false, is_saved: false,
    image_urls: ['https://images.unsplash.com/photo-1561112078-7d24e04c3407?w=600'],
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    seller: { id: 's2', full_name: 'Rahul Verma', avatar_url: 'https://i.pravatar.cc/60?img=33' },
    university_id: 'uni-1',
  },
  {
    id: 'p3', title: 'Study Table with Drawer', price: 1800,
    description: 'Solid wood, fits perfectly in hostel room. Height adjustable.',
    category: 'furniture', condition: 'Good', location: 'Hall 3',
    status: 'available', views: 67, likes_count: 15, comments_count: 3,
    is_liked: true, is_saved: true,
    image_urls: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600'],
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    seller: { id: 's3', full_name: 'Priya Nair',  avatar_url: 'https://i.pravatar.cc/60?img=47' },
    university_id: 'uni-1',
  },
  {
    id: 'p4', title: 'Data Structures & Algorithms (CLRS)', price: 450,
    description: '3rd edition, minor highlights in chapters 1-4 only. Great condition.',
    category: 'books', condition: 'Good', location: 'Library Block',
    status: 'available', views: 43, likes_count: 9, comments_count: 2,
    is_liked: false, is_saved: false,
    image_urls: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600'],
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    seller: { id: 's4', full_name: 'Karthik R',   avatar_url: 'https://i.pravatar.cc/60?img=22' },
    university_id: 'uni-1',
  },
  {
    id: 'p5', title: 'Vintage Denim Jacket — XL', price: 1200,
    description: "Levi's original. Slightly faded, perfect aesthetic. Size XL.",
    category: 'clothing', condition: 'Good', location: 'Hall 2',
    status: 'available', views: 89, likes_count: 28, comments_count: 6,
    is_liked: false, is_saved: false,
    image_urls: ['https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600'],
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    seller: { id: 's5', full_name: 'Sneha Iyer',  avatar_url: 'https://i.pravatar.cc/60?img=5' },
    university_id: 'uni-1',
  },
  {
    id: 'p6', title: 'Hero Cycle — Mountain Gear', price: 2200,
    description: '21-speed mountain bike. Minor rust on one pedal, otherwise perfect.',
    category: 'vehicles', condition: 'Fair', location: 'Main Gate',
    status: 'available', views: 55, likes_count: 11, comments_count: 4,
    is_liked: false, is_saved: false,
    image_urls: ['https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600'],
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    seller: { id: 's6', full_name: 'Dev Sharma',  avatar_url: 'https://i.pravatar.cc/60?img=60' },
    university_id: 'uni-1',
  },
  {
    id: 'p7', title: 'JBL Flip 5 Bluetooth Speaker', price: 3200,
    description: 'Waterproof, 12hr battery. One tiny scratch on the back. Loud & clear.',
    category: 'electronics', condition: 'Like New', location: 'D Block',
    status: 'available', views: 112, likes_count: 41, comments_count: 7,
    is_liked: false, is_saved: false,
    image_urls: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600'],
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    seller: { id: 's1', full_name: 'Anmol Singh',  avatar_url: 'https://i.pravatar.cc/60?img=12' },
    university_id: 'uni-1',
  },
  {
    id: 'p8', title: 'Yoga Mat + Resistance Bands Set', price: 600,
    description: 'Barely used, full set with 3 resistance levels. Great for hostel workouts.',
    category: 'sports', condition: 'Mint', location: 'Sports Complex',
    status: 'available', views: 38, likes_count: 7, comments_count: 1,
    is_liked: false, is_saved: false,
    image_urls: ['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600'],
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    seller: { id: 's3', full_name: 'Priya Nair',  avatar_url: 'https://i.pravatar.cc/60?img=47' },
    university_id: 'uni-1',
  },
  {
    id: 'p9', title: 'Mini Fridge 40L — Haier', price: 3800,
    description: 'Perfect for hostel room. Works perfectly, just upgrading. Comes with warranty.',
    category: 'appliances', condition: 'Good', location: 'Hall 1',
    status: 'available', views: 76, likes_count: 19, comments_count: 3,
    is_liked: false, is_saved: false,
    image_urls: ['https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600'],
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    seller: { id: 's7', full_name: 'Aditya K',    avatar_url: 'https://i.pravatar.cc/60?img=70' },
    university_id: 'uni-1',
  },
  {
    id: 'p10', title: 'Minimalist Analog Watch', price: 2800,
    description: 'Unworn, original box included. Sleek matte dial, leather strap.',
    category: 'misc', condition: 'Mint', location: 'Hall 4',
    status: 'available', views: 95, likes_count: 36, comments_count: 5,
    is_liked: false, is_saved: false,
    image_urls: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600'],
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    seller: { id: 's8', full_name: 'Meera Das',   avatar_url: 'https://i.pravatar.cc/60?img=9' },
    university_id: 'uni-1',
  },
];

/* ─────────────────────────────────────
   ICONS
───────────────────────────────────── */
const SearchIcon   = ({ s = 17 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const GridIcon     = ({ s = 17 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const SwipeIcon    = ({ s = 17 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2a4 4 0 0 1 4 4v5.5l1.5-.5a2 2 0 0 1 2.5 1.9v.6L18 18a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-7a2 2 0 0 1 2-2h.5V6a2 2 0 0 1 2-2z"/></svg>;
const SwitchIcon   = ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3L4 7l4 4"/><path d="M4 7h16"/><path d="M16 21l4-4-4-4"/><path d="M20 17H4"/></svg>;
const FilterIcon   = ({ s = 17 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>;
const XIcon        = ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const ChevronIcon  = ({ s = 14, dir = 'down' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{dir === 'down' ? <polyline points="6 9 12 15 18 9"/> : dir === 'up' ? <polyline points="18 15 12 9 6 15"/> : dir === 'left' ? <polyline points="15 18 9 12 15 6"/> : <polyline points="9 18 15 12 9 6"/>}</svg>;
const HeartIcon    = ({ s = 16, filled }) => <svg width={s} height={s} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const TagIcon      = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
const PriceIcon    = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const StarIcon     = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const CalendarIcon = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const ListIcon     = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const PinIcon      = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const CheckIcon    = ({ s = 13 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const PassIcon     = ({ s = 22 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const LikeSwipeIcon = ({ s = 22 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const PlusIcon     = ({ s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;

/* ─────────────────────────────────────
   SKELETON CARD
───────────────────────────────────── */
const SkeletonCard = memo(function SkeletonCard() {
  return (
    <div className={styles.skeleton}>
      <div className={`${styles.skeletonImg} ${styles.shimmer}`} />
      <div className={styles.skeletonBody}>
        <div className={`${styles.skeletonLine} ${styles.skeletonLineSm} ${styles.shimmer}`} />
        <div className={`${styles.skeletonLine} ${styles.skeletonLineLg} ${styles.shimmer}`} />
        <div className={`${styles.skeletonLine} ${styles.shimmer}`} />
      </div>
    </div>
  );
});

/* ─────────────────────────────────────
   SWIPE CARD (Tinder-style)
───────────────────────────────────── */
const SWIPE_THRESHOLD = 100; // px before triggering a decision

const SwipeCard = memo(function SwipeCard({ product, onLike, onPass, zIndex, isTop }) {
  const cardRef  = useRef(null);
  const startX   = useRef(0);
  const startY   = useRef(0);
  const currentX = useRef(0);
  const [dragging,  setDragging]  = useState(false);
  const [offsetX,   setOffsetX]   = useState(0);
  const [decision,  setDecision]  = useState(null); // 'like' | 'pass' | null
  const [leaving,   setLeaving]   = useState(false);

  const rotate   = offsetX / 20;
  const likeOp   = Math.min(offsetX / SWIPE_THRESHOLD, 1);
  const passOp   = Math.min(-offsetX / SWIPE_THRESHOLD, 1);

  /* Pointer handlers */
  const onPointerDown = useCallback((e) => {
    if (!isTop) return;
    cardRef.current?.setPointerCapture(e.pointerId);
    startX.current   = e.clientX;
    startY.current   = e.clientY;
    currentX.current = 0;
    setDragging(true);
  }, [isTop]);

  const onPointerMove = useCallback((e) => {
    if (!dragging) return;
    const dx = e.clientX - startX.current;
    currentX.current = dx;
    setOffsetX(dx);
    setDecision(dx > 30 ? 'like' : dx < -30 ? 'pass' : null);
  }, [dragging]);

  const onPointerUp = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    if (Math.abs(currentX.current) >= SWIPE_THRESHOLD) {
      const dir = currentX.current > 0 ? 'like' : 'pass';
      setLeaving(true);
      setTimeout(() => {
        dir === 'like' ? onLike(product.id) : onPass(product.id);
      }, 350);
    } else {
      setOffsetX(0);
      setDecision(null);
    }
  }, [dragging, product.id, onLike, onPass]);

  const triggerLike = useCallback(() => {
    setLeaving(true);
    setOffsetX(400);
    setTimeout(() => onLike(product.id), 350);
  }, [product.id, onLike]);

  const triggerPass = useCallback(() => {
    setLeaving(true);
    setOffsetX(-400);
    setTimeout(() => onPass(product.id), 350);
  }, [product.id, onPass]);

  const imageUrl = product.image_urls?.[0] || 'https://via.placeholder.com/600x800';

  return (
    <div
      ref={cardRef}
      className={`${styles.swipeCard} ${leaving ? styles.swipeLeaving : ''}`}
      style={{
        zIndex,
        transform: `translateX(${offsetX}px) rotate(${rotate}deg)`,
        transition: dragging ? 'none' : 'transform 0.35s cubic-bezier(.4,0,.2,1)',
        cursor: isTop ? (dragging ? 'grabbing' : 'grab') : 'default',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Image */}
      <div className={styles.swipeImgWrap}>
        <img src={imageUrl} alt={product.title} className={styles.swipeImg} draggable={false} />

        {/* Decision overlays */}
        <div className={styles.swipeLikeStamp} style={{ opacity: likeOp }}>LIKE 💚</div>
        <div className={styles.swipePassStamp} style={{ opacity: passOp }}>PASS ✕</div>

        {/* Info overlay at bottom of image */}
        <div className={styles.swipeImgOverlay}>
          <span className={styles.swipePrice}>₹{Number(product.price).toLocaleString('en-IN')}</span>
          <span className={styles.swipeConditionBadge}>{product.condition}</span>
        </div>
      </div>

      {/* Info */}
      <div className={styles.swipeInfo}>
        <h3 className={styles.swipeTitle}>{product.title}</h3>
        <p className={styles.swipeDesc}>{product.description}</p>
        <div className={styles.swipeMeta}>
          <span>{product.location}</span>
          <span>by {product.seller?.full_name}</span>
        </div>
      </div>

      {/* Action buttons (only on top card) */}
      {isTop && (
        <div className={styles.swipeActions}>
          <button className={`${styles.swipeBtn} ${styles.swipeBtnPass}`} onClick={triggerPass} aria-label="Pass">
            <PassIcon s={24} />
          </button>
          <button className={`${styles.swipeBtn} ${styles.swipeBtnLike}`} onClick={triggerLike} aria-label="Like">
            <LikeSwipeIcon s={24} />
          </button>
        </div>
      )}
    </div>
  );
});

/* ─────────────────────────────────────
   UNIVERSITY SWITCHER MODAL
───────────────────────────────────── */
function UniSwitcher({ current, onSelect, onClose }) {
  return (
    <div className={styles.uniOverlay} onClick={onClose}>
      <div className={styles.uniModal} onClick={e => e.stopPropagation()}>
        <div className={styles.uniModalHead}>
          <span className={styles.uniModalTitle}>Switch Campus</span>
          <button className={styles.uniCloseBtn} onClick={onClose}><XIcon s={16} /></button>
        </div>
        <div className={styles.uniList}>
          {UNIVERSITIES.map(u => (
            <button
              key={u.id}
              className={`${styles.uniItem} ${current.id === u.id ? styles.uniItemActive : ''}`}
              onClick={() => { onSelect(u); onClose(); }}
            >
              <span className={styles.uniItemDot} style={{ background: current.id === u.id ? 'var(--purple)' : '#ddd' }} />
              <div>
                <div className={styles.uniItemName}>{u.name}</div>
                <div className={styles.uniItemDomain}>{u.domain}</div>
              </div>
              {current.id === u.id && <span className={styles.uniItemCheck}><CheckIcon s={14} /></span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   FILTER SECTION (accordion item)
───────────────────────────────────── */
function FilterSection({ icon, title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={styles.filterSection}>
      <button className={styles.filterSectionHead} onClick={() => setOpen(o => !o)}>
        <span className={styles.filterSectionIcon}>{icon}</span>
        <span className={styles.filterSectionTitle}>{title}</span>
        <span className={`${styles.filterChevron} ${open ? styles.filterChevronOpen : ''}`}>
          <ChevronIcon s={13} dir={open ? 'up' : 'down'} />
        </span>
      </button>
      {open && <div className={styles.filterSectionBody}>{children}</div>}
    </div>
  );
}

/* ─────────────────────────────────────
   MAIN MARKETPLACE COMPONENT
───────────────────────────────────── */
export default function Marketplace() {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('yahora_user_id');

  /* ── Core State ── */
  const [products,      setProducts]    = useState([]);
  const [loading,       setLoading]     = useState(true);
  const [viewMode,      setViewMode]    = useState('grid');     // 'grid' | 'swipe'
  const [activeSort,    setActiveSort]  = useState('newest');
  const [searchQuery,   setSearchQuery] = useState('');
  const [university,    setUniversity]  = useState(UNIVERSITIES[0]);
  const [showUniModal,  setShowUniModal]= useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [swipeDeck,     setSwipeDeck]   = useState([]);

  /* ── Filter State ── */
  const [selCategories,  setSelCategories]  = useState([]);
  const [priceRange,     setPriceRange]     = useState([0, 50000]);
  const [selConditions,  setSelConditions]  = useState([]);
  const [selPostingDate, setSelPostingDate] = useState('');
  const [showWishlist,   setShowWishlist]   = useState(false);
  const [showMyListings, setShowMyListings] = useState(false);

  /* ── Fetch products (replace MOCK_PRODUCTS with real fetch) ── */
  useEffect(() => {
    setLoading(true);
    // Simulate network delay
    const t = setTimeout(() => {
      const universityProducts = MOCK_PRODUCTS.filter(p => p.university_id === university.id);
      setProducts(universityProducts);
      setSwipeDeck([...universityProducts].reverse()); // top of deck = first item
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);

    // Real call (uncomment when backend ready):
    // const params = new URLSearchParams({ university_id: university.id });
    // fetch(`${import.meta.env.VITE_API_BASE_URL}/api/marketplace?${params}`)
    //   .then(r => r.json())
    //   .then(data => { setProducts(data.products); setSwipeDeck([...data.products].reverse()); })
    //   .finally(() => setLoading(false));
  }, [university]);

  /* ── Active filter count (for mobile badge) ── */
  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (selCategories.length)  n++;
    if (selConditions.length)  n++;
    if (selPostingDate)        n++;
    if (priceRange[0] > 0 || priceRange[1] < 50000) n++;
    if (showWishlist)          n++;
    if (showMyListings)        n++;
    return n;
  }, [selCategories, selConditions, selPostingDate, priceRange, showWishlist, showMyListings]);

  /* ── Clear all filters ── */
  const clearFilters = useCallback(() => {
    setSelCategories([]);
    setPriceRange([0, 50000]);
    setSelConditions([]);
    setSelPostingDate('');
    setShowWishlist(false);
    setShowMyListings(false);
  }, []);

  /* ── Toggle helpers ── */
  const toggleCategory = useCallback((id) => {
    setSelCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  }, []);
  const toggleCondition = useCallback((c) => {
    setSelConditions(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  }, []);

  /* ── Posting date filter helper ── */
  const isWithinPostingDate = useCallback((isoDate, key) => {
    if (!key) return true;
    const now   = Date.now();
    const then  = new Date(isoDate).getTime();
    const diff  = now - then;
    if (key === 'today')  return diff < 86400000;
    if (key === 'week')   return diff < 86400000 * 7;
    if (key === 'month')  return diff < 86400000 * 30;
    if (key === 'older')  return diff >= 86400000 * 30;
    return true;
  }, []);

  /* ── Filtered + sorted products ── */
  const displayProducts = useMemo(() => {
    let list = products.filter(p => p.status !== 'sold'); // only unsold

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q)
      );
    }
    // Category
    if (selCategories.length) list = list.filter(p => selCategories.includes(p.category));
    // Price range
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    // Condition
    if (selConditions.length) list = list.filter(p => selConditions.includes(p.condition));
    // Posting date
    if (selPostingDate) list = list.filter(p => isWithinPostingDate(p.created_at, selPostingDate));
    // Wishlist
    if (showWishlist) list = list.filter(p => p.is_saved);
    // My listings
    if (showMyListings) list = list.filter(p => p.seller?.id === currentUserId);

    // Sort
    if (activeSort === 'newest')       list = [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (activeSort === 'lowest_price') list = [...list].sort((a, b) => a.price - b.price);
    if (activeSort === 'trending')     list = [...list].sort((a, b) => (b.likes_count + b.views) - (a.likes_count + a.views));

    return list;
  }, [products, searchQuery, selCategories, priceRange, selConditions, selPostingDate, showWishlist, showMyListings, activeSort, currentUserId, isWithinPostingDate]);

  /* ── Swipe handlers ── */
  const handleSwipeLike = useCallback((id) => {
    setSwipeDeck(prev => prev.filter(p => p.id !== id));
    // TODO: add to wishlist / fire like API
  }, []);

  const handleSwipePass = useCallback((id) => {
    setSwipeDeck(prev => prev.filter(p => p.id !== id));
  }, []);

  /* ── Sidebar JSX (shared between desktop and mobile drawer) ── */
  const SidebarContent = (
    <aside className={styles.sidebar}>
      {/* University badge */}
      <div className={styles.sidebarUni}>
        <span className={styles.sidebarUniBrand}>Yahora</span>
        <span className={styles.sidebarUniSep}>—</span>
        <span className={styles.sidebarUniName}>{university.name}</span>
        <button className={styles.sidebarUniSwitch} onClick={() => setShowUniModal(true)} title="Switch campus">
          <SwitchIcon s={15} />
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filterList}>

        {/* Categories */}
        <FilterSection icon={<TagIcon />} title="Categories" defaultOpen={true}>
          <div className={styles.categoryGrid}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`${styles.categoryChip} ${selCategories.includes(cat.id) ? styles.categoryChipActive : ''}`}
                onClick={() => toggleCategory(cat.id)}
              >
                <span className={styles.categoryIcon}>{cat.icon}</span>
                <span className={styles.categoryLabel}>{cat.label}</span>
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection icon={<PriceIcon />} title="Price Range">
          <div className={styles.priceRangeWrap}>
            <div className={styles.priceRangeLabels}>
              <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
              <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range" min="0" max="50000" step="500"
              value={priceRange[0]}
              className={styles.rangeInput}
              onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
            />
            <input
              type="range" min="0" max="50000" step="500"
              value={priceRange[1]}
              className={styles.rangeInput}
              onChange={e => setPriceRange([priceRange[0], +e.target.value])}
            />
          </div>
        </FilterSection>

        {/* Item Condition */}
        <FilterSection icon={<StarIcon />} title="Item Condition">
          <div className={styles.conditionList}>
            {CONDITIONS.map(c => (
              <button
                key={c}
                className={`${styles.conditionChip} ${selConditions.includes(c) ? styles.conditionChipActive : ''}`}
                onClick={() => toggleCondition(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* My Wishlist */}
        <FilterSection icon={<HeartIcon s={15} />} title="My Wishlist">
          <button
            className={`${styles.toggleFilter} ${showWishlist ? styles.toggleFilterActive : ''}`}
            onClick={() => setShowWishlist(v => !v)}
          >
            {showWishlist ? '✓ Showing saved items' : 'Show my saved items'}
          </button>
        </FilterSection>

        {/* Posting Date */}
        <FilterSection icon={<CalendarIcon />} title="Posting Date">
          <div className={styles.dateList}>
            {POSTING_DATE_OPTIONS.map(d => (
              <button
                key={d.key}
                className={`${styles.dateChip} ${selPostingDate === d.key ? styles.dateChipActive : ''}`}
                onClick={() => setSelPostingDate(prev => prev === d.key ? '' : d.key)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* My Listings */}
        <FilterSection icon={<ListIcon />} title="My Listings">
          <button
            className={`${styles.toggleFilter} ${showMyListings ? styles.toggleFilterActive : ''}`}
            onClick={() => setShowMyListings(v => !v)}
          >
            {showMyListings ? '✓ Showing my listings' : 'Show only my listings'}
          </button>
          <button className={styles.listNewBtn} onClick={() => navigate('/sell')}>
            <PlusIcon s={14} /> List New Item
          </button>
        </FilterSection>
      </div>

      {/* Clear all filters */}
      {activeFilterCount > 0 && (
        <button className={styles.clearBtn} onClick={clearFilters}>
          <XIcon s={13} /> Clear All Filters
          <span className={styles.clearBadge}>{activeFilterCount}</span>
        </button>
      )}
    </aside>
  );

  /* ── Render ── */
  return (
    <div className={styles.root}>

      {/* ── University Switcher Modal ── */}
      {showUniModal && (
        <UniSwitcher
          current={university}
          onSelect={setUniversity}
          onClose={() => setShowUniModal(false)}
        />
      )}

      {/* ── Desktop Sidebar ── */}
      <div className={styles.sidebarWrap}>
        {SidebarContent}
      </div>

      {/* ── Mobile filter drawer ── */}
      {showMobileFilter && (
        <div className={styles.mobileDrawerOverlay} onClick={() => setShowMobileFilter(false)}>
          <div className={styles.mobileDrawer} onClick={e => e.stopPropagation()}>
            <div className={styles.mobileDrawerHandle} />
            {SidebarContent}
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className={styles.main}>

        {/* ── Top Bar ── */}
        <div className={styles.topBar}>

          {/* Search */}
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}><SearchIcon s={16} /></span>
            <input
              type="search"
              placeholder="Search marketplace…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              aria-label="Search products"
            />
            {searchQuery && (
              <button className={styles.searchClear} onClick={() => setSearchQuery('')}><XIcon s={13} /></button>
            )}
          </div>

          {/* Sort options */}
          <div className={styles.sortGroup}>
            <span className={styles.sortLabel}>Sort by:</span>
            {SORT_OPTIONS.map(s => (
              <button
                key={s.key}
                className={`${styles.sortBtn} ${activeSort === s.key ? styles.sortBtnActive : ''}`}
                onClick={() => setActiveSort(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* View mode toggle */}
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <GridIcon s={16} /> <span>Grid</span>
            </button>
            <button
              className={`${styles.viewBtn} ${viewMode === 'swipe' ? styles.viewBtnActive : ''}`}
              onClick={() => setViewMode('swipe')}
              aria-label="Swipe view"
            >
              <SwipeIcon s={16} /> <span>Swipe</span>
            </button>
          </div>

          {/* Mobile filter button */}
          <button
            className={styles.mobileFilterBtn}
            onClick={() => setShowMobileFilter(true)}
            aria-label="Open filters"
          >
            <FilterIcon s={17} />
            {activeFilterCount > 0 && <span className={styles.mobileFilterBadge}>{activeFilterCount}</span>}
          </button>
        </div>

        {/* ── Results count ── */}
        {/* {!loading && (
          <div className={styles.resultsBar}>
            <span className={styles.resultsCount}>
              {displayProducts.length === 0
                ? 'No items found'
                : `${displayProducts.length} item${displayProducts.length !== 1 ? 's' : ''}`}
            </span>
            {searchQuery && (
              <span className={styles.resultsQuery}>for "<strong>{searchQuery}</strong>"</span>
            )}
            {activeFilterCount > 0 && (
              <button className={styles.resultsClearLink} onClick={clearFilters}>
                Clear {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''}
              </button>
            )}
          </div>
        )} */}

        {/* ── GRID VIEW ── */}
        {viewMode === 'grid' && (
          <>
            {loading ? (
              <div className={styles.grid}>
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : displayProducts.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🛍️</div>
                <h3 className={styles.emptyTitle}>
                  {searchQuery
                    ? `No results for "${searchQuery}"`
                    : showWishlist
                      ? 'Your wishlist is empty'
                      : `No items listed in ${university.name} right now`}
                </h3>
                <p className={styles.emptyDesc}>
                  {showWishlist
                    ? 'Explore the marketplace and save items you love.'
                    : 'Be the first to list something! Your campus is waiting.'}
                </p>
                <div className={styles.emptyActions}>
                  {activeFilterCount > 0 && (
                    <button className={styles.emptyBtnSecondary} onClick={clearFilters}>Clear filters</button>
                  )}
                  <button className={styles.emptyBtnPrimary} onClick={() => navigate('/sell')}>
                    <PlusIcon s={15} /> List an item
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.grid}>
                {displayProducts.map((product, i) => (
                  <div
                    key={product.id}
                    className={styles.gridItem}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <ProductCard
                      product={product}
                      currentUserId={currentUserId}
                      onCardClick={(id) => navigate(`/product/${id}`)}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── SWIPE VIEW ── */}
        {viewMode === 'swipe' && (
          <div className={styles.swipeViewWrap}>
            {loading ? (
              <div className={styles.swipeLoading}>
                <div className={styles.swipeSkeletonCard} />
                <p>Loading items…</p>
              </div>
            ) : swipeDeck.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🎉</div>
                <h3 className={styles.emptyTitle}>You've seen everything!</h3>
                <p className={styles.emptyDesc}>Check back later for new listings, or browse in Grid mode.</p>
                <div className={styles.emptyActions}>
                  <button className={styles.emptyBtnSecondary} onClick={() => setViewMode('grid')}>
                    Switch to Grid
                  </button>
                  <button
                    className={styles.emptyBtnPrimary}
                    onClick={() => setSwipeDeck([...displayProducts].reverse())}
                  >
                    See again
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Instruction hint */}
                <p className={styles.swipeHint}>
                  Swipe <span style={{ color: '#4ade80' }}>right to like</span> · <span style={{ color: '#f87171' }}>left to pass</span>
                </p>

                {/* Deck — show top 3 cards stacked */}
                <div className={styles.swipeDeck}>
                  {swipeDeck.slice(-3).map((product, i, arr) => (
                    <SwipeCard
                      key={product.id}
                      product={product}
                      isTop={i === arr.length - 1}
                      zIndex={i + 1}
                      onLike={handleSwipeLike}
                      onPass={handleSwipePass}
                    />
                  ))}
                </div>

                {/* Counter */}
                <p className={styles.swipeCounter}>
                  {swipeDeck.length} item{swipeDeck.length !== 1 ? 's' : ''} remaining
                </p>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}