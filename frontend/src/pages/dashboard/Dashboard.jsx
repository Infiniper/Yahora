// frontend/src/pages/dashboard/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { 
  Edit2, 
  MapPin, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Award,
  Package,
  ShoppingBag,
  Camera
} from "lucide-react";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [userData, setUserData] = useState({
    profile: null,
    listings: [],
    purchases: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("listings"); // 'listings' or 'purchases'
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle Scroll for d1 -> d2 UI Transition
  useEffect(() => {
    const handleScroll = () => {
      // Trigger the layout shift when scrolled past the banner (approx 120px)
      if (window.scrollY > 120) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch Dashboard Data (Connecting to Vishwajeet's Backend)
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const userId = localStorage.getItem("yahora_user_id"); // Or however you store it
        const token = localStorage.getItem("yahora_session");

        if (!userId) {
          setError("User not found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5000/api/user/${userId}/dashboard`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          // Mock data fallback for UI testing if backend isn't ready yet
          setUserData({
            profile: {
              full_name: "Anmol Singh",
              avatar_url: "https://i.pravatar.cc/300?img=11",
              qualification: "Graduation",
              courseName: "B.Tech Computer Science",
              year_of_study: "3rd year",
              specializationName: "Artificial Intelligence",
              bio: "CSE student at IIITK. Selling mostly electronics, books, and hostel essentials. Open to negotiations!"
            },
            listings: [
              { id: 1, title: "Sony WH-1000XM4", price: "₹5000", status: "available", image_urls: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500"] },
              { id: 2, title: "DSA Notes (Handwritten)", price: "₹200", status: "sold", image_urls: ["https://images.unsplash.com/photo-1517842645767-c639042777db?w=500"] }
            ],
            purchases: [
              { id: 1, product: { title: "IKEA Desk Lamp", price: "₹450", image_urls: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500"] } }
            ]
          });
        }
      } catch (err) {
        setError("Network error fetching dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div className={styles.loadingScreen}>Loading your campus life...</div>;
  if (error) return <div className={styles.errorScreen}>{error}</div>;

  const { profile, listings, purchases } = userData;

  return (
    <div className={`${styles.dashboardContainer} ${isScrolled ? styles.scrolled : ""}`}>
      
      {/* Top Banner (d1 focus) */}
      <div className={styles.banner}>
        <div className={styles.bannerOverlay}></div>
      </div>

      <div className={styles.dashboardLayout}>
        
        {/* LEFT COLUMN: User Profile Details (Sticky Sidebar in d2) */}
        <aside className={styles.profileSidebar}>
          <div className={styles.profileCard}>
            
            {/* Avatar Section */}
            <div className={styles.avatarWrapper}>
              <div className={styles.avatarContainer}>
                <img 
                  src={profile?.avatar_url || "https://via.placeholder.com/150"} 
                  alt="Profile" 
                  className={styles.avatar}
                />
                <button className={styles.editAvatarBtn} title="Update Photo">
                  <Camera size={16} />
                </button>
              </div>
            </div>

            {/* Name & Bio */}
            <div className={styles.userInfo}>
              <div className={styles.nameRow}>
                <h1 className={styles.userName}>Hi! {profile?.full_name?.split(' ')[0]}</h1>
                <button className={styles.iconBtn} title="Edit Name"><Edit2 size={16} /></button>
              </div>
              
              <div className={styles.bioSection}>
                <p className={styles.bioText}>{profile?.bio || "No bio added yet."}</p>
                <button className={styles.iconBtn} title="Edit Bio"><Edit2 size={14} /></button>
              </div>
            </div>

            <hr className={styles.divider} />

            {/* Academic Details Grid */}
            <div className={styles.academicSection}>
              <div className={styles.sectionHeader}>
                <h3>Academic Details</h3>
                <button className={styles.iconBtn} title="Edit Academics"><Edit2 size={16} /></button>
              </div>
              
              <div className={styles.academicGrid}>
                <div className={styles.academicItem}>
                  <GraduationCap className={styles.academicIcon} />
                  <div>
                    <span className={styles.label}>QUALIFICATION</span>
                    <span className={styles.value}>{profile?.qualification}</span>
                  </div>
                </div>
                <div className={styles.academicItem}>
                  <BookOpen className={styles.academicIcon} />
                  <div>
                    <span className={styles.label}>COURSE</span>
                    <span className={styles.value}>{profile?.courseName}</span>
                  </div>
                </div>
                <div className={styles.academicItem}>
                  <Calendar className={styles.academicIcon} />
                  <div>
                    <span className={styles.label}>YEAR OF STUDY</span>
                    <span className={styles.value}>{profile?.year_of_study}</span>
                  </div>
                </div>
                <div className={styles.academicItem}>
                  <Award className={styles.academicIcon} />
                  <div>
                    <span className={styles.label}>SPECIALIZATION</span>
                    <span className={styles.value}>{profile?.specializationName}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </aside>

        {/* RIGHT COLUMN: Products & Tabs (Scrolls up in d2) */}
        <main className={styles.dashboardMain}>
          
          {/* Custom Tabs */}
          <div className={styles.tabsContainer}>
            <button 
              className={`${styles.tabBtn} ${activeTab === "listings" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("listings")}
            >
              <Package size={18} />
              My Listings
              <span className={styles.badge}>{listings.length}</span>
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === "purchases" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("purchases")}
            >
              <ShoppingBag size={18} />
              Purchased
              <span className={styles.badge}>{purchases.length}</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            
            {/* LISTINGS VIEW */}
            {activeTab === "listings" && (
              <div className={styles.productsGrid}>
                {listings.length === 0 ? (
                  <div className={styles.emptyState}>You haven't listed any items yet.</div>
                ) : (
                  listings.map(item => (
                    <div key={item.id} className={styles.productCard}>
                      <div className={styles.productImageWrapper}>
                        <img src={item.image_urls[0]} alt={item.title} className={styles.productImage} />
                        {item.status === 'sold' && <div className={styles.soldBadge}>SOLD</div>}
                        {item.status === 'available' && <div className={styles.activeBadge}>AVAILABLE</div>}
                      </div>
                      <div className={styles.productInfo}>
                        <h4>{item.title}</h4>
                        <p className={styles.price}>{item.price}</p>
                        <div className={styles.productActions}>
                          <button className={styles.editBtn}>Edit Details</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* PURCHASES VIEW */}
            {activeTab === "purchases" && (
              <div className={styles.productsGrid}>
                {purchases.length === 0 ? (
                  <div className={styles.emptyState}>You haven't purchased anything yet.</div>
                ) : (
                  purchases.map(item => (
                    <div key={item.id} className={styles.productCard}>
                      <div className={styles.productImageWrapper}>
                        <img src={item.product.image_urls[0]} alt={item.product.title} className={styles.productImage} />
                        <div className={styles.purchasedBadge}>PURCHASED</div>
                      </div>
                      <div className={styles.productInfo}>
                        <h4>{item.product.title}</h4>
                        <p className={styles.price}>{item.product.price}</p>
                        <p className={styles.date}>Bought on: {new Date(item.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;