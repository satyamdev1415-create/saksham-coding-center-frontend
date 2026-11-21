import { Link } from "react-router-dom";

function About() {
    const features = [
        {
            icon: "bi bi-code-slash",
            title: "Practical Learning",
            description:
                "Learn programming by writing real code and building practical projects."
        },
        {
            icon: "bi bi-laptop",
            title: "Real Projects",
            description:
                "Build projects that can help you strengthen your portfolio."
        },
        {
            icon: "bi bi-people",
            title: "Student Focused",
            description:
                "A learning environment designed for students and aspiring developers."
        },
        {
            icon: "bi bi-rocket-takeoff",
            title: "Career Growth",
            description:
                "Develop practical skills and confidence for your technology journey."
        }
    ];

    return (
        <>
            <section className="py-5 bg-dark text-white">
                <div className="container py-5 text-center">

                    <span className="badge bg-info text-dark px-3 py-2 mb-3">
                        ABOUT SAKSHAM
                    </span>

                    <h1 className="display-5 fw-bold">
                        Learn. Build. Grow.
                    </h1>

                    <p className="lead text-light mx-auto mt-3">
                        Saksham Coding Center is focused on helping students
                        learn practical programming skills and build real-world projects.
                    </p>

                </div>
            </section>

            <section className="py-5">
                <div className="container py-4">

                    <div className="row align-items-center g-5">

                        <div className="col-lg-6">
                            <span className="section-label">
                                WHO WE ARE
                            </span>

                            <h2 className="fw-bold mt-3">
                                Building Future Developers
                            </h2>

                            <p className="text-secondary mt-3">
                                Saksham Coding Center aims to make practical
                                technology education accessible to students
                                and aspiring developers.
                            </p>

                            <p className="text-secondary">
                                We believe that learning programming should not
                                only be about theory. Students should practice,
                                build projects and understand how real applications
                                are created.
                            </p>

                            <Link
                                to="/courses"
                                className="btn btn-primary mt-3"
                            >
                                Explore Courses
                                <i className="bi bi-arrow-right ms-2"></i>
                            </Link>

                        </div>

                        <div className="col-lg-6">

                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-5">

                                    <div className="mb-4">
                                        <i className="bi bi-bullseye fs-1 text-primary"></i>

                                        <h3 className="fw-bold mt-3">
                                            Our Mission
                                        </h3>

                                        <p className="text-secondary mb-0">
                                            To help students develop practical
                                            programming skills through structured
                                            learning and real-world projects.
                                        </p>
                                    </div>

                                    <hr />

                                    <div>
                                        <i className="bi bi-eye fs-1 text-info"></i>

                                        <h3 className="fw-bold mt-3">
                                            Our Vision
                                        </h3>

                                        <p className="text-secondary mb-0">
                                            To build a strong learning community
                                            where students can learn technology,
                                            build projects and grow their careers.
                                        </p>
                                    </div>

                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </section>

            <section className="py-5 bg-light">
                <div className="container py-4">

                    <div className="text-center mb-5">

                        <span className="section-label">
                            WHY SAKSHAM
                        </span>

                        <h2 className="fw-bold mt-3">
                            Why Choose Saksham Coding Center?
                        </h2>

                        <p className="text-secondary">
                            Focus on practical learning and continuous growth.
                        </p>

                    </div>

                    <div className="row g-4">

                        {features.map((feature) => (
                            <div
                                className="col-md-6 col-lg-3"
                                key={feature.title}
                            >
                                <div className="card h-100 border-0 shadow-sm">

                                    <div className="card-body p-4 text-center">

                                        <i
                                            className={`${feature.icon} fs-1 text-primary`}
                                        ></i>

                                        <h5 className="fw-bold mt-3">
                                            {feature.title}
                                        </h5>

                                        <p className="text-secondary mb-0">
                                            {feature.description}
                                        </p>

                                    </div>

                                </div>
                            </div>
                        ))}

                    </div>

                </div>
            </section>

            <section className="py-5">
                <div className="container py-4 text-center">

                    <h2 className="fw-bold">
                        Start Your Coding Journey Today
                    </h2>

                    <p className="text-secondary mt-3">
                        Explore our courses and begin building your technology skills.
                    </p>

                    <Link
                        to="/courses"
                        className="btn btn-primary btn-lg mt-2"
                    >
                        View Courses
                    </Link>

                </div>
            </section>
        </>
    );
}

export default About;