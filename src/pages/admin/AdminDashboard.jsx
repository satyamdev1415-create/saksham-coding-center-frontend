import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminDashboard() {
  const [stats, setStats] = useState({
    total_courses: 0,
    total_faculty: 0,
    total_applications: 0,
    pending_applications: 0,
    total_students: 0,

    application_status: {
      pending: 0,
      contacted: 0,
      accepted: 0,
      rejected: 0,
    },

    recent_applications: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchDashboard() {
    try {
      setLoading(true);

      const response = await api.get("auth/admin/dashboard/");

      setStats(response.data);
      setError("");
    } catch (err) {
      console.error(
        "Dashboard error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Dashboard data load nahi hua."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

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

    return "bg-secondary";
  }

  const cards = [
    {
      title: "Total Courses",
      value: stats.total_courses,
      icon: "📚",
      text: "Available courses",
      color: "primary",
    },
    {
      title: "Total Faculty",
      value: stats.total_faculty,
      icon: "👨‍🏫",
      text: "Teaching professionals",
      color: "success",
    },
    {
      title: "Total Applications",
      value: stats.total_applications,
      icon: "📝",
      text: "Student applications",
      color: "info",
    },
    {
      title: "Total Students",
      value: stats.total_students,
      icon: "🎓",
      text: "Registered students",
      color: "warning",
    },
  ];

  const total = stats.total_applications || 1;

  const processedApplications =
    stats.application_status.contacted +
    stats.application_status.accepted +
    stats.application_status.rejected;

  const processedPercentage = Math.round(
    (processedApplications / total) * 100
  );

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <h4>Loading dashboard...</h4>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid p-4">
        <div className="alert alert-danger">
          {error}
        </div>

        <button
          className="btn btn-primary"
          onClick={fetchDashboard}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">

      {/* Welcome Section */}

      <div className="bg-primary text-white rounded-3 p-4 mb-4 shadow-sm">

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

          <div>
            <h1 className="fw-bold mb-2">
              Welcome to Saksham Coding Center! 🚀
            </h1>

            <p className="mb-0">
              Manage your institute, students, courses and faculty from one place.
            </p>
          </div>

          <button
            className="btn btn-light"
            onClick={fetchDashboard}
          >
            🔄 Refresh Dashboard
          </button>

        </div>

      </div>


      {/* Statistics Cards */}

      <div className="row g-4 mb-4">

        {cards.map((card) => (

          <div
            className="col-12 col-sm-6 col-xl-3"
            key={card.title}
          >

            <div className="card border-0 shadow-sm h-100">

              <div className="card-body p-4">

                <div className="d-flex justify-content-between">

                  <div>
                    <p className="text-secondary mb-2">
                      {card.title}
                    </p>

                    <h2 className={`fw-bold text-${card.color}`}>
                      {card.value}
                    </h2>

                    <small className="text-secondary">
                      {card.text}
                    </small>
                  </div>

                  <div className="fs-2">
                    {card.icon}
                  </div>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>


      {/* Application Overview */}

      <div className="row g-4 mb-4">

        <div className="col-lg-7">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4">

              <h4 className="fw-bold mb-4">
                📊 Application Overview
              </h4>


              <div className="d-flex justify-content-between mb-2">

                <span className="text-secondary">
                  Processed Applications
                </span>

                <strong>
                  {processedPercentage}%
                </strong>

              </div>


              <div
                className="progress mb-4"
                style={{ height: "12px" }}
              >

                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{
                    width: `${processedPercentage}%`,
                  }}
                />

              </div>


              <div className="row text-center">

                <div className="col-4">

                  <h3 className="text-primary fw-bold">
                    {stats.total_applications}
                  </h3>

                  <small className="text-secondary">
                    Total
                  </small>

                </div>


                <div className="col-4">

                  <h3 className="text-warning fw-bold">
                    {stats.application_status.pending}
                  </h3>

                  <small className="text-secondary">
                    Pending
                  </small>

                </div>


                <div className="col-4">

                  <h3 className="text-success fw-bold">
                    {processedApplications}
                  </h3>

                  <small className="text-secondary">
                    Processed
                  </small>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* Pending Applications */}

        <div className="col-lg-5">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between">

                <h4 className="fw-bold">
                  Pending Applications
                </h4>

                <span className="fs-3">
                  ⏳
                </span>

              </div>


              <h1 className="text-warning fw-bold mt-4">

                {stats.application_status.pending}

              </h1>


              <p className="text-secondary">
                Applications waiting for review.
              </p>


              <a
                href="/admin/applications"
                className="btn btn-warning"
              >
                Review Applications →
              </a>

            </div>

          </div>

        </div>

      </div>


      {/* Application Status Overview */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-body p-4">

          <h4 className="fw-bold mb-4">
            📈 Application Status Overview
          </h4>


          <div className="row g-3">

            <div className="col-md-6 col-lg-3">

              <div className="border rounded p-3 text-center">

                <div className="fs-3">
                  🟡
                </div>

                <h3 className="fw-bold text-warning">

                  {stats.application_status.pending}

                </h3>

                <span className="text-secondary">
                  Pending
                </span>

                </div>

            </div>


            <div className="col-md-6 col-lg-3">

                <div className="border rounded p-3 text-center">

                <div className="fs-3">
                    🔵
                </div>

                <h3 className="fw-bold text-info">

                    {stats.application_status.contacted}

                </h3>

                <span className="text-secondary">
                    Contacted
                </span>

                </div>

            </div>


            <div className="col-md-6 col-lg-3">

                <div className="border rounded p-3 text-center">

                <div className="fs-3">
                    🟢
                </div>

                <h3 className="fw-bold text-success">

                    {stats.application_status.accepted}

                </h3>

                <span className="text-secondary">
                    Accepted
                </span>

                </div>

            </div>


            <div className="col-md-6 col-lg-3">

                <div className="border rounded p-3 text-center">

                <div className="fs-3">
                    🔴
                </div>

                <h3 className="fw-bold text-danger">

                    {stats.application_status.rejected}

                </h3>

                <span className="text-secondary">
                    Rejected
                </span>

                </div>

            </div>

            </div>

        </div>

        </div>


      {/* Recent Applications */}

        <div className="card border-0 shadow-sm mb-4">

        <div className="card-body p-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

            <div>

                <h4 className="fw-bold mb-1">
                📝 Recent Applications
                </h4>

                <p className="text-secondary mb-0">
                Latest student course applications.
                </p>

            </div>


            <a
                href="/admin/applications"
                className="btn btn-outline-primary"
            >
                View All →
            </a>

            </div>


            <div className="table-responsive">

            <table className="table table-hover align-middle">

                <thead className="table-light">

                <tr>

                    <th>Student</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Status</th>
                    <th>Applied Date</th>

                </tr>

            </thead>


            <tbody>

                {stats.recent_applications.length === 0 ? (

                <tr>

                    <td
                    colSpan="5"
                    className="text-center py-4 text-secondary"
                    >
                    No recent applications found.
                    </td>

                </tr>

                ) : (

                stats.recent_applications.map((application) => (

                    <tr key={application.id}>

                    <td className="fw-semibold">

                        {application.full_name}

                    </td>


                    <td>

                        {application.email}

                    </td>


                    <td>

                        {application.course_title}

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

                        {new Date(
                            application.created_at
                        ).toLocaleDateString()}

                    </td>

                    </tr>

                ))

                )}

            </tbody>

            </table>

        </div>

        </div>

    </div>


      {/* Quick Actions */}

    <div className="mb-3">

        <h3 className="fw-bold">
            Quick Actions
        </h3>

        <p className="text-secondary">
            Quickly access your management modules.
        </p>

    </div>


    <div className="row g-4 mb-4">

        <div className="col-md-6 col-xl-3">

        <a
            href="/admin/courses"
            className="text-decoration-none"
        >

            <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4 text-center">

                <div className="fs-1">
                    📚
                </div>

                <h5 className="fw-bold mt-3">
                    Manage Courses
                </h5>

            </div>

            </div>

        </a>

        </div>


        <div className="col-md-6 col-xl-3">

        <a
            href="/admin/faculty"
            className="text-decoration-none"
        >

            <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4 text-center">

                <div className="fs-1">
                    👨‍🏫
                </div>

                <h5 className="fw-bold mt-3">
                    Manage Faculty
                </h5>

            </div>

            </div>

        </a>

        </div>


        <div className="col-md-6 col-xl-3">

        <a
            href="/admin/applications"
            className="text-decoration-none"
        >

            <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4 text-center">

                <div className="fs-1">
                    📝
                </div>

                <h5 className="fw-bold mt-3">
                    Applications
                </h5>

            </div>

            </div>

        </a>

        </div>


        <div className="col-md-6 col-xl-3">

        <a
            href="/admin/students"
            className="text-decoration-none"
        >

            <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4 text-center">

                <div className="fs-1">
                    🎓
                </div>

                <h5 className="fw-bold mt-3">
                Manage Students
                </h5>

            </div>

            </div>

        </a>

        </div>

    </div>

    </div>
);
}

export default AdminDashboard;