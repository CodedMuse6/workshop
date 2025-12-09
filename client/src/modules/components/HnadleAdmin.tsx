import { Button } from "@/components/ui/button";
import { useAuth } from "@/Context/AuthContext";

const HandleAdmin = () => {
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

export default HandleAdmin