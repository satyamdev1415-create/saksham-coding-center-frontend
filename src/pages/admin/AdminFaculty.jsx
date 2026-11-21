import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminFaculty() {
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingFaculty, setEditingFaculty] = useState(null);

    const initialFormData = {
    name: "",
    designation: "",
    qualification: "",
    experience: "",
    bio: "",
    skills: "",
    linkedin_url: "",
    github_url: "",
    email: "",
    is_active: true,
    display_order: 0,
    photo: null,
    };

    const [formData, setFormData] = useState(initialFormData);

  // Fetch all faculty for admin
    async function fetchFaculty() {
    try {
        setLoading(true);

        const response = await api.get("faculty/admin/");

        setFaculty(
        Array.isArray(response.data)
            ? response.data
            : response.data.results || []
        );

        setError("");
    } catch (err) {
        console.error(
        "Faculty fetch error:",
        err.response?.data || err.message
        );

        setError("Faculty data load nahi ho paya.");
    } finally {
        setLoading(false);
    }
    }

    useEffect(() => {
    fetchFaculty();
    }, []);

  // Handle text input
    function handleChange(event) {
    const { name, value, type, checked } = event.target;

    if (type === "checkbox") {
        setFormData({
        ...formData,
        [name]: checked,
        });
    } else {
        setFormData({
        ...formData,
        [name]: value,
        });
    }
    }

  // Handle photo
    function handlePhotoChange(event) {
    const file = event.target.files[0];

    if (file) {
        setFormData({
        ...formData,
        photo: file,
        });
    }
    }

  // Open Add Faculty form
    function handleAddFaculty() {
    setEditingFaculty(null);
    setFormData(initialFormData);
    setShowForm(true);
    }

  // Open Edit Faculty form
    function handleEdit(facultyMember) {
    setEditingFaculty(facultyMember);

    setFormData({
        name: facultyMember.name || "",
        designation: facultyMember.designation || "",
        qualification: facultyMember.qualification || "",
        experience: facultyMember.experience || "",
        bio: facultyMember.bio || "",
        skills: Array.isArray(facultyMember.skills)
        ? facultyMember.skills.join(", ")
        : "",
        linkedin_url: facultyMember.linkedin_url || "",
        github_url: facultyMember.github_url || "",
        email: facultyMember.email || "",
        is_active: facultyMember.is_active,
        display_order: facultyMember.display_order || 0,
        photo: null,
    });

    setShowForm(true);
    }

  // Submit Add or Edit form
    async function handleSubmit(event) {
    event.preventDefault();

    try {
        const data = new FormData();

        data.append("name", formData.name);
        data.append("designation", formData.designation);
        data.append("qualification", formData.qualification);
        data.append("experience", formData.experience);
        data.append("bio", formData.bio);

      // Convert comma separated skills to array
        const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

        data.append("skills", JSON.stringify(skillsArray));

        data.append("linkedin_url", formData.linkedin_url);
        data.append("github_url", formData.github_url);
        data.append("email", formData.email);
        data.append("is_active", formData.is_active);
        data.append("display_order", formData.display_order);

      // Add photo only if selected
        if (formData.photo instanceof File) {
        data.append("photo", formData.photo);
        }

      // Update faculty if editing, otherwise add new
        if (editingFaculty) {
        await api.patch(
            `faculty/admin/${editingFaculty.id}/`,
            data
        );

        alert("Faculty updated successfully!");
        } else {
        await api.post("faculty/admin/", data);

        alert("Faculty added successfully!");
        }

        setShowForm(false);
        setEditingFaculty(null);
        setFormData(initialFormData);

        fetchFaculty();
    } catch (err) {
        console.error(
        "Faculty save error:",
        err.response?.data || err.message
        );

        alert(
        "Faculty save nahi ho paya. Console check karo."
        );
    }
    }

  // Delete faculty
    async function handleDelete(id) {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this faculty member?"
    );

    if (!confirmDelete) {
        return;
    }

    try {
        await api.delete(`faculty/admin/${id}/`);

        setFaculty((previousFaculty) =>
        previousFaculty.filter(
            (facultyMember) => facultyMember.id !== id
        )
        );

        alert("Faculty deleted successfully!");
    } catch (err) {
        console.error(
        "Faculty delete error:",
        err.response?.data || err.message
        );

        alert("Faculty delete nahi ho paya.");
    }
    }

    if (loading) {
    return (
        <div className="p-4">
        Loading faculty...
        </div>
    );
    }

    if (error) {
    return (
        <div className="p-4">
        <div className="alert alert-danger">
            {error}
        </div>
        </div>
    );
    }

return (
    <div className="container-fluid p-4">

        <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 className="fw-bold">Manage Faculty</h2>

            <p className="text-secondary mb-0">
            Add, edit and manage Saksham Coding Center faculty.
            </p>
        </div>

        <button
            className="btn btn-primary"
            onClick={handleAddFaculty}
        >
            + Add New Faculty
        </button>
        </div>

        {showForm && (
        <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">
                {editingFaculty
                    ? "Edit Faculty"
                    : "Add New Faculty"}
                </h4>

                <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                    setShowForm(false);
                    setEditingFaculty(null);
                    setFormData(initialFormData);
                }}
                >
                Cancel
                </button>
            </div>

            <form onSubmit={handleSubmit}>

                <div className="row g-3">

                <div className="col-md-6">
                    <label className="form-label">
                    Full Name *
                    </label>

                    <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">
                    Designation *
                    </label>

                    <input
                    type="text"
                    name="designation"
                    className="form-control"
                    placeholder="Example: Founder & CEO"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">
                    Qualification
                    </label>

                    <input
                    type="text"
                    name="qualification"
                    className="form-control"
                    value={formData.qualification}
                    onChange={handleChange}
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">
                    Experience
                    </label>

                    <input
                    type="text"
                    name="experience"
                    className="form-control"
                    placeholder="Example: 5 Years"
                    value={formData.experience}
                    onChange={handleChange}
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">
                    Email
                    </label>

                    <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">
                    Display Order
                    </label>

                    <input
                    type="number"
                    name="display_order"
                    className="form-control"
                    value={formData.display_order}
                    onChange={handleChange}
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">
                    LinkedIn URL
                    </label>

                    <input
                    type="url"
                    name="linkedin_url"
                    className="form-control"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">
                    GitHub URL
                    </label>

                    <input
                    type="url"
                    name="github_url"
                    className="form-control"
                    value={formData.github_url}
                    onChange={handleChange}
                    />
                </div>

                <div className="col-12">
                    <label className="form-label">
                    Skills
                    </label>

                    <input
                    type="text"
                    name="skills"
                    className="form-control"
                    placeholder="Python, Django, React, Java"
                    value={formData.skills}
                    onChange={handleChange}
                    />

                    <small className="text-secondary">
                    Separate skills using commas.
                    </small>
                </div>

                <div className="col-12">
                    <label className="form-label">
                    Bio *
                    </label>

                    <textarea
                    name="bio"
                    className="form-control"
                    rows="4"
                    value={formData.bio}
                    onChange={handleChange}
                    required
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">
                    Faculty Photo
                    </label>

                    <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    />
                </div>

                <div className="col-md-6 d-flex align-items-end">
                    <div className="form-check mb-2">
                    <input
                        type="checkbox"
                        name="is_active"
                        className="form-check-input"
                        checked={formData.is_active}
                        onChange={handleChange}
                        id="is_active"
                    />

                    <label
                        className="form-check-label"
                        htmlFor="is_active"
                    >
                        Active Faculty
                    </label>
                    </div>
                </div>

                </div>

                <button
                type="submit"
                className="btn btn-primary mt-4"
                >
                {editingFaculty
                    ? "Update Faculty"
                    : "Save Faculty"}
                </button>

            </form>
            </div>
        </div>
        )}

    <div className="card border-0 shadow-sm">
        <div className="card-body">

            <div className="table-responsive">
            <table className="table table-hover align-middle">

                <thead className="table-light">
                <tr>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Experience</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {faculty.length === 0 ? (
                    <tr>
                    <td
                        colSpan="6"
                        className="text-center py-4"
                    >
                        No faculty members found.
                    </td>
                    </tr>
                ) : (
                    faculty.map((facultyMember) => (
                    <tr key={facultyMember.id}>

                        <td>
                        {facultyMember.photo ? (
                            <img
                            src={facultyMember.photo}
                            alt={facultyMember.name}
                            width="50"
                            height="50"
                            className="rounded-circle"
                            style={{ objectFit: "cover" }}
                            />
                        ) : (
                            <div
                            className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                                width: "50px",
                                height: "50px",
                            }}
                            >
                            👤
                            </div>
                        )}
                        </td>

                        <td className="fw-semibold">
                        {facultyMember.name}
                        </td>

                        <td>
                        {facultyMember.designation}
                        </td>

                        <td>
                        {facultyMember.experience || "-"}
                        </td>

                        <td>
                        <span
                            className={`badge ${
                            facultyMember.is_active
                                ? "bg-success"
                                : "bg-secondary"
                            }`}
                        >
                            {facultyMember.is_active
                            ? "Active"
                            : "Inactive"}
                        </span>
                        </td>

                        <td>
                        <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() =>
                            handleEdit(facultyMember)
                            }
                        >
                            Edit
                        </button>

                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                            handleDelete(facultyMember.id)
                            }
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

export default AdminFaculty;