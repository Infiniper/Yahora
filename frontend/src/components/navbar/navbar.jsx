import { Link } from 'react-router-dom';
import { useState } from 'react';
import './navbar.css';

const handleCartClick = () => {
    console.log("Wishlist/Cart button was clicked!");
    // Logic to open a wishlist modal or sidebar
};

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className='nav-elements'>
            <div className='logo'>
                <Link to="/">
                    <button className="logo-btn">
                        {/* Keeping your original image src, but adding text next to it */}
                        <img src="/yahora_logo.svg" alt="Yahora Logo" />
                        {/* <span className="brand-text">Yahora</span> */}
                    </button>
                </Link>
            </div>
            <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                <Link to="/"><button><p>Home</p></button></Link>
                <Link to="/feed"><button><p>Marketplace</p></button></Link>
                <Link to="/hot"><button><p>Campus Hot</p></button></Link>
                <Link to="/messages"><button><p>Messages</p></button></Link>
            </div>
            
            <div className="nav-actions">
                <button className='cart-button' onClick={handleCartClick}>
                <img className='cart' src="/cart.svg" alt="Cart" />
            </button>
                <button className='hamburger-menu' onClick={toggleMenu}>
                    &#9776;
                </button>
            </div>
        </div>
    );
}

export default Navbar;