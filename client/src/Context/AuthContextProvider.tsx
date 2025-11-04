import {AuthContext} from "./AuthContext";
import { onAuthStateChanged } from "firebase/auth"
import {type User} from "firebase/auth"
// import {doc , setDoc , getDoc} from 'firebase/firestore';
import {auth} from '../config/Firebase';
import {useEffect,useState, type ReactNode} from "react";

const AuthContextProvider = ({children} : {children : ReactNode}) => {
const[user, setUser] = useState<User | null>(null);
// const[role, setRole] = useState<string | null >(null);
const[loading, setLoading] = useState<boolean>(true);

useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) =>{
        setUser(u);
        setLoading(false);
    });
    return() => unsubscribe();
},[])

// signup
// const signUp = async(email : string , password : string , role : string) => {
//     const userCredential = await createUserWithEmailAndPassword(auth, email , password);
//     const user = userCredential.user;
//     await setDoc(doc(db, 'users', user.uid),{
//         email, role,
//     })
// }

// login
// const logIn = async(email : string, password : string) => {
//     await signInWithEmailAndPassword(auth, email, password);
// }

// logout
// const logOut = async() => {
//     await auth.signOut();
// }

// fetchUser
// const fetchUserRole = async(userId:string) =>{
//     const userDoc = await getDoc(doc(db, 'users' , userId));
//     return userDoc.exists()?.userDoc.role;
// }

return(
    <AuthContext.Provider value = {{user, loading}}>
     {children}
    </AuthContext.Provider>
)

}

export default AuthContextProvider
