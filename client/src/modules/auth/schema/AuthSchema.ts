import {z} from 'zod'

export const authschema = z.object({
    email:z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be atleast 6 characters log'),
    confirmPassword : z.string(),
    role: z.enum(['user', 'admin'],{message:'Role must be either user or admin'}),
});
export type AuthSchema = z.infer<typeof authschema>
