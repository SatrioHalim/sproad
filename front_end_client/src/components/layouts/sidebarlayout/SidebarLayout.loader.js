import session from "@/utils/session";
import { redirect } from "react-router";

export default function sidebarLoader(){
    const isAuthenticated = session.isAuthenticated();

    if(!isAuthenticated){
        return redirect('/login');
    }
    return null;
}