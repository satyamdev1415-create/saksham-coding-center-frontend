import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
        const response = await api.post("auth/login/", formData);

        const { access, refresh } = response.data;

        if (!access || !refresh) {
            setError("Login response did not contain tokens.");
            return;
        }

        // Save JWT Tokens
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);

        // Fetch user details
        let userData = {
            username: formData.username
        };

        try {
            const userResponse = await api.get("auth/me/", {
                headers: {
                    Authorization: `Bearer ${access}`,
                },
            });

            userData = userResponse.data;

        } catch (userError) {
            console.warn(
                "User details API unavailable. Using username.",
                userError.response?.data
            );
        }

        // Save user details
        localStorage.setItem("user", JSON.stringify(userData));

        // Notify Navbar
        window.dispatchEvent(new Event("authChanged"));

        // Navigate Home
        navigate("/");

    } catch (err) {
        console.error("Login Error:", err.response?.data || err);

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");

        if (err.response?.status === 401) {
            setError("Invalid username or password.");
        } else {
            setError(
                err.response?.data?.detail ||
                "Unable to login. Please try again."
            );
        }

    } finally {
        setLoading(false);
    }
}

    return (
        <div className="auth-wrapper">
            <div className="auth-card">

                <div className="text-center mb-4">
                    <i className="bi bi-code-square auth-icon"></i>

                    <h2 className="fw-bold mt-3">
                        Welcome Back!
                    </h2>

                    <p className="text-secondary">
                        Login to your Saksham account.
                    </p>
                </div>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="mb-3">
                        <label className="form-label">
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            className="form-control form-control-lg"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleChange}
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            className="form-control form-control-lg"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100"
                        disabled={loading}
                    >
                        {loading ? "Logging In..." : "Login"}
                    </button>

                </form>

                <p className="text-center mt-4 mb-0">
                    Don't have an account?{" "}
                    <Link to="/register">
                        Register here
                    </Link>
                </p>

                <div className="text-center mt-3">
                    <Link to="/" className="text-decoration-none">
                        <i className="bi bi-arrow-left me-2"></i>
                        Back to Home
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default Login;