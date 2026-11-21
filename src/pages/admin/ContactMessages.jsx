import { useEffect, useState } from "react";
import api from "../../services/api";

function ContactMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchMessages();
    }, []);

    async function fetchMessages() {
    try {
        setLoading(true);
        setError("");

        const response = await api.get("contact/admin/");

        const data = response.data;

        setMessages(
            Array.isArray(data) ? data : data.results || []
        );

    } catch (error) {
        console.log("Contact API Error:", error);
        console.log("Status:", error.response?.status);
        console.log("Response:", error.response?.data);

        setError(
            error.response?.data?.detail ||
            error.response?.data?.message ||
            `API Error: ${error.response?.status || "Network Error"}`
        );

    } finally {
        setLoading(false);
    }
}

    async function toggleRead(message) {
        try {
            const response = await api.patch(
                `contact/admin/${message.id}/`,
                {
                    is_read: !message.is_read,
                }
            );

            setMessages((previousMessages) =>
                previousMessages.map((item) =>
                    item.id === message.id ? response.data : item
                )
            );

            if (selectedMessage?.id === message.id) {
                setSelectedMessage(response.data);
            }
        } catch (error) {
            console.error("Error updating message:", error);
            alert("Unable to update message status.");
        }
    }

    async function deleteMessage(id) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this message?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`contact/admin/${id}/`);

            setMessages((previousMessages) =>
                previousMessages.filter((message) => message.id !== id)
            );

            if (selectedMessage?.id === id) {
                setSelectedMessage(null);
            }
        } catch (error) {
            console.error("Error deleting message:", error);
            alert("Unable to delete message.");
        }
    }

    const unreadCount = messages.filter(
        (message) => !message.is_read
    ).length;

    const readCount = messages.filter(
        (message) => message.is_read
    ).length;

    const filteredMessages = messages.filter((message) => {
        if (filter === "unread") return !message.is_read;
        if (filter === "read") return message.is_read;
        return true;
    });

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary"></div>
                <p className="mt-2">Loading messages...</p>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold">Contact Messages</h2>
                    <p className="text-muted mb-0">
                        Manage messages received from website visitors.
                    </p>
                </div>

                <button
                    className="btn btn-outline-primary"
                    onClick={fetchMessages}
                >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Refresh
                </button>
            </div>

            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            {/* Statistics */}

            <div className="row g-3 mb-4">

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h6 className="text-muted">Total Messages</h6>
                            <h2 className="fw-bold">{messages.length}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h6 className="text-muted">Unread Messages</h6>
                            <h2 className="fw-bold text-danger">
                                {unreadCount}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h6 className="text-muted">Read Messages</h6>
                            <h2 className="fw-bold text-success">
                                {readCount}
                            </h2>
                        </div>
                    </div>
                </div>

            </div>

            {/* Filters */}

            <div className="d-flex gap-2 mb-3 flex-wrap">

                <button
                    className={`btn ${filter === "all" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setFilter("all")}
                >
                    All Messages ({messages.length})
                </button>

                <button
                    className={`btn ${filter === "unread" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setFilter("unread")}
                >
                    Unread ({unreadCount})
                </button>

                <button
                    className={`btn ${filter === "read" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setFilter("read")}
                >
                    Read ({readCount})
                </button>

            </div>

            {/* Messages Table */}

            <div className="card border-0 shadow-sm">
                <div className="card-body">

                    <div className="table-responsive">
                        <table className="table table-hover align-middle">

                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Subject</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredMessages.length > 0 ? (
                                    filteredMessages.map((message, index) => (
                                        <tr key={message.id}>
                                            <td>{index + 1}</td>

                                            <td className="fw-semibold">
                                                {message.name}
                                            </td>

                                            <td>{message.email}</td>

                                            <td>{message.subject}</td>

                                            <td>
                                                {new Date(
                                                    message.created_at
                                                ).toLocaleDateString()}
                                            </td>

                                            <td>
                                                {message.is_read ? (
                                                    <span className="badge bg-success">
                                                        Read
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-danger">
                                                        Unread
                                                    </span>
                                                )}
                                            </td>

                                            <td>
                                                <div className="d-flex gap-2">

                                                    <button
                                                        className="btn btn-sm btn-info"
                                                        title="View Message"
                                                        onClick={() => setSelectedMessage(message)}
                                                    >
                                                        <i className="bi bi-eye"></i>
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        title="Toggle Read Status"
                                                        onClick={() => toggleRead(message)}
                                                    >
                                                        <i className={`bi ${message.is_read ? "bi-envelope" : "bi-envelope-open"}`}></i>
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        title="Delete Message"
                                                        onClick={() => deleteMessage(message.id)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>

                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5">
                                            <i className="bi bi-inbox fs-1 text-muted"></i>
                                            <p className="text-muted mt-2 mb-0">
                                                No messages found.
                                            </p>
                                        </td>
                                    </tr>
                                )}

                            </tbody>

                        </table>
                    </div>

                </div>
            </div>

            {/* Message Details Modal */}

            {selectedMessage && (
                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">
                                    Message Details
                                </h5>

                                <button
                                    className="btn-close"
                                    onClick={() => setSelectedMessage(null)}
                                ></button>
                            </div>

                            <div className="modal-body">

                                <p>
                                    <strong>Name:</strong>{" "}
                                    {selectedMessage.name}
                                </p>

                                <p>
                                    <strong>Email:</strong>{" "}
                                    {selectedMessage.email}
                                </p>

                                <p>
                                    <strong>Phone:</strong>{" "}
                                    {selectedMessage.phone || "Not provided"}
                                </p>

                                <p>
                                    <strong>Subject:</strong>{" "}
                                    {selectedMessage.subject}
                                </p>

                                <p>
                                    <strong>Date:</strong>{" "}
                                    {new Date(
                                        selectedMessage.created_at
                                    ).toLocaleString()}
                                </p>

                                <hr />

                                <h6>Message:</h6>

                                <div className="bg-light p-3 rounded">
                                    {selectedMessage.message}
                                </div>

                            </div>

                            <div className="modal-footer">

                                <button
                                    className={`btn ${selectedMessage.is_read ? "btn-outline-primary" : "btn-success"}`}
                                    onClick={() => toggleRead(selectedMessage)}
                                >
                                    {selectedMessage.is_read
                                        ? "Mark as Unread"
                                        : "Mark as Read"}
                                </button>

                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedMessage(null)}
                                >
                                    Close
                                </button>

                            </div>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default ContactMessages;




