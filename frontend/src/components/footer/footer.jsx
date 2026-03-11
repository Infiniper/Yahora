import React from "react";
import styles from "./footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.description}>
        <img
          src="/yahora_logo.svg"
          alt="Yahora Logo"
          className={styles.logo}
        />
        <p>
          Because Every Item Has a Memory. A high-trust, closed-loop community marketplace        exclusively for students.
        </p>
      </div>

      <nav className={styles.navigation}>
        <h4>Quick Links</h4>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/feed">Marketplace Feed</a></li>
          <li><a href="/hot">Trending on Campus</a></li>
          <li><a href="/messages">Messages</a></li>
        </ul>
      </nav>

      <div className={styles.contactInfo}>
        <h4>Contact Us</h4>
        <ul>
          <li><p>📍 India</p></li>
          <li><p>📞 +91 9140400064</p></li>
          <li><p>📞 +91 6386444659</p></li>
          <li><p>📧 infiniper@gmail.com</p></li>
        </ul>
      </div>

      <div className={styles.socialMedia}>
        <h4>Follow Us</h4>
        <ul>
          <li><a href="#" target="_blank" rel="noopener noreferrer">Twitter / X</a></li>
          <li><a href="#" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          <li><a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
        </ul>
      </div>
      
      <div className={styles.newsletter}>
        <h4>Join Your Campus</h4>
        <p>Get updates on seasonal move-out sales and trending campus items!</p>
        <div className={styles.newsletterForm}>
          <input type="email" placeholder="Enter university email" className={styles.newsletterInput} />
          <button className={styles.newsletterButton}>Subscribe</button>
        </div>
      </div>

      <div className={styles.copyright}>
        <p>Copyright © 2026 Yahora. All Rights Reserved.</p>
        <div className={styles.legalLinks}>
          <a href="/terms">Terms & Conditions</a>
          <span>|</span>
          <a href="/privacy">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;