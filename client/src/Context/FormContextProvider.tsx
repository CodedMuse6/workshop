import {ReactNode, useState} from "react"
import {FormContext, WorkshopData} from "./FormContext"

const FormContextProvider = ({children} : {children : ReactNode}) =>{
const [formStatus, setFormStatus] = useState(false);
const[formData, setFormData] = useState<WorkshopData>({
    collegeName : "",
    workshopName : "",
    date : "",
    time : "",
    instructions : "",
    studentEmail : "",
});

const updateFormData = (data:WorkshopData) =>{
    setFormData(data);
}

const toggleForm
}

export default FormContextProvider