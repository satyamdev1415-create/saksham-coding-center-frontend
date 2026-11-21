import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Faculty.css";

function Faculty() {
const [faculty, setFaculty] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

    useEffect(() => {
    api
        .get("faculty/")
        .then((response) => {
        const data = response.data;
        const members = Array.isArray(data) ? data : data.results || [];

        setFaculty(members.filter((member) => member.is_active));
        })
        .catch(() => {
        setError("Unable to load faculty. Please try again later.");
        })
        .finally(() => {
        setLoading(false);
        });
    }, []);

const getPhotoUrl = (photo) => {
    if (!photo) return "";

    if (photo.startsWith("http")) return photo;

    const baseURL = (api.defaults.baseURL || "").replace(/\/api\/?$/, "");

    return `${baseURL}${photo.startsWith("/") ? "" : "/"}${photo}`;
};

    const leadership = faculty.filter((member) =>
    /ceo|founder|director|principal|managing director/i.test(
        member.designation || ""
    )
    );

    const instructors = faculty.filter(
    (member) => !leadership.includes(member)
    );

    const FacultyCard = ({ member }) => {
    const [imageError, setImageError] = useState(false);

    const initials = member.name
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();

    return (
    <article className="faculty-card">
        <div className="faculty-image-wrapper">
        {member.photo && !imageError ? (
            <img
                src={getPhotoUrl(member.photo)}
                alt={member.name}
                className="faculty-photo"
                onError={() => setImageError(true)}
            />
            ) : (
            <div className="faculty-avatar">{initials}</div>
            )}
        </div>

        <div className="faculty-card-content">
            <span className="faculty-designation">
            {member.designation}
            </span>

            <h3>{member.name}</h3>

            {member.qualification && (
            <p className="faculty-detail">
                🎓 {member.qualification}
            </p>
            )}

            {member.experience && (
            <p className="faculty-detail">
                💼 {member.experience} Experience
            </p>
            )}

            {member.bio && <p className="faculty-bio">{member.bio}</p>}

            {Array.isArray(member.skills) && member.skills.length > 0 && (
            <div className="faculty-skills">
                {member.skills.map((skill, index) => (
                <span key={index}>{skill}</span>
                ))}
            </div>
            )}

            <div className="faculty-social-links">
            {member.linkedin_url && (
                <a
                href={member.linkedin_url}
                target="_blank"
                rel="noreferrer"
                >
                LinkedIn ↗
                </a>
            )}

            {member.github_url && (
                <a
                href={member.github_url}
                target="_blank"
                rel="noreferrer"
                >
                GitHub ↗
                </a>
            )}
            </div>
        </div>
        </article>
    );
    };

return (
    <main className="faculty-page">
        <section className="faculty-hero">
        <div className="faculty-container">
            <span className="faculty-eyebrow">
            SAKSHAM CODING CENTER
            </span>
    
            <h1>
            Meet Our <span>Expert Team</span>
            </h1>

            <p>
            Meet our leadership team and experienced instructors.
            Learn programming, develop practical skills, and build your future
            with Saksham Coding Center.
            </p>

            <div className="faculty-stats">
            <div>
                <h2>{faculty.length}</h2>
                <p>Team Members</p>
            </div>

            <div>
                <h2>💻</h2>
                <p>Technology Experts</p>
            </div>

            <div>
                <h2>🚀</h2>
                <p>Future Ready</p>
            </div>
            </div>
        </div>
        </section>

        <section className="faculty-container faculty-main">
        {loading && <p className="faculty-message">Loading faculty...</p>}

        {!loading && error && (
            <p className="faculty-message faculty-error">{error}</p>
        )}

        {!loading && !error && faculty.length === 0 && (
            <div className="faculty-message">
            <h2>Our Team Is Growing!</h2>
            <p>Faculty profiles will appear here soon.</p>
            </div>
        )}

        {!loading && !error && leadership.length > 0 && (
            <section className="faculty-section">
            <div className="faculty-section-heading">
                <span>LEADERSHIP</span>
                <h2>Our Leadership Team</h2>
                <p>The people guiding our vision and direction.</p>
            </div>

            <div className="faculty-grid">
                {leadership.map((member) => (
                <FacultyCard key={member.id} member={member} />
                ))}
            </div>
            </section>
        )}

        {!loading && !error && instructors.length > 0 && (
            <section className="faculty-section">
            <div className="faculty-section-heading">
                <span>OUR EDUCATORS</span>
                <h2>Meet Our Faculty</h2>
                <p>Learn from our instructors and technology professionals.</p>
            </div>

            <div className="faculty-grid">
                {instructors.map((member) => (
                <FacultyCard key={member.id} member={member} />
                ))}
            </div>
            </section>
        )}
        </section>

        <section className="faculty-cta">
        <div className="faculty-container faculty-cta-inner">
            <div>
            <h2>Ready to Start Your Coding Journey?</h2>
            <p>Explore our courses and start learning today.</p>
            </div>

            <Link to="/courses" className="faculty-btn">
            Explore Courses →
            </Link>
        </div>
        </section>
    </main>
    );
}

export default Faculty;