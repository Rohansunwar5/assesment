import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import axios from 'axios';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { uidb64, token } = useParams(); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({ uidb64, token, password });
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/auth/reset-password/', {
                uidb64,
                token,
                password
            });
            console.log(response);
            
            setSuccess(response.data.message);
            setError('');
            setTimeout(() => navigate('/login'), 2000); 
        } catch (error) {
            setError(error.response?.data?.error || 'Something went wrong. Please try again.');
            setSuccess('');
        }
    };

    return (
        <div className="reset-password-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength="8"
                    />
                </div>
                <button type="submit">Reset Password</button>
            </form>
            {success && <div className="success-message">{success}</div>}
            {error && <div className="error-message">{error}</div>}
            <p>Remember your password? <button onClick={() => navigate('/login')}>Login</button></p>
        </div>
    );
};

export default ResetPassword;
