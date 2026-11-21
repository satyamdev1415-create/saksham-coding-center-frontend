import { NavLink } from "react-router-dom";

function AdminSidebar() {
    const menuItems = [
        { name: "Dashboard", path: "/admin", icon: "📊" },
        { name: "Courses", path: "/admin/courses", icon: "📚" },
        { name: "Faculty", path: "/admin/faculty", icon: "👨‍🏫" },
        { name: "Applications", path: "/admin/applications", icon: "📝" },
        { name: "Students", path: "/admin/students", icon: "🎓" },
        { name: "Contact Messages", path: "/admin/contact-messages", icon: "✉️" },
    ];

    return (
        <div className="bg-dark text-white min-vh-100 p-3">
            <h4 className="text-center mb-4">Saksham Admin</h4>

            <hr />

            {menuItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/admin"}
                    className={({ isActive }) =>
                        `d-block text-decoration-none p-3 rounded mb-2 ${
                            isActive ? "bg-primary text-white" : "text-white"
                        }`
                    }
                >
                    {item.icon} {item.name}
                </NavLink>
            ))}
        </div>
    );
}

export default AdminSidebar;