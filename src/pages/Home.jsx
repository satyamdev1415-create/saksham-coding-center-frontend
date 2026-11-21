import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Home() {
const [courses, setCourses] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

// Fetch courses from Django REST API
useEffect(() => {
async function fetchCourses() {
try {
const response = await api.get("courses/");
const data = response.data;


    setCourses(
        Array.isArray(data) ? data : data.results || []
    );
    } catch (err) {
    console.error("Courses fetch error:", err);
    setError("Courses load nahi ho paaye. Please try again.");
    } finally {
    setLoading(false);
    }
}

fetchCourses();


}, []);

return (
<>

  {/* Hero Section */}
    <section id="home" className="hero-section">
    <div className="container">
        <div className="row align-items-center g-5">
        <div className="col-lg-7">
            <span className="badge bg-info text-dark mb-3 px-3 py-2">
            LEARN • PRACTICE • BUILD • GROW
            </span>

            <h1 className="display-4 fw-bold text-white">
            Build Your Future
            <span className="text-info"> With Coding</span>
            </h1>

            <p className="lead text-light mt-4">
            Learn programming, build real-world projects and
            develop practical technology skills with Saksham
            Coding Center.
            </p>

            <div className="d-flex flex-wrap gap-3 mt-4">
            <a href="#courses" className="btn btn-info btn-lg">
                Explore Courses
                <i className="bi bi-arrow-right ms-2"></i>
            </a>

            <Link
                to="/about"
                className="btn btn-outline-light btn-lg">
                    Learn More
            </Link>
            </div>

            <p className="text-info mt-4 mb-0">
            <i className="bi bi-geo-alt me-2"></i>
            Deoghar, Jharkhand
            </p>
        </div>

        <div className="col-lg-5">
            <div className="hero-card">
            <i className="bi bi-laptop hero-icon"></i>

            <h3 className="fw-bold mt-4">
                Your Coding Journey
            </h3>

            <p className="text-light">
                Start learning. Build projects. Keep growing.
            </p>

            <div className="code-box">
                <span className="text-info">def</span>{" "}
                <span className="text-warning">build_future</span>():
                <br />
                &nbsp;&nbsp;learn()
                <br />
                &nbsp;&nbsp;practice()
                <br />
                &nbsp;&nbsp;
                <span className="text-info">return</span>{" "}
                "Success"
            </div>
            </div>
        </div>
        </div>
    </div>
    </section>

  {/* Courses Section - Data from Django API */}
    <section id="courses" className="py-5">
    <div className="container py-4">
        <div className="text-center mb-5">
        <span className="section-label">OUR COURSES</span>

        <h2 className="display-6 fw-bold mt-2">
            Choose Your Learning Path
        </h2>

        <p className="text-secondary">
            Explore our planned technology learning programs.
        </p>
        </div>

      {/* Loading */}
        {loading && (
        <div className="text-center py-5">
            <div
            className="spinner-border text-info"
            role="status"
            >
            <span className="visually-hidden">Loading...</span>
            </div>

            <p className="mt-3">Loading courses...</p>
        </div>
        )}

      {/* Error */}
        {!loading && error && (
        <div className="alert alert-warning text-center">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
        </div>
        )}

      {/* Course Cards */}
        {!loading && !error && (
        <>
            {courses.length === 0 ? (
            <div className="alert alert-info text-center">
                Abhi koi course available nahi hai.
            </div>
            ) : (
            <div className="row g-4">
                {courses.slice(0, 6).map((course) => (
                <div
                    className="col-md-6 col-lg-4"
                    key={course.id}
                >
                <div className="card course-card h-100">
                    <div className="card-body p-4 d-flex flex-column">
                    <div className="course-icon mb-3">
                        <i className="bi bi-code-slash"></i>
                    </div>

                    <h4 className="fw-bold">
                        {course.title}
                    </h4>

                    <span className="badge text-bg-info mb-3 align-self-start">
                        {course.duration}
                    </span>

                    <p className="text-secondary">
                        {course.description}
                    </p>

                    <div className="mt-auto">
                        <Link
                        to={`/courses/${course.slug}`}
                        className="btn btn-outline-primary mt-2 w-100"
                        >
                        View Details
                        <i className="bi bi-arrow-right ms-2"></i>
                        </Link>
                    </div>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}

          {/* Explore All Courses */}
        {courses.length > 0 && (
            <div className="text-center mt-5">
            <Link
                to="/courses"
                className="btn btn-primary btn-lg"
            >
                Explore All Courses
                <i className="bi bi-arrow-right ms-2"></i>
            </Link>
            </div>
        )}
        </>
    )}
    </div>
</section>


  {/* Contact Section */}
    <section id="contact" className="py-5">
    <div className="container text-center py-4">
        <h2 className="fw-bold">
        Ready to Start Your Journey?
        </h2>

        <p className="text-secondary mt-3">
        Interested in our upcoming courses? Stay connected
        for future announcements.
        </p>

        <Link
        to="/register"
        className="btn btn-primary btn-lg mt-2"
        >
        Register Your Interest
        </Link>
    </div>
    </section>

  {/* Footer */}
    <footer className="bg-dark text-white py-4">
    <div className="container text-center">
        <h5 className="fw-bold">SAKSHAM CODING CENTER</h5>

        <p className="text-light mb-2">
        Learn Today. Build Tomorrow.
        </p>

        <small className="text-secondary">
        © {new Date().getFullYear()} Saksham Coding Center.
        All rights reserved.
        </small>
    </div>
</footer>
</>


);
}

export default Home;
