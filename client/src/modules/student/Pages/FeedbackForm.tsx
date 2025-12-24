import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {auth, db} from "../../../config/Firebase.ts"; 
import {getDocs, collection,query, where, addDoc, setDoc, doc} from "firebase/firestore"; 
import {useParams} from "react-router-dom"
import { studentschema } from "../schema/StudentSchema.ts";
import type { StudentSchema } from "../schema/StudentSchema.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { useEffect , useState,} from "react"; 
import { OTPInput } from "@/modules/components/OTPInput.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import {type WorkshopSchema } from "../schema/FormSchema.ts";
import FormError from "@/modules/components/FormError.tsx";
import { RecaptchaVerifier, sendEmailVerification, signInWithPhoneNumber } from "firebase/auth";


const FeedbackForm = () => {
    const {linkId} = useParams();
    const [workshop, setWorkshop] = useState<WorkshopSchema | null>(null); 
    const [loading, setLoading] = useState<boolean>(true);
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const {register, handleSubmit,watch,formState:{errors, isSubmitting}} = useForm<StudentSchema>({
        resolver: zodResolver(studentschema),
    });
    const email = watch("email");
    const phone = watch("phone");

    // load workshop by linkId or fetch workshop
    useEffect(() => {
            if(!linkId) return;
            const fetchWorkshop = async () =>{
                const q = query(collection(db, "workshops"),where("linkId" , "==" , linkId));
            const snap = await getDocs(q);
             if(snap.empty){
                setLoading(false);
                return;
             }
             setWorkshop(snap.docs[0].data() as WorkshopSchema);
             setLoading(false);
            }
            fetchWorkshop();
            },[linkId]);   

    // verifyPhone
    const verifyPhone = async(phone: string) => {
        const recaptcha = new RecaptchaVerifier("recaptcha-container", {}, auth);
        const confirmation = await signInWithPhoneNumber(auth, phone, recaptcha);
        const code = prompt("Enter OTP sent to your phone:");
        await confirmation.confirm(code!);
        setPhoneVerified(true);
    }

    // verifyEmail
    const verifyEmail = async(email: string) =>{
        const userCredential = await auth.createUserWithEmailAndPassword(email, "temporaryPassword123!");
        await sendEmailVerification(userCredential.user);
        alert("Verification email sent! Please verify your email and then submit the form.");
    }

    const onSubmit = async(data: StudentSchema) => {
        console.log("Submitting form data:", data);
         
        try{
         if(!phoneVerified || !emailVerified){
        alert("Please verify phone and email before submitting.");
       return;
      } 

    //save feedback data to firebase
    // const feedbackRef = await addDoc(collection(db,'feedbacks'),{
    //     ...data,
    //     linkId,
    //     submittedAt : new Date(),
    // });
    const feedbackRef = doc(db, "feedbacks",linkId! + "-" + data.email); // workshopId = linkId
    await setDoc(feedbackRef, data);
    console.log('Feedback saved with ID:' , feedbackRef.id);

    //generate certificate for the student
    const certUrl = await generateCertificate("/certificate-templates/sample.pdf", data);

    alert('feedback submitted successfully! Certificate will be generated automatically.');
        }catch(error){
            console.error('Error submitting feedback:', error);
        }
     };

 
    if(loading) return <p>Loading...</p>;
    if(!workshop) return <p>Invalid link or Form not found</p>;

    return(
       <div className='flex-justify-center items-center min-h-screen bg-gray-50'>
            <Card className="w-[400px] shadow-lg">
            <CardHeader>
                <CardTitle className="text-center text-xl font-semibold">
                   {workshop.workshopName} - Feedback Form
                    <p><strong>College:</strong>{workshop.collegeName}</p>
                </CardTitle>
            </CardHeader>
        <CardContent>
            <div>
               <p><strong>Date:</strong>{workshop.date}</p>
               <p><strong>Time:</strong>{workshop.time}</p>
               <p><strong>Instructions</strong>{workshop.instructions}</p>
            </div>
        <form onSubmit={handleSubmit(onSubmit)} className = "flex flex-col gap-4">
            
            <div>
            <Label htmlFor = "studentName">Student Name</Label>
            <Input
            id="studentName"
            placeholder="Enter Your Name"
            {...register("studentName")}
            />
            <FormError message = {errors. studentName?.message}/>
            </div>

            <div>
                <Label htmlFor = "course">Workshop Name</Label>
                <Input
                id = "course"
                value = {workshop.workshopName}
                readOnly
                 {...register("course")}
                />
            </div> 

             {/*phone & OTP  */}
            <div>
                <Label htmlFor = "phone">Phone</Label>
                <Input
                type="text"
                id = "phone"
                {...register("phone")}
                maxLength={10}
                />
            {phone?.length === 10 && !phoneVerified && (
            <OTPInput
            type="phone"
            target={phone}
            onVerified={() => setPhoneVerified(true)}
            />
            )}
            {phoneVerified && <p className="text-green-600">Phone Verified</p>}
            </div> 

            {/* Email & OTP */}
            <div>
                <Label htmlFor = "email">Email</Label>
                <Input
                id = "email"
                type = "email"
                {...register("email")}
                />
                {email && email.includes("@") && (
                <OTPInput 
                type="email" 
                target={email}
                onVerified={() => setEmailVerified(true)}/>
                )}
                 {emailVerified && <p className="text-green-600">Email Verified</p>}
            </div>

             <div>
                <Label htmlFor = "instructions">Feedback</Label>
                <Textarea
                id = "feedback"
                placeholder = "Instructions"
                {...register("feedback")}
                />
            </div>

            {/* Submit button */}
           <Button type = "submit" disabled = {!phoneVerified || !emailVerified || isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
        </form>
         </CardContent>
          </Card>
          </div>
    )
};

export default FeedbackForm;



