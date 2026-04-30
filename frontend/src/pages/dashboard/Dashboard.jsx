// frontend/src/pages/dashboard/Dashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import ProductCard from "../../components/ProductCard/ProductCard";

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const STATUS_CONFIG = {
  available: { label: "ACTIVE", bg: "#1a1a2e", color: "#4ade80" },
  pending: { label: "PENDING", bg: "#1a1a2e", color: "#facc15" },
  sold: { label: "SOLD", bg: "#1a1a2e", color: "#f87171" },
};

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

/* ─────────────────────────────────────────────
   ICONS
───────────────────────────────────────────── */
const HeartIcon = ({ size = 18, fill = "none", stroke = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const PenIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const BellIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const GearIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const EyeIcon = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const ChatIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const ClockIcon = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const PlusIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const CheckIcon = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const XIcon = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ─────────────────────────────────────────────
   SUB-COMPONENTS 
───────────────────────────────────────────── */
function Avatar({ src, size, editable, onEdit, isUploading }) {
  const imageSource = src || "https://via.placeholder.com/250?text=User";
  return (
    <div className={styles.avatarWrap} style={{ "--av-size": size + "px" }}>
      <div className={styles.avatarRing}>
        {isUploading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              background: "#eee",
              color: "#888",
              fontSize: "12px",
            }}
          >
            Uploading...
          </div>
        ) : (
          <img src={imageSource} alt="avatar" className={styles.avatarImg} />
        )}
      </div>
      {editable && !isUploading && (
        <button
          className={styles.avatarEdit}
          onClick={onEdit}
          title="Change photo"
        >
          <PenIcon size={14} />
        </button>
      )}
    </div>
  );
}

function EditableField({ label, value, onSave, textarea, placeholder }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");
  const save = () => {
    onSave(draft);
    setEditing(false);
  };
  const cancel = () => {
    setDraft(value || "");
    setEditing(false);
  };
  return (
    <div className={styles.ef}>
      {label && <div className={styles.efLabel}>{label}</div>}
      {editing ? (
        <div className={styles.efEdit}>
          {textarea ? (
            <textarea
              className={styles.efInput}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={placeholder}
              rows={3}
            />
          ) : (
            <input
              className={styles.efInput}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={placeholder}
            />
          )}
          <div className={styles.efActions}>
            <button
              className={`${styles.efBtn} ${styles.efBtnSave}`}
              onClick={save}
            >
              <CheckIcon />
            </button>
            <button
              className={`${styles.efBtn} ${styles.efBtnCancel}`}
              onClick={cancel}
            >
              <XIcon />
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.efDisplay}>
          <span className={styles.efValue}>
            {value || <em style={{ color: "#aaa" }}>Not set</em>}
          </span>
          <button className={styles.efTrigger} onClick={() => setEditing(true)}>
            <PenIcon size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

// function ProductCard({ item, owned }) {
//   const st = STATUS_CONFIG[item.status] || STATUS_CONFIG.available;
//   const imageUrl = item.image_urls?.[0] || "https://via.placeholder.com/300?text=No+Image";

//   // Local state for the like button (wishlist feature)
//   const [isLiked, setIsLiked] = useState(false);

//   // Fallback for location until you add it to your database schema
//   const locationName = item.location || "Campus Hostel";

//   return (
//     <div className={styles.listingCard}>

//       {/* --- Image Wrapper --- */}
//       <div className={styles.listingImageWrapper}>
//         <img src={imageUrl} alt={item.title} className={styles.listingImage} />

//         {/* Status Badge (Active/Sold) */}
//         <span className={styles.cardBadge} style={{ background: st.bg, color: st.color }}>
//           {st.label}
//         </span>

//         {/* Heart Like Button */}
//         <button
//           className={styles.heartBtn}
//           onClick={(e) => {
//             e.stopPropagation(); // Prevents clicking the card if you add links later
//             setIsLiked(!isLiked);
//           }}
//         >
//           <HeartIcon
//             size={18}
//             fill={isLiked ? "var(--pink-dark)" : "none"}
//             stroke={isLiked ? "var(--pink-dark)" : "#fff"}
//           />
//         </button>
//       </div>

//       {/* --- Info Section --- */}
//       <div className={styles.listingInfo}>

//         {/* Tags & Price Row */}
//         <div className={styles.listingTags}>
//           <div className={styles.tagLocation}>
//             {item.category && (
//               <span className={styles.tag}>{item.category}</span>
//             )}
//             <span className={styles.locationTag}>{locationName}</span>
//           </div>

//           <div
//             className={styles.listingPrice}
//             style={{
//               color: item.status === "sold" ? "#999" : "var(--purple)",
//               textDecoration: item.status === "sold" ? "line-through" : "none",
//             }}
//           >
//             {fmt(item.price)}
//           </div>
//         </div>

//         {/* Title & Description */}
//         <h3 className={styles.listingTitle}>{item.title}</h3>
//         <p className={styles.cardDesc}>
//           {item.description || item.product?.description}
//         </p>

//         {/* Footer (Dashboard specific data: Views/Sold + Actions) */}
//         <div className={styles.cardFoot}>
//           {item.status === "sold" && item.sold_to ? (
//             <span className={styles.cardSoldTo}>
//               <ClockIcon /> Sold to @{item.sold_to}
//             </span>
//           ) : item.views !== undefined ? (
//             <span className={styles.cardViews}>
//               <EyeIcon /> {item.views} Views
//             </span>
//           ) : (
//             // <span />
//             <span className={styles.cardViews}>
//               <EyeIcon /> {item.views} Views
//             </span>
//           )}

//           {owned && item.status !== "sold" && (
//             <div className={styles.cardActions}>
//               <button className={`${styles.cardBtn} ${styles.cardBtnChat}`} title="Messages">
//                 <ChatIcon size={14} />
//               </button>
//               <button className={`${styles.cardBtn} ${styles.cardBtnEdit}`} title="Edit listing">
//                 <PenIcon size={13} />
//               </button>
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }

function PurchaseCard({ item }) {
  const p = item.product;
  const imageUrl =
    p.image_urls?.[0] || "https://via.placeholder.com/300?text=No+Image";
  return (
    <div className={styles.card}>
      <div className={styles.cardImgWrap}>
        <img src={imageUrl} alt={p.title} className={styles.cardImg} />
        <span
          className={styles.cardBadge}
          style={{ background: "#1a1a2e", color: "#60a5fa" }}
        >
          BOUGHT
        </span>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardHead}>
          <h3 className={styles.cardTitle}>{p.title}</h3>
          <span className={styles.cardPrice} style={{ color: "var(--blue)" }}>
            {fmt(p.price)}
          </span>
        </div>
        <div className={styles.cardFoot}>
          <span className={styles.cardViews}>
            <ClockIcon />{" "}
            {new Date(item.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN DASHBOARD COMPONENT
───────────────────────────────────────────── */

export default function Dashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("listings");

  const fileInputRef = React.useRef(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Simple boolean state replacing the glitchy 3-phase timer
  const [isDashboard, setIsDashboard] = useState(false);

  /* ── Avatar Upload Logic ── */
  const handleAvatarEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const userId = localStorage.getItem("yahora_user_id");
      const token = localStorage.getItem("yahora_session");
      if (!userId || !token) return;

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/${userId}/avatar`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }, // Do NOT set Content-Type here
          body: formData,
        },
      );

      if (!res.ok) throw new Error("Failed to upload avatar");

      const responseData = await res.json();

      // Update UI immediately with the new URL
      setData((prev) => ({
        ...prev,
        profile: { ...prev.profile, avatar_url: responseData.avatar_url },
      }));
    } catch (e) {
      console.error("Failed to upload avatar:", e);
      alert("Failed to update profile photo.");
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
    }
  };

  /* ── Fetch ── */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const userId = localStorage.getItem("yahora_user_id");
        const token = localStorage.getItem("yahora_session");
        if (!userId || !token) {
          navigate("/auth");
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/user/${userId}/dashboard`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        setData(await res.json());
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
        setError("Could not load dashboard. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [navigate]);

  /* ── Smooth Scroll Intent Logic (Desktop & Mobile) ── */
  useEffect(() => {
    let touchStartY = 0;
    let isCooldown = false;

    const startCooldown = () => {
      isCooldown = true;
      setTimeout(() => {
        isCooldown = false;
      }, 800); // Prevents rapid accidental toggles
    };

    const handleWheel = (e) => {
      if (isCooldown) return;

      // Scrolling DOWN in Hero view
      if (!isDashboard && e.deltaY > 20) {
        setIsDashboard(true);
        window.scrollTo({ top: 0, behavior: "smooth" }); // Reset scroll position naturally
        startCooldown();
      }
      // Scrolling UP in Dashboard view (ONLY when at the very top of the page)
      else if (isDashboard && e.deltaY < -20 && window.scrollY <= 0) {
        setIsDashboard(false);
        startCooldown();
      }
    };

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (isCooldown) return;
      const delta = touchStartY - e.touches[0].clientY; // Positive = scrolling down

      if (!isDashboard && delta > 30) {
        setIsDashboard(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
        startCooldown();
      } else if (isDashboard && delta < -30 && window.scrollY <= 0) {
        setIsDashboard(false);
        startCooldown();
      }
    };

    // Attach passive listeners to not block scrolling threads
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isDashboard]);

  /* ── Profile field update ── */
  const updateField = useCallback(async (field, value) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, [field]: value },
    }));
    try {
      const userId = localStorage.getItem("yahora_user_id");
      const token = localStorage.getItem("yahora_session");
      if (!userId || !token) return;
      await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/${userId}/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ [field]: value }),
        },
      );
    } catch (e) {
      console.error("Failed to update profile field:", e);
    }
  }, []);

  /* ── Product Management Logic ── */
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this listing? This cannot be undone.")) return;

    try {
      const token = localStorage.getItem("yahora_session");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete product");

      // Instantly remove the item from the UI state
      setData((prev) => ({
        ...prev,
        listings: prev.listings.filter((item) => item.id !== productId),
      }));
    } catch (e) {
      console.error("Failed to delete listing:", e);
      alert("Failed to delete the listing. Please try again.");
    }
  };

  const handleEditProduct = (product) => {
    // Navigate to the Sell page and pass the product data via state
    // Your Sell page will need to check for this state to populate its fields
    navigate("/sell", { state: { editProduct: product } });
  };  

  /* ── Guards ── */
  if (loading)
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <span>Loading your dashboard…</span>
      </div>
    );
  if (error)
    return (
      <div className={styles.loading}>
        <span>{error}</span>
      </div>
    );
  if (!data) return null;

  const { profile, listings, purchases } = data;
  const firstName = (profile.full_name || "User").split(" ")[0];

  return (
    <div
      className={styles.dashboardRoot}
      style={{ position: "relative", minHeight: "100vh", overflowX: "hidden" }}
    >
      {/* Hidden file input for Avatar uploads */}
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* ══════════════════════════════════════
          UI 1 — HERO VIEW
          Uses CSS inline styles to smoothly fade and scale out.
          When active, position is relative so it dictates document height.
      ══════════════════════════════════════ */}
      <div
        className={styles.heroView}
        style={{
          opacity: isDashboard ? 0 : 1,
          transform: isDashboard
            ? "translateY(-40px) scale(0.96)"
            : "translateY(0) scale(1)",
          pointerEvents: isDashboard ? "none" : "all",
          transition:
            "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          position: isDashboard ? "absolute" : "relative",
          width: "100%",
          top: 0,
          zIndex: isDashboard ? 0 : 10,
        }}
      >
        {/* Row 1: avatar + greeting + icon buttons */}
        <div className={styles.heroHeader}>
          <Avatar
            src={profile.avatar_url}
            size={160} // or 140 for the sidebar
            editable
            onEdit={handleAvatarEditClick}
            isUploading={isUploadingAvatar}
          />
          <div className={styles.heroText}>
            <div className={styles.heroEyebrow}>Student Dashboard</div>
            <div className={styles.sidebarUni}>
              <span className={styles.sidebarUniDot} />
              {profile.university || "Your University"}
            </div>
            <div className={styles.heroGreeting}>Hi, {firstName}! 👋</div>
            <div className={styles.heroSub}>
              Manage your academic journey and marketplace activities.
            </div>
          </div>
          <div className={styles.heroIcons}>
            <button className={styles.iconBtn} title="Notifications">
              <BellIcon />
            </button>
            <button className={styles.iconBtn} title="Settings">
              <GearIcon />
            </button>
          </div>
        </div>

        {/* Row 2: info cards */}
        <div className={styles.heroCards}>
          <div className={styles.academicCard}>
            <div className={styles.cardTitleRow}>
              <span className={styles.sectionTitle}>Academic Profile</span>
            </div>
            <div className={styles.acadGrid}>
              <div>
                <div className={styles.acadLabel}>Qualification</div>
                <div className={styles.acadValue}>
                  {profile.qualification || "—"}
                </div>
              </div>
              <div>
                <div className={styles.acadLabel}>Course</div>
                <div className={styles.acadValue}>
                  {profile.courseName || "—"}
                </div>
              </div>
              <div>
                <div className={styles.acadLabel}>Current Year</div>
                <div className={styles.acadValue}>
                  {profile.year_of_study || "—"}
                </div>
              </div>
              <div>
                <div className={styles.acadLabel}>Specialization</div>
                <div className={styles.acadValue}>
                  {profile.specializationName || "—"}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.bioCard}>
            <div className={styles.bioCardHead}>
              <span className={styles.sectionTitle}>Short Bio</span>
            </div>
            <p className={styles.bioText}>
              "{profile.bio || "Tell the campus who you are!"}"
            </p>
            <div className={styles.tags}>
              {["Campus", "Student", "Yahora"].map((t) => (
                <span key={t} className={styles.tag}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: CTA */}
        <button
          className={styles.sellBtn}
          onClick={() => {
            setIsDashboard(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Manage Your Items
        </button>
      </div>

      {/* ══════════════════════════════════════
          UI 2 — SPLIT / DASHBOARD VIEW
          Smoothly fades and slides UP when triggered.
          When active, it becomes relative to push the layout properly.
      ══════════════════════════════════════ */}
      <div
        className={styles.dashView}
        style={{
          opacity: isDashboard ? 1 : 0,
          transform: isDashboard ? "translateY(0)" : "translateY(40px)",
          pointerEvents: isDashboard ? "all" : "none",
          transition:
            "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          position: isDashboard ? "relative" : "absolute",
          width: "100%",
          top: 0,
          zIndex: isDashboard ? 10 : 0,
        }}
      >
        {/* ─ Left Sidebar (sticky) ─ */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarProfileCard}>
            <Avatar
              src={profile.avatar_url}
              size={140}
              editable
              onEdit={handleAvatarEditClick}
              isUploading={isUploadingAvatar}
            />
            <div className={styles.sidebarName}>{profile.full_name}</div>
            <div className={styles.sidebarUni}>
              <span className={styles.sidebarUniDot} />
              {profile.university || "Your University"}
            </div>
            <div className={styles.sidebarBio}>
              <EditableField
                value={profile.bio}
                placeholder="Tell the campus who you are…"
                textarea
                onSave={(v) => updateField("bio", v)}
              />
            </div>
          </div>

          <div className={styles.sidebarActions}>
            <button className={styles.sidebarIconBtn} title="Notifications">
              <BellIcon />
            </button>
            <button className={styles.sidebarIconBtn} title="Settings">
              <GearIcon />
            </button>
          </div>

          <div className={styles.listNewCard}>
            <button
              className={styles.listNewIcon}
              onClick={() => {
                navigate("/sell");
                window.scrollTo({ top: 0, left: 0, behavior: "auto" });
              }}
            >
              <PlusIcon size={20} />
            </button>
            <div className={styles.listNewTitle}>List New Item</div>
            <div className={styles.listNewSub}>Earn some campus cash</div>
          </div>

          <div className={styles.sidebarDetailsCard}>
            <div className={styles.detailRow}>
              <div className={styles.detailPill}>
                <div className={styles.detailPillLabel}>Qualification</div>
                <div className={styles.detailPillValue}>
                  {profile.qualification || "—"}
                </div>
              </div>
              <div className={styles.detailPill}>
                <div className={styles.detailPillLabel}>Course</div>
                <div className={styles.detailPillValue}>
                  {profile.courseName || "—"}
                </div>
              </div>
              <div className={styles.yearSpecRow}>
                <div className={styles.detailPill}>
                  <div className={styles.detailPillLabel}>Year</div>
                  <div className={styles.detailPillValue}>
                    {profile.year_of_study || "—"}
                  </div>
                </div>
                <div className={styles.detailPill}>
                  <div className={styles.detailPillLabel}>Specialization</div>
                  <div className={styles.detailPillValue}>
                    {profile.specializationName || "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!profile.is_profile_complete && (
            <button
              className={styles.completeBtn}
              onClick={() => navigate("/onboarding")}
            >
              Complete Profile
            </button>
          )}
        </div>

        {/* ─ Right main content ─ */}
        <div className={styles.mainContent}>
          <div className={styles.tabs}>
            {[
              { key: "listings", label: "My Items" },
              { key: "purchases", label: "Bought Items" },
              { key: "watchlist", label: "Watchlist" },
            ].map((t) => (
              <button
                key={t.key}
                className={`${styles.tab} ${tab === t.key ? styles.tabActive : ""}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className={styles.grid} key={tab}>
            {tab === "listings" &&
              (listings.length ? (
                listings.map((item) => (
                  <ProductCard
                    key={item.id}
                    product={item}       
                    isOwner={true}       
                    currentUserId={localStorage.getItem("yahora_user_id")} 
                    onEdit={() => handleEditProduct(item)}
                    onDelete={() => handleDeleteProduct(item.id)}
                  />
                ))
              ) : (
                <div className={styles.emptyState}>
                  You haven't listed anything yet.
                  <br />
                  Hit the + button to start selling!
                </div>
              ))}

            {tab === "purchases" &&
              (purchases.length ? (
                purchases.map((item) => (
                  <PurchaseCard key={item.id} item={item} />
                ))
              ) : (
                <div className={styles.emptyState}>
                  You haven't bought anything yet.
                  <br />
                  Go explore the marketplace!
                </div>
              ))}
            {tab === "watchlist" && (
              <div className={styles.emptyState}>
                Your wishlist is empty.
                <br />
                Swipe right on items you love!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── FAB — gracefully fades in/out with the Dashboard state ── */}
      <div
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 100,
          opacity: isDashboard ? 1 : 0,
          transform: isDashboard ? "scale(1)" : "scale(0)",
          pointerEvents: isDashboard ? "all" : "none",
          transition:
            "opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <button
          className={styles.fab}
          title="List a new item"
          onClick={() => {
            navigate("/sell");
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          }}
        >
          <PlusIcon size={24} />
        </button>
      </div>
    </div>
  );
}
