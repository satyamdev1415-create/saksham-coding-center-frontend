import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import api from "../services/api";

function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    const closeMenu = () => {
        setMenuOpen(false);
    };

    // Check login status
    useEffect(() => {

        async function checkUser() {

            const token = localStorage.getItem("access_token");

            if (!token) {
                setUser(null);
                return;
            }

            try {

                const savedUser = localStorage.getItem("user");

                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                    return;
                }

                const response = await api.get("auth/me/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data);

                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data)
                );

            } catch (error) {

                console.error("User Fetch Error:", error);

                setUser(null);

            }
        }

        checkUser();

        window.addEventListener("authChanged", checkUser);

        return () => {
            window.removeEventListener("authChanged", checkUser);
        };

    }, []);

    // Logout
    function handleLogout() {

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");

        setUser(null);

        window.dispatchEvent(new Event("authChanged"));

        closeMenu();

        navigate("/login");
    }

    const displayName =
        user?.first_name ||
        user?.username ||
        user?.email ||
        "User";

    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">

            <div className="container">

                <Link
                    className="navbar-brand fw-bold"
                    to="/"
                    onClick={closeMenu}
                >
                    <i className="bi bi-code-square text-info me-2"></i>
                    SAKSHAM
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation"
                    aria-expanded={menuOpen}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className={`collapse navbar-collapse ${
                        menuOpen ? "show" : ""
                    }`}
                >

                    <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3">

                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/"
                                end
                                onClick={closeMenu}
                            >
                                Home
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/courses"
                                onClick={closeMenu}
                            >
                                Courses
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/faculty"
                                onClick={closeMenu}
                            >
                                Faculty
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/about"
                                onClick={closeMenu}
                            >
                                About
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/contact"
                                onClick={closeMenu}
                            >
                                Contact
                            </NavLink>
                        </li>

                        {user ? (

                            <>
                                <li className="nav-item">

                                    <span className="nav-link text-info fw-semibold">

                                        <i className="bi bi-person-circle me-2"></i>

                                        Welcome, {displayName}

                                    </span>

                                </li>

                                <li className="nav-item">

                                    <button
                                        className="btn btn-outline-danger"
                                        onClick={handleLogout}
                                    >
                                        <i className="bi bi-box-arrow-right me-2"></i>
                                        Logout
                                    </button>

                                </li>
                            </>

                        ) : (

                            <>
                                <li className="nav-item">

                                    <Link
                                        className="btn btn-outline-info"
                                        to="/login"
                                        onClick={closeMenu}
                                    >
                                        Login
                                    </Link>

                                </li>

                                <li className="nav-item">

                                    <Link
                                        className="btn btn-info text-dark"
                                        to="/register"
                                        onClick={closeMenu}
                                    >
                                        Register
                                    </Link>

                                </li>
                            </>

                        )}

                    </ul>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;