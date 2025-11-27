import {useEffect, useState} from "react";
import type {ReactNode} from "react";
import {FormContext } from "./FormContext.ts";
import type { WorkshopData } from "./FormContext.ts";
import { useAuth } from "./AuthContext.ts";
import { generateRandomLink } from "@/utils/generateId.ts";
import { addDoc, Timestamp , collection,query, where, getDocs} from "firebase/firestore";
import { db } from "@/config/Firebase.ts";


const FormContextProvider = ({children} : {children : ReactNode}) => {
const {user} = useAuth();
// const [formStatus, setFormStatus] = useState(false);
const [formData, setFormData] = useState<WorkshopData[]>([]);
    // collegeName : "",
    // workshopName : "",
    // date : "",
    // time : "",
    // instructions : "",
    // studentEmail : "",
// });

const fetchForms = async() =>{
    if(!user) return;
    const q = query(collection(db, "workshops"), where("createdBy", "==", user.uid));
    const snapshot = await getDocs(q);
    const list : WorkshopData[] = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()} as WorkshopData));
    setFormData(list);
}

const createForm = async(form:Omit<WorkshopData, "id" | "linkId" | "createdAt" | "createdBy">) =>{
    if(!user) return;
    const linkId = generateRandomLink(12);
    await addDoc(collection(db, "workshops"),{
        ...form,
        status: "off",
        linkId,
        createdBy: user.uid,
        createdAt: Timestamp.now(),
    });
    fetchForms();
};

const toggleStatus = async(formId: string, newStatus: "on" | "off") => {
    const docRef = collection(db, "workshops").doc(formId);
    await db.collection("workshops").doc(formId).update({status: newStatus});
    fetchForms();
};

useEffect(() => {
    if(user) fetchForms();
}, [user]);

// const updateFormData = (data:WorkshopData) =>{
//     setFormData(data);
// };

// const toggleFormStatus = () =>{
//     setFormStatus((prevStatus) => !prevStatus);
// };

return(
    <FormContext.Provider value = {{formData, createForm, fetchForms, toggleStatus }}> //formStatus
        {children}
    </FormContext.Provider>
);
};

export default FormContextProvider;