import {useEffect} from "react";
import { useFormDataContext } from "@/Context/FormContext";
import { Button } from "@/components/ui/button";
import {Link} from "react-router-dom";

export const AdminDashboard = () =>{
const {formData, fetchForms, toggleStatus} = useFormDataContext();

useEffect(() => {
    fetchForms();
},[]);

return(
    <div>
        <h1>Admin Dashboard</h1>
        <Link to = "/admin/forms/create">
        <Button>Create New Workshop Form</Button>
        </Link>

        <table>
            <thead>
                <tr>
                    <th>Workshop</th>
                    <th>College</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Link</th>
                    <th>Toggle</th>
                </tr>
            </thead>
            <tbody>
                {formData.map((form) => (
                    <tr key={form.id}>
                     <td>{form.workshopName}</td>
                     <td>{form.collegeName}</td>
                     <td>{form.date}</td>
                     <td>{form.status}</td>
                     <td>{form.status === "on" ? `${Window.location.origin}/form/${form.linkId}` : "Inactive"}</td>
                    <td>
                        <Button onClick = {() => toggleStatus(form.id!, form.status === "on" ? "off" : "on")}>
                            {form.status === "on" ? "Turn off" : "Turn On"}
                        </Button>
                    </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)
};