import { functions } from "@/config/Firebase";
import { httpsCallable, type HttpsCallableResult } from "firebase/functions";
import OTPInput from "./OTPInput";
import { useState } from "react";

interface verifyOTPResponse{
    success: boolean;
}

export const OTPForm=() =>{
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");

const sendEmailOTPFn = httpsCallable<{email: string}, void>(functions, "sendEmailOTP");
const VerifyEmailOTPFn =  httpsCallable<{email: string; otp:string}, verifyOTPResponse>(functions, "verifyEmailOTP");
const sendPhoneOTPFn = httpsCallable<{phone: string}, void>(functions, "sendPhoneOTP");
const VerifyPhoneOTPFn = httpsCallable<{phone: string; otp:string}, verifyOTPResponse>(functions, "verifyPhoneOTP");
return(
    <>
    <h2>Email OTP Verification</h2>
    {/* Email Input */}
    <input type = "email"
    placeholder = "Enter Your email"
    value = {email}
    onChange = {(e) => setEmail(e.target.value)}
    style = {{
                width: "40px",
                height:"45px",
                textAlign:"center",
                fontSize:"20px",
                border:"1px solid #ccc",
                borderRadius: "6px",
             }}
    />
    {/* Email OTP Input */}
    {email && (
        <OTPInput
        label = "Enter Email OTP"
        onSendOTP = {async () => {
           await sendEmailOTPFn({email})
        }}
        onVerifyOTP = {async(otp) => {
            const res : HttpsCallableResult<verifyOTPResponse> = await VerifyEmailOTPFn({email, otp});
            return res.data.success;
        }}
        onVerified={() => alert("Email Verified Successfully")}
        />
    )}

    <hr style = {{margin: "30px 0"}}/>

    <h2>Phone OTP Verification (WhatsApp)</h2>

    {/* Phone Input */}

    <input
    type = "text"
    placeholder = "Enter Phone Number"
    value = {phone}
    onChange = {(e) => setPhone(e.target.value)}
    style = {{
                width: "40px",
                height:"45px",
                textAlign:"center",
                fontSize:"20px",
                border:"1px solid #ccc",
                borderRadius: "6px",
             }}
    />

    {/* Phone OTP Input */}
    {phone && (
        <OTPInput
        label = "Enter Phone OTP"
        onSendOTP = {async() => {
            await sendPhoneOTPFn({phone});
        }}
        onVerifyOTP={async (otp) =>{
            const res: HttpsCallableResult<verifyOTPResponse> = await VerifyPhoneOTPFn({phone, otp});
            return res.data.success;
        }}
        onVerified = {() => alert("Phone Verified Sucessfully")}
        />
    )}
    </>
);
}