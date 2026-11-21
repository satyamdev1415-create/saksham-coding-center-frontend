import { useState } from "react";
import api from "../services/api";

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle Input Changes
    function handleChange(event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    }

    // Submit Contact Form
    async function handleSubmit(event) {
        event.preventDefault();

        setLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const response = await api.post("contact/", formData);

            console.log("Contact Response:", response.data);

            setSuccessMessage(
                "Thank you! Your message has been submitted successfully."
            );

            setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
            });

        } catch (error) {
            console.error("Contact Form Error:", error);

            setErrorMessage(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                "Unable to submit your message. Please try again."
            );

        } finally {
            setLoading(false);
        }
    }

    return (
        <div>

            {/* Page Header */}
            <section className="bg-dark text-white py-5">
                <div className="container text-center py-4">

                    <span className="badge bg-info text-dark px-3 py-2 mb-3">
                        CONTACT US
                    </span>

                    <h1 className="display-5 fw-bold">
                        Get In Touch With Us
                    </h1>

                    <p className="lead text-light mb-0">
                        Have a question about our courses? We'd love to hear from you.
                    </p>

                </div>
            </section>


            {/* Contact Content */}
            <section className="py-5">
                <div className="container py-4">

                    <div className="row g-5">

                        {/* Contact Information */}
                        <div className="col-lg-5">

                            <h2 className="fw-bold mb-3">
                                Let's Start Your Coding Journey
                            </h2>

                            <p className="text-secondary mb-4">
                                Contact Saksham Coding Center for information about
                                courses, admissions and upcoming programs.
                            </p>


                            {/* Location */}
                            <div className="card border-0 shadow-sm mb-3">
                                <div className="card-body p-4">

                                    <div className="d-flex align-items-center">

                                        <div className="fs-2 text-primary me-3">
                                            <i className="bi bi-geo-alt-fill"></i>
                                        </div>

                                        <div>
                                            <h6 className="fw-bold mb-1">
                                                Location
                                            </h6>

                                            <p className="text-secondary mb-0">
                                                Deoghar, Jharkhand, India
                                            </p>
                                        </div>

                                    </div>

                                </div>
                            </div>


                            {/* Email */}
                            <div className="card border-0 shadow-sm mb-3">
                                <div className="card-body p-4">

                                    <div className="d-flex align-items-center">

                                        <div className="fs-2 text-primary me-3">
                                            <i className="bi bi-envelope-fill"></i>
                                        </div>

                                        <div>
                                            <h6 className="fw-bold mb-1">
                                                Email
                                            </h6>

                                            <p className="text-secondary mb-0">
                                                satyamray940@gmail.com
                                            </p>
                                        </div>

                                    </div>

                                </div>
                            </div>


                            {/* Phone */}
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4">

                                    <div className="d-flex align-items-center">

                                        <div className="fs-2 text-primary me-3">
                                            <i className="bi bi-telephone-fill"></i>
                                        </div>

                                        <div>
                                            <h6 className="fw-bold mb-1">
                                                Phone
                                            </h6>

                                            <p className="text-secondary mb-0">
                                                +91 6205757906
                                            </p>
                                        </div>

                                    </div>

                                </div>
                            </div>

                        </div>


                        {/* Contact Form */}
                        <div className="col-lg-7">

                            <div className="card border-0 shadow">

                                <div className="card-body p-4 p-md-5">

                                    <h3 className="fw-bold mb-4">
                                        Send Us a Message
                                    </h3>


                                    {/* Success Message */}
                                    {successMessage && (
                                        <div className="alert alert-success">
                                            <i className="bi bi-check-circle-fill me-2"></i>
                                            {successMessage}
                                        </div>
                                    )}


                                    {/* Error Message */}
                                    {errorMessage && (
                                        <div className="alert alert-danger">
                                            <i className="bi bi-exclamation-circle-fill me-2"></i>
                                            {errorMessage}
                                        </div>
                                    )}


                                    <form onSubmit={handleSubmit}>

                                        <div className="row g-3">

                                            {/* Full Name */}
                                            <div className="col-md-6">

                                                <label className="form-label fw-semibold">
                                                    Full Name
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="Enter your name"
                                                    minLength={2}
                                                    required
                                                />

                                            </div>


                                            {/* Email */}
                                            <div className="col-md-6">

                                                <label className="form-label fw-semibold">
                                                    Email Address
                                                </label>

                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="Enter your email"
                                                    required
                                                />

                                            </div>


                                            {/* Phone */}
                                            <div className="col-md-6">

                                                <label className="form-label fw-semibold">
                                                    Phone Number
                                                </label>

                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="Enter phone number"
                                                />

                                            </div>


                                            {/* Subject */}
                                            <div className="col-md-6">

                                                <label className="form-label fw-semibold">
                                                    Subject
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    placeholder="What is this about?"
                                                    required
                                                />

                                            </div>


                                            {/* Message */}
                                            <div className="col-12">

                                                <label className="form-label fw-semibold">
                                                    Message
                                                </label>

                                                <textarea
                                                    className="form-control"
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    rows="6"
                                                    placeholder="Write your message here..."
                                                    minLength={10}
                                                    required
                                                ></textarea>

                                            </div>


                                            {/* Submit Button */}
                                            <div className="col-12">

                                                <button
                                                    type="submit"
                                                    className="btn btn-primary btn-lg w-100"
                                                    disabled={loading}
                                                >

                                                    {loading ? (
                                                        <>
                                                            <span
                                                                className="spinner-border spinner-border-sm me-2"
                                                                role="status"
                                                            ></span>

                                                            Sending...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Send Message

                                                            <i className="bi bi-send-fill ms-2"></i>
                                                        </>
                                                    )}

                                                </button>

                                            </div>

                                        </div>

                                    </form>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </section>

        </div>
    );
}

export default Contact;