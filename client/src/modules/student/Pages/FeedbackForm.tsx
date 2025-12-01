import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {db,auth, setupRecaptcha} from "../../../config/Firebase.ts";
import {doc, getDocs, collection,query, where, addDoc, Timestamp} from "firebase/firestore";
import {useParams, useNavigate} from "react-router-dom"
import { studentschema } from "../schema/StudentSchema.ts";
import type { StudentSchema } from "../schema/StudentSchema.ts";
import {signInWithPhoneNumber} from "firebase/auth";
import type {ConfirmationResult} from "firebase/auth";
import { requestEmailOTP, verifyEmailOTP } from "@/services/otpEmail.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import FormError from "../../components/FormError.tsx";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { useEffect , useState} from "react";
import { generateCertificate } from "@/services/generateCertificate.ts";



const FeedbackForm = () => {
    const {linkId} = useParams();
    const navigate = useNavigate();
    const [workshop, setWorkshop] = useState<any>(null); //<any>
    const [loading, setLoading] = useState(true);
    const [phoneOtpSent, setPhoneOtpSent] = useState(false);
    const [phoneCode, setPhoneCode] = useState("");
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [emailOtpSent, setEmailOtpSent] = useState(false);
    const [emailCode, setEmailCode] = useState("");
    const [emailVerified, setEmailVerified] = useState(false);
    const {register, handleSubmit, watch, formState:{errors}} = useForm<StudentSchema>({
        resolver: zodResolver(studentschema),
    });
    const email = watch("email");
    const phone = watch("phone");

    // load workshop by linkId
    useEffect(() => {
        const loadWorkshop = async () => {
            const q = query(
                collection(db, "workshops"),
                where("linkId" , "==" , linkId)
            );
            const snap = await getDocs(q);

            if(!snap.empty){
                setWorkshop(snap.docs[0].data());
            }
            setLoading(false);
        };
        loadWorkshop();
    },[linkId]);

    // send phone otp
    const sendPhoneOTP = async () => {
        try{
            setupRecaptcha(); //invisible
            const phoneNumber = "+91" + phone;

            const confirmation = await signInWithPhoneNumber(auth, phoneNumber,window.recaptchaVerifier);
            setConfirmationResult(confirmation);
            setPhoneOtpSent(true);
            alert("OTP sent to phone!");
        } catch (err) {
            console.error(err);
            alert("Failed to send OTP");
        }
    };

    const verifyPhoneOTP = async () =>{
        if(!confirmationResult) return;
        try{
            await confirmationResult.confirm(phoneCode);
            setPhoneVerified(true);
            alert("Phone verified");
        } catch(err) {
            alert("Invalid OTP");
        }
    }

    // send email otp
    const sendEmailOTP = async () => {
        try{
            await requestEmailOTP(email);
            setEmailOtpSent(true);
            alert("Email OTP sent!");
        } catch(err) {
            alert("Failed to send email OTP");
        }
    };

    const verifyEmail = async () => {
        try{
            const valid = await verifyEmailOTP(email, emailCode);
            if(valid){
                setEmailVerified(true);
                alert("Email verified");
            } else {
                alert("Invalid OTP");
            }
        } catch(err){
            alert("Error verifying email OTP");
        }
    }

    const onSubmit = async(data: StudentSchema) => {
      if(!phoneVerified || !emailVerified){
        alert("Please verify both phone & email before submitting");
        return;
      }

      await addDoc(collection(db, "submissions"), {
        workshopId: workshop.id,
        linkId,
        ...data,
        phoneVerified,
        emailVerified,
        createdAt: Timestamp.now(),
        certificateUrl:"",
        status:"pending",
      });

      const certificateUrl = await generateCertificate({
        studentName: data.studentName,
        course: data.course,
        // phone:data.phone,
        // email:data.email,
        // feedback: data.feedback,
        workshopName: workshop.workshopName,
        linkId: linkId!,
      });

      alert("Submitted successfully! Certificate generated:" + certificateUrl);
      navigate("/submitted");
    };

    if(loading) return <p>Loading...</p>;
    if(!workshop) return <p>Invalid link</p>

    return(
       <div className='flex-justify-center items-center min-h-screen bg-gray-50'>
            <Card className="w-[400px] shadow-lg">
            <CardHeader>
                <CardTitle className="text-center text-xl font-semibold">
                   {workshop.workshopName} - Feedback Form
                </CardTitle>
            </CardHeader>
        <CardContent>
            <div>
               <p><strong>College:</strong>{workshop.collegeName}</p>
               <p><strong>Date:</strong>{workshop.date}</p>
               <p><strong>Time:</strong>{workshop.time}</p>
               <p><strong>Instructions</strong>{workshop.instructions}</p>
            </div>
        <form onSubmit={handleSubmit(onSubmit)} className = "flex flex-col gap-4">
            
            <div>
            <Label htmlFor = "studentName">Student Name</Label>
            <Input
            id="studentName"
            type="text"
            placeholder="Your College Name"
            {...register("studentName")}
            />
            <FormError message={errors.studentName?.message}/>
            </div>

            <div>
                <Label htmlFor = "workshopName">Workshop Name</Label>
                <Input
                id = " course"
                type = "text"
                placeholder = "Workshop Name"
                {...register("course")}
                />
               <FormError message = {errors. course?.message}/>
            </div> 

             {/*phone & OTP  */}
             <div>
                <Label htmlFor = "phone">Phone</Label>
                <Input
                id = " phone"
                type = "number"
                {...register("phone")}
                maxLength={10}
                />

                {!phoneVerified && (
                    <div>
                        {!phoneOtpSent ? (
                            <Button type = "button" onClick={sendPhoneOTP}>Send OTP</Button>
                        ) : (
                            <>
                            <Input value = {phoneCode}
                            onChange = {(e) => setPhoneCode(e.target.value)}
                            placeholder = "Enter OTP"
                            />
                            <Button onClick = {verifyPhoneOTP}>Verify</Button>
                            </>
                        )}
                    </div>
                )}
                {phoneVerified && <p>Phone Verified </p>}
               {/* <FormError message = {errors. phone?.message}/> */}
            </div> 

            {/* Email & OTP */}
            <div>
                <Label htmlFor = "email">Email</Label>
                <Input
                id = "email"
                type = "email"
                {...register("email")}
                />

                {!emailVerified && (
                    <div>
                      {!emailOtpSent ? (
                        <Button type = "button" onClick = {sendEmailOTP}>
                            Send OTP
                        </Button>
                      ) : (
                        <>
                        <Input
                        value = {emailCode}
                        onChange = {(e) => setEmailCode(e.target.value)}
                        placeholder="Enter OTP"
                        />
                        <Button onClick = {verifyEmail}>Verify</Button>
                        </>
                      )}

                    </div>
                )}
               {/* <FormError message = {errors.email?.message}/> */}
               {emailVerified && <p>Email Verified</p>}
            </div>

             <div>
                <Label htmlFor = "instructions">Feedback</Label>
                <Input
                id = " feedback"
                type = "text"
                placeholder = "Instructions"
                {...register("feedback")}
                />
               <FormError message = {errors. feedback?.message}/>
            </div>

            {/* Submit button */}
           <Button disabled = {!phoneVerified || !emailVerified} type = "submit">Submit Feedback</Button>
        </form>
         </CardContent>
          </Card>

          <div id = "recaptcha-container"></div>
          </div>
    )

}

export default FeedbackForm



