import { Button } from "@/components/ui/button";
import { useAuth } from "@/Context/AuthContext";

const AdminSettings = () => {
    const {deleteAdmin} = useAuth();

    const handleDeleteAdmin = async(uid: string) => {
        await deleteAdmin(uid);
    }

    return(
        <div>
            <Button onClick={() => handleDeleteAdmin("admin-uid")}>DeleteAdmin</Button>
        </div>
    );
};

export default AdminSettings



