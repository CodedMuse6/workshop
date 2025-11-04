import { useParams } from "react-router-dom";
import {doc, getDoc, addDoc, collection} from "firebase/firestore";
import {db} from "../config/Firebase.ts";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {studentschema} from "../modules/student/schema/StudentSchema.ts"
import type { StudentSchema } from "../modules/student/schema/StudentSchema.ts";

export const StudentForm = () => {
    const {formId} = useParams();
    const [form, setForm] = useState<any>(null);
    const {register,handleSubmit} = useForm<StudentSchema>({
      resolver : zodResolver(studentschema),
    });

    useEffect(() => {
    const fetch =  async () =>{
        const docSnap = await getDoc(doc(db, "forms", formId!));
        setForm(docSnap.data());
    };
    fetch();
    }, [formId]);

    const onSubmit = async (data: StudentSchema) => {
        await addDoc(collection(db, `forms/${formId}/submissions`), data);
        alert("Feedback submitted");
    };

    if(!form) return <p>Loading...</p>

  return (
    // <div className="p-8">
    //   <h1>{form.workshopName}</h1>
    //   <p>{form.collegeName}</p>
    //   <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
    //     <input {...register("name")} placeholder="Your Name" />
    //     <input {...register("course")} placeholder="Your Course" />
    //     <input {...register("phone")} placeholder="Phone" />
    //     <input {...register("email")} placeholder="Email" />
    //     <textarea {...register("feedback")} placeholder="Feedback" />
    //     <button type="submit" className="bg-green-500 text-white p-2">Submit</button>
    //   </form>
    // </div>
  );
}