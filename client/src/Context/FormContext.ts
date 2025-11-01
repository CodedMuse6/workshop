import { createContext, useContext } from "react";

export type WorkshopData = {
    collegeName : string;
    workshopName : string;
    date : string;
    time : string;
    instructions : string;
    studentEmail : string;
}

export type WorkshopContextType = {
    formData : WorkshopData[];
    updateFormData : (data : WorkshopData) => void;
    formStatus : boolean;
    toggleFormStatus : () => void;
}

// create context
export const FormContext = createContext<WorkshopContextType | undefined>(undefined);

// consumer
export const useFormDataContext = () =>{
    const contexts = useContext(FormContext);
    if(!contexts){
        throw new Error('useFormDataContext must be used within a Provider')   
    }
    return contexts;
}