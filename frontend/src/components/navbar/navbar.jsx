import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./navbar.module.css";

// ─────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────
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

const DashboardIcon = ({ className }) => (
  <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14,10V22H4a2,2,0,0,1-2-2V10Z"></path>
    <path d="M22,10V20a2,2,0,0,1-2,2H16V10Z"></path>
    <path d="M22,4V8H2V4A2,2,0,0,1,4,2H20A2,2,0,0,1,22,4Z"></path>
  </svg>
);

const SettingsIcon = ({ className }) => (
  <svg className={className} width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.2788 2.15224C13.9085 2 13.439 2 12.5 2C11.561 2 11.0915 2 10.7212 2.15224C10.2274 2.35523 9.83509 2.74458 9.63056 3.23463C9.53719 3.45834 9.50065 3.7185 9.48635 4.09799C9.46534 4.65568 9.17716 5.17189 8.69017 5.45093C8.20318 5.72996 7.60864 5.71954 7.11149 5.45876C6.77318 5.2813 6.52789 5.18262 6.28599 5.15102C5.75609 5.08178 5.22018 5.22429 4.79616 5.5472C4.47814 5.78938 4.24339 6.1929 3.7739 6.99993C3.30441 7.80697 3.06967 8.21048 3.01735 8.60491C2.94758 9.1308 3.09118 9.66266 3.41655 10.0835C3.56506 10.2756 3.77377 10.437 4.0977 10.639C4.57391 10.936 4.88032 11.4419 4.88029 12C4.88026 12.5581 4.57386 13.0639 4.0977 13.3608C3.77372 13.5629 3.56497 13.7244 3.41645 13.9165C3.09108 14.3373 2.94749 14.8691 3.01725 15.395C3.06957 15.7894 3.30432 16.193 3.7738 17C4.24329 17.807 4.47804 18.2106 4.79606 18.4527C5.22008 18.7756 5.75599 18.9181 6.28589 18.8489C6.52778 18.8173 6.77305 18.7186 7.11133 18.5412C7.60852 18.2804 8.2031 18.27 8.69012 18.549C9.17714 18.8281 9.46533 19.3443 9.48635 19.9021C9.50065 20.2815 9.53719 20.5417 9.63056 20.7654C9.83509 21.2554 10.2274 21.6448 10.7212 21.8478C11.0915 22 11.561 22 12.5 22C13.439 22 13.9085 22 14.2788 21.8478C14.7726 21.6448 15.1649 21.2554 15.3694 20.7654C15.4628 20.5417 15.4994 20.2815 15.5137 19.902C15.5347 19.3443 15.8228 18.8281 16.3098 18.549C16.7968 18.2699 17.3914 18.2804 17.8886 18.5412C18.2269 18.7186 18.4721 18.8172 18.714 18.8488C19.2439 18.9181 19.7798 18.7756 20.2038 18.4527C20.5219 18.2105 20.7566 17.807 21.2261 16.9999C21.6956 16.1929 21.9303 15.7894 21.9827 15.395C22.0524 14.8691 21.9088 14.3372 21.5835 13.9164C21.4349 13.7243 21.2262 13.5628 20.9022 13.3608C20.4261 13.0639 20.1197 12.558 20.1197 11.9999C20.1197 11.4418 20.4261 10.9361 20.9022 10.6392C21.2263 10.4371 21.435 10.2757 21.5836 10.0835C21.9089 9.66273 22.0525 9.13087 21.9828 8.60497C21.9304 8.21055 21.6957 7.80703 21.2262 7C20.7567 6.19297 20.522 5.78945 20.2039 5.54727C19.7799 5.22436 19.244 5.08185 18.7141 5.15109C18.4722 5.18269 18.2269 5.28136 17.8887 5.4588C17.3915 5.71959 16.7969 5.73002 16.3099 5.45096C15.8229 5.17191 15.5347 4.65566 15.5136 4.09794C15.4993 3.71848 15.4628 3.45833 15.3694 3.23463C15.1649 2.74458 14.7726 2.35523 14.2788 2.15224ZM12.5 15C14.1695 15 15.5228 13.6569 15.5228 12C15.5228 10.3431 14.1695 9 12.5 9C10.8305 9 9.47716 10.3431 9.47716 12C9.47716 13.6569 10.8305 15 12.5 15Z" clipRule="evenodd" fillRule="evenodd"></path>
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
    <div className={styles.navElements}>
      <div className={styles.logo}>
        <Link to="/">
          <button className={styles.logoBtn}>
            <img src="/yahora_logo.svg" alt="Yahora Logo" />
          </button>
        </Link>
      </div>
      
      <div className={`${styles.navLinks} ${isMenuOpen ? styles.active : ""}`}>
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

      <div className={styles.navActions}>
        {isAuthenticated ? (
          <div className={styles.userActions}>
            <button className={styles.cartButton} onClick={handleCartClick}>
              <img className={styles.cart} src="/cart.svg" alt="Wishlist" />
            </button>

            <button className={styles.iconBtn} title="Notifications">
              <BellIcon />
            </button>

            <div className={styles.profileMenu} ref={dropdownRef}>
              <button
                className={`${styles.iconBtn} ${styles.profileBtn} ${avatarUrl ? styles.hasAvatar : ""}`}
                onClick={toggleDropdown}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="User Avatar" className={styles.navAvatarImg} />
                ) : (
                  <UserIcon />
                )}
              </button>

              {isDropdownOpen && (
                <div className={styles.profileDropdown}>
                  {/* Removed &nbsp; elements */}
                  <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)} className={styles.dropdownItem}>
                    <DashboardIcon className={styles.dropdownIcon} />
                    Dashboard
                  </Link>
                  <Link to="/settings" onClick={() => setIsDropdownOpen(false)} className={styles.dropdownItem}>
                    <SettingsIcon className={styles.dropdownIcon} />
                    Settings
                  </Link>
                  
                  
                  {/* Expanded Custom Logout Button */}
                  <button onClick={handleLogout} className={`${styles.Btn} ${styles.logoutBtn}`}>
                    <div className={styles.sign}>
                      <svg viewBox="0 0 512 512">
                        <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                      </svg>
                    </div>
                    <div className={styles.text}>Logout</div>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Custom Login/Signup Button */
          <Link to="/auth" style={{ textDecoration: 'none' }}>
            <button className={styles.loginButton}>
              <span className={styles.loginButtonIconWrapper}>
                <svg viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.loginButtonIconSvg} width="10">
                  <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"></path>
                </svg>
                <svg viewBox="0 0 14 15" fill="none" width="10" xmlns="http://www.w3.org/2000/svg" className={`${styles.loginButtonIconSvg} ${styles.loginButtonIconSvgCopy}`}>
                  <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"></path>
                </svg>
              </span>
              Login / Sign up
            </button>
          </Link>
        )}

        <button className={styles.hamburgerMenu} onClick={toggleMenu}>
          &#9776;
        </button>
      </div>
    </div>
  );
}

export default Navbar;