import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }) {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const isLogin = method === "login";
    const name = isLogin ? "Login" : "Register";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!isLogin && formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            setLoading(false);
            return;
        }

        try {
            const payload = {
                username: formData.username,
                password: formData.password
            };
            if (!isLogin) {
                payload.email = formData.email;
            }

            const res = await api.post(route, payload);
            
            if (isLogin) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch (error) {
            let errorMessage = "An error occurred. Please try again.";
        if (error.response?.data) {
            const errorData = error.response.data;
            if (typeof errorData === "object" && !Array.isArray(errorData)) {
                errorMessage = Object.values(errorData)
                    .flat() 
                    .join(", "); 
            }
            if (errorData.detail) {
                errorMessage = errorData.detail;
            }
        }
        toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            <input
                className="form-input"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
            />
            {!isLogin && (
                <input
                    className="form-input"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
            )}
            <input
                className="form-input"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
            />
            {!isLogin && (
                <input
                    className="form-input"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    required
                />
            )}

            {loading && <LoadingIndicator />}
            
            <button className="form-button" type="submit">
                {name}
            </button>
        </form>
    );
}

export default Form;