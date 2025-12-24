import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as sgMail from "@sendgrid/mail";
import {PDFDocument, rgb, StandardFonts} from "pdf-lib";

sgMail.setApiKey(functions.config().sendgrid.key);

// Function: generate certificate when feedback is submitted
export const generateCertificate = functions.firestore
.document("feedback/{feedbackId}")
.onCreate(async(snap) => {
    const feedbackData = snap.data();
    const email = feedbackData.email;
    const studentName = feedbackData.name;
    const workshopTitle = feedbackData.workshopTitle;

    // create PDF using pdf-lib
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    page.drawText("Certificate of Completion", {x: 50, y: height - 100,
        size: 30,
        font,
        color: rgb(0, 0, 0.8),
    });

    page.drawText(`This certifies that ${studentName}`, {
        x: 50,
        y: height - 150,
        size: 20,
        font,
        color: rgb(0, 0, 0),
    });

    page.drawText("has successfully completed the workshop:", {
        x:50,
        y: height - 180,
        size: 18,
        font,
        color: rgb(0, 0, 0),
    });

    page.drawText(`${workshopTitle}`, {
        x: 50,
        y: height - 210,
        size: 22,
        font,
        color: rgb(0.8, 0, 0),
    });

// convert PDF to bytes
const pdfBytes = await pdfDoc.save();

// upload PDF to firebase storage
const bucket = admin.storage().bucket();
const file = bucket.file(`Certificates/${email}.pdf`);
await file.save(pdfBytes, {contentType: "application/pdf"});
const [url] = await file.getSignedUrl({
    action: "read",
    expires: "30-01-2030",
});

// save certificate info in firebase
const certRef = admin.firestore().collection
("certificates").doc();
await certRef.set({
    email,
    studentName,
    workshopTitle,
    pdfUrl: url,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
});

// send certificate email
await sgMail.send({
    to: email,
    from: "admin@yourdomain.com",
    subject: `You Certificate: ${workshopTitle}`,
    html: `<p>Congratulations ${studentName}! Your certificate is ready.</p>
    <a href = "${url}">Download Certificate</a>`,
});

});
