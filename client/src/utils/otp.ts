import { db } from "@/config/Firebase";
import {doc,setDoc,getDoc,deleteDoc} from "firebase/firestore";

export const sendOTP = async(target:string, type: "phone" | "email") =>{
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const otpId = `${type}-${target}`;

    await setDoc(doc(db, "otp", otpId),{
        target,
        type,
        code,
        createdAt: Date.now(),
        expiresAt: Date.now() + 5 * 60 * 1000,
    });

    console.log("OTP sent (dev):", code);
    return true;
};


export const verifyOTP = async(
target:string,
codeInput:string,
type:"phone" | "email"
) =>{
 const otpId = `${type} - ${target}`;
 const snap = await getDoc(doc(db, "otp" , otpId));

 if(!snap.exists()) return false;
 const data = snap.data();

 console.log("Verifying OTP:", codeInput , "against stored:", data.code);
 console.log("Now:", Date.now(), "ExpiresAt:", data.expiresAt);
//  Compare values correctly
 if(data.code !== codeInput) return false;
 if(Date.now() > data.expiresAt) return false;
//  if(data.expiresAt < Date.now()) return false;

 await deleteDoc(doc(db, "otp", otpId));
 return true;
};