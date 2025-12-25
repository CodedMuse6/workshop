import * as functions from "firebase-functions";
import * as sgmail from "@sendgrid/mail";

// set SendGrid Api key
sgmail.setApiKey("Your_SENDGRID_API_KEY");

// define a type for the incoming request data
interface FeedbackData{
    email:string;
    link:string;
}

// send feedback link email
export const sendFeedbackLink = functions.https.onCall(async (data:
    functions.https.CallableRequest<FeedbackData>) => { // context
  const {email, link} = data.data;

  // log the data
  console.log("Received email:", email);
  console.log("Recevied link:", link);

  if (!email || !link) {
    throw new functions.https.HttpsError("invalid-argument",
      "Email and link are required");
  }

  const msg = {
    to: email,
    from: "your_email@example.com",
    subject: "Your Workshop Feedback Link",
    text: `Click here to give feedback: http://localhost:5173/feedback/${link}`,
  };

  try {
    await sgmail.send(msg);
    console.log("Feedback link sent to:", email);
    return {success: true};
  } catch (error) {
    console.error("Error sending feedback link:", error);
    throw new functions.https.HttpsError("internal",
      "Failed to send feddback link.");
  }
});
