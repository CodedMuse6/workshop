import {AuthContext} from "./AuthContext";
import type {AppUser} from "./AuthContext";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,signOut } from "firebase/auth"
// import {type User} from "firebase/auth"
import {doc , setDoc , getDoc} from 'firebase/firestore';
import {auth , db} from '../config/Firebase';
import {useEffect,useState, type ReactNode} from "react";

const AuthContextProvider = ({children} : {children : ReactNode}) => {
const[user, setUser] = useState<AppUser | null>(null);   //useState<User | null>(null);
// const[role, setRole] = useState<string | null >(null);
const[loading, setLoading] = useState<boolean>(true);

// useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (u) => {
//         setUser(u);
//         setLoading(false);
//     });
//     return() => unsubscribe();
// },[])

// check if admin already exists
const checkAdminExists = async()=>{
    const adminDoc = await getDoc(doc(db, "roles", "admin"));
    return adminDoc.exists();

    // const q = query(collection(db, "users"), where("role", "===" , "admin"));
    // const snapshot = await getDocs(q);
    // return !snapshot.empty;
};

// signup - also save role in firestore
const signUp = async(email : string , password : string , role : string) => {
// const signUp = async(email, password, role) => {
    const adminExists = await checkAdminExists();
    // if admin exists, nobady else can register as admin
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
    // const userCredential = await createUserWithEmailAndPassword(auth, email , password);
    // const user = userCredential.user;
    // await setDoc(doc(db, 'users', user.uid),{
    //     // email, role,
    //     email: user.email,
    //     role:role
    // });
};

// login
const logIn = async(email : string, password : string) => {
    // await signInWithEmailAndPassword(auth, email, password);
    const res = await signInWithEmailAndPassword(auth, email, password);
    const uid = res.user.uid;

    const userDoc = await getDoc(doc(db, "users", uid));
    const role = userDoc.data()?.role || "user";

    setUser({uid, email:res.user.email, role});

    return role;
};

// logout
const logOut = async() => {
    // await auth.signOut();
    await signOut(auth);
    setUser(null);
}

// fetchUser
// const fetchUserRole = async(userId:string) =>{
//     const userDoc = await getDoc(doc(db, 'users' , userId));
//     return userDoc.exists()?.userDoc.role;
//}

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
        //     const snap = await getDoc(doc(db, "users", u.uid));
        //     const role = snap.exists() ? snap.data().role : "user";

        //     setUser({
        //         uid: u.uid,
        //         email:u.email,
        //         role
        //     });
        // } else {
        //     setUser(null);
        // }
         setLoading(false);
         
    });
    return () => unsubscribe();
},[]);

return(
    <AuthContext.Provider value = {{user, loading, logIn, logOut, signUp}}>
     {children}
    </AuthContext.Provider>
)
}

export default AuthContextProvider
