import { db } from "@/config/Firebase";
import {collection, addDoc, serverTimestamp} from "firebase/firestore";
import type { StudentSchema } from "../schema/StudentSchema";


export const saveStudentSubmission = async(workshopId:string, data:StudentSchema, certificateUrl: string) => {
    const ref = collection(db, "workshops", workshopId, "submissions");

    await addDoc(ref,{
        ...data,
        certificateUrl,
        createdAt: serverTimestamp(),
        certificateGenerated:true,
    });
};