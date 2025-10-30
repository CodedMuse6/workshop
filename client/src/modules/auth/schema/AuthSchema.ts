import {z} from 'zod'

export const authschema = z.object({
    email:z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be atleast 6 characters log'),
    confirmPassword : z.string(),
});
export type AuthSchema = z.infer<typeof authschema>
