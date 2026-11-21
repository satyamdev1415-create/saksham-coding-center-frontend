import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    // Fetch Applications
    async function fetchApplications() {
        try {
            setLoading(true);

            const response = await api.get("applications/admin/");

            const data = response.data;

            setApplications(
                Array.isArray(data) ? data : data.results || []
            );

            setError("");

        } catch (err) {
            console.error(
                "Applications fetch error:",
                err.response?.data || err.message
            );

            setError("Failed to fetch applications.");

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchApplications();
    }, []);

    // Update Application Status
    async function handleStatusChange(id, newStatus) {
        try {
            setUpdatingId(id);
            setError("");

            await api.patch(
                `applications/admin/${id}/`,
                {
                    status: newStatus
                }
            );

            setApplications((prevApplications) =>
                prevApplications.map((app) =>
                    app.id === id
                        ? { ...app, status: newStatus }
                        : app
                )
            );

        } catch (err) {
            console.error(
                "Status update error:",
                err.response?.data || err.message
            );

            setError("Failed to update application status.");

        } finally {
            setUpdatingId(null);
        }
    }

    // Status Badge
    function getStatusClass(status) {
        if (status === "PENDING") {
            return "bg-warning text-dark";
        }

        if (status === "CONTACTED") {
            return "bg-info text-dark";
        }

        if (status === "ACCEPTED") {
            return "bg-success text-white";
        }

        if (status === "REJECTED") {
            return "bg-danger text-white";
        }

        return "bg-secondary text-white";
    }

    // Loading
    if (loading) {
        return (
            <div className="container-fluid p-4">
                <h4>Loading applications...</h4>
            </div>
        );
    }

    // Main UI
    return (
        <div className="container-fluid p-4">

            <div className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fw-bold">Course Applications</h2>

                    <p className="text-secondary mb-0">
                        Manage student applications and update their status.
                    </p>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={fetchApplications}
                >
                    Refresh
                </button>
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <div className="card border-0 shadow-sm">

                <div className="card-body">

                    <div className="table-responsive">

                        <table className="table table-hover align-middle">

                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Student</th>
                                    <th>Course</th>
                                    <th>Contact</th>
                                    <th>City</th>
                                    <th>Qualification</th>
                                    <th>Status</th>
                                    <th>Change Status</th>
                                </tr>
                            </thead>

                            <tbody>

                                {applications.length === 0 ? (

                                    <tr>
                                        <td colSpan="8" className="text-center py-4">
                                            No applications found.
                                        </td>
                                    </tr>

                                ) : (

                                    applications.map((application) => (

                                        <tr key={application.id}>

                                            <td>
                                                {application.id}
                                            </td>

                                            <td>
                                                <div className="fw-semibold">
                                                    {application.full_name}
                                                </div>

                                                <small className="text-secondary">
                                                    {application.email}
                                                </small>
                                            </td>

                                            <td>
                                                {application.course_title}
                                            </td>

                                            <td>
                                                {application.phone}
                                            </td>

                                            <td>
                                                {application.city}
                                            </td>

                                            <td>
                                                {application.qualification}
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${getStatusClass(
                                                        application.status
                                                    )}`}
                                                >
                                                    {application.status}
                                                </span>
                                            </td>

                                            <td>
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={application.status}
                                                    disabled={updatingId === application.id}
                                                    onChange={(event) =>
                                                        handleStatusChange(
                                                            application.id,
                                                            event.target.value
                                                        )
                                                    }
                                                >

                                                    <option value="PENDING">
                                                        Pending
                                                    </option>

                                                    <option value="CONTACTED">
                                                        Contacted
                                                    </option>

                                                    <option value="ACCEPTED">
                                                        Accepted
                                                    </option>

                                                    <option value="REJECTED">
                                                        Rejected
                                                    </option>

                                                </select>
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

export default AdminApplications;