import {useState} from "react";
import type {ReactNode} from "react";
import {FormContext } from "./FormContext.ts";
import type { WorkshopData } from "./FormContext.ts";


const FormContextProvider = ({children} : {children : ReactNode}) => {
const [formStatus, setFormStatus] = useState(false);
const [formData, setFormData] = useState<WorkshopData>({
    collegeName : "",
    workshopName : "",
    date : "",
    time : "",
    instructions : "",
    studentEmail : "",
});

const updateFormData = (data:WorkshopData) =>{
    setFormData(data);
};

const toggleFormStatus = () =>{
    setFormStatus((prevStatus) => !prevStatus);
};

return(
    <FormContext.Provider value = {{formData, updateFormData, toggleFormStatus, formStatus}}>
        {children}
    </FormContext.Provider>
);
};

export default FormContextProvider;