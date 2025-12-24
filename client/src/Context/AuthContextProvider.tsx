import {AuthContext} from "./AuthContext";
import type {AppUser} from "./AuthContext";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,signOut, deleteUser } from "firebase/auth"
import {doc , setDoc , getDoc, deleteDoc} from 'firebase/firestore';
import {auth , db} from '../config/Firebase';
import {useEffect,useState, type ReactNode} from "react";

const AuthContextProvider = ({children} : {children : ReactNode}) => {
const[user, setUser] = useState<AppUser | null>(null);
const[loading, setLoading] = useState<boolean>(true);


// check if admin already exists
const checkAdminExists = async()=>{
    const adminDoc = await getDoc(doc(db, "roles", "admin"));
    return adminDoc.exists();
};

// signup - also save role in firestore
const signUp = async(email : string , password : string , role : string) => {
    const adminExists = await checkAdminExists();
    if(role === "admin" && adminExists){
        throw new Error("Admin already exists");
    }

    // create firebase user
    const res = await createUserWithEmailAndPassword(auth, email , password);
    const uid = res.user.uid;

    // store user role in firestore
    await setDoc(doc(db, "users", uid), {email,role});

    // if role is admin store single-admin flag
    if(role === "admin"){
        await setDoc(doc(db, "roles", "admin"),{uid});
    }

    return role;
};

// login
const logIn = async(email : string, password : string) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const uid = res.user.uid;

    const userDoc = await getDoc(doc(db, "users", uid));
    const role = userDoc.data()?.role || "user";

    setUser({uid, email:res.user.email, role});

    return role;
};

// logout
const logOut = async() => {
    await signOut(auth);
    setUser(null);
};

// deleteAdmin function
const deleteAdmin = async(uid:string) => {
    try{
        const user = auth.currentUser;
        if(user){
            await deleteUser(user);
        }

        await deleteDoc(doc(db, "users", uid));
        await deleteDoc(doc(db, "roles", "admin"));

        console.log("Admin deleted successfully");
    } catch(error){
        console.error("Error deleting admin:", error);
    }
};

// fetchuser + role
useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if(!firebaseUser){
            setUser(null);
            setLoading(false);
            return;
        }
        const uid = firebaseUser.uid;
        const userDoc = await getDoc(doc(db, "users", uid));
        const role = userDoc.data()?.role || "user";
        setUser({uid, email:firebaseUser.email, role});
         setLoading(false);

    });
    return () => unsubscribe();
},[]);

return(
    <AuthContext.Provider value = {{user, loading, logIn, logOut, signUp, deleteAdmin}}>
     {children}
    </AuthContext.Provider>
)
}

export default AuthContextProvider
