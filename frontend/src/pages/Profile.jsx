import React, { useState, useEffect } from 'react';
import api from '../api';
import LoadingIndicator from '../components/LoadingIndicator';
import { useNavigate } from 'react-router-dom'; 
import '../styles/Profile.css'

const PasswordDialog = ({ passwordForm, handlePasswordChange, handlePasswordSubmit, passwordError, passwordSuccess, isSubmitting, onClose }) => (
    <div className="password-dialog-overlay">
        <div className="password-dialog">
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordSubmit}>
                <div className="form-group">
                    <label>Current Password</label>
                    <input
                        type="password"
                        name="old_password"
                        value={passwordForm.old_password}
                        onChange={handlePasswordChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>New Password</label>
                    <input
                        type="password"
                        name="new_password"
                        value={passwordForm.new_password}
                        onChange={handlePasswordChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                        type="password"
                        name="confirm_password"
                        value={passwordForm.confirm_password}
                        onChange={handlePasswordChange}
                        required
                    />
                </div>
                {passwordError && <div className="error-message">{passwordError}</div>}
                {passwordSuccess && <div className="success-message">{passwordSuccess}</div>}
                <div className="dialog-buttons">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="cancel-button"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Changing...' : 'Change Password'}
                    </button>
                </div>
            </form>
        </div>
    </div>
);

const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/api/user/profile/');
            setProfile(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load profile data');
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (passwordForm.new_password !== passwordForm.confirm_password) {
            setPasswordError("New passwords don't match");
            return;
        }

        if (passwordForm.new_password.length < 8) {
            setPasswordError("New password must be at least 8 characters long");
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post('/api/user/change-password/', {
                old_password: passwordForm.old_password,
                new_password: passwordForm.new_password
            });

            setPasswordSuccess('Password changed successfully!');
            setPasswordForm({
                old_password: '',
                new_password: '',
                confirm_password: ''
            });
            setTimeout(() => setShowPasswordDialog(false), 2000);
        } catch (err) {
            setPasswordError(err.response?.data?.error || 'Failed to change password');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <LoadingIndicator />;
    if (error) return <div className="error">{error}</div>;
    if (!profile) return null;

    return (
        <div className="container">
            <h1 className="heading">Profile</h1>
            
            <div>
                <div className="info-section">
                    <label className="label">Username</label>
                    <p className="value">{profile.username}</p>
                </div>

                <div className="info-section">
                    <label className="label">Email</label>
                    <p className="value">{profile.email}</p>
                </div>

                <div className="info-section">
                    <label className="label">Member Since</label>
                    <p className="value">
                        {new Date(profile.date_joined).toLocaleDateString()}
                    </p>
                </div>

                <div className="info-section">
                    <label className="label">Last Updated</label>
                    <p className="value">
                        {new Date(profile.last_updated).toLocaleDateString()}
                    </p>
                </div>

                <button 
                    onClick={() => setShowPasswordDialog(true)}
                    className="change-password-button"
                >
                    Change Password
                </button>
            </div>
            <button 
                onClick={() => navigate('/')} 
                className="go-back-button"
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Go Back
            </button>

            {showPasswordDialog && (
                <PasswordDialog
                    passwordForm={passwordForm}
                    handlePasswordChange={handlePasswordChange}
                    handlePasswordSubmit={handlePasswordSubmit}
                    passwordError={passwordError}
                    passwordSuccess={passwordSuccess}
                    isSubmitting={isSubmitting}
                    onClose={() => setShowPasswordDialog(false)}
                />
            )}
        </div>
    );
};

export default Profile;