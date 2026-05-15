import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate for the product card
import UniversityModal from "../../components/modal/UniversityModal";
import { useAuth } from "../../contexts/AuthContext";
import ProductCard from "../../components/ProductCard/ProductCard";

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
// [Keep all your existing MOCK_BUZZ and MOCK_LISTINGS data exactly the same here]
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
    id: "mock-1",
    title: "Sony WH-1000XM4 Headphones",
    price: 5000,
    description: "Used for a few months, excellent noise cancellation.",
    image_urls: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=800",
    ],
    condition: "Mint",
    location: "Hall 1",
    status: "available",
    views: 124,
    likes_count: 12,
    comments_count: 3,
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    is_liked: false,
    is_saved: false,
    seller: {
      id: "user-1",
      full_name: "Anmol Singh",
      avatar_url: "https://i.pravatar.cc/150?img=11",
      university: "IIITDM Kurnool",
    },
  },
  {
    id: "mock-2",
    title: "Keychron K2 Mechanical Keyboard",
    price: 3000,
    description: "Brown switches, wireless. Works perfectly.",
    image_urls: [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800",
    ],
    condition: "Like New",
    location: "Hall 3",
    status: "available",
    views: 89,
    likes_count: 8,
    comments_count: 1,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    is_liked: true,
    is_saved: false,
    seller: {
      id: "user-2",
      full_name: "Gyanendra Srivastava",
      avatar_url: "https://i.pravatar.cc/150?img=12",
      university: "IIITDM Kurnool",
    },
  },
  {
    id: "mock-3",
    title: "IKEA Study Table + Chair Set",
    price: 1100,
    description: "Moving out sale. Must pick up by Sunday.",
    image_urls: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800",
    ],
    condition: "Good",
    location: "Hall 2",
    status: "sold",
    views: 250,
    likes_count: 34,
    comments_count: 8,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    is_liked: false,
    is_saved: true,
    seller: {
      id: "user-3",
      full_name: "Dikhsha Prajapati",
      avatar_url: "https://i.pravatar.cc/150?img=5",
      university: "NIET Greater Noida",
    },
  },
  {
    id: "mock-4",
    title: "Hero Sprint Pro Bicycle",
    price: 1800,
    description: "Great for getting around campus quickly. Recently serviced.",
    image_urls: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800",
    ],
    condition: "Fair",
    location: "Hall 4",
    status: "available",
    views: 56,
    likes_count: 5,
    comments_count: 0,
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    is_liked: false,
    is_saved: false,
    seller: {
      id: "user-4",
      full_name: "Sanya",
      avatar_url: "https://i.pravatar.cc/150?img=9",
      university: "NIET Greater Noida",
    },
  },
];

// --- TAGLINES ARRAY ---
const TAGLINES = [
  "Because Every Item Has a Memory.",
  "Where Every Thing Finds Its Next Story.",
  "Keep the Story Going.",
];

const Home = () => {
  const [likedPosts, setLikedPosts] = useState({});
  const videoRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const currentUserId = localStorage.getItem("yahora_user_id");
  const navigate = useNavigate();

  // --- TYPEWRITER STATES ---
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  // --- TYPEWRITER LOGIC ---
  useEffect(() => {
    const handleType = () => {
      const i = loopNum % TAGLINES.length;
      const fullText = TAGLINES[i];

      // Determine next text state
      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1)
      );

      // Adjust typing speed (delete faster)
      setTypingSpeed(isDeleting ? 40 : 100);

      // If word is complete, wait and start deleting
      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2500); // 2.5 second pause reading time
      } 
      // If deleted completely, move to next word
      else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500); // Pause before typing new sentence
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.65;
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
            
            {/* UPDATED TITLE WITH TYPEWRITER */}
            <h1 className="hero-title" style={{ minHeight: '120px' }}>
              {text}
              <span className="typewriter-cursor">|</span>
            </h1>
            
            <div className="hero-buttons">
              <button
                className="btn-secondary"
                onClick={() => setIsModalOpen(true)}
              >
                View Supported Campuses
              </button>
            </div>
          </div>
        </div>
      </section>

      <UniversityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* [The rest of your JSX code remains exactly the same below here] */}
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
              <ProductCard
                key={item.id}
                product={item}
                currentUserId={currentUserId}
                onCardClick={(id) => navigate(`/product/${id}`)}
              />
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
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="btn-outline"
              onClick={() =>
                window.scrollTo({ top: 0, left: 0, behavior: "instant" })
              }
            >
              Marketplace
            </Link>
          ) : (
            <Link
              to="/auth"
              className="btn-outline"
              onClick={() =>
                window.scrollTo({ top: 0, left: 0, behavior: "instant" })
              }
            >
              Sign Up Now
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;