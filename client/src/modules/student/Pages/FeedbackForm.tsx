import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {db, storage} from "../../../config/Firebase.ts";
import {getDocs, collection,query, where, updateDoc} from "firebase/firestore";
import {useParams} from "react-router-dom"
import { studentschema } from "../schema/StudentSchema.ts";
import type { StudentSchema } from "../schema/StudentSchema.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { useEffect , useState} from "react";
import { useCertificateGenerator } from "@/services/generateCertificate.ts";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { OTPInput } from "@/modules/components/OTPInput.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { workshopschema, type WorkshopSchema } from "../schema/FormSchema.ts";
import { saveStudentSubmission } from "./submissions.tsx";


const FeedbackForm = () => {
    const {linkId} = useParams();
    const [workshop, setWorkshop] = useState<WorkshopSchema | null>(null); 
    const [loading, setLoading] = useState<boolean>(true);
    const {generateCertificate}  = useCertificateGenerator();
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const {register, handleSubmit,watch,setValue,formState:{isSubmitting}} = useForm<StudentSchema>({
        resolver: zodResolver(studentschema),
    });
    const email = watch("email");
    const phone = watch("phone");

    const getDefaultTemplateUrl = async()=>{
     const templateRef = ref(storage,"certificateTemplates/default-template.pdf")
     try{
       const url = await getDownloadURL(templateRef);
       return url;
     }catch(err){
        console.error("Default template not found:", err);
        return "";
     }
    };

    // load workshop by linkId or fetch workshop
    useEffect(() => {
        const loadWorkshop = async () => {
            const q = query(collection(db, "workshops"),where("linkId" , "==" , linkId));
            const snap = await getDocs(q);

            if(!snap.empty){
                const docRef = snap.docs[0].ref;
                const docData = snap.docs[0].data() as WorkshopSchema; //as WorkshopSchema

                // auto-fill templateUrl if missing
                if(!docData.templateUrl){
                    
                    const defaultUrl = await getDefaultTemplateUrl();
                    if(!defaultUrl){
                        alert("Certificate template missing! Please contact admin");
                        setLoading(false);
                        return;
                    }
                    await updateDoc(docRef,{templateUrl: defaultUrl});
                    docData.templateUrl = defaultUrl;
                }
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
                setWorkshop(snap.docs[0].data() as WorkshopSchema);
             }else{
                alert("Workshop not found")
             }
            setLoading(false);
        };
        loadWorkshop();
    },[linkId, setValue]);

    if(loading) return <p>Loading...</p>;
    if(!workshop) return <p>Invalid link or Form not found</p>;

    const onSubmit = async(data: StudentSchema) => {
        console.log("Submitting form data:", data);
      if(!phoneVerified || !emailVerified){
        alert("Please verify phone and email before submitting.");
       return;
      } 
   
    if(!workshop.templateUrl){
    // if(!parsed.success){
        alert("certificate template missing!");
        return;
    }
    // setWorkshop(parsed.data);
    try{
    //    Generate certificate PDF
      const pdfBytes = await generateCertificate(workshop.templateUrl,{
        studentName: data.studentName,
        workshopName: workshop.workshopName,
        collegeName: workshop.collegeName,
        date:workshop.date,
        linkId: linkId!
      });

    //   upload certificate
    const certRef = ref(storage, `certificates/${linkId}/${data.studentName}.pdf`);
    await uploadBytes(certRef, pdfBytes);
    const certificateUrl = await getDownloadURL(certRef);

    // save submission
    await saveStudentSubmission(linkId!, data, certificateUrl)
    alert("Submitted successfully! Certificate generated:" + certificateUrl);
    } catch(err){
        console.error("Submission error:", err);
        alert("An error occured during submission.");
    }
    };

 

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
            </div>

            <div>
                <Label htmlFor = "course">Workshop Name</Label>
                <Input
                id = "course"
                value = {workshop.workshopName}
                readOnly
                placeholder = "Workshop Name"
                {...register("course")}
                />
            </div> 

             {/*phone & OTP  */}
            <div>
                <Label htmlFor = "phone">Phone</Label>
                <Input
                id = "phone"
                {...register("phone")}
                maxLength={10}
                />
            {phone?.length === 10 && (
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
           <Button disabled = {!phoneVerified || !emailVerified || isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
        </form>
         </CardContent>
          </Card>
          </div>
    )
};

export default FeedbackForm;



