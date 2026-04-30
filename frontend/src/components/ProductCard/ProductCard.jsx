/**
 * Yahora — ProductCard Component
 * ================================
 * File: frontend/src/components/ProductCard/ProductCard.jsx
 *
 *
 * Features:
 *  ✅ Image carousel with "1/4" counter
 *  ✅ Dual like buttons (image overlay + footer) — synced, counter only in footer
 *  ✅ Real-time view / like / comment counts via Supabase Realtime
 *  ✅ Live "time ago" ticker (updates every 30s)
 *  ✅ Save (wishlist) + Share with Web Share API fallback
 *  ✅ Condition badge + Location tag + Price layout
 *  ✅ Seller avatar + name row
 *  ✅ Optimistic UI — instant feedback, server confirms asynchronously
 *
 * Usage:
 *   import ProductCard from '@/components/ProductCard/ProductCard';
 *
 *   <ProductCard
 *     product={productObject}
 *     currentUserId={userId}        // from localStorage / auth context
 *     onCardClick={(id) => navigate(`/product/${id}`)}
 *   />
 *
 * Product object shape (matches backend GET /api/user/:id/dashboard listings):
 * {
 *   id, title, price, description,
 *   image_urls: string[],
 *   condition: 'Mint' | 'Good' | 'Fair' | 'Poor',
 *   location: string,          // e.g. "Hall 1"
 *   status: 'available' | 'sold' | 'pending',
 *   views: number,
 *   likes_count: number,
 *   comments_count: number,
 *   created_at: string,        // ISO date string
 *   is_liked: boolean,         // current user already liked?
 *   is_saved: boolean,         // current user already saved?
 *   seller: {
 *     id, full_name, avatar_url, university
 *   }
 * }
 */

import React, { useState, useEffect, useRef, useCallback, memo } from "react";
// Import the shared client instead of creating a new one!
import { supabase } from "../../config/supabaseClient";
import styles from "./ProductCard.module.css";

const CONDITION_CONFIG = {
  Mint: { label: "MINT CONDITION", bg: "#2BB7FF", color: "#fff" },
  "Like New": { label: "LIKE NEW", bg: "#4ade80", color: "#052e16" },
  Good: { label: "GOOD", bg: "#facc15", color: "#1a1100" },
  Fair: { label: "FAIR", bg: "#fb923c", color: "#fff" },
  Poor: { label: "POOR", bg: "#f87171", color: "#fff" },
};

function timeAgo(isoString) {
  if (!isoString) return "Just now";
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 86400 * 30) return `${Math.floor(diff / (86400 * 7))}w ago`;
  return new Date(isoString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

/* ── Icons ── */
const HeartIcon = ({ filled, size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const EyeIcon = ({ size = 16 }) => (
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
const CommentIcon = ({ size = 16 }) => (
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
const BookmarkIcon = ({ filled, size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);
const ShareIcon = ({ size = 18 }) => (
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
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const ChevronIcon = ({ dir = "left", size = 18 }) => (
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
    {dir === "left" ? (
      <polyline points="15 18 9 12 15 6" />
    ) : (
      <polyline points="9 18 15 12 9 6" />
    )}
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

const XIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ProductCard = memo(function ProductCard({
  product,
  currentUserId = null,
  isOwner = false,
  onCardClick = null,
  onEdit = null,
  onChat = null,
  onDelete = null,
}) {
  const [imgIndex, setImgIndex] = useState(0);
  const [liked, setLiked] = useState(product.is_liked ?? false);
  const [saved, setSaved] = useState(product.is_saved ?? false);
  const [likeCount, setLikeCount] = useState(product.likes_count ?? 0);
  const [viewCount, setViewCount] = useState(product.views ?? 0);
  const [commentCount, setCommentCount] = useState(product.comments_count ?? 0);
  const [timeLabel, setTimeLabel] = useState(() => timeAgo(product.created_at));

  const likeThrottle = useRef(false);
  const saveThrottle = useRef(false);

  // Safely handle both Database array format and Mock string format
  const images = product.image_urls?.length
    ? product.image_urls
    : product.image
      ? [product.image]
      : ["https://via.placeholder.com/600x400?text=No+Image"];

  const totalImages = images.length;
  const condCfg =
    CONDITION_CONFIG[product.condition] ?? CONDITION_CONFIG["Good"];

  // Handle differences in price formatting
  const displayPrice =
    typeof product.price === "string" && product.price.includes("₹")
      ? product.price
      : `₹${Number(product.price).toLocaleString("en-IN")}`;

  useEffect(() => {
    const id = setInterval(
      () => setTimeLabel(timeAgo(product.created_at)),
      30_000,
    );
    return () => clearInterval(id);
  }, [product.created_at]);

  useEffect(() => {
    if (!supabase || !product.id) return;
    const channel = supabase
      .channel(`product:${product.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "products",
          filter: `id=eq.${product.id}`,
        },
        (payload) => {
          const row = payload.new;
          if (row.views !== undefined) setViewCount(row.views);
          if (row.likes_count !== undefined) setLikeCount(row.likes_count);
          if (row.comments_count !== undefined)
            setCommentCount(row.comments_count);
        },
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [product.id]);

  useEffect(() => {
    if (!supabase || !product.id) return;
    if (currentUserId && currentUserId === product.seller?.id) return;
    const key = `viewed_${product.id}`;
    if (sessionStorage.getItem(key)) return;

    sessionStorage.setItem(key, "1");

    // Fixed: properly handle the async rpc call
    const incrementView = async () => {
      const { error } = await supabase.rpc("increment_product_views", {
        product_id: product.id,
      });
      if (error) console.error("Failed to increment views", error);
    };
    incrementView();
  }, [product.id, currentUserId, product.seller?.id]);

  const prevImage = useCallback(
    (e) => {
      e.stopPropagation();
      setImgIndex((i) => (i - 1 + totalImages) % totalImages);
    },
    [totalImages],
  );
  const nextImage = useCallback(
    (e) => {
      e.stopPropagation();
      setImgIndex((i) => (i + 1) % totalImages);
    },
    [totalImages],
  );

  const handleLike = useCallback(
    async (e) => {
      e.stopPropagation();
      if (!currentUserId) return alert("Please log in to like items!");
      if (likeThrottle.current) return;
      likeThrottle.current = true;
      setTimeout(() => {
        likeThrottle.current = false;
      }, 600);

      const nowLiked = !liked;
      setLiked(nowLiked);
      setLikeCount((c) => (nowLiked ? c + 1 : Math.max(0, c - 1)));

      try {
        if (!supabase) return;
        if (nowLiked)
          await supabase
            .from("product_likes")
            .insert({ user_id: currentUserId, product_id: product.id });
        else
          await supabase
            .from("product_likes")
            .delete()
            .match({ user_id: currentUserId, product_id: product.id });
      } catch (err) {
        setLiked(!nowLiked);
        setLikeCount((c) => (nowLiked ? Math.max(0, c - 1) : c + 1));
      }
    },
    [liked, currentUserId, product.id],
  );

  const handleSave = useCallback(
    async (e) => {
      e.stopPropagation();
      if (!currentUserId) return alert("Please log in to save items!");
      if (saveThrottle.current) return;
      saveThrottle.current = true;
      setTimeout(() => {
        saveThrottle.current = false;
      }, 600);

      const nowSaved = !saved;
      setSaved(nowSaved);

      try {
        if (!supabase) return;
        if (nowSaved)
          await supabase
            .from("product_saves")
            .insert({ user_id: currentUserId, product_id: product.id });
        else
          await supabase
            .from("product_saves")
            .delete()
            .match({ user_id: currentUserId, product_id: product.id });
      } catch (err) {
        setSaved(!nowSaved);
      }
    },
    [saved, currentUserId, product.id],
  );

  const handleShare = useCallback(
    async (e) => {
      e.stopPropagation();
      const shareData = {
        title: product.title,
        text: `Check out "${product.title}" on Yahora for ${displayPrice}`,
        url: `${window.location.origin}/product/${product.id}`,
      };
      try {
        if (navigator.share) await navigator.share(shareData);
        else {
          await navigator.clipboard.writeText(shareData.url);
          alert("Link copied to clipboard!");
        }
      } catch {}
    },
    [product, displayPrice],
  );

  const handleCardClick = useCallback(() => {
    if (onCardClick) onCardClick(product.id);
  }, [onCardClick, product.id]);

  // Handle nested object from DB or flat string from Mock
  const sellerName =
    product.seller?.full_name || product.seller || "Unknown Seller";
  const sellerAvatar = product.seller?.avatar_url || null;
  const sellerInitial =
    typeof sellerName === "string" ? sellerName.charAt(0).toUpperCase() : "U";

  return (
    <article
      className={styles.card}
      onClick={onCardClick ? handleCardClick : undefined}
      style={{ cursor: onCardClick ? "pointer" : "default" }}
    >
      <div className={styles.imageWrap}>
        <div
          className={styles.imageTrack}
          style={{ transform: `translateX(-${imgIndex * 100}%)` }}
        >
          {images.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`${product.title} ${i + 1}`}
              className={styles.image}
              loading={i === 0 ? "eager" : "lazy"}
              draggable={false}
            />
          ))}
        </div>
        {totalImages > 1 && (
          <>
            <button
              className={`${styles.carouselBtn} ${styles.carouselBtnLeft}`}
              onClick={prevImage}
            >
              <ChevronIcon dir="left" size={14} />
            </button>
            <button
              className={`${styles.carouselBtn} ${styles.carouselBtnRight}`}
              onClick={nextImage}
            >
              <ChevronIcon dir="right" size={14} />
            </button>
            <div className={styles.imageCounter}>
              {imgIndex + 1}/{totalImages}
            </div>
          </>
        )}
        <button
          className={`${styles.overlayHeart} ${liked ? styles.overlayHeartLiked : ""}`}
          onClick={handleLike}
        >
          <HeartIcon filled={liked} size={18} />
        </button>
        {product.status === "sold" && (
          <div className={styles.soldBanner}>SOLD</div>
        )}
      </div>

      <div className={styles.infoWrap}>
        <div className={styles.metaRow}>
          <div className={styles.metaLeft}>
            <span
              className={styles.conditionBadge}
              style={{ background: condCfg.bg, color: condCfg.color }}
            >
              {condCfg.label}
            </span>
          </div>
          <span className={styles.price}>{displayPrice}</span>
        </div>
        {(product.location || product.category || product.tag) && (
          <span className={styles.locationTag}>
            {(
              product.location ||
              product.category ||
              product.tag
            ).toUpperCase()}
          </span>
        )}
        <h3 className={styles.title}>{product.title}</h3>

        <div className={styles.footerRow}>
          <div className={styles.stats}>
            <span className={styles.stat}>
              <EyeIcon />
              <span>{viewCount}</span>
            </span>
            <button
              className={`${styles.statBtn} ${liked ? styles.statBtnLiked : ""}`}
              onClick={handleLike}
            >
              <HeartIcon filled={liked} size={16} />
              <span>{likeCount}</span>
            </button>
            <span className={styles.stat}>
              <CommentIcon />
              <span>{commentCount}</span>
            </span>
            <button
              className={`${styles.statBtn} ${saved ? styles.statBtnSaved : ""}`}
              onClick={handleSave}
            >
              <BookmarkIcon filled={saved} size={16} />
            </button>
            <button className={styles.statBtn} onClick={handleShare}>
              <ShareIcon size={16} />
            </button>
          </div>
        </div>
        
        <div className={styles.timeAvatar}>
          <p className={styles.timeAgo}>{timeLabel}</p>
          {isOwner ? (
            <div className={styles.ownerActions}>
               {product.status === "sold" && product.sold_to ? (
                  <span className={styles.cardSoldTo}>
                    SOLD TO @{product.sold_to}
                  </span>
               ) : (
                  <>
                    <button 
                      className={`${styles.cardBtn} ${styles.cardBtnChat}`} 
                      title="Messages" 
                      onClick={(e) => { e.stopPropagation(); onChat?.(); }}
                    >
                      <ChatIcon size={14} />
                    </button>
                    <button 
                      className={`${styles.cardBtn} ${styles.cardBtnEdit}`} 
                      title="Edit listing" 
                      onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
                    >
                      <PenIcon size={13} />
                    </button>
                    {/* NEW DELETE BUTTON HERE */}
                    <button 
                      className={`${styles.cardBtn} ${styles.cardBtnDelete}`} 
                      title="Delete listing" 
                      onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
                      style={{ color: '#f87171' }}
                    >
                      <XIcon size={14} />
                    </button>
                  </>
               )}
            </div>
          ) : (
            <div className={styles.seller}>
              {sellerAvatar ? (
                <img
                  src={sellerAvatar}
                  alt={sellerName}
                  className={styles.sellerAvatar}
                />
              ) : (
                <div className={styles.sellerAvatarFallback}>
                  {sellerInitial}
                </div>
              )}
              <span className={styles.sellerName}>by {sellerName}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
});

export default ProductCard;
