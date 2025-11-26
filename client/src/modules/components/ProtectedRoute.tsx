import React, { useEffect, useState } from "react";
import {Route, Navigate} from 'react-router-dom';
import type {RouteProps} from 'react-router-dom';
import {auth, db} from "../../config/Firebase.ts";
import {getDoc, doc} from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";

interface ProtectedRouteProps extends Omit<RouteProps, 'element'> {
    // component : React.ComponentType<any>;
    element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps>= ({element, ...rest}) =>{
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [isAdmin, setIsAdmin] = useState(false);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
        if(user){
            // check is the user is an admin
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if(userDoc.exists() && userDoc.data()?.role === 'admin') {
                setIsAuthenticated(true);
                setIsAdmin(true);
            } else {
                setIsAuthenticated(true);
                setIsAdmin(false);
            } 
            } else {
                setIsAuthenticated(false);
            }
             setLoading(false);
    });
    return () => unsubscribe();
}, []);

if(loading){
    return <div>Loading...</div>
}

if(!isAuthenticated){
    // Redirect to a forbidden page if the user is authenticated but not an admin
    return <Navigate to = "/login" />;
}


if(!isAdmin){
    // Redirect to a forbidden page if the user is authenticated but not an admin
    return <Navigate to = "/forbidden" />;
}

// if authenticated and authorized, render the requested component
// return <Route {...rest} render = {(props) => <element {...props} />} />;
 return <Route {...rest} element = {element} />;

};

export default ProtectedRoute;