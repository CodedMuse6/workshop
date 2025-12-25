import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { confirmOTP, sendOTP } from "@/services/PhoneVerificationService";
import { useState } from "react";


type Props = {
    onVerified: () => void;
};

export const PhoneVerification =({onVerified} : Props) =>{  
    const [phone, setPhone] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [confirmationResult, setConfirmationResult] = useState<any>(null);
    const [message, setMessage] = useState("");

 
      // send OTP
         const handleSendOTP = async() => {
             try {
                 const result = await sendOTP(phone);
                 setConfirmationResult(result);
                 setMessage("OTP sent! Check your phone.");
             } catch (err) {
                console.error(err);
                 setMessage("err.message,Failed to send OTP");
             }
         };

     // confirm OTP
      const handleConfirmOTP = async () => {
        if (!confirmationResult) return;
        try {
        await confirmOTP(confirmationResult, otpCode);
        setMessage("Phone verified");
        onVerified(); //notify parent component
        } catch (err) {
            console.error(err);
            setMessage("err.message,Phone Verification error");
        }
    };

  return(
    <div>
         <input type = "tel" value = {phone} onChange = {(e) => setPhone(e.target.value)} placeholder="+91"/>
          <button onClick={handleSendOTP}>Send OTP</button>
            <Input type = "text" value = {otpCode}
                onChange = {(e) => setOtpCode(e.target.value)}
                placeholder = "Enter OTP"/>
            <Button type="button" onClick={ handleConfirmOTP}>
            Confirm OTP
            </Button>
            <p>{message}</p>
            <div id = "recaptcha"></div>
    </div>
);
};
       













































// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import React, {useState, useRef, useEffect} from "react";
// // import { optional } from "zod";

// interface OTPInputProps{
//     length?: number;
//     label: string;
//     onSendOTP: () => Promise<void>;
//     onVerifyOTP:(otp:string) => Promise<boolean>;
//     onVerified:() => void;
// }

// export default function OTPInput({
//     length = 6,
//     label,
//     onSendOTP,
//     onVerifyOTP,
//     onVerified,
// }: OTPInputProps){
// const[otp, setOtp] = useState<string[]>(Array(length).fill(""));
// const[isSent, setIsSent] = useState(false);
// const[verified, setVerified] = useState(false);
// const[resendTimer, setResendTimer] = useState(0);
// const inputRefs = useRef<(HTMLInputElement | null)[]>([]);


// // handle typing on each box
// const handleChange = (value:string, index:number) =>{
//     if(!/^\d*$/.test(value)) return; //allow only numbers

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     // move to next input box automatically
//     if(value && index <length - 1){
//         inputRefs.current[index + 1]?.focus();
//     }
// };

// // handle backspace navigation
// const handlekeyDown = (e:React.KeyboardEvent, index:number) => {
//     if(e.key === "backspace" && !otp[index] && index > 0){
//         inputRefs.current[index - 1]?.focus();
//     }
// };

// // button: send otp
// const handleSendOTP = async() =>{
//     try{
//     await onSendOTP();
//     setIsSent(true);
//     setResendTimer(60);
//     alert("OTP sent!");
//     } catch(err){
//         console.error(err);
//         alert("Failed to send OTP. Try again.");
//     }
  
// };

// // button : verify otp
// const handleVerify = async() => {
//     const enteredOtp = otp.join("");

//     if(enteredOtp.length !== length){
//         alert("Please enter full OTP");
//         return;
//     }


// const ok = await onVerifyOTP(enteredOtp);

// if(ok){
//     setVerified(true);
//     onVerified();
//     alert("OTP Verified Successfully");
// }else{
//     setOtp(Array(length).fill(""));
//     inputRefs.current[0]?.focus();
//     alert("Invalid OTP, Please Try again");
// }
// };

// useEffect(() => {
//     if(resendTimer === 0) return;
//     const interval = setInterval(() => {
//         setResendTimer((prev) => prev - 1);
//     }, 1000);
//     return() => clearInterval(interval);
// },[resendTimer]);


// return(
//     <div style={{marginTop: "15px", marginBottom: "20px"}}>
//         <label style = {{fontWeight:"bold"}}>{label}</label>
//         <div style={{marginTop:"10px", display:"flex", gap: "8px"}}>
//          {otp.map((digit,index) =>(
//             <Input
//              key={index}
//              ref={(el: HTMLInputElement | null) => {inputRefs.current[index] = el;}}
//              maxLength={1}
//              value = {digit}
//              onChange = {(e) => handleChange(e.target.value,index)}
//              onKeyDown={(e) => handlekeyDown(e, index)}
//              disabled = {!isSent || verified}
//              style = {{
//                 width: "40px",
//                 height:"45px",
//                 textAlign:"center",
//                 fontSize:"20px",
//                 border:"1px solid #ccc",
//                 borderRadius: "6px",
//              }}
//             />
//          ))}
//         </div>

//         {/* buttons */}
//         {!verified?(
//             <div style={{marginTop:"10px", display:"flex", gap:"10px"}}>
//              <Button 
//              type="button"
//              onClick={handleSendOTP}
//              disabled={isSent && resendTimer > 0}
//              style={{
//                 padding:"8px",
//                 background: isSent ? "#aaa" : "#007bff",
//                 color:"white",
//                 borderRadius:"4px",
//              }}
//               >
//                 {/* {isSent? "OTP Sent" : "Send OTP"} */}
//                 {isSent ? (resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP") : "send OTP"}
//              </Button>

//              <Button
//              type="button"
//              onClick={handleVerify}
//              disabled = {!isSent}
//              style={{
//                 padding: "8px",
//                 background: "#28a745",
//                 color:"white",
//                 borderRadius:"4px",
//              }}>
//                 Verify OTP
//              </Button>
//             </div>
//         ):(
//             <p style={{color:"green", marginTop:"10px"}}>Verified</p>
//         )}
//     </div>
// );
// };