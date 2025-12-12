// import axios from "axios";

// type OTPType = "phone" | "email";

// // send OTP function
// export const sendOTP = async(type:OTPType, target:string) => {
//     try{
//         const url = 
//         type === "phone" ? "https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/sendOtp" 
//         : "https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/sendEmailOTP";
//     //  const response = await axios.post("https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/sendOtp",
//     //     {
//     //         phone,

//     //     });
//     const response = await axios.post(url, {[type]: target});
//         console.log("OTP Sent:", response.data);
//     } catch(error){
//       console.error("Error sending OTP:", error);
//     }
// };


// // verify OTP function
// export const verifyOTP = async(type:OTPType, target:string, otp:string) => {
//     try{
//         const url = 
//         type === "phone" ? "https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/verifyOtp" 
//         : "https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/verifyEmailOTP";
//     // const response = await axios.post("https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/verifyOTP",{
//     //     phone, otp,
//     // });
//     const response = await axios.post(url, {[type] : target, otp});
//     console.log("OTP Verified:", response.data);
//     }catch(error){
//         console.error("Error verifying OTP:", error);
//     }
// }

// export const requestEmailOTP = async(email:string) => {
//     const res = await axios.post(
//         "https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/sendEmailOtp",
//         {email}
//     );
//     return res.data;
// };

// export const verifyEmailOTP = async(email:string, code:string) => {
//     const res = await axios.post(
//         "https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/verifyEmailOtp",
//         {email,code}
//     );
//     return res.data.valid;
// };