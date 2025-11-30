import { useState } from "react";
import  { useForm } from "react-hook-form";
import { authschema } from "../schema/AuthSchema.ts";
import type { AuthSchema } from "../schema/AuthSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/Context/AuthContext.ts";
import {Link, useNavigate} from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import FormError from "../../components/FormError.tsx";
import {Eye, EyeOff} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';

const AdminSignUp = () =>{
const {signUp} = useAuth();
const navigate = useNavigate();
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const {register, handleSubmit, formState:{errors}} = useForm<AuthSchema>({resolver: zodResolver(authschema)});

const onSubmit = async(data:AuthSchema) => {
    try{
        // const role = await signUp(data.email, data.password, data.role);
         await signUp(data.email, data.password, "admin" ); 
        // navigate(role === "admin" ? "/admin" : "/");
        navigate("/admin/login");
        // navigate("/login");
        // navigate("/");
    } catch(error:unknown){
        if(error instanceof Error && error.message.includes("Admin already exists")){
          alert("Admin account already created!No more admins allowed.");
        // if(error.message.includes("Admin already exists")){
        //   alert("Admin account already created!No more admins allowed.");
        // }
        // console.log('Signup failed', error);  
    } else{
        console.error("SIgnup failed", error);
        // console.log("Signup failed");
    } 
    }
};
    return(
         <div className='flex justify-center items-center min-h-screen bg-gray-50'>
            <Card className="w-[400px] shadow-lg">
            <CardHeader>
                <CardTitle className="text-center text-xl font-semibold">
                    Admin SignUp
                </CardTitle>
            </CardHeader>
        <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
            <Label htmlFor = "email">Email</Label>
            <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            autoComplete = "off"
            {...register("email")}
            />
            <FormError message={errors.email?.message}/>
            </div>

            <div>
                <Label htmlFor = "password">Password</Label>
                <div>
                <Input
                id = "password"
                type = {showPassword ? "text" : "password"}
                placeholder = "Enter your password"
                autoComplete = "off"
                {...register("password")}
                />
                {/* Toggle Button */}
                <button type="button" onClick = {() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18}/> :<Eye size = {18}/>}
                </button>
                </div>
               <FormError message = {errors.password?.message}/>
            </div> 

             <div>
                <Label htmlFor = "confirmpassword">Confirm Password</Label>
                <div>
                <Input
                id = "confirmpassword"
                type = {showConfirmPassword ? "text" : "password"}
                placeholder = "Confirm your password"
                autoComplete = "off"
                {...register("confirmPassword")}
                />
                {/* Toggle Button */}
                <button type="button" onClick = {() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff size={18}/> :<Eye size = {18}/>}
                </button>
                </div>
               <FormError message = {errors.confirmPassword?.message}/>
            </div> 

            {/* Submit button */}
            <Button type="submit" className = "w-full font-semibold">SignUp</Button>

            <p>Do you have an account?{""}
                <Link to="/admin/login">LogIn</Link>
            </p>   
        </form>
         </CardContent>
          </Card>
          </div>
    );
};

export default AdminSignUp;
