import {useEffect, useState, useCallback} from "react";
import type {ReactNode} from "react";
import {FormContext } from "./FormContext.ts";
import type { WorkshopData } from "./FormContext.ts";
import { useAuth } from "./AuthContext.ts";
import { generateRandomLink } from "@/utils/generateId.ts";
import { addDoc, Timestamp , collection,query, where, getDocs, doc,updateDoc} from "firebase/firestore";
import { db } from "@/config/Firebase.ts";


const FormContextProvider = ({children} : {children : ReactNode}) => {
const {user} = useAuth();
const [formData, setFormData] = useState<WorkshopData[]>([]);
   
const fetchForms = useCallback(async() =>{
    if(!user) return;
    const q = query(collection(db, "workshops"), where("createdBy", "==", user.uid));
    const snapshot = await getDocs(q);
    const list : WorkshopData[] = snapshot.docs.map((docItem) => ({id: docItem.id, ...(docItem.data() as Omit<WorkshopData, "id">),}));
    setFormData(list);
},[user]);

const createForm = useCallback(async(form:Omit<WorkshopData, "id" | "linkId" | "createdAt" | "createdBy">) =>{
    if(!user) return;
    const linkId = generateRandomLink(12);
    await addDoc(collection(db, "workshops"),{
        ...form,
        status: "off",
        linkId,
        createdBy: user.uid,
        createdAt: Timestamp.now(),
    });
   await fetchForms();
},[user,fetchForms]);

const toggleStatus = useCallback(async(formId: string, newStatus: "on" | "off") => {
    const docRef = doc(db, "workshops", formId);
    await updateDoc(docRef, {status: newStatus});
    await fetchForms(); 
},[fetchForms]);

useEffect(() => {
    if(user) fetchForms();
}, [user, fetchForms]);


return(
    <FormContext.Provider value = {{formData, fetchForms, createForm, toggleStatus }}> 
        {children}
    </FormContext.Provider>
);
};

export default FormContextProvider;