import { deleteUser } from "firebase/auth";
import { deleteDoc } from "firebase/firestore";
import { auth ,db} from "@/config/Firebase";
import { doc } from "firebase/firestore";

export const DeleteAdmin = 