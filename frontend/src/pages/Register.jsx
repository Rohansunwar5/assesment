import React from 'react';
import Form from '../components/Form';
import { Link } from 'react-router-dom';
import '../styles/Auth.css'

const Register = () => {
  return (
      <div className="auth-container">
          <Form route="/api/auth/register" method="register" />
          <div className="auth-link">
                Already have an account? <Link to="/login">Login here</Link>.
            </div>
      </div>
  );
};

export default Register;
