import { createContext , useContext } from "react";
import { type User } from "firebase/auth";

// extend firebase's User type to optionally include a role
// export type AppUser = User & {role?: string};

// type User = {
//     uid : string;
//     email : string;
//     role : 'admin' | 'user'
// }

interface AuthContextType{
    user : User | null;
    loading :  boolean;
}

// export type AdminType = {
//     // user : AppUser | null;
//     user : User | null; 
//     role : string | null;
//     logIn : (email : string, password : string) => void;
//     signUp : (email : string, password : string, role : string) => void;
//     logOut : () => void;
//     loading : boolean;
//     isAdmin : boolean;
// }

// createContext
export const AuthContext = createContext<AuthContextType>({user : null, loading:true});

// consumer
export const useAuth = () =>{
    // return useContext(AdminContext)
    const contexts = useContext(AuthContext);
    if(!contexts){
        throw new Error('useAdmin must be used within a Provider')
    }
    return contexts;
}