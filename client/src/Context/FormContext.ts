import type { Timestamp } from "firebase/firestore";
import { createContext, useContext } from "react";

export type WorkshopData = {
    id?: string;
    collegeName : string;
    workshopName : string;
    date : string;
    time : string;
    instructions : string;
    studentEmail : string;
    status: "on" | "off";
    linkId: string;
    createdBy: string;
    createdAt: Timestamp;
}

export type WorkshopContextType = {
    // formData : WorkshopData;
    // updateFormData : (data : WorkshopData) => void;
    // formStatus : boolean;
    // toggleFormStatus : () => void;

    formData : WorkshopData[];
    createForm : (form: Omit<WorkshopData, "id" | "linkId" | "createdAt" | "createdBy">) => Promise<void>;
    fetchForms : () => Promise<void>;
    toggleStatus : (formId: string, newStatus: "on" | "off") => Promise<void>;
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