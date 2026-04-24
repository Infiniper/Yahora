import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext"; // Note: Ensured the import path matches standard
import "./navbar.css";

// Icons
const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const handleCartClick = () => {
  console.log("Wishlist/Cart button was clicked!");
};

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null); 
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Close profile dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch the user's avatar from the backend
  useEffect(() => {
    const fetchAvatar = async () => {
      if (isAuthenticated) {
        const userId = localStorage.getItem("yahora_user_id");
        const token = localStorage.getItem("yahora_session");

        if (userId && token) {
          try {
            const res = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/api/user/${userId}/dashboard`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            if (res.ok) {
              const data = await res.json();
              if (data.profile && data.profile.avatar_url) {
                setAvatarUrl(data.profile.avatar_url);
              }
            }
          } catch (e) {
            console.error("Could not load avatar:", e);
          }
        }
      } else {
        setAvatarUrl(null); 
      }
    };
    fetchAvatar();
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/auth");
  };

  return (
    <div className="nav-elements">
      <div className="logo">
        <Link to="/">
          <button className="logo-btn">
            <img src="/yahora_logo.svg" alt="Yahora Logo" />
          </button>
        </Link>
      </div>
      <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        <Link to="/">
          <button><p>Home</p></button>
        </Link>
        <Link to="/marketplace">
          <button><p>Marketplace</p></button>
        </Link>
        <Link to="/hot">
          <button><p>Campus Hot</p></button>
        </Link>
        <Link to="/messages">
          <button><p>Messages</p></button>
        </Link>
      </div>

      <div className="nav-actions">
        {isAuthenticated ? (
          <div className="user-actions">
            <button className="cart-button" onClick={handleCartClick}>
              <img className="cart" src="/cart.svg" alt="Wishlist" />
            </button>

            <button className="icon-btn" title="Notifications">
              <BellIcon />
            </button>

            <div className="profile-menu" ref={dropdownRef}>
              <button
                className={`icon-btn profile-btn ${avatarUrl ? "has-avatar" : ""}`}
                onClick={toggleDropdown}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="User Avatar" className="nav-avatar-img" />
                ) : (
                  <UserIcon />
                )}
              </button>

              {isDropdownOpen && (
                <div className="profile-dropdown">
                  <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)}>
                    Dashboard
                  </Link>
                  <Link to="/settings" onClick={() => setIsDropdownOpen(false)}>
                    Settings
                  </Link>
                  <hr />
                  <button onClick={handleLogout} className="logout-btn">
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Link to="/auth">
            <button className="auth-btn">Log in / Sign up</button>
          </Link>
        )}

        <button className="hamburger-menu" onClick={toggleMenu}>
          &#9776;
        </button>
      </div>
    </div>
  );
}

export default Navbar;