import { auth } from "@/config/Firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export async function sendOTP(phone: string) {
    const verifier = new RecaptchaVerifier(auth, "recaptcha", {
        size: "invisible",
    });
    return signInWithPhoneNumber(auth, phone, verifier);
}

export async function confirmOTP(confirmationResult: any, code: string) {
    return confirmationResult.confirm(code);
}