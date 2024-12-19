import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css"; 

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login"); 
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <button onClick={handleLogout} className="logout-button">
                Logout
            </button>
        </nav>
    );
};

export default Navbar;
