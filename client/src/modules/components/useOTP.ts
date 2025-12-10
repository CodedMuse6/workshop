// import { functions } from "@/config/Firebase"
import axios from "axios";
// import { httpsCallable } from "firebase/functions"
import { useState } from "react";

type OTPType = "phone" | "email";

export const useOTP = () => {
    // const sendOtpFn = httpsCallable(functions, "sendOTP");
    // const verifyOtpFn = httpsCallable(functions, "verifyOTP");

    const [sent, setSent] = useState(false);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState("");
     
    const sendOTP = async(type: OTPType, target:string) => {
        // const fnName = type === "phone" ? "sendOTP" : "sendEmailOTP";
        // const sendFn = httpsCallable(functions, fnName);
        // return sendFn({[type === "phone" ? "phone" : "email"]: target});

       try{
        const url = 
        type === "phone" ? `https://us-central1-${import.meta.env.VITE_FIREBASE_PROJECT_ID}.cloudfunctions.net/sendOTP`: `https://us-central1-${import.meta.env.VITE_FIREBASE_PROJECT_ID}.cloudfunctions.net/sendEmailOtp`;
        //    const fn = httpsCallable(functions, type === "phone" ? "sendOTP" : "sendEmailOTP");
        const response = await axios.post(url, {[type] : target});
        console.log("OTP Sent:", response.data);
        //    const fnName = type === "phone" ? "sendOTP" : "sendEmailOTP";
        //    const sendFn = httpsCallable(functions, fnName);
        //    await sendFn({[type]: target});
           setSent(true);
           setError("");
        } catch(e:unknown){
        if(e instanceof Error) setError(e.message);
        else setError("Unknown error");
       }

        // try{
        //     await sendOtpFn({phone});
        //     setSent(true);
        // } catch(e:any){
        //   setError(e.message);
        // }
    };

    const verifyOTP = async(type: OTPType, target: string, otp: string) => {
        // const fnName = type === "phone" ? "verifyOTP" : "verifyEmailOTP";
        // const verifyFn = httpsCallable(functions, fnName);
        // return verifyFn({[type === "phone" ? "phone" : "email"]: target, otp});

        try{
             const url = 
        type === "phone" ? `https://us-central1-${import.meta.env.VITE_FIREBASE_PROJECT_ID}.cloudfunctions.net/verifyOTP`: `https://us-central1-${import.meta.env.VITE_FIREBASE_PROJECT_ID}.cloudfunctions.net/verifyEmailOtp`;
            // const fn = httpsCallable(functions, type === "phone" ? "verifyOTP" : "verifyEmailOTP");
            const response = await axios.post(url, {[type]: target, otp});
            console.log("OTP Verified:", response.data);
            // const fnName = type === "phone" ? "verifyOTP" : "verifyEmailOTP";
            // const verifyFn = httpsCallable(functions, fnName);
            // await verifyFn({[type]: target, otp});
            setVerified(true);
            setError("");
            return true;
        }catch(e:unknown){
            if(e instanceof Error) setError(e.message);
            else setError("Unknown error");
            return false;
        }

        // try{
        //     await verifyOtpFn({phone, otp});
        //     setVerified(true);
        //     return true;
        // } catch(e:any){
        //     setError(e.message);
        //     return false;
        // }
    };

    return{sent, verified, error, sendOTP, verifyOTP, setSent,setVerified,setError};
};