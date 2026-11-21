import { Outlet } from "react-router-dom"
import AdminSidebar from "../components/admin/AdminSidebar"

function AdminLayout() {
return (
    <div className="d-flex">
        <div style={{width:"250px" , flexShrink: 0}}>
            <AdminSidebar />
        </div>

        <main className="flex-grow-1  bg-light min-vh-100">
            <Outlet />
        </main>
        
    </div>
)
}

export default AdminLayout
