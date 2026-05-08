import TextField from "@/components/ui/forms/textfield";
import { Button, Paper, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const AuthLayout = ({children}) => {

    return (
        <Stack sx={{ 
            flexDirection:'column',
            alignItems:'center',
            justifyContent:'center',
            height:'100vh',
            width:'100%'
         }}>
            {children}
        </Stack>
    )
}

export default AuthLayout;