import { useParams } from "react-router-dom";
import {doc, getDoc, addDoc, collection} from "firebase/firestore";
import {db} from "../config/Firebase.ts";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {studentschema} from "../modules/student/schema/StudentSchema.ts"
import type { StudentSchema } from "../modules/student/schema/StudentSchema.ts";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import FormError from "./../modules/components/FormError.tsx";
import { Button } from "@/components/ui/button.tsx";

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
    <div className='flex-justify-center items-center min-h-screen bg-gray-50'>
            <Card className="w-[400px] shadow-lg">
            <CardHeader>
                <CardTitle className="text-center text-xl font-semibold">
                   {form.workshopName}
                   {form.collegeName}
                </CardTitle>
            </CardHeader>
        <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className = "flex flex-col gap-4">
            <div>
            <Label htmlFor = "studentName">Student Name </Label>
            <Input
            id="studentName"
            type="text"
            placeholder="Your Name"
            {...register("studentName")}
            />
            <FormError message={errors.studentName?.message}/>
            </div>

            <div>
                <Label htmlFor = "course">Your Course</Label>
                <Input
                id = " course"
                type = "text"
                placeholder = "Your Course"
                {...register("course")}
                />
               <FormError message = {errors.course?.message}/>
            </div> 

             <div>
                <Label htmlFor = "phone">Phone</Label>
                <Input
                id = "phone"
                type = "number"
                {...register("phone")}
                />
                <FormError message = {errors.phone?.message}/>
            </div> 

             <div>
                <Label htmlFor = "email">Email</Label>
                <Input
                id = "email"
                type = "email"
                {...register("email")}
                />
               <FormError message = {errors.email?.message}/>
            </div>

             <div>
                <Label htmlFor = "feedback">Feedback</Label>
                <Input
                id = "feedback"
                type = "text"
                placeholder = "Your Feedback"
                {...register("feedback")}
                />
               <FormError message = {errors.feedback?.message}/>
            </div>

            {/* Submit button */}
            <Button type="submit" className = "w-full font-semibold bg-green-500 text-white p-2">Submit</Button> 
        </form>
         </CardContent>
          </Card>
          </div>
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