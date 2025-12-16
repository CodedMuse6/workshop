import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {db} from "../../../config/Firebase.ts"; //storage
import {getDocs, collection,query, where, addDoc} from "firebase/firestore"; //setDoc,
import {useParams} from "react-router-dom"
import { studentschema } from "../schema/StudentSchema.ts";
import type { StudentSchema } from "../schema/StudentSchema.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { useEffect , useState,} from "react"; //useRef,
// import { useCertificateGenerator } from "@/services/generateCertificate.ts";
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { OTPInput } from "@/modules/components/OTPInput.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import {type WorkshopSchema } from "../schema/FormSchema.ts"; //workshopschema, 
// import { saveStudentSubmission } from "./submissions.tsx";
import FormError from "@/modules/components/FormError.tsx";


const FeedbackForm = () => {
    const {linkId} = useParams();
    const [workshop, setWorkshop] = useState<WorkshopSchema | null>(null); 
    const [loading, setLoading] = useState<boolean>(true);
    // const {generateCertificate}  = useCertificateGenerator();
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    // const[isSubmitting, setIsSubmitting] = useState(false);
    const {register, handleSubmit,watch,formState:{errors, isSubmitting}} = useForm<StudentSchema>({
        resolver: zodResolver(studentschema),
    });
    const email = watch("email");
    const phone = watch("phone");

    // load workshop by linkId or fetch workshop
    useEffect(() => {
        // const loadWorkshop = async () => {
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

            // if(!snap.empty){
            //     const docRef = snap.docs[0].ref;
            //     const docData = snap.docs[0].data() as WorkshopSchema; //as WorkshopSchema

            //     // auto-fill templateUrl if missing
            //     if(!docData.templateUrl){
                    
                //     const defaultUrl = await getDefaultTemplateUrl();
                //     if(!defaultUrl){
                //         alert("Certificate template missing! Please contact admin");
                //         setLoading(false);
                //         return;
                //     }
                //     await updateDoc(docRef,{templateUrl: defaultUrl});
                //     docData.templateUrl = defaultUrl;
                // }
                // validate firestore data
                // const parsed = workshopschema.safeParse(docData);
                // if(!parsed.success){
                //     alert("Workshop configuration is incomplete.Certificate template missing.");
                //     setLoading(false);
                //     return;
                // }
                //  setWorkshop(parsed.data);
                //  setValue("course", parsed.data.workshopName);
                // setWorkshop(docData);
    //             setWorkshop(snap.docs[0].data() as WorkshopSchema);
    //          }else{
    //             alert("Workshop not found")
    //          }
    //         setLoading(false);
    //     };
    //     loadWorkshop();
    // },[linkId, setValue]);

    // if(loading) return <p>Loading...</p>;
    // if(!workshop) return <p>Invalid link or Form not found</p>;

    const onSubmit = async(data: StudentSchema) => {
        console.log("Submitting form data:", data);
         
        try{
         if(!phoneVerified || !emailVerified){
        alert("Please verify phone and email before submitting.");
       return;
      } 
        //  isSubmitting(true);

    //   save feedback data to firebase
    const feedbackRef = await addDoc(collection(db,'feedbacks'),{
        ...data,
        linkId,
        submittedAt : new Date(),
    });
    console.log('Feedback saved with ID:' , feedbackRef.id);

    // generate certificate for the student
//    const pdfBytes = await generateCertificate(workshopDetails, data.studentName);
//     const certRef = ref(storage, `certificates/${linkId}/${data.studentName}.pdf`);
//     await uploadBytes(certRef, pdfBytes); 
//     const certificateUrl = await getDownloadURL(certRef);



    // const pdfBytes = await generateCertificate(data.studentName);
    // await sendEmail(data.email, data.studentName, pdfBytes);

    alert('feedback submitted successfully!');
    // isSubmitting(true);
        }catch(error){
            console.error('Error submitting feedback:', error);
            // isSubmitting(false);
        }

        //     if(!workshop) return;

    //   if(!phoneVerified || !emailVerified){
    //     alert("Please verify phone and email before submitting.");
    //    return;
    //   } 
   
    // if(!workshop.templateUrl){
    // // if(!parsed.success){
    //     alert("certificate template missing!");
    //     return;
    // }
    // setWorkshop(parsed.data);
    // try{
    // //    Generate certificate PDF
    //   const pdfBytes = await generateCertificate(workshop.templateUrl!,{
    //     studentName: data.studentName,
    //     workshopName: workshop.workshopName,
    //     collegeName: workshop.collegeName,
    //     date:workshop.date,
    //     linkId: linkId!
    //   });

    //   upload certificate
    // const certRef = ref(storage, `certificates/${linkId}/${data.studentName}.pdf`);
    // await uploadBytes(certRef, pdfBytes); 
    // const certificateUrl = await getDownloadURL(certRef);

    // save submission
    // await saveStudentSubmission(linkId!, data, certificateUrl)
    // alert("Submitted successfully! Certificate generated:" + certificateUrl);
    // } catch(err){
    //     console.error("Submission error:", err);
    //     alert("An error occured during submission.");
    // }
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
                // placeholder = "Workshop Name"
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
            {/* {phoneVerified && <FormError message = {errors. phone?.message}/> } */}
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



