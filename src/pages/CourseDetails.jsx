import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import "./CourseDetails.css";

export default function CourseDetails() {
  const { slug } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openModule, setOpenModule] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchCourse() {
      try {
        const response = await api.get("courses/");
        const data = response.data;

        const courses = Array.isArray(data)
          ? data
          : data.results || [];

        const selectedCourse = courses.find(
          (item) => item.slug === slug && item.is_active
        );

        if (!selectedCourse) {
          throw new Error("Course not found.");
        }

        if (isMounted) {
          setCourse(selectedCourse);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.message === "Course not found."
              ? err.message
              : "Course load nahi ho paya. Please try again."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchCourse();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="course-details-page">
        <div className="course-state">
          <div className="course-spinner"></div>
          <p>Loading course details...</p>
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="course-details-page">
        <div className="course-state">
          <h2>Course Not Found</h2>
          <p>{error || "This course is unavailable."}</p>
          <Link to="/courses" className="course-btn">
            Explore Courses
          </Link>
        </div>
      </main>
    );
  }

  const outcomes = course.learning_outcomes || [];
  const prerequisites = course.prerequisites || [];
  const curriculum = course.curriculum || [];
  const projects = course.projects || [];
  const faqs = course.faqs || [];

  return (
    <main className="course-details-page">
      <section className="course-hero">
        <div className="course-container course-hero-grid">
          <div className="course-hero-content">
            <Link to="/courses" className="course-back-link">
              ← All Courses
            </Link>

            <span className="course-eyebrow">
              SAKSHAM CODING CENTER
            </span>

            <h1>{course.title}</h1>

            <p className="course-description">
              {course.description}
            </p>

            <div className="course-hero-meta">
              <span>🕒 {course.duration || "Flexible Duration"}</span>
              <span>
                💻 {curriculum.length || "Multiple"} Learning Modules
              </span>
            </div>

            <div className="course-hero-actions">
              <Link
                to={`/apply/${course.slug}`}
                className="course-btn"
              >
                Enroll Now →
              </Link>

              <a href="#curriculum" className="course-btn-outline">
                View Curriculum
              </a>
            </div>
          </div>

          <div className="course-summary-card">
            <div className="course-summary-icon">🎓</div>

            <span className="course-summary-label">
              COURSE OVERVIEW
            </span>

            <h2>{course.title}</h2>

            <div className="course-summary-row">
              <span>Duration</span>
              <strong>{course.duration || "Contact Us"}</strong>
            </div>

            <div className="course-summary-row">
              <span>Course Fee</span>
              <strong>
                {Number(course.fee) > 0
                  ? `₹${Number(course.fee).toLocaleString("en-IN")}`
                  : "Contact Us"}
              </strong>
            </div>

            <div className="course-summary-row">
              <span>Course Status</span>
              <strong className="course-active-status">
                {course.is_active ? "Available" : "Unavailable"}
              </strong>
            </div>

            <Link
              to={`/apply/${course.slug}`}
              className="course-btn course-btn-full"
            >
              Apply for This Course
            </Link>

            <p className="course-summary-note">
              Start learning and build practical skills.
            </p>
          </div>
        </div>
      </section>

      <section className="course-container course-main-content">
        <div className="course-content-column">
          <section className="course-section">
            <span className="course-section-label">INTRODUCTION</span>
            <h2>About This Course</h2>

            <p className="course-body-text">
              {course.overview ||
                course.description ||
                "Course information will be updated soon."}
            </p>
          </section>

          <section className="course-section">
            <span className="course-section-label">WHAT YOU WILL LEARN</span>
            <h2>Learning Outcomes</h2>

            {outcomes.length > 0 ? (
              <div className="course-outcomes-grid">
                {outcomes.map((outcome, index) => (
                  <div className="course-outcome" key={index}>
                    <span className="course-check">✓</span>
                    <span>
                      {typeof outcome === "string"
                        ? outcome
                        : outcome.title || outcome.name || ""}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="course-muted-text">
                Learning outcomes will be announced soon.
              </p>
            )}
          </section>

          <section className="course-section" id="curriculum">
            <span className="course-section-label">YOUR LEARNING PATH</span>
            <h2>Course Curriculum</h2>

            <p className="course-section-description">
              Explore the modules included in this course.
            </p>

            {curriculum.length > 0 ? (
              <div className="course-curriculum">
                {curriculum.map((module, index) => {
                  const title =
                    typeof module === "string"
                      ? module
                      : module.title || `Module ${index + 1}`;

                  const topics =
                    typeof module === "object"
                      ? module.topics || module.lessons || []
                      : [];

                  const isOpen = openModule === index;

                  return (
                    <div className="course-module" key={index}>
                      <button
                        type="button"
                        className={`course-module-header ${
                          isOpen ? "is-open" : ""
                        }`}
                        onClick={() =>
                          setOpenModule(isOpen ? null : index)
                        }
                        aria-expanded={isOpen}
                      >
                        <span className="course-module-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="course-module-title">
                          {title}
                        </span>

                        <span className="course-module-toggle">
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="course-module-content">
                          {topics.length > 0 ? (
                            <ul>
                              {topics.map((topic, topicIndex) => (
                                <li key={topicIndex}>
                                  {typeof topic === "string"
                                    ? topic
                                    : topic.title || topic.name || ""}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>
                              Detailed topics for this module will be
                              announced soon.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="course-muted-text">
                Curriculum will be updated soon.
              </p>
            )}
          </section>

          <section className="course-section">
            <span className="course-section-label">PRACTICAL EXPERIENCE</span>
            <h2>Projects You Can Build</h2>

            {projects.length > 0 ? (
              <div className="course-projects-grid">
                {projects.map((project, index) => {
                  const title =
                    typeof project === "string"
                      ? project
                      : project.title || `Project ${index + 1}`;

                  const description =
                    typeof project === "object"
                      ? project.description || ""
                      : "";

                  return (
                    <article className="course-project-card" key={index}>
                      <span className="course-project-number">
                        PROJECT {String(index + 1).padStart(2, "0")}
                      </span>

                      <h3>{title}</h3>

                      <p>
                        {description ||
                          "Build practical skills through hands-on learning."}
                      </p>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="course-muted-text">
                Projects will be announced soon.
              </p>
            )}
          </section>

          <section className="course-section">
            <span className="course-section-label">GETTING STARTED</span>
            <h2>Prerequisites</h2>

            {prerequisites.length > 0 ? (
              <ul className="course-prerequisites">
                {prerequisites.map((item, index) => (
                  <li key={index}>
                    <span>✓</span>
                    {typeof item === "string"
                      ? item
                      : item.title || item.name || ""}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="course-muted-text">
                Contact us to learn about the prerequisites for this course.
              </p>
            )}
          </section>

          <section className="course-section">
            <span className="course-section-label">HAVE QUESTIONS?</span>
            <h2>Frequently Asked Questions</h2>

            {faqs.length > 0 ? (
              <div className="course-faq-list">
                {faqs.map((faq, index) => {
                  const question =
                    typeof faq === "string"
                      ? faq
                      : faq.question || faq.title || "";

                  const answer =
                    typeof faq === "object" ? faq.answer || "" : "";

                  const isOpen = openFaq === index;

                  return (
                    <div className="course-faq-item" key={index}>
                      <button
                        type="button"
                        className="course-faq-question"
                        onClick={() =>
                          setOpenFaq(isOpen ? null : index)
                        }
                        aria-expanded={isOpen}
                      >
                        <span>{question}</span>
                        <span>{isOpen ? "−" : "+"}</span>
                      </button>

                      {isOpen && (
                        <div className="course-faq-answer">
                          {answer ||
                            "Please contact Saksham Coding Center for more information."}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="course-muted-text">
                Have questions? Contact us for more information about this
                course.
              </p>
            )}
          </section>
        </div>

        <aside className="course-sidebar">
          <div className="course-sidebar-card">
            <span className="course-section-label">READY TO BEGIN?</span>
            <h3>Start Your Learning Journey</h3>

            <p>
              Take the next step towards learning new skills with Saksham
              Coding Center.
            </p>

            <Link
              to={`/apply/${course.slug}`}
              className="course-btn course-btn-full"
            >
              Apply Now →
            </Link>

            <Link to="/courses" className="course-sidebar-link">
              Browse Other Courses
            </Link>
          </div>
        </aside>
      </section>

      <section className="course-bottom-cta">
        <div className="course-container course-bottom-cta-inner">
          <div>
            <span>SAKSHAM CODING CENTER</span>
            <h2>Ready to take the next step?</h2>
            <p>Explore your interests and start building practical skills.</p>
          </div>

          <Link
            to={`/apply/${course.slug}`}
            className="course-btn course-btn-light"
          >
            Apply for {course.title} →
          </Link>
        </div>
      </section>
    </main>
  );
}