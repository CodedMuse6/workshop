import { completeEmailSignIn, sendEmailMagicLink } from "@/services/EmailVerificationService";
import { useEffect, useState } from "react";

interface Props {
    onVerified: () => void; //callback when email is verified
}

export const EmailVerification =({onVerified} : Props) =>{
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

 // complete magic link sign-in
  useEffect(() => {
   completeEmailSignIn(window.location.href)
   .then(() => onVerified())
   .catch(() => {});
  },[onVerified]);


 const handleSendEmailLink = async () => {
    try{
        await sendEmailMagicLink(email);
        setMessage("Magic link sent! Check your email.");
    } catch (err:any) {
        console.error(err.message)
        setMessage(err.message);
    }
 };

 return(
    <div>
        <input type="email" value = {email} onChange = {(e) => setEmail(e.target.value)} placeholder="enter email"/>
        <button onClick = {handleSendEmailLink}>Send Magic link</button>
        <p>{message}</p>
        </div>
 );
};


// feedback code
// useEffect(() =>{
// const unsubscribe = auth.onAuthStateChanged((user) => {
//     setCanSubmit(user?.emailVerified && user?.phoneNumber ? true : false);
// });
// return () => unsubscribe();
// },[])





