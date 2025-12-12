import { db } from "@/config/Firebase";
import {collection, addDoc, serverTimestamp} from "firebase/firestore";


export const saveStudentSubmission = async(workshopId:string, data:any) =>{
    const ref = collection(db, "workshops", workshopId, "submissions");

    await addDoc(ref,{
        ...data,
        createdAt: serverTimestamp(),
        certificateGenerated:false,
    });
};