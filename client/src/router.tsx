import { createBrowserRouter } from "react-router-dom";
import AdminLogin from "./modules/auth/pages/AdminLogin";
import { AdminDashboard } from "./modules/auth/pages/AdminDashboard";
import CreateForm from "./modules/auth/pages/CreateForm";
import FeedbackForm  from "./modules/student/Pages/FeedbackForm";
import ProtectedRoute from "./modules/components/ProtectedRoute";
import Home from "./pages/Home";
import Forbidden from "./modules/auth/pages/Forbidden";

export const router = createBrowserRouter([
    {
        path: "/", 
        element: <Home/>
    },
     {
        path: "/unauthorized",
        element: <Forbidden/>
    },
    {
        path:"/admin/login",
        element:<AdminLogin/>
    },
    {
        path:"/admin",
        element:(
            <ProtectedRoute role = "admin">
                <AdminDashboard />
            </ProtectedRoute>
        )
    },
    {
        path:"/admin/forms/create",
        element:(
            <ProtectedRoute role = "admin">
                <CreateForm/>
            </ProtectedRoute>
        )
    },
    {
        path:"/form/:linkId",
        element:<FeedbackForm />
    },
])