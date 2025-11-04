import {Link} from "react-router-dom"

export const AdminDashboard = () => {
    return(
        <div className="p-8">
        <h1>Admin Dashboard</h1>
        <Link to = "/admin/create" className = "text-blue-600 underline">
        Create New Form
        </Link>
        </div>
    );
};