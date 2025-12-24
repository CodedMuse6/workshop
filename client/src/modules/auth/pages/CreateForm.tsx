import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import type { WorkshopSchema } from "@/modules/student/schema/FormSchema";
import { workshopschema } from "@/modules/student/schema/FormSchema";
import { useFormDataContext } from "@/Context/FormContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import FormError from "@/modules/components/FormError";
import { Card, CardContent, CardHeader, CardTitle  } from "@/components/ui/card";
import  { v4 as uuidv4} from "uuid";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/config/Firebase";


const CreateForm = () => {
    const {createForm} = useFormDataContext();
    const {register,handleSubmit, formState:{errors}} = useForm<WorkshopSchema>({
        resolver:zodResolver(workshopschema),
    });

    const onSubmit = async(data: WorkshopSchema) => {
        try{
            // genearate unique link
            const uniqueLink = ` http://localhost:5173/feedback/${uuidv4()}`;
            const docRef = await addDoc(collection(db, "workshops"),{
              ...data,
              link:uniqueLink,
              createdAt: new Date(),  
            });
            alert("Workshop created! Feedback link: " + uniqueLink)
        } catch(err){
         console.error(err);
        }
      
        // await createForm(data);
       
        // alert("Workshop form created successfully!");
    };

    return(
     <div className='flex justify-center items-center min-h-screen bg-gray-50'>
            <Card className="w-[400px] shadow-lg">
            <CardHeader>
                <CardTitle className="text-center text-xl font-semibold">
                Create Workshop Form
                </CardTitle>
            </CardHeader>
        <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className = "flex flex-col gap-4">
            
            <div>
            <Label htmlFor = "collegeName">College Name</Label>
            <Input
            id="collegeName"
            type="text"
            placeholder="Your College Name"
            {...register("collegeName")}
            />
            <FormError message={errors.collegeName?.message}/>
            </div>

            <div>
                <Label htmlFor = "workshopName">Workshop Name</Label>
                <Input
                id = "workshopName"
                type = "text"
                placeholder = "Workshop Name"
                {...register("workshopName")}
                />
               <FormError message = {errors.workshopName?.message}/>
            </div> 

             <div>
                <Label htmlFor = "date">Date</Label>
                <Input
                id = "date"
                type = "date"
                {...register("date")}
                />
               <FormError message = {errors.date?.message}/>
            </div> 

             <div>
                <Label htmlFor = "time">Time</Label>
                <Input
                id = "time"
                type = "time"
                {...register("time")}
                />
               <FormError message = {errors.time?.message}/>
            </div>

             <div>
                <Label htmlFor = "instructions">Instructions</Label>
                <Input
                id = "instructions"
                type = "text"
                placeholder = "Instructions"
                {...register("instructions")}
                />
               <FormError message = {errors.instructions?.message}/>
            </div>

            {/* Submit button */}
            <Button type="submit" className = "w-full font-semibold">Create</Button> 
        </form>
         </CardContent>
          </Card>
          </div>
    )
}

export default CreateForm

