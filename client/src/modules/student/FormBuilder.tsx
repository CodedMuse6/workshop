import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {addDoc, collection} from "firebase/firestore";
import {db} from "../../config/Firebase";
import {workshopschema} from "../student/schema/FormSchema.ts";
import type {WorkshopSchema } from "../student/schema/FormSchema.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import FormError from "../components/FormError.tsx";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';


export const FormBuilder = () => {
    const {register, handleSubmit, formState:{errors}} = useForm<WorkshopSchema>({
        resolver: zodResolver(workshopschema),
    });

    const onSubmit = async(data: WorkshopSchema) => {
        try{
        const ref = await addDoc(collection(db, "forms"),{
            ...data,
            status: "off",
            createdAt : new Date().toISOString(),
        });
        alert(`Form created with ID: ${ref.id}`);
        } catch (error) {
            alert(error);
        }
    };

    return(
 <div className='flex-justify-center items-center min-h-screen bg-gray-50'>
            <Card className="w-[400px] shadow-lg">
            <CardHeader>
                <CardTitle className="text-center text-xl font-semibold">
                    Form Builder Form
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
