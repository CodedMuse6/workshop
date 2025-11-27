// import React, { useEffect, useState } from "react";
import { Navigate} from 'react-router-dom';
// import type {Route,RouteProps} from 'react-router-dom';
// import {auth, db} from "../../config/Firebase.ts";
// import {getDoc, doc} from 'firebase/firestore';
// import { onAuthStateChanged } from "firebase/auth";
import { useAuth } from "@/Context/AuthContext.ts";

// interface ProtectedRouteProps extends Omit<RouteProps, 'element'> {
//     // component : React.ComponentType<any>;
//     element: React.ReactNode;
// }
interface ProtectedRouteProps{
    children: React.ReactNode;
    role?: "admin" | "student";
}

const ProtectedRoute = ({children, role} : ProtectedRouteProps) => {
    const {user, loading} = useAuth();

    if(loading){
    return <div>Loading...</div>
    }

    if(!user) return <Navigate to = "/admin/login" />;

    if(role && user.role !== role) return <Navigate to="/unauthorized"/>;

    return<>{children}</>;
}

// const ProtectedRoute: React.FC<ProtectedRouteProps>= ({children} : ProtectedRouteProps) =>{
// const [isAuthenticated, setIsAuthenticated] = useState(false);
// const [isAdmin, setIsAdmin] = useState(false);
// const [loading, setLoading] = useState(true);

// useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async(user) => {
//         if(user){
//             // check is the user is an admin
//             const userDoc = await getDoc(doc(db, 'users', user.uid));
//             if(userDoc.exists() && userDoc.data()?.role === 'admin') {
//                 setIsAuthenticated(true);
//                 setIsAdmin(true);
//             } else {
//                 setIsAuthenticated(true);
//                 setIsAdmin(false);
//             } 
//             } else {
//                 setIsAuthenticated(false);
//             }
//              setLoading(false);
//     });
//     return () => unsubscribe();
// }, []);

// if(loading){
//     return <div>Loading...</div>
// }

// if(!isAuthenticated){
//     // Redirect to a forbidden page if the user is authenticated but not an admin
//     return <Navigate to = "/login" />;
// }


// if(!isAdmin){
//     // Redirect to a forbidden page if the user is authenticated but not an admin
//     return <Navigate to = "/forbidden" />;
// }

// // if authenticated and authorized, render the requested component
// // return <Route {...rest} render = {(props) => <element {...props} />} />;
//  return <Route element = {children} />;

// };

export default ProtectedRoute;