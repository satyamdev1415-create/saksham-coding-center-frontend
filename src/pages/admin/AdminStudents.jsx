import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminStudents() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [editStudent, setEditStudent] = useState(null);
    const [updating, setUpdating] = useState(false);

    // Fetch Students
    async function fetchStudents() {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("auth/admin/students/");

            const data = response.data;

            setStudents(
                Array.isArray(data) ? data : data.results || []
            );

        } catch (err) {
            console.error(
                "Students fetch error:",
                err.response?.data || err.message
            );

            setError("Failed to fetch students.");

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchStudents();
    }, []);

    // Search Students
    const filteredStudents = students.filter((student) => {
        const searchText = search.toLowerCase();

        const fullName =
            `${student.first_name} ${student.last_name}`.toLowerCase();

        return (
            fullName.includes(searchText) ||
            student.username.toLowerCase().includes(searchText) ||
            student.email.toLowerCase().includes(searchText)
        );
    });

    // Delete Student
    async function handleDelete(id) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`auth/admin/students/${id}/`);

            setStudents((previousStudents) =>
                previousStudents.filter(
                    (student) => student.id !== id
                )
            );

        } catch (err) {
            console.error(
                "Delete student error:",
                err.response?.data || err.message
            );

            setError("Failed to delete student.");
        }
    }

    // Edit Student
    function handleEdit(student) {
        setEditStudent({
            id: student.id,
            first_name: student.first_name || "",
            last_name: student.last_name || "",
            email: student.email || "",
            is_active: student.is_active
        });
    }

    // Update Student
    async function handleUpdate(event) {
        event.preventDefault();

        try {
            setUpdating(true);

            const response = await api.patch(
                `auth/admin/students/${editStudent.id}/`,
                {
                    first_name: editStudent.first_name,
                    last_name: editStudent.last_name,
                    email: editStudent.email,
                    is_active: editStudent.is_active
                }
            );

            setStudents((previousStudents) =>
                previousStudents.map((student) =>
                    student.id === editStudent.id
                        ? { ...student, ...response.data }
                        : student
                )
            );

            setEditStudent(null);

        } catch (err) {
            console.error(
                "Update student error:",
                err.response?.data || err.message
            );

            setError("Failed to update student.");

        } finally {
            setUpdating(false);
        }
    }

    // Loading
    if (loading) {
        return (
            <div className="container-fluid p-4">
                <h4>Loading students...</h4>
            </div>
        );
    }

    return (
        <div className="container-fluid p-4">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

                <div>
                    <h2 className="fw-bold mb-1">
                        Students Management
                    </h2>

                    <p className="text-secondary mb-0">
                        Manage all registered students.
                    </p>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={fetchStudents}
                >
                    Refresh Students
                </button>

            </div>

            {/* Error */}
            {error && (
                <div className="alert alert-danger">
                    {error}

                    <button
                        className="btn-close float-end"
                        onClick={() => setError("")}
                    ></button>
                </div>
            )}

            {/* Statistics */}
            <div className="row g-3 mb-4">

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h6 className="text-secondary">
                                Total Students
                            </h6>

                            <h2 className="fw-bold text-primary">
                                {students.length}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h6 className="text-secondary">
                                Active Students
                            </h6>

                            <h2 className="fw-bold text-success">
                                {students.filter(
                                    (student) => student.is_active
                                ).length}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h6 className="text-secondary">
                                Inactive Students
                            </h6>

                            <h2 className="fw-bold text-danger">
                                {students.filter(
                                    (student) => !student.is_active
                                ).length}
                            </h2>
                        </div>
                    </div>
                </div>

            </div>

            {/* Students Table */}
            <div className="card border-0 shadow-sm">

                <div className="card-header bg-white py-3">

                    <div className="row align-items-center g-3">

                        <div className="col-md-6">
                            <h5 className="fw-bold mb-0">
                                All Students
                            </h5>
                        </div>

                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search students..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />
                        </div>

                    </div>

                </div>

                <div className="card-body">

                    <div className="table-responsive">

                        <table className="table table-hover align-middle">

                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Student</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Joined Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredStudents.length === 0 ? (

                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="text-center py-4"
                                        >
                                            No students found.
                                        </td>
                                    </tr>

                                ) : (

                                    filteredStudents.map((student) => (

                                        <tr key={student.id}>

                                            <td>{student.id}</td>

                                            <td>
                                                <div className="fw-semibold">
                                                    {student.first_name} {student.last_name}
                                                </div>
                                            </td>

                                            <td>{student.username}</td>

                                            <td>{student.email || "N/A"}</td>

                                            <td>
                                                {student.date_joined
                                                    ? new Date(
                                                        student.date_joined
                                                    ).toLocaleDateString()
                                                    : "N/A"}
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${
                                                        student.is_active
                                                            ? "bg-success"
                                                            : "bg-danger"
                                                    }`}
                                                >
                                                    {student.is_active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="d-flex gap-2">

                                                    <button
                                                        className="btn btn-sm btn-info text-white"
                                                        onClick={() =>
                                                            setSelectedStudent(student)
                                                        }
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-warning"
                                                        onClick={() =>
                                                            handleEdit(student)
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() =>
                                                            handleDelete(student.id)
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>

                                    ))
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

            {/* View Student Modal */}
            {selectedStudent && (
                <div
                    className="modal d-block"
                    style={{
                        backgroundColor: "rgba(0,0,0,0.5)"
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered">

                        <div className="modal-content">

                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">
                                    Student Details
                                </h5>

                                <button
                                    className="btn-close"
                                    onClick={() =>
                                        setSelectedStudent(null)
                                    }
                                ></button>
                            </div>

                            <div className="modal-body">

                                <p>
                                    <strong>ID:</strong> {selectedStudent.id}
                                </p>

                                <p>
                                    <strong>Name:</strong>{" "}
                                    {selectedStudent.first_name} {selectedStudent.last_name}
                                </p>

                                <p>
                                    <strong>Username:</strong>{" "}
                                    {selectedStudent.username}
                                </p>

                                <p>
                                    <strong>Email:</strong>{" "}
                                    {selectedStudent.email || "N/A"}
                                </p>

                                <p>
                                    <strong>Status:</strong>{" "}
                                    {selectedStudent.is_active
                                        ? "Active"
                                        : "Inactive"}
                                </p>

                                <p>
                                    <strong>Joined:</strong>{" "}
                                    {selectedStudent.date_joined
                                        ? new Date(
                                            selectedStudent.date_joined
                                        ).toLocaleString()
                                        : "N/A"}
                                </p>

                            </div>

                        </div>

                    </div>
                </div>
            )}

            {/* Edit Student Modal */}
            {editStudent && (
                <div
                    className="modal d-block"
                    style={{
                        backgroundColor: "rgba(0,0,0,0.5)"
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered">

                        <div className="modal-content">

                            <form onSubmit={handleUpdate}>

                                <div className="modal-header">
                                    <h5 className="modal-title fw-bold">
                                        Edit Student
                                    </h5>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() =>
                                            setEditStudent(null)
                                        }
                                    ></button>
                                </div>

                                <div className="modal-body">

                                    <div className="mb-3">
                                        <label className="form-label">
                                            First Name
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editStudent.first_name}
                                            onChange={(event) =>
                                                setEditStudent({
                                                    ...editStudent,
                                                    first_name: event.target.value
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Last Name
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editStudent.last_name}
                                            onChange={(event) =>
                                                setEditStudent({
                                                    ...editStudent,
                                                    last_name: event.target.value
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            className="form-control"
                                            value={editStudent.email}
                                            onChange={(event) =>
                                                setEditStudent({
                                                    ...editStudent,
                                                    email: event.target.value
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="studentActive"
                                            checked={editStudent.is_active}
                                            onChange={(event) =>
                                                setEditStudent({
                                                    ...editStudent,
                                                    is_active: event.target.checked
                                                })
                                            }
                                        />

                                        <label
                                            className="form-check-label"
                                            htmlFor="studentActive"
                                        >
                                            Active Student
                                        </label>
                                    </div>

                                </div>

                                <div className="modal-footer">

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            setEditStudent(null)
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={updating}
                                    >
                                        {updating
                                            ? "Saving..."
                                            : "Save Changes"}
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

export default AdminStudents;