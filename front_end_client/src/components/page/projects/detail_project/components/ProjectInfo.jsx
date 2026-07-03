import { Stack } from "@mui/material"
import ProjectMembers from "./ProjectMembers"

const ProjectInfo = () => {
    return (
        <Stack
        sx={{ 
            justifyContent:'space-between',
            alignItems:'center',
            mb: 2
         }}
         direction={'row'}>
            <ProjectMembers></ProjectMembers>
        </Stack>
    )
}

export default ProjectInfo