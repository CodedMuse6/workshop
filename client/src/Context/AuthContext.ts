import { createContext , useContext } from "react";
import User  from 'firebase/auth';

type User = {
    uid : string;
    email : string;
    role : 'admin' | 'user'
}

export type AdminType = {
    user : User | null;
    logIn : (email : string, password : string) => void;
    signUp : (email : string, password : string, role : string) => void;
    logOut : () => void;
    loading : boolean;
    isAdmin : boolean;
}

// createContext
export const AuthContext = createContext<AdminType | undefined>(undefined);

// consumer
export const useAuth = () =>{
    // return useContext(AdminContext)
    const contexts = useContext(AuthContext);
    if(!contexts){
        throw new Error('useAdmin must be used within a Provider')
    }
    return contexts;
}