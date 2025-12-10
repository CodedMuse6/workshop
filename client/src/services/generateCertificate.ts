import {PDFDocument, StandardFonts} from "pdf-lib";

export const useCertificateGenerator = () =>{
    const generateCertificate = async(templateUrl: string, data:any) => {
        const templateBytes = await fetch(templateUrl).then((res) => 
            res.arrayBuffer()
    );

    const pdfDoc = await PDFDocument.load(templateBytes);
    const page = pdfDoc.getPage(0);

    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    page.drawText(data.studentName,{
        x:250,
        y:300,
        size: 24,
        font,
        color: undefined,
    });
    page.drawText(data.workshopName,{x:250, y:260, size:14, font});
    page.drawText(data.collegeName, {x:250,y:240, size:14, font});
    page.drawText(data.date,{x:250, y:220, size:14,font});

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
    }
    return{generateCertificate};
}























// import {PDFDocument} from 'pdf-lib';
// import {getStorage, ref, getDownloadURL} from 'firebase/storage';
// import {db} from '../config/Firebase.ts';
// import {addDoc, collection} from 'firebase/firestore';

// export const generateCertificate = async(
//     studentName: string,
//     course: string,
//     workshopName : string,
//     linkId : string,
//     // studentEmail : string,
//     // studentPhone : string,
// ) => {
//     const storage = getStorage();

//     // get the template file from firebase storage
//     const templateUrl = 'gs://your-app-id.appspot.com/certificates/templates/certificate-template.pdf';
//     const templateRef = ref(storage, templateUrl);
//     const templateBytes = await fetch(await getDownloadURL(templateRef)).then((res) => res.arrayBuffer());
//     const pdfDoc = await PDFDocument.load(templateBytes);

//     // Add text on the certificate
//     const page = pdfDoc.getPages()[0];
//     const {height} = page.getSize();

//     page.drawText(studentName, {x:200, y:height-300, size:30});
//     page.drawText(workshopName, {x:200, y:height-350, size:25});
//     page.drawText(course, {x:200, y:height-400, size:20});

//     const pdfBytes = await pdfDoc.save();

//     // upload the generated certificate PDF to Firebase Storage
//     const certificateRef = ref(storage, `certificates/${linkId}_${studentName}_certificate.pdf`);
//     await certificateRef.put(new Blob([pdfBytes], {type: 'application/pdf'}));
    
//     const certificateUrl = await getDownloadURL(certificateRef);

//     // save certificate metadata to firebase
//     await addDoc(collection(db, 'certificates'),{
//         studentId: linkId,
//         certificateUrl,
//         createdAt: new Date(),
//     });

//     return certificateUrl;
// }