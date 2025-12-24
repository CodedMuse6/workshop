import * as admin from "firebase-admin";
import {setGlobalOptions} from "firebase-functions";
import {sendFeedbackLink} from "./FeedbackLinkEmail";
import {generateCertificate} from "./generateCertificate";

// Initialize Admin once
admin.initializeApp();

// optional: limit concurrent function instances
setGlobalOptions({maxInstances: 10});

// export functions
export {sendFeedbackLink};
export {generateCertificate};


