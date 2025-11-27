import axios from "axios";

export const requestEmailOTP = async(email:string) => {
    const res = await axios.post(
        "https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/sendEmailOtp",
        {email}
    );
    return res.data;
};

export const verifyEmailOTP = async(email:string, code:string) => {
    const res = await axios.post(
        "https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/verifyEmailOtp",
        {email,code}
    );
    return res.data.valid;
};