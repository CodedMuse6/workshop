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

// signup - also save role in firestore
const signUp = async(email : string , password : string , role : string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email , password);
    const user = userCredential.user;
    await setDoc(doc(db, 'users', user.uid),{
        // email, role,
        email: user.email,
        role:role
    });
};

// login
const logIn = async(email : string, password : string) => {
    await signInWithEmailAndPassword(auth, email, password);
};

// logout
const logOut = async() => {
    // await auth.signOut();
    await signOut(auth);
}

// fetchUser
// const fetchUserRole = async(userId:string) =>{
//     const userDoc = await getDoc(doc(db, 'users' , userId));
//     return userDoc.exists()?.userDoc.role;
//}

// fetchuser + role
useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
        if(u){
            const snap = await getDoc(doc(db, "users", u.uid));
            const role = snap.exists() ? snap.data().role : "user";

            setUser({
                uid: u.uid,
                email:u.email,
                role
            });
        } else {
            setUser(null);
        }
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
