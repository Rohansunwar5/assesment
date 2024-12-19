import React from 'react';
import Form from '../components/Form';
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div className="auth-container">
            <Form route="/api/auth/login" method="login" />
            <p className="auth-link">
                Don't have an account? <Link to="/register">Register here</Link>.
            </p>
            <p className="auth-link">
                Forgot Password? <Link to="/forgot-password">Click here</Link>.
            </p>
        </div>
        
    );
};

export default Login;