import { isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from "firebase/auth";
import { auth } from "@/config/Firebase";

export async function sendEmailMagicLink(email:string) {
    const config = {
        url: window.location.origin + "/feedback",
        handleCodeInApp: true,
    };
    await sendSignInLinkToEmail(auth, email, config);
    window.localStorage.setItem("emailForSIgnIn", email);
}


export async function completeEmailSignIn(url:string) {
    if (isSignInWithEmailLink(auth, url)) {
        const email = window.localStorage.getItem("emailForSignIn");
        if (!email) throw new Error("No email stored for sign-in");
        // Ask user to enter email again
        // or if(!email) { 
        // email = window.prompt("Please enter your eamil for verification");
        // }
        await signInWithEmailLink(auth, email, url)
       .then(() => {
         console.log("Email verified and signed in!");
        });
    };
}
