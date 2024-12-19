import { useState } from "react";
import api from "../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingIndicator from "./LoadingIndicator";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/api/auth/forgot-password/', { email });
            toast.success("Password reset instructions sent to your email");
            setEmail("");
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
            <h1>Forgot Password</h1>
            <input
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />

            {loading && <LoadingIndicator />}
            
            <button className="form-button" type="submit">
                Send Reset Instructions
            </button>
        </form>
    );
}

export default ForgotPassword;