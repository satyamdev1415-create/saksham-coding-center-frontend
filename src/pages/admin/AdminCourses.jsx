import { useEffect, useState } from "react";
import api from "../../services/api";

const initialForm = {
    title: "",
    slug: "",
    description: "",
    duration: "",
    fee: "",
    overview: "",
    prerequisites: "[]",
    learning_outcomes: "[]",
    curriculum: "[]",
    projects: "[]",
    faqs: "[]",
    is_active: true,
};

function AdminCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState(initialForm);
    const [saving, setSaving] = useState(false);

  // Fetch all courses
    async function fetchCourses() {
    try {
        const response = await api.get("courses/");
        setCourses(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
        setError("Courses load nahi ho paye.");
    } finally {
        setLoading(false);
    }
    }

    useEffect(() => {
    fetchCourses();
    }, []);

  // Input change
    function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((previousData) => ({
        ...previousData,
        [name]: type === "checkbox" ? checked : value,
    }));
    }

  // Open Add Form
    function handleAddCourse() {
    setEditId(null);
    setFormData(initialForm);
    setShowForm(true);
    }

  // Open Edit Form
    function handleEditCourse(course) {
    setEditId(course.id);

    setFormData({
        title: course.title || "",
        slug: course.slug || "",
        description: course.description || "",
        duration: course.duration || "",
        fee: course.fee || "",
        overview: course.overview || "",
        prerequisites: JSON.stringify(course.prerequisites || [], null, 2),
        learning_outcomes: JSON.stringify(course.learning_outcomes || [], null, 2),
        curriculum: JSON.stringify(course.curriculum || [], null, 2),
        projects: JSON.stringify(course.projects || [], null, 2),
        faqs: JSON.stringify(course.faqs || [], null, 2),
        is_active: course.is_active,
    });

    setShowForm(true);
    }

  // Save Course
    async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
        const payload = {
        ...formData,
        fee: Number(formData.fee),
        prerequisites: JSON.parse(formData.prerequisites),
        learning_outcomes: JSON.parse(formData.learning_outcomes),
        curriculum: JSON.parse(formData.curriculum),
        projects: JSON.parse(formData.projects),
        faqs: JSON.parse(formData.faqs),
        };

        if (editId) {
        await api.patch(`courses/${editId}/`, payload);
        alert("Course updated successfully!");
        } else {
        await api.post("courses/", payload);
        alert("Course added successfully!");
        }

        setShowForm(false);
        setFormData(initialForm);
        setEditId(null);

        await fetchCourses();

    } catch (err) {
        console.error("Save error:", err.response?.data || err.message);

        if (err instanceof SyntaxError) {
        setError("JSON fields ka format check karo. Valid JSON array hona chahiye.");
        } else {
        setError(
            JSON.stringify(err.response?.data || "Unable to save course.")
        );
        }
    } finally {
        setSaving(false);
    }
    }

  // Delete Course
    async function deleteCourse(id) {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    try {
        await api.delete(`courses/${id}/`);

        setCourses((previousCourses) =>
        previousCourses.filter((course) => course.id !== id)
        );

        alert("Course deleted successfully!");

    } catch (err) {
        console.error(err.response?.data || err.message);
        alert("Unable to delete course.");
    }
    }

    if (loading) {
    return <div className="container py-5">Loading courses...</div>;
}

return (
    <div className="container-fluid p-4">

      {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 className="fw-bold">Manage Courses</h2>
            <p className="text-secondary">
            Manage all Saksham Coding Center courses.
            </p>
        </div>

        <button
            className="btn btn-primary"
            onClick={handleAddCourse}
        >
            + Add New Course
        </button>
        </div>

        {error && (
        <div className="alert alert-danger">
            {error}
        </div>
        )}

      {/* Add / Edit Form */}
        {showForm && (
        <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-primary text-white py-3">
            <h5 className="mb-0">
                {editId ? "Edit Course" : "Add New Course"}
            </h5>
        </div>

        <div className="card-body p-4">

            <form onSubmit={handleSubmit}>

            <div className="row g-3">

                <div className="col-md-6">
                <label className="form-label">Course Title</label>
                <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                </div>

                <div className="col-md-6">
                <label className="form-label">Slug</label>
                <input
                    type="text"
                    name="slug"
                    className="form-control"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                />
                </div>

                <div className="col-md-6">
                <label className="form-label">Duration</label>
                <input
                    type="text"
                    name="duration"
                    className="form-control"
                    placeholder="Example: 6 Months"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                />
                </div>

                <div className="col-md-6">
                <label className="form-label">Course Fee</label>
                <input
                    type="number"
                    name="fee"
                    className="form-control"
                    value={formData.fee}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                />
                </div>

                <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                    name="description"
                    className="form-control"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
                </div>

                <div className="col-12">
                    <label className="form-label">Overview</label>
                    <textarea
                    name="overview"
                    className="form-control"
                    rows="3"
                    value={formData.overview}
                    onChange={handleChange}
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">
                    Prerequisites (JSON Array)
                    </label>
                    <textarea
                    name="prerequisites"
                    className="form-control"
                    rows="3"
                    value={formData.prerequisites}
                    onChange={handleChange}
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">
                    Learning Outcomes (JSON Array)
                    </label>
                    <textarea
                    name="learning_outcomes"
                    className="form-control"
                    rows="3"
                    value={formData.learning_outcomes}
                    onChange={handleChange}
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">
                    Curriculum (JSON Array)
                    </label>
                    <textarea
                    name="curriculum"
                    className="form-control"
                    rows="3"
                    value={formData.curriculum}
                    onChange={handleChange}
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">
                    Projects (JSON Array)
                    </label>
                    <textarea
                    name="projects"
                    className="form-control"
                    rows="3"
                    value={formData.projects}
                    onChange={handleChange}
                    />
                </div>

                <div className="col-12">
                    <label className="form-label">
                    FAQs (JSON Array)
                    </label>
                    <textarea
                    name="faqs"
                    className="form-control"
                    rows="3"
                    value={formData.faqs}
                    onChange={handleChange}
                    />
                </div>

                <div className="col-12">
                    <div className="form-check">
                    <input
                        type="checkbox"
                        name="is_active"
                        className="form-check-input"
                        checked={formData.is_active}
                        onChange={handleChange}
                    />

                    <label className="form-check-label">
                        Active Course
                    </label>
                    </div>
                </div>

                </div>

                <div className="mt-4 d-flex gap-2">

                <button
                    type="submit"
                    className="btn btn-success"
                    disabled={saving}
                >
                    {saving
                    ? "Saving..."
                    : editId
                    ? "Update Course"
                    : "Save Course"}
                </button>

                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowForm(false)}
                >
                    Cancel
                </button>

                </div>

            </form>

            </div>
        </div>
        )}

      {/* Courses Table */}
        <div className="card border-0 shadow-sm">
        <div className="card-body">

            <div className="table-responsive">
            <table className="table table-hover align-middle">

                <thead className="table-light">
                <tr>
                    <th>ID</th>
                    <th>Course Name</th>
                    <th>Duration</th>
                    <th>Fee</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {courses.length === 0 ? (
                    <tr>
                    <td colSpan="6" className="text-center">
                        No courses found.
                    </td>
                    </tr>
                ) : (
                    courses.map((course) => (
                    <tr key={course.id}>
                        <td>{course.id}</td>
                        <td>{course.title}</td>
                        <td>{course.duration}</td>
                        <td>₹{course.fee}</td>

                        <td>
                        <span
                            className={`badge ${
                            course.is_active
                                ? "bg-success"
                                : "bg-secondary"
                            }`}
                        >
                            {course.is_active ? "Active" : "Inactive"}
                        </span>
                        </td>

                        <td>
                        <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEditCourse(course)}
                        >
                            Edit
                        </button>

                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteCourse(course.id)}
                        >
                            Delete
                        </button>
                        </td>
                    </tr>
                    ))
                )}
                </tbody>

            </table>
            </div>

        </div>
        </div>

    </div>
    );
}

export default AdminCourses;