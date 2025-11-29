import {useState} from 'react';
import {useForm} from 'react-hook-form';
import { useAuth } from '../../../Context/AuthContext.ts';
import {Link, useNavigate} from 'react-router-dom';
import { loginschema} from '../schema/LoginSchema.ts';
import type { LoginSchema } from '../schema/LoginSchema.ts';
import {zodResolver} from '@hookform/resolvers/zod';
import {Input} from  "@/components/ui/input.tsx";
import { Button } from '@/components/ui/button.tsx';
import { Label } from '@/components/ui/label.tsx';
import FormError from '../../components/FormError.tsx';
import {Eye, EyeOff} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx'

const AdminLogin = () =>{
    const {logIn, user, logOut} = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const {register, handleSubmit, formState:{errors}} = useForm<LoginSchema>({resolver:zodResolver(loginschema)});

    const onSubmit =  async(data:LoginSchema) => {
        try{
         await logIn(data.email, data.password);
          navigate('/admin');
        } catch(error){
         console.log('Login failed please try again', error);
        };
    }

    if(user){
    return(
       <div className='flex-justify-center items-center h-screen'>
        <Card className="w-[400px] shadow-md">
            <CardHeader>
                <CardTitle>
                {user.role === 'admin' ? 'Admin is loggedIn' : 'User  loggedIn'}
                </CardTitle>
            </CardHeader>
            <CardContent>
        {user.role === 'admin' ? (<p>Welcome, Admin! You can create forms.</p>):(
            <p>You are logged in as a user, but You can not create forms.</p>
        )}
        <Button onClick = {logOut}></Button>
         </CardContent>
        </Card>
       </div>
    );
    }

    return(
        <div className='flex-justify-center items-center min-h-screen bg-gray-50'>
            <Card className="w-[400px] shadow-lg">
            <CardHeader>
                <CardTitle className="text-center text-xl font-semibold">
                    Admin Login 
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

            {/* Submit button */}
            <Button type="submit" className = "w-full font-semibold">Log In</Button>

            <p>Don&apos;t have an account?{""}
                <Link to = "/admin/signup">SignUp</Link>
            </p>   
        </form>
         </CardContent>
          </Card>
          </div>
    );
};

export default AdminLogin