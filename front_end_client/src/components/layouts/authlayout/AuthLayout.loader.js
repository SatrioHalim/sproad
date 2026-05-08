import session from "@/utils/session";
import { redirect } from "react-router";

export default function authLoader(){
    const isAuthenticated = session.isAuthenticated();

    if(isAuthenticated){
        return redirect('/');
    }
    return null;
}