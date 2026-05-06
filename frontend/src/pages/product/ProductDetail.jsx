import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ProductDetail.module.css";
import { 
  Heart, Share2, MessageSquare, MapPin, Tag, Clock, 
  ChevronRight, ChevronLeft, ArrowLeft, Send, ThumbsUp, ThumbsDown
} from "lucide-react";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("yahora_user_id");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Comment & Q&A State
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null); // stores comment ID
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const url = `${API_BASE_URL}/products/${id}${currentUserId ? `?user_id=${currentUserId}` : ""}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.ok) {
          setProduct(data.product);
        } else {
          console.error("Failed to fetch product:", data.error);
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, currentUserId]);

  const handleToggleSave = async () => {
    if (!currentUserId) return alert("Please log in to save items.");
    
    // Optimistic UI update
    setProduct(prev => ({ ...prev, is_saved: !prev.is_saved }));

    try {
      await fetch(`${API_BASE_URL}/products/${id}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUserId })
      });
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };

  /* ── Comments & Q&A Logic ── */
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUserId) return;

    setIsSubmittingComment(true);
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUserId,
          content: commentText,
          parent_comment_id: replyingTo
        })
      });
      const data = await response.json();

      if (response.ok) {
        // Optimistically add the new comment to the list
        setProduct(prev => ({
          ...prev,
          comments: [...(prev.comments || []), { ...data.comment, user_vote: 0 }]
        }));
        setCommentText("");
        setReplyingTo(null);
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleVote = async (commentId, voteValue) => {
    if (!currentUserId) return alert("Please log in to vote.");

    setProduct(prev => {
      const newComments = prev.comments.map(c => {
        if (c.id !== commentId) return c;
        
        let newUpvotes = c.upvotes;
        let newDownvotes = c.downvotes;
        let newUserVote = voteValue;

        // Removing a vote if clicked again
        if (c.user_vote === voteValue) {
          newUserVote = 0;
          if (voteValue === 1) newUpvotes--;
          if (voteValue === -1) newDownvotes--;
        } 
        // Changing vote or brand new vote
        else {
          if (voteValue === 1) {
            newUpvotes++;
            if (c.user_vote === -1) newDownvotes--;
          } else {
            newDownvotes++;
            if (c.user_vote === 1) newUpvotes--;
          }
        }
        return { ...c, upvotes: newUpvotes, downvotes: newDownvotes, user_vote: newUserVote };
      });
      return { ...prev, comments: newComments };
    });

    try {
      await fetch(`${API_BASE_URL}/products/comments/${commentId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUserId, vote_value: voteValue })
      });
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };

  const timeAgo = (dateString) => {
    const days = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
    return days === 0 ? "Today" : `${days}d ago`;
  };

  if (loading) return <div className={styles.loading}>Loading product details...</div>;
  if (!product) return <div className={styles.error}>Product not found.</div>;

  return (
    <div className={styles.root}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <ArrowLeft size={20} /> Back to Marketplace
      </button>

      <div className={styles.container}>
        {/* LEFT COLUMN: Gallery & Details */}
        <div className={styles.leftCol}>
          
          {/* IMAGE GALLERY */}
          <div className={styles.gallery}>
            <div className={styles.mainImageWrap}>
              <img src={product.image_urls[activeImageIndex]} alt={product.title} className={styles.mainImage} />
              
              {product.image_urls.length > 1 && (
                <>
                  <button className={`${styles.navBtn} ${styles.navLeft}`} onClick={() => setActiveImageIndex(prev => prev === 0 ? product.image_urls.length - 1 : prev - 1)}>
                    <ChevronLeft size={24} />
                  </button>
                  <button className={`${styles.navBtn} ${styles.navRight}`} onClick={() => setActiveImageIndex(prev => prev === product.image_urls.length - 1 ? 0 : prev + 1)}>
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Desktop Thumbnails */}
            {product.image_urls.length > 1 && (
              <div className={styles.thumbnailStrip}>
                {product.image_urls.map((img, i) => (
                  <img 
                    key={i} src={img} alt={`Thumb ${i}`} 
                    className={`${styles.thumbnail} ${i === activeImageIndex ? styles.activeThumb : ""}`}
                    onClick={() => setActiveImageIndex(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* PRODUCT DESCRIPTION */}
          <div className={styles.detailsSection}>
            <h1 className={styles.title}>{product.title}</h1>
            
            <div className={styles.metaStrip}>
              <span className={styles.metaBadge}><Tag size={14} /> {product.category}</span>
              <span className={styles.metaBadge}><MapPin size={14} /> {product.location || "Campus"}</span>
              <span className={styles.metaBadge}><Clock size={14} /> {timeAgo(product.created_at)}</span>
              <span className={styles.conditionTag}>Condition: <strong>{product.condition}</strong></span>
            </div>

            <div className={styles.descriptionBox}>
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          </div>

          {/* Q&A / COMMENT SECTION */}
          <div className={styles.qaSection}>
            <h3>Questions & Answers</h3>
            
            {/* Add Comment Form */}
            <form className={styles.commentForm} onSubmit={handlePostComment}>
              <input 
                type="text" 
                placeholder={replyingTo ? "Write a reply..." : "Ask the seller a question..."}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className={styles.commentInput}
              />
              <button type="submit" disabled={!commentText.trim() || isSubmittingComment} className={styles.sendBtn}>
                <Send size={18} />
              </button>
              {replyingTo && (
                <button type="button" className={styles.cancelReply} onClick={() => setReplyingTo(null)}>Cancel Reply</button>
              )}
            </form>

            {/* Comments List */}
            <div className={styles.commentList}>
              {product.comments?.length === 0 ? (
                <p className={styles.noComments}>No questions yet. Be the first to ask!</p>
              ) : (
                product.comments?.map(comment => (
                  <div key={comment.id} className={`${styles.commentItem} ${comment.parent_comment_id ? styles.isReply : ''}`}>
                    <img src={comment.user.avatar_url || 'https://via.placeholder.com/40'} alt="Avatar" className={styles.commentAvatar} />
                    <div className={styles.commentBody}>
                      <div className={styles.commentHeader}>
                        <strong>{comment.user.full_name}</strong>
                        <span className={styles.commentTime}>{timeAgo(comment.created_at)}</span>
                      </div>
                      <p className={styles.commentText}>{comment.content}</p>
                      
                      <div className={styles.commentActions}>
                        <button 
                          className={`${styles.voteBtn} ${comment.user_vote === 1 ? styles.voteActive : ''}`}
                          onClick={() => handleVote(comment.id, 1)}
                        >
                          <ThumbsUp size={14} /> {comment.upvotes}
                        </button>
                        <button 
                          className={`${styles.voteBtn} ${comment.user_vote === -1 ? styles.voteActiveDown : ''}`}
                          onClick={() => handleVote(comment.id, -1)}
                        >
                          <ThumbsDown size={14} /> {comment.downvotes}
                        </button>
                        <button className={styles.replyBtn} onClick={() => setReplyingTo(comment.id)}>
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Action Card & Seller Info */}
        <div className={styles.rightCol}>
          <div className={styles.actionCard}>
            <div className={styles.priceRow}>
              <h2>₹{product.price.toLocaleString("en-IN")}</h2>
              <button className={styles.shareBtn}><Share2 size={20} /></button>
            </div>
            
            <p className={styles.statusText}>Status: <span className={styles.statusBadge}>{product.status}</span></p>

            <div className={styles.actionButtons}>
              {/* PHASE 3 PREP: Message Seller Button */}
              <button className={styles.primaryBtn} onClick={() => navigate(`/messages?user=${product.seller.id}&product=${product.id}`)}>
                <MessageSquare size={18} /> Message Seller
              </button>
              
              <button className={`${styles.secondaryBtn} ${product.is_saved ? styles.savedActive : ''}`} onClick={handleToggleSave}>
                <Heart size={18} fill={product.is_saved ? "currentColor" : "none"} /> 
                {product.is_saved ? "Saved to Wishlist" : "Save to Wishlist"}
              </button>
            </div>

            <div className={styles.divider} />

            <div className={styles.sellerInfo}>
              <h4 className={styles.sellerLabel}>About the Seller</h4>
              <div className={styles.sellerProfile}>
                <img src={product.seller.avatar_url || 'https://via.placeholder.com/50'} alt="Seller" className={styles.sellerAvatar} />
                <div className={styles.sellerDetails}>
                  <p className={styles.sellerName}>{product.seller.full_name}</p>
                  {product.seller.qualification && (
                    <p className={styles.sellerEdu}>{product.seller.qualification} • Year {product.seller.year_of_study}</p>
                  )}
                  <button className={styles.viewProfileBtn}>View Profile</button>
                </div>
              </div>
            </div>

            <div className={styles.safetyTip}>
              <strong>🛡️ Campus Safety Tip</strong>
              <p>Always meet in public campus areas (like the library or cafeteria) when exchanging items.</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}