/**
 * Yahora — Marketplace Page
 * ==========================
 * File: frontend/src/pages/marketplace/Marketplace.jsx
 */

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  memo,
} from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import styles from "./Marketplace.module.css";
import {
  Search,
  LayoutGrid,
  Layers,
  ArrowRightLeft,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Heart,
  Tag,
  Banknote,
  Star,
  Calendar,
  List,
  Check,
  Plus,
  Laptop,
  Armchair,
  BookOpen,
  Shirt,
  Bike,
  PlugZap,
  Dumbbell,
  Package,
  ShoppingBag,
  PartyPopper,
} from "lucide-react";

/* ─────────────────────────────────────
   STATIC DATA
───────────────────────────────────── */
const UNIVERSITIES = [
  { id: "uni-2", name: "NIET Greater Noida", domain: "niet.co.in" },
  { id: "uni-1", name: "IIITDM Kurnool", domain: "iiitk.ac.in" },
];

const CATEGORIES = [
  {
    id: "electronics",
    label: "Electronics & Tech",
    icon: <Laptop size={16} />,
  },
  { id: "furniture", label: "Furniture & Decor", icon: <Armchair size={16} /> },
  {
    id: "books",
    label: "Books & Study Materials",
    icon: <BookOpen size={16} />,
  },
  {
    id: "clothing",
    label: "Clothing & Accessories",
    icon: <Shirt size={16} />,
  },
  { id: "vehicles", label: "Vehicles & Bikes", icon: <Bike size={16} /> },
  { id: "appliances", label: "Appliances", icon: <PlugZap size={16} /> },
  { id: "sports", label: "Sports & Fitness", icon: <Dumbbell size={16} /> },
  { id: "misc", label: "Miscellaneous", icon: <Package size={16} /> },
];

const CONDITIONS = ["Mint", "Like New", "Good", "Fair", "Poor"];

const SORT_OPTIONS = [
  { key: "newest", label: "Newest" },
  { key: "lowest_price", label: "Lowest Price" },
  { key: "trending", label: "Trending" },
];

const POSTING_DATE_OPTIONS = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "older", label: "Older" },
];

/* ── Mock products (replace with API call) ── */
const MOCK_PRODUCTS = [
  /* ================= IIITDM Kurnool (uni-1) ================= */
  {
    id: "p1",
    title: "Sony WH-1000XM4 Headphones",
    price: 8500,
    description: "Industry-leading noise cancellation. Used for 6 months, in perfect condition.",
    category: "electronics",
    condition: "Mint",
    location: "Hall 1",
    status: "available",
    views: 124,
    likes_count: 32,
    comments_count: 8,
    is_liked: false,
    is_saved: false,
    image_urls: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600",
    ],
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    seller: { id: "s1", full_name: "Anmol Singh", avatar_url: "https://i.pravatar.cc/60?img=12" },
    university_id: "uni-1",
  },
  {
    id: "p2",
    title: "Keychron K2 V2 Mechanical Keyboard",
    price: 4500,
    description: "Gateron Brown switches, aluminum frame. Used 2 months, like new.",
    category: "electronics",
    condition: "Like New",
    location: "C Block",
    status: "available",
    views: 98,
    likes_count: 24,
    comments_count: 5,
    is_liked: false,
    is_saved: false,
    image_urls: ["https://images.unsplash.com/photo-1561112078-7d24e04c3407?w=600"],
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    seller: { id: "s2", full_name: "Rahul Verma", avatar_url: "https://i.pravatar.cc/60?img=33" },
    university_id: "uni-1",
  },
  {
    id: "p3",
    title: "Study Table with Drawer",
    price: 1800,
    description: "Solid wood, fits perfectly in hostel room. Height adjustable.",
    category: "furniture",
    condition: "Good",
    location: "Hall 3",
    status: "available",
    views: 67,
    likes_count: 15,
    comments_count: 3,
    is_liked: true,
    is_saved: true,
    image_urls: ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600"],
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    seller: { id: "s3", full_name: "Priya Nair", avatar_url: "https://i.pravatar.cc/60?img=47" },
    university_id: "uni-1",
  },
  {
    id: "p4",
    title: "Data Structures & Algorithms (CLRS)",
    price: 450,
    description: "3rd edition, minor highlights in chapters 1-4 only. Great condition.",
    category: "books",
    condition: "Good",
    location: "Library Block",
    status: "available",
    views: 43,
    likes_count: 9,
    comments_count: 2,
    is_liked: false,
    is_saved: false,
    image_urls: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600"],
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    seller: { id: "s4", full_name: "Karthik R", avatar_url: "https://i.pravatar.cc/60?img=22" },
    university_id: "uni-1",
  },
  {
    id: "p5",
    title: "Vintage Denim Jacket — XL",
    price: 1200,
    description: "Levi's original. Slightly faded, perfect aesthetic. Size XL.",
    category: "clothing",
    condition: "Good",
    location: "Hall 2",
    status: "available",
    views: 89,
    likes_count: 28,
    comments_count: 6,
    is_liked: false,
    is_saved: false,
    image_urls: ["https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600"],
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    seller: { id: "s5", full_name: "Sneha Iyer", avatar_url: "https://i.pravatar.cc/60?img=5" },
    university_id: "uni-1",
  },
  {
    id: "p6",
    title: "Hero Cycle — Mountain Gear",
    price: 2200,
    description: "21-speed mountain bike. Minor rust on one pedal, otherwise perfect.",
    category: "vehicles",
    condition: "Fair",
    location: "Main Gate",
    status: "available",
    views: 55,
    likes_count: 11,
    comments_count: 4,
    is_liked: false,
    is_saved: false,
    image_urls: ["https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600"],
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    seller: { id: "s6", full_name: "Dev Sharma", avatar_url: "https://i.pravatar.cc/60?img=60" },
    university_id: "uni-1",
  },

  /* ================= NIET Greater Noida (uni-2) ================= */
  {
    id: "p7",
    title: "iPad Air 4th Gen (64GB)",
    price: 28000,
    description: "Perfect condition for note-taking. Original charger included. No scratches.",
    category: "electronics",
    condition: "Like New",
    location: "Hostel 2",
    status: "available",
    views: 320,
    likes_count: 45,
    comments_count: 12,
    is_liked: true,
    is_saved: true,
    image_urls: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600"],
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(), // Today
    seller: { id: "s7", full_name: "Neha Gupta", avatar_url: "https://i.pravatar.cc/60?img=3" },
    university_id: "uni-2",
  },
  {
    id: "p8",
    title: "Logitech Wireless Mouse (M235)",
    price: 600,
    description: "Works perfectly. Battery lasts for months. Just upgraded to a gaming mouse.",
    category: "electronics",
    condition: "Good",
    location: "Library",
    status: "available",
    views: 45,
    likes_count: 5,
    comments_count: 0,
    is_liked: false,
    is_saved: false,
    image_urls: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600"],
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(), // This Week
    seller: { id: "s8", full_name: "Amit Kumar", avatar_url: "https://i.pravatar.cc/60?img=11" },
    university_id: "uni-2",
  },
  {
    id: "p9",
    title: "Ergonomic Office Chair",
    price: 2500,
    description: "Very comfortable for long coding sessions. Small tear on left armrest.",
    category: "furniture",
    condition: "Fair",
    location: "Hostel 3",
    status: "available",
    views: 210,
    likes_count: 18,
    comments_count: 4,
    is_liked: false,
    is_saved: true,
    image_urls: ["https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=600"],
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(), // This Month
    seller: { id: "s9", full_name: "Rohan Singh", avatar_url: "https://i.pravatar.cc/60?img=13" },
    university_id: "uni-2",
  },
  {
    id: "p10",
    title: "Wooden 3-Tier Bookshelf",
    price: 800,
    description: "Sturdy wooden bookshelf. Need to sell before moving out next week.",
    category: "furniture",
    condition: "Good",
    location: "Hostel 1",
    status: "available",
    views: 89,
    likes_count: 12,
    comments_count: 1,
    is_liked: false,
    is_saved: false,
    image_urls: ["https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600"],
    created_at: new Date(Date.now() - 40 * 86400000).toISOString(), // Older
    seller: { id: "s10", full_name: "Pooja Sharma", avatar_url: "https://i.pravatar.cc/60?img=20" },
    university_id: "uni-2",
  },
  {
    id: "p11",
    title: "University Physics - 14th Ed",
    price: 400,
    description: "Standard B.Tech 1st year textbook. Highlighted pages but completely readable.",
    category: "books",
    condition: "Poor",
    location: "Academic Block",
    status: "available",
    views: 34,
    likes_count: 2,
    comments_count: 0,
    is_liked: false,
    is_saved: false,
    image_urls: ["https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=600"],
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(), // This Week
    seller: { id: "s11", full_name: "Vikram Das", avatar_url: "https://i.pravatar.cc/60?img=53" },
    university_id: "uni-2",
  },
  {
    id: "p12",
    title: "Cracking the Coding Interview",
    price: 500,
    description: "Brand new condition. Never got around to reading it before placements.",
    category: "books",
    condition: "Mint",
    location: "Hostel 4",
    status: "available",
    views: 405,
    likes_count: 65,
    comments_count: 5,
    is_liked: true,
    is_saved: false,
    image_urls: ["https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600"],
    created_at: new Date(Date.now() - 1 * 3600000).toISOString(), // Today
    seller: { id: "s12", full_name: "Simran Kaur", avatar_url: "https://i.pravatar.cc/60?img=35" },
    university_id: "uni-2",
  },
  {
    id: "p13",
    title: "Official College Hoodie (Size M)",
    price: 600,
    description: "Washed and clean. Only worn a few times, too small for me now.",
    category: "clothing",
    condition: "Good",
    location: "Hostel 2",
    status: "available",
    views: 76,
    likes_count: 14,
    comments_count: 2,
    is_liked: false,
    is_saved: true,
    image_urls: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600"],
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(), // This Month
    seller: { id: "s13", full_name: "Aditya Patel", avatar_url: "https://i.pravatar.cc/60?img=61" },
    university_id: "uni-2",
  },
  {
    id: "p14",
    title: "Nike Running Sneakers (UK 9)",
    price: 1500,
    description: "Used lightly for jogging. Soles are still in great shape.",
    category: "clothing",
    condition: "Like New",
    location: "Sports Ground",
    status: "available",
    views: 150,
    likes_count: 22,
    comments_count: 3,
    is_liked: false,
    is_saved: false,
    image_urls: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"],
    created_at: new Date(Date.now() - 45 * 86400000).toISOString(), // Older
    seller: { id: "s14", full_name: "Karan Verma", avatar_url: "https://i.pravatar.cc/60?img=15" },
    university_id: "uni-2",
  },
  {
    id: "p15",
    title: "Firefox Mountain Bike",
    price: 3500,
    description: "Serviced last week. New brake pads installed. Runs super smooth.",
    category: "vehicles",
    condition: "Good",
    location: "Main Gate",
    status: "available",
    views: 230,
    likes_count: 40,
    comments_count: 7,
    is_liked: true,
    is_saved: true,
    image_urls: ["https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600"],
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(), // This Week
    seller: { id: "s15", full_name: "Manish Tiwari", avatar_url: "https://i.pravatar.cc/60?img=50" },
    university_id: "uni-2",
  },
  {
    id: "p16",
    title: "Electric Scooter / E-Bike",
    price: 12000,
    description: "Battery holds charge very well. Comes with charger and a free helmet.",
    category: "vehicles",
    condition: "Fair",
    location: "Parking Area",
    status: "available",
    views: 510,
    likes_count: 85,
    comments_count: 14,
    is_liked: false,
    is_saved: false,
    image_urls: ["https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600"],
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(), // This Month
    seller: { id: "s16", full_name: "Tanya Reddy", avatar_url: "https://i.pravatar.cc/60?img=41" },
    university_id: "uni-2",
  },
  {
    id: "p17",
    title: "Induction Cooktop (Prestige)",
    price: 1100,
    description: "Works flawlessly. Perfect for late night Maggi sessions.",
    category: "appliances",
    condition: "Like New",
    location: "Hostel 3",
    status: "available",
    views: 180,
    likes_count: 27,
    comments_count: 4,
    is_liked: false,
    is_saved: true,
    image_urls: ["https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600"],
    created_at: new Date(Date.now() - 50 * 86400000).toISOString(), // Older
    seller: { id: "s17", full_name: "Aryan Khan", avatar_url: "https://i.pravatar.cc/60?img=18" },
    university_id: "uni-2",
  },
  
  {
    id: "p19",
    title: "5kg Dumbbell Pair",
    price: 800,
    description: "PVC coated dumbbells. Heavy and intact. Great for room workouts.",
    category: "sports",
    condition: "Good",
    location: "Hostel 4",
    status: "available",
    views: 110,
    likes_count: 16,
    comments_count: 2,
    is_liked: true,
    is_saved: false,
    image_urls: ["https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600"],
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(), // This Week
    seller: { id: "s19", full_name: "Rishi Kapoor", avatar_url: "https://i.pravatar.cc/60?img=55" },
    university_id: "uni-2",
  },
  
  {
    id: "p21",
    title: "LED Desk Lamp (Rechargeable)",
    price: 350,
    description: "3 brightness modes. Gives 4 hours backup on full charge.",
    category: "misc",
    condition: "Like New",
    location: "Hostel 2",
    status: "available",
    views: 130,
    likes_count: 21,
    comments_count: 0,
    is_liked: false,
    is_saved: false,
    image_urls: ["https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600"],
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(), // Older
    seller: { id: "s21", full_name: "Harsh Vardhan", avatar_url: "https://i.pravatar.cc/60?img=68" },
    university_id: "uni-2",
  },
  {
    id: "p22",
    title: "Casio Scientific Calculator",
    price: 600,
    description: "Required for B.Tech first year. Buttons work perfectly. FX-82MS.",
    category: "misc",
    condition: "Good",
    location: "Academic Block",
    status: "available",
    views: 410,
    likes_count: 88,
    comments_count: 15,
    is_liked: true,
    is_saved: true,
    image_urls: ["https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600"],
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(), // Today
    seller: { id: "s22", full_name: "Divya Shah", avatar_url: "https://i.pravatar.cc/60?img=31" },
    university_id: "uni-2",
  },
];

/* ─────────────────────────────────────
   SKELETON CARD
───────────────────────────────────── */
const SkeletonCard = memo(function SkeletonCard() {
  return (
    <div className={styles.skeleton}>
      <div className={`${styles.skeletonImg} ${styles.shimmer}`} />
      <div className={styles.skeletonBody}>
        <div
          className={`${styles.skeletonLine} ${styles.skeletonLineSm} ${styles.shimmer}`}
        />
        <div
          className={`${styles.skeletonLine} ${styles.skeletonLineLg} ${styles.shimmer}`}
        />
        <div className={`${styles.skeletonLine} ${styles.shimmer}`} />
      </div>
    </div>
  );
});

/* ─────────────────────────────────────
   SWIPE CARD (Tinder-style)
───────────────────────────────────── */
const SWIPE_THRESHOLD = 100; // px before triggering a decision

const SwipeCard = memo(function SwipeCard({
  product,
  onLike,
  onPass,
  zIndex,
  isTop,
  currentUserId,
}) {
  const cardRef = useRef(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentX = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const rotate = offsetX / 20;
  const likeOp = Math.min(offsetX / SWIPE_THRESHOLD, 1);
  const passOp = Math.min(-offsetX / SWIPE_THRESHOLD, 1);

  /* Pointer handlers */
  const onPointerDown = useCallback(
    (e) => {
      if (!isTop) return;
      cardRef.current?.setPointerCapture(e.pointerId);
      startX.current = e.clientX;
      startY.current = e.clientY;
      currentX.current = 0;
      setDragging(true);
    },
    [isTop],
  );

  const onPointerMove = useCallback(
    (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX.current;
      currentX.current = dx;
      setOffsetX(dx);
    },
    [dragging],
  );

  const onPointerUp = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    if (Math.abs(currentX.current) >= SWIPE_THRESHOLD) {
      const dir = currentX.current > 0 ? "like" : "pass";
      setLeaving(true);
      setTimeout(() => {
        dir === "like" ? onLike(product.id) : onPass(product.id);
      }, 350);
    } else {
      setOffsetX(0);
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

  return (
    <div
      ref={cardRef}
      className={`${styles.swipeCardWrapper} ${leaving ? styles.swipeLeaving : ""}`}
      style={{
        zIndex,
        transform: `translateX(${offsetX}px) rotate(${rotate}deg)`,
        transition: dragging
          ? "none"
          : "transform 0.35s cubic-bezier(.4,0,.2,1)",
        cursor: isTop ? (dragging ? "grabbing" : "grab") : "default",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Decision overlays */}
      <div
        className={styles.swipeLikeStamp}
        style={{ opacity: likeOp, zIndex: 10 }}
      >
        LIKE 💚
      </div>
      <div
        className={styles.swipePassStamp}
        style={{ opacity: passOp, zIndex: 10 }}
      >
        PASS ✕
      </div>

      {/* ── We render the exact Grid Card here! ── */}
      <div
        style={{
          pointerEvents: dragging ? "none" : "all",
          width: "100%",
          height: "100%",
        }}
      >
        <ProductCard product={product} currentUserId={currentUserId} />
      </div>
    </div>
  );
});

/* ─────────────────────────────────────
   UNIVERSITY SWITCHER MODAL
───────────────────────────────────── */
function UniSwitcher({ current, onSelect, onClose }) {
  return (
    <div className={styles.uniOverlay} onClick={onClose}>
      <div className={styles.uniModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.uniModalHead}>
          <span className={styles.uniModalTitle}>Switch Campus</span>
          <button className={styles.uniCloseBtn} onClick={onClose}>
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>
        <div className={styles.uniList}>
          {UNIVERSITIES.map((u) => (
            <button
              key={u.id}
              className={`${styles.uniItem} ${current.id === u.id ? styles.uniItemActive : ""}`}
              onClick={() => {
                onSelect(u);
                onClose();
              }}
            >
              <span
                className={styles.uniItemDot}
                style={{
                  background: current.id === u.id ? "var(--purple)" : "#ddd",
                }}
              />
              <div>
                <div className={styles.uniItemName}>{u.name}</div>
                <div className={styles.uniItemDomain}>{u.domain}</div>
              </div>
              {current.id === u.id && (
                <span className={styles.uniItemCheck}>
                  <Check size={16} strokeWidth={2.5} />
                </span>
              )}
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
      <button
        className={styles.filterSectionHead}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={styles.filterSectionIcon}>{icon}</span>
        <span className={styles.filterSectionTitle}>{title}</span>
        <span className={styles.filterChevron}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
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
  const currentUserId = localStorage.getItem("yahora_user_id");

  /* ── Core State ── */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'swipe'
  const [activeSort, setActiveSort] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [university, setUniversity] = useState(UNIVERSITIES[0]);
  const [showUniModal, setShowUniModal] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [swipeDeck, setSwipeDeck] = useState([]);

  /* ── Filter State ── */
  const [selCategories, setSelCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selConditions, setSelConditions] = useState([]);
  const [selPostingDate, setSelPostingDate] = useState("");
  const [showWishlist, setShowWishlist] = useState(false);
  const [showMyListings, setShowMyListings] = useState(false);

  /* ── Fetch products ── */
  useEffect(() => {
    setLoading(true);
    // Simulate network delay
    const t = setTimeout(() => {
      const universityProducts = MOCK_PRODUCTS.filter(
        (p) => p.university_id === university.id,
      );
      setProducts(universityProducts);
      setSwipeDeck([...universityProducts].reverse());
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, [university]);

  /* ── Active filter count ── */
  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (selCategories.length) n++;
    if (selConditions.length) n++;
    if (selPostingDate) n++;
    if (priceRange[0] > 0 || priceRange[1] < 50000) n++;
    if (showWishlist) n++;
    if (showMyListings) n++;
    return n;
  }, [
    selCategories,
    selConditions,
    selPostingDate,
    priceRange,
    showWishlist,
    showMyListings,
  ]);

  /* ── Clear all filters ── */
  const clearFilters = useCallback(() => {
    setSelCategories([]);
    setPriceRange([0, 50000]);
    setSelConditions([]);
    setSelPostingDate("");
    setShowWishlist(false);
    setShowMyListings(false);
  }, []);

  /* ── Toggle helpers ── */
  const toggleCategory = useCallback((id) => {
    setSelCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }, []);
  const toggleCondition = useCallback((c) => {
    setSelConditions((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  }, []);

  /* ── Posting date filter helper ── */
  const isWithinPostingDate = useCallback((isoDate, key) => {
    if (!key) return true;
    const now = Date.now();
    const then = new Date(isoDate).getTime();
    const diff = now - then;
    if (key === "today") return diff < 86400000;
    if (key === "week") return diff < 86400000 * 7;
    if (key === "month") return diff < 86400000 * 30;
    if (key === "older") return diff >= 86400000 * 30;
    return true;
  }, []);

  /* ── Filtered + sorted products ── */
  const displayProducts = useMemo(() => {
    let list = products.filter((p) => p.status !== "sold");

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q),
      );
    }

    if (selCategories.length)
      list = list.filter((p) => selCategories.includes(p.category));
    list = list.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );
    if (selConditions.length)
      list = list.filter((p) => selConditions.includes(p.condition));
    if (selPostingDate)
      list = list.filter((p) =>
        isWithinPostingDate(p.created_at, selPostingDate),
      );
    if (showWishlist) list = list.filter((p) => p.is_saved);
    if (showMyListings)
      list = list.filter((p) => p.seller?.id === currentUserId);

    if (activeSort === "newest")
      list = [...list].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );
    if (activeSort === "lowest_price")
      list = [...list].sort((a, b) => a.price - b.price);
    if (activeSort === "trending")
      list = [...list].sort(
        (a, b) => b.likes_count + b.views - (a.likes_count + a.views),
      );

    return list;
  }, [
    products,
    searchQuery,
    selCategories,
    priceRange,
    selConditions,
    selPostingDate,
    showWishlist,
    showMyListings,
    activeSort,
    currentUserId,
    isWithinPostingDate,
  ]);

  /* ── Swipe handlers ── */
  const handleSwipeLike = useCallback((id) => {
    setSwipeDeck((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleSwipePass = useCallback((id) => {
    setSwipeDeck((prev) => prev.filter((p) => p.id !== id));
  }, []);

  /* ── Sidebar JSX ── */
  const SidebarContent = (
    <aside className={styles.sidebar}>
      {/* University badge */}
      <div className={styles.sidebarUni}>
        <span className={styles.sidebarUniBrand}>Yahora</span>
        <span className={styles.sidebarUniSep}>—</span>
        <span className={styles.sidebarUniName}>{university.name}</span>
        <button
          className={styles.sidebarUniSwitch}
          onClick={() => setShowUniModal(true)}
          title="Switch campus"
        >
          <ArrowRightLeft size={16} />
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filterList}>
        {/* Categories */}
        <FilterSection
          icon={<Tag size={16} />}
          title="Categories"
          defaultOpen={false}
        >
          <div className={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.categoryChip} ${selCategories.includes(cat.id) ? styles.categoryChipActive : ""}`}
                onClick={() => toggleCategory(cat.id)}
              >
                <span className={styles.categoryIcon}>{cat.icon}</span>
                <span className={styles.categoryLabel}>{cat.label}</span>
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection icon={<Banknote size={16} />} title="Price Range">
          <div className={styles.priceRangeWrap}>
            <div className={styles.priceRangeLabels}>
              <span>₹{priceRange[0].toLocaleString("en-IN")}</span>
              <span>₹{priceRange[1].toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min="0"
              max="50000"
              step="500"
              value={priceRange[0]}
              className={styles.rangeInput}
              onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
            />
            <input
              type="range"
              min="0"
              max="50000"
              step="500"
              value={priceRange[1]}
              className={styles.rangeInput}
              onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
            />
          </div>
        </FilterSection>

        {/* Item Condition */}
        <FilterSection icon={<Star size={16} />} title="Item Condition">
          <div className={styles.conditionList}>
            {CONDITIONS.map((c) => (
              <button
                key={c}
                className={`${styles.conditionChip} ${selConditions.includes(c) ? styles.conditionChipActive : ""}`}
                onClick={() => toggleCondition(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* My Wishlist */}
        <FilterSection icon={<Heart size={16} />} title="My Wishlist">
          <button
            className={`${styles.toggleFilter} ${showWishlist ? styles.toggleFilterActive : ""}`}
            onClick={() => setShowWishlist((v) => !v)}
          >
            {showWishlist ? "✓ Showing saved items" : "Show my saved items"}
          </button>
        </FilterSection>

        {/* Posting Date */}
        <FilterSection icon={<Calendar size={16} />} title="Posting Date">
          <div className={styles.dateList}>
            {POSTING_DATE_OPTIONS.map((d) => (
              <button
                key={d.key}
                className={`${styles.dateChip} ${selPostingDate === d.key ? styles.dateChipActive : ""}`}
                onClick={() =>
                  setSelPostingDate((prev) => (prev === d.key ? "" : d.key))
                }
              >
                {d.label}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* My Listings */}
        <FilterSection icon={<List size={16} />} title="My Listings">
          <button
            className={`${styles.toggleFilter} ${showMyListings ? styles.toggleFilterActive : ""}`}
            onClick={() => setShowMyListings((v) => !v)}
          >
            {showMyListings ? "✓ Showing my listings" : "Show only my listings"}
          </button>
        </FilterSection>
      </div>

      {/* List New Item Card (Dashed box style) */}
      <div
        className={styles.listNewCard}
        onClick={() => {
          navigate("/sell");
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        }}
      >
        <button className={styles.listNewIcon}>
          <Plus size={16} strokeWidth={2.5} />
        </button>
        <div className={styles.listNewTitle}>List New Item</div>
        <div className={styles.listNewSub}>Earn some campus cash</div>
      </div>

      {/* Clear all filters */}
      {activeFilterCount > 0 && (
        <button className={styles.clearBtn} onClick={clearFilters}>
          <X size={14} /> Clear All Filters
          <span className={styles.clearBadge}>{activeFilterCount}</span>
        </button>
      )}
    </aside>
  );

  /* ── Render ── */
  return (
    <div className={styles.root}>
      {/* ── FAB ── */}
      <div
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 100,
          opacity: 1,
          transform: "scale(1)",
          pointerEvents: "all",
          transition:
            "opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <button
          className={`${styles.fab} ${styles.fabEnter}`}
          title="List a new item"
          onClick={() => {
            navigate("/sell");
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          }}
        >
          <Plus size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* ── University Switcher Modal ── */}
      {showUniModal && (
        <UniSwitcher
          current={university}
          onSelect={setUniversity}
          onClose={() => setShowUniModal(false)}
        />
      )}

      {/* ── Desktop Sidebar ── */}
      <div className={styles.sidebarWrap}>{SidebarContent}</div>

      {/* ── Mobile filter drawer ── */}
      {showMobileFilter && (
        <div
          className={styles.mobileDrawerOverlay}
          onClick={() => setShowMobileFilter(false)}
        >
          <div
            className={styles.mobileDrawer}
            onClick={(e) => e.stopPropagation()}
          >
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
            <span className={styles.searchIcon}>
              <Search size={18} />
            </span>
            <input
              type="search"
              placeholder="Search marketplace…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              aria-label="Search products"
            />
            {searchQuery && (
              <button
                className={styles.searchClear}
                onClick={() => setSearchQuery("")}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Sort options */}
          <div className={styles.sortGroup}>
            <span className={styles.sortLabel}>Sort by:</span>
            {SORT_OPTIONS.map((s) => (
              <button
                key={s.key}
                className={`${styles.sortBtn} ${activeSort === s.key ? styles.sortBtnActive : ""}`}
                onClick={() => setActiveSort(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* View mode toggle */}
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewBtn} ${viewMode === "grid" ? styles.viewBtnActive : ""}`}
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              <LayoutGrid size={16} /> <span>Grid</span>
            </button>
            <button
              className={`${styles.viewBtn} ${viewMode === "swipe" ? styles.viewBtnActive : ""}`}
              onClick={() => setViewMode("swipe")}
              aria-label="Swipe view"
            >
              <Layers size={16} /> <span>Swipe</span>
            </button>
          </div>

          {/* Mobile filter button */}
          <button
            className={styles.mobileFilterBtn}
            onClick={() => setShowMobileFilter(true)}
            aria-label="Open filters"
          >
            <SlidersHorizontal size={20} />
            {activeFilterCount > 0 && (
              <span className={styles.mobileFilterBadge}>
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* ── GRID VIEW ── */}
        {viewMode === "grid" && (
          <>
            {loading ? (
              <div className={styles.grid}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : displayProducts.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <ShoppingBag size={56} strokeWidth={1.5} color="#d0d0d0" />
                </div>
                <h3 className={styles.emptyTitle}>
                  {searchQuery
                    ? `No results for "${searchQuery}"`
                    : showWishlist
                      ? "Your wishlist is empty"
                      : `No items listed in ${university.name} right now`}
                </h3>
                <p className={styles.emptyDesc}>
                  {showWishlist
                    ? "Explore the marketplace and save items you love."
                    : "Be the first to list something! Your campus is waiting."}
                </p>
                <div className={styles.emptyActions}>
                  {activeFilterCount > 0 && (
                    <button
                      className={styles.emptyBtnSecondary}
                      onClick={clearFilters}
                    >
                      Clear filters
                    </button>
                  )}
                  <button
                    className={styles.emptyBtnPrimary}
                    onClick={() => navigate("/sell")}
                  >
                    <Plus size={16} /> List an item
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
        {viewMode === "swipe" && (
          <div className={styles.swipeViewWrap}>
            {loading ? (
              <div className={styles.swipeLoading}>
                <div className={styles.swipeSkeletonCard} />
                <p>Loading items…</p>
              </div>
            ) : swipeDeck.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <PartyPopper size={56} strokeWidth={1.5} color="#d0d0d0" />
                </div>
                <h3 className={styles.emptyTitle}>You've seen everything!</h3>
                <p className={styles.emptyDesc}>
                  Check back later for new listings, or browse in Grid mode.
                </p>
                <div className={styles.emptyActions}>
                  <button
                    className={styles.emptyBtnSecondary}
                    onClick={() => setViewMode("grid")}
                  >
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
                <div className={styles.swipeDeck}>
                  {swipeDeck.slice(-3).map((product, i, arr) => (
                    <SwipeCard
                      key={product.id}
                      product={product}
                      isTop={i === arr.length - 1}
                      zIndex={i + 1}
                      onLike={handleSwipeLike}
                      onPass={handleSwipePass}
                      currentUserId={currentUserId}
                    />
                  ))}
                </div>

                <p className={styles.swipeCounter}>
                  {swipeDeck.length} item{swipeDeck.length !== 1 ? "s" : ""}{" "}
                  remaining
                </p>
                <p className={styles.swipeHint}>
                  Swipe <span style={{ color: "#4ade80" }}>right to like</span>{" "}
                  · <span style={{ color: "#f87171" }}>left to pass</span>
                </p>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}