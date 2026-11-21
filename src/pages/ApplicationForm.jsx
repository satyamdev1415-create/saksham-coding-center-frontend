import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import "./ApplicationForm.css";

function ApplicationForm() {
  const { slug } = useParams();

  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    city: "",
    qualification: "",
    course: "",
    message: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [submittedCourse, setSubmittedCourse] = useState("");

  // Fetch courses from Django API.
  useEffect(() => {
    let isMounted = true;

    async function fetchCourses() {
      try {
        const response = await api.get("courses/");
        const data = response.data;
        const courseList = Array.isArray(data) ? data : data.results || [];

        if (!isMounted) return;
        setCourses(courseList);

        const selectedCourse = courseList.find(
          (item) => String(item.slug) === String(slug)
        );

        if (selectedCourse) {
          setFormData((previous) => ({
            ...previous,
            course: String(selectedCourse.id),
          }));
        }
      } catch (err) {
        console.error("Courses fetch error:", err);
        if (isMounted) {
          setError(
            "Courses load nahi ho paaye. Please refresh and try again."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchCourses();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Handle input changes.
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) setError("");
  }

  // Submit application.
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!formData.course) {
      setError("Please select a course before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        qualification: formData.qualification,
        course: Number(formData.course),
        message: formData.message.trim(),
      };

      await api.post("applications/", payload);

      const selectedCourse = courses.find(
        (course) => String(course.id) === String(formData.course)
      );

      setSubmittedName(formData.full_name.trim());
      setSubmittedCourse(selectedCourse?.title || "Selected Course");
      setSuccess(true);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Application submission error:", err);
      const responseData = err.response?.data;

      if (responseData) {
        const errorMessage = Object.entries(responseData)
          .map(([field, messages]) => {
            const text = Array.isArray(messages)
              ? messages.join(", ")
              : typeof messages === "string"
                ? messages
                : JSON.stringify(messages);

            return `${field}: ${text}`;
          })
          .join(" | ");

        setError(errorMessage || "Application submit nahi ho paayi.");
      } else {
        setError("Server se connection nahi ho paaya. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  // Loading screen.
  if (loading) {
    return (
      <section className="application-page">
        <div className="application-loading">
          <div
            className="spinner-border text-primary"
            role="status"
            aria-label="Loading"
          ></div>
          <p>Preparing your application form...</p>
        </div>
      </section>
    );
  }

  // Registration success screen.
  if (success) {
    return (
      <section className="application-page">
        <div className="registration-success">
          <div className="success-animation">
            <i className="bi bi-check-lg"></i>
          </div>

          <span className="success-badge">APPLICATION RECEIVED</span>
          <h1>Registration Successful!</h1>
          <h3>Congratulations, {submittedName}! 🎉</h3>

          <p className="success-description">
            Thank you for choosing Saksham Coding Center. Your application
            has been submitted successfully.
          </p>

          <div className="submitted-course">
            <div className="course-icon">
              <i className="bi bi-mortarboard-fill"></i>
            </div>
            <div>
              <span>YOUR SELECTED COURSE</span>
              <h4>{submittedCourse}</h4>
            </div>
          </div>

          <div className="next-step-box">
            <div className="next-step-icon">
              <i className="bi bi-telephone-forward-fill"></i>
            </div>
            <div>
              <h4>What's Next?</h4>
              <p>
                Our team will contact you soon on your registered phone number
                or email to discuss your course and the next steps.
              </p>
              <p className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Please keep your phone available.
              </p>
            </div>
          </div>

          <div className="success-footer">
            <i className="bi bi-heart-fill"></i>{" "}
            We're excited to be part of your coding journey!
          </div>

          <div className="success-actions">
            <Link to="/" className="success-home-btn">
              <i className="bi bi-house-door me-2"></i>
              Back to Home
            </Link>
            <Link to="/courses" className="success-courses-link">
              Explore More Courses
              <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>

          <p className="success-brand">Saksham Coding Center</p>
        </div>
      </section>
    );
  }

  // Application form.
  return (
    <section className="application-page">
      <div className="application-container">
        <div className="application-heading">
          <span className="application-eyebrow">
            YOUR FUTURE STARTS HERE
          </span>
          <h1>
            Start Your <span>Coding Journey</span>
          </h1>
          <p>
            Fill out the form below and our team will help you take the next
            step toward your tech career.
          </p>
        </div>

        <div className="application-layout">
          {/* Left information panel */}
          <aside className="application-info">
            <div className="info-brand-icon">
              <i className="bi bi-code-slash"></i>
            </div>
            <h2>
              Learn Today.
              <br />
              Build Tomorrow.
            </h2>
            <p>
              Turn your interest in technology into practical skills with
              Saksham Coding Center.
            </p>

            <div className="info-feature">
              <i className="bi bi-laptop"></i>
              <div>
                <h4>Practical Learning</h4>
                <p>Learn by building real projects.</p>
              </div>
            </div>

            <div className="info-feature">
              <i className="bi bi-person-check"></i>
              <div>
                <h4>Guidance &amp; Support</h4>
                <p>Get guidance on your learning journey.</p>
              </div>
            </div>

            <div className="info-feature">
              <i className="bi bi-rocket-takeoff"></i>
              <div>
                <h4>Build Your Skills</h4>
                <p>Take the next step toward your tech career.</p>
              </div>
            </div>

            <div className="info-bottom">
              <i className="bi bi-shield-check me-2"></i>
              Your details will be used to process your application.
            </div>
          </aside>

          {/* Form panel */}
          <div className="application-form-card">
            <div className="form-card-heading">
              <div className="form-heading-icon">
                <i className="bi bi-person-lines-fill"></i>
              </div>
              <div>
                <h2>Course Application</h2>
                <p>Enter your details to get started.</p>
              </div>
            </div>

            {error && (
              <div className="application-error" role="alert">
                <i className="bi bi-exclamation-circle-fill"></i>
                <div>
                  <strong>Unable to continue</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-section-title">
                <span>01</span>
                Personal Information
              </div>

              <div className="application-field">
                <label htmlFor="full_name">
                  Full Name <span>*</span>
                </label>
                <div className="input-with-icon">
                  <i className="bi bi-person"></i>
                  <input
                    id="full_name"
                    type="text"
                    name="full_name"
                    placeholder="Enter your full name"
                    value={formData.full_name}
                    onChange={handleChange}
                    autoComplete="name"
                    maxLength={150}
                    required
                  />
                </div>
              </div>

              <div className="application-field">
                <label htmlFor="email">
                  Email Address <span>*</span>
                </label>
                <div className="input-with-icon">
                  <i className="bi bi-envelope"></i>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    maxLength={254}
                    required
                  />
                </div>
              </div>

              <div className="form-two-columns">
                <div className="application-field">
                  <label htmlFor="phone">
                    Phone Number <span>*</span>
                  </label>
                  <div className="input-with-icon">
                    <i className="bi bi-telephone"></i>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      placeholder="Your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                      pattern="[0-9+\-\s()]{10,20}"
                      title="Enter a valid phone number"
                      maxLength={20}
                      required
                    />
                  </div>
                </div>

                <div className="application-field">
                  <label htmlFor="city">
                    City <span>*</span>
                  </label>
                  <div className="input-with-icon">
                    <i className="bi bi-geo-alt"></i>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      placeholder="Your city"
                      value={formData.city}
                      onChange={handleChange}
                      autoComplete="address-level2"
                      maxLength={100}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section-title">
                <span>02</span>
                Course Information
              </div>

              <div className="application-field">
                <label htmlFor="qualification">
                  Highest Qualification <span>*</span>
                </label>
                <div className="select-with-icon">
                  <i className="bi bi-mortarboard"></i>
                  <select
                    id="qualification"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select your qualification</option>
                    <option value="10th">10th Pass</option>
                    <option value="12th">12th Pass</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="application-field">
                <label htmlFor="course">
                  Select Course <span>*</span>
                </label>
                <div className="select-with-icon">
                  <i className="bi bi-code-square"></i>
                  <select
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                    disabled={courses.length === 0}
                  >
                    <option value="">Choose your course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                {courses.length === 0 && (
                  <small className="field-help">
                    No courses are currently available. Please try again later.
                  </small>
                )}
              </div>

              <div className="application-field">
                <label htmlFor="message">
                  Tell Us About Your Goals{" "}
                  <span className="optional-label">(Optional)</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  placeholder="What would you like to learn? Tell us about your goals..."
                  value={formData.message}
                  onChange={handleChange}
                  maxLength={2000}
                ></textarea>
              </div>

              <div className="form-note">
                <i className="bi bi-info-circle"></i>
                <p>
                  Submitting this form does not guarantee admission. Our team
                  will contact you to discuss the next steps.
                </p>
              </div>

              <button
                type="submit"
                className="application-submit-btn"
                disabled={submitting || courses.length === 0}
              >
                {submitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                    ></span>
                    Submitting Application...
                  </>
                ) : (
                  <>
                    Submit Application
                    <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>

              <p className="secure-note">
                <i className="bi bi-shield-lock-fill"></i>
                Please provide accurate contact information.
              </p>
            </form>

            <div className="form-back-link">
              <Link to="/courses">
                <i className="bi bi-arrow-left"></i>
                Back to All Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ApplicationForm;