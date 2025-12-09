import { useState } from "react";
import { useAuth } from "@/Context/AuthContext";

export const AdminSettings = () =>{
    const {deleteAdmin} = useAuth();
    const[adminUid, setAdminUid] = useState<string>(""); 

    const handleDeleteAdmin= async()=>{
        if(adminUid){
            await deleteAdmin(adminUid);
        }
    };

    return(
          <>
          <h2>Admin Management </h2>
          <input type="text"
          placeholder = "Enter Admin UID to delete"
          value = {adminUid}
          onChange = {(e) => setAdminUid(e.target.value)}
          />
          <button onClick = {handleDeleteAdmin}>Delete Admin</button>
          </>
    )
};































// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/Context/AuthContext";

// const AdminSettings = () => {
//     const {deleteAdmin} = useAuth();

//     const handleDeleteAdmin = async(uid: string) => {
//         await deleteAdmin(uid);
//     }

//     return(
//         <div>
//             <Button onClick={() => handleDeleteAdmin("admin-uid")}>DeleteAdmin</Button>
//         </div>
//     );
// };

// export default AdminSettings



