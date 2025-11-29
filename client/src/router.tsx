import { createBrowserRouter } from "react-router-dom";
import AdminLogin from "./modules/auth/pages/AdminLogin";
import AdminSignUp from "./modules/auth/pages/AdminSignUp";
import { AdminDashboard } from "./modules/auth/pages/AdminDashboard";
import CreateForm from "./modules/auth/pages/CreateForm";
// import  {ViewForms}  from "./modules/auth/pages/ViewForms";
import FeedbackForm  from "./modules/student/Pages/FeedbackForm";
// import { SubmissionSuccess } from "./modules/student/Pages/SubmissionSuccess";
import ProtectedRoute from "./modules/components/ProtectedRoute";

export const router = createBrowserRouter([
    {
        path: "/admin/login",
        element: <AdminLogin />
    },
    {
        path:"/admin/signup",
        element:<AdminSignUp/>
    },
    {
        path:"/", //admin
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
    // {
    //     path:"/admin/forms",
    //     element:(
    //         <ProtectedRoute role = "admin">
    //             <ViewForms />
    //         </ProtectedRoute>
    //     )
    // },
    {
        path:"/form/:linkId",
        element:<FeedbackForm />
    },
    // {
    //     path:"/submitted",
    //     element:<SubmissionSuccess/>
    // }
])