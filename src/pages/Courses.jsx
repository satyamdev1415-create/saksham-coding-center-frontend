import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Courses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
    async function fetchCourses() {
        try {
        const response = await api.get("courses/");
        const data = response.data;

        setCourses(Array.isArray(data) ? data : data.results || []);
        } catch (err) {
        console.error("Courses fetch error:", err);
        setError("Courses load nahi ho paaye. Please try again.");
        } finally {
        setLoading(false);
        }
    }

    fetchCourses();
}, []);

if (loading) {
    return (
        <div className="container py-5 text-center">
        <div className="spinner-border text-info" role="status" />
        <p className="mt-3">Loading courses...</p>
        </div>
    );
}

if (error) {
    return (
        <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
        </div>
    );
}

return (
    <section className="container py-5">
        <div className="text-center mb-5">
        <p className="section-label">OUR COURSES</p>
        <h1 className="fw-bold">Explore Our Courses</h1>
        <p className="text-secondary">
            Choose a learning path that matches your career goals.
        </p>
        </div>

        <div className="row g-4">
        {courses.map((course) => (
            <div className="col-md-6 col-lg-4" key={course.id}>
            <div className="card course-card h-100 p-3">
                <div className="card-body d-flex flex-column">
                <div className="course-icon mb-3">
                    <i className="bi bi-code-slash" />
                </div>

                <h4 className="fw-bold">{course.title}</h4>

                <p className="text-secondary">
                    {course.description}
                </p>

                <div className="mb-3">
                    <span className="badge text-bg-info">
                    {course.duration}
                    </span>
                </div>

                <div className="mt-auto">
                    <p className="fw-semibold">
                    Fee: ₹{Number(course.fee || 0).toLocaleString("en-IN")}
                    </p>

                    <Link
                    to={`/courses/${course.slug}`}
                    className="btn btn-info w-100"
                    >
                    View Details <i className="bi bi-arrow-right ms-2" />
                    </Link>
                </div>
                </div>
            </div>
            </div>
        ))}
        </div>

        {courses.length === 0 && (
        <div className="alert alert-info text-center">
            Abhi koi course available nahi hai.
        </div>
    )}
    </section>
);
}

export default Courses;