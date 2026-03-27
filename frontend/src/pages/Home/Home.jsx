import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
// Import the elegant line icons from lucide-react
import {
  ShieldCheck,
  ShoppingBag,
  Handshake,
  MapPin,
  Package,
  UserCheck,
  Shield,
  MailCheck,
  UserX,
  Heart,
  MessageCircle,
} from "lucide-react";
import "./Home.css";

// --- MOCK DATA FOR UI DEVELOPMENT ---
const MOCK_BUZZ = [
  {
    id: 1,
    name: "Neeraj Kumar",
    time: "2 mins ago",
    location: "Hall 2",
    content: "Anyone heading to the city this evening? Looking to carpool! 🚗",
    likes: 12,
    comments: 4,
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: 2,
    name: "Shivani Singh",
    time: "15 mins ago",
    location: "Hall 1",
    content:
      "Selling my mini-fridge, dm if interested! Moving out by Saturday. ❄️",
    likes: 8,
    comments: 2,
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    name: "Vishwajeet Singh",
    time: "1 hour ago",
    location: "Hall 3",
    content:
      "Found a pair of RayBans near the Mess. Please message me if they are yours!",
    likes: 24,
    comments: 11,
    avatar: "https://i.pravatar.cc/150?img=8",
  },
  {
    id: 4,
    name: "Shivangi Singh",
    time: "5 mins ago",
    location: "Hall 4",
    content:
      "Anyone has DSA notes for placements? Especially graphs & DP. Would really appreciate it 🙏",
    likes: 16,
    comments: 6,
    avatar: "https://i.pravatar.cc/150?img=9",
  },
];

const MOCK_LISTINGS = [
  {
    id: 1,
    title: "Sony WH-1000XM4 Headphones",
    price: "₹500",
    tag: "MINT CONDITION",
    location: "HALL 1",
    tagColor: "var(--blue)",
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800",
    seller: "Anmol Singh",
  },
  {
    id: 2,
    title: "Keychron K2 Mechanical Keyboard",
    price: "₹300",
    tag: "HOT DEAL",
    location: "HALL 3",
    tagColor: "var(--pink)",
    image:
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800",
    seller: "Gyanendra Srivastava",
  },

  // 🔥 NEW ITEM 3
  {
    id: 3,
    title: "IKEA Study Table + Chair Set",
    price: "₹1,100",
    tag: "URGENT SALE",
    location: "HALL 2",
    tagColor: "var(--pink)",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800",
    seller: "Dikhsha Prajapati",
  },

  // 🔥 NEW ITEM 4
  {
    id: 4,
    title: "Hero Sprint Pro Bicycle",
    price: "₹1,800",
    tag: "WELL MAINTAINED",
    location: "HALL 4",
    tagColor: "var(--blue)",
    image: "https://m.media-amazon.com/images/I/714GKeO03iL._SL1500_.jpg",
    seller: "Sanya",
  },
];

const Home = () => {
  const [likedPosts, setLikedPosts] = useState({});
  const [likedItems, setLikedItems] = useState({});
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.65; // Slowed down as requested
    }
  }, []);

  return (
    <div className="home-container">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="hero-video"
          src="https://iwhtzhejyhaqctoqsolz.supabase.co/storage/v1/object/public/yahora%20videos/yahora_home_page.mp4"
        />
        <div className="hero-overlay">
          <div className="hero-content">
            <span className="hero-badge">Buy and sell within your campus.</span>
            <h1 className="hero-title">Keep the Story Going.</h1>
            <div className="hero-buttons">
              <button className="btn-secondary">View Supported Campuses</button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SPLIT SECTION: BUZZ & LISTINGS */}
      <section className="split-section">
        {/* Left Column: 35% */}
        <div className="buzz-column">
          <div className="section-header">
            <h2>
              Comunity Feed <span className="live-dot"></span>
            </h2>
          </div>
          <div className="buzz-feed">
            {MOCK_BUZZ.map((post) => (
              <div key={post.id} className="buzz-card">
                <div className="buzz-header">
                  <img
                    src={post.avatar}
                    alt={post.name}
                    className="buzz-avatar"
                  />
                  <div className="buzz-meta">
                    <h4>{post.name}</h4>
                    <span>
                      {post.time} • {post.location}
                    </span>
                  </div>
                </div>
                <p className="buzz-content">{post.content}</p>
                <div className="buzz-actions">
                  <span
                    className="buzz-action"
                    onClick={() =>
                      setLikedPosts((prev) => ({
                        ...prev,
                        [post.id]: !prev[post.id],
                      }))
                    }
                  >
                    <Heart
                      size={16}
                      fill={likedPosts[post.id] ? "#EB487F" : "none"}
                      stroke={likedPosts[post.id] ? "#EB487F" : "#888"}
                    />
                    {post.likes + (likedPosts[post.id] ? 1 : 0)}
                  </span>

                  <span className="buzz-action">
                    <MessageCircle size={16} fill="#acaaaa" stroke="#acaaaa" />
                    {post.comments}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: 65% */}
        <div className="listings-column">
          <div className="section-header">
            <h2>Recent Listings</h2>
          </div>
          <div className="listings-grid">
            {MOCK_LISTINGS.map((item) => (
              <div key={item.id} className="listing-card">
                <div className="listing-image-wrapper">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="listing-image"
                  />
                  <button
                    className="heart-btn"
                    onClick={() =>
                      setLikedItems((prev) => ({
                        ...prev,
                        [item.id]: !prev[item.id],
                      }))
                    }
                  >
                    <Heart
                      size={18}
                      fill={likedItems[item.id] ? "#EB487F" : "none"}
                      stroke={likedItems[item.id] ? "#EB487F" : "#fff"}
                    />
                  </button>
                </div>
                <div className="listing-info">
                  <div className="listing-tags">
                    <span
                      className="tag"
                      style={{ backgroundColor: item.tagColor }}
                    >
                      {item.tag}
                    </span>
                    <span className="location-tag">{item.location}</span>
                  </div>
                  <h3 className="listing-title">{item.title}</h3>
                  <div className="listing-price">{item.price}</div>
                  <div className="listing-seller">
                    <div className="seller-avatar-mini"></div>
                    <span>by {item.seller}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="info-section">
        <h2 className="info-heading">How Yahora Works</h2>
        <div className="info-grid steps-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <ShieldCheck size={44} strokeWidth={1.5} />
            </div>
            <h3>Verify Identity</h3>
            <p>Log in securely using your official university email domain.</p>
            <div className="feature-dot"></div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <ShoppingBag size={44} strokeWidth={1.5} />
            </div>
            <h3>Post or Browse</h3>
            <p>
              List your old gear in seconds or scroll through what your peers
              are selling.
            </p>
            <div className="feature-dot"></div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Handshake size={44} strokeWidth={1.5} />
            </div>
            <h3>Connect & Meet</h3>
            <p>
              Chat in-app and meet up safely on campus to complete the exchange.
            </p>
            <div className="feature-dot"></div>
          </div>
        </div>
      </section>

      {/* 3. TRUST STRIP */}
      <section className="trust-strip">
        <div className="trust-item">
          <MailCheck className="trust-icon" />
          <p>University email verification</p>
        </div>

        <div className="trust-item">
          <ShieldCheck className="trust-icon" />
          <p>Campus-only community</p>
        </div>

        <div className="trust-item">
          <Handshake className="trust-icon" />
          <p>Safe local pickup</p>
        </div>

        <div className="trust-item">
          <UserX className="trust-icon" />
          <p>No random strangers</p>
        </div>
      </section>

      {/* 5. WHY STUDENTS LOVE YAHORA */}
      <section className="info-section benefits-section">
        <h2 className="info-heading">Why Students Love Yahora...💕</h2>
        <div className="info-grid benefits-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <MapPin size={44} strokeWidth={1.5} />
            </div>
            <h3>Find Items Locally</h3>
            <p>Everything is located right near your hostel or department.</p>
            <div className="feature-dot"></div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Package size={44} strokeWidth={1.5} />
            </div>
            <h3>Hassle-Free Moves</h3>
            <p>
              Easily sell your old items right before the move-out week hits.
            </p>
            <div className="feature-dot"></div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <UserCheck size={44} strokeWidth={1.5} />
            </div>
            <h3>Real Students Only</h3>
            <p>
              Meet and transact with verified, real students from your college.
            </p>
            <div className="feature-dot"></div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Shield size={44} strokeWidth={1.5} />
            </div>
            <h3>Scam-Free Zone</h3>
            <p>
              Our closed-loop ecosystem means absolutely no scammy listings.
            </p>
            <div className="feature-dot"></div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="cta-section">
        <h2>Keep the story going.</h2>
        <p>
          Join your campus marketplace today and discover what's waiting for
          you.
        </p>
        <div className="cta-buttons">
          {/* <button className="btn-primary">View Supported Campuses</button> */}
          <Link to="/auth" className="btn-outline">
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
