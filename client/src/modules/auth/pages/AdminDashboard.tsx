import {useEffect} from "react";
import { useFormDataContext } from "@/Context/FormContext";
import { Button } from "@/components/ui/button";
import {Link, useNavigate} from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { useAuth } from "@/Context/AuthContext";
import { toast } from "sonner";

export const AdminDashboard = () =>{
const {formData, fetchForms, toggleStatus} = useFormDataContext();
const {logOut} = useAuth();
const navigate = useNavigate();

useEffect(() => {
    fetchForms();
});

const handleLogout = async() => {
    await logOut();
    navigate("/admin/login");
}

return(
    <div>
    <header className="flex justify-between items-center p-4 bg-white shadow">
        <h1>Admin Dashboard</h1>
        <Button onClick={handleLogout}>Logout</Button>
        </header>
        <main className="p-6">
            <div className="mb-6">
        <Link to = "/admin/forms/create">
        <Button>Create New Workshop Form</Button>
        </Link>
         </div>

         <Card>
            <CardHeader>
                <CardTitle>Workshop Forms</CardTitle>
            </CardHeader>
            <CardContent>
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
                {formData.map((form) => {
                    const formLink = form.status === "on" && form.linkId ? `${window.location.origin}/form/${form.linkId}` : null;
                    return(
                    <tr key={form.id}>
                     <td>{form.workshopName}</td>
                     <td>{form.collegeName}</td>
                     <td>{form.date}</td>
                     <td>{form.status}</td>
                     <td>{form.status === "on" && formLink ? (
                        <div>
                            <a
                            href={formLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{color:"blue", textDecoration:"underline"}}
                            >
                                {formLink}
                            </a>
                            <Button onClick={() => {navigator.clipboard.writeText(formLink);
                                toast.success("Link copied");
                            }}
                                style={{fontSize: "12px"}}>
                                    Copy Link
                                </Button>
                            </div>
                     ):(
                        <span style={{color: "red"}}>Inactive</span>
                     )} </td>
                     {/* <td>{form.status === "on" ? <a href={`/form/${form.linkId}`}>open Form</a> : "Inactive"}</td> */}
                     {/* `${window.location.origin}/form/${form.linkId}`}*/}
                    <td>
                        <Button variant = {form.status === "on" ? "destructive" : "default"}
                         onClick = {async () => { await toggleStatus(form.id!, form.status === "on" ? "off" : "on");
                            toast.success(`Form turned ${form.status === "on" ? "OFF" : "ON"}`);
                         }}>
                            {form.status === "on" ? "Turn off" : "Turn On"}
                        </Button>
                    </td>
                    </tr>
                );
                })}
            </tbody>
        </table>
</CardContent>
        </Card>
        </main>
    </div>
)
};