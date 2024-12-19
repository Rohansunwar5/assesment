import React, { useState, useEffect } from 'react';
import api from '../api';
import "../styles/Home.css";

const Home = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await api.get('/api/user/profile/');
                setUser(response.data);
                setError(null);
            } catch (error) {
                setError(error.response?.data?.message || 'Failed to load user profile');
                console.error('Error fetching user profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);
    return (
        <div className="home-container">
            <h1 className="welcome-text">
                Welcome back, {user?.username}!
            </h1>
        </div>
    );
};

export default Home;