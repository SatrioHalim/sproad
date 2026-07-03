import { AVATAR_GROUP_MAX } from "@/utils/constants"
import { GroupAdd } from "@mui/icons-material"
import { AvatarGroup, Button, Stack } from "@mui/material"
import useDetailProjectContext from "../hooks/useDetailProjectContext"
import Avatar from "@/components/ui/avatar"
import ModalAddNewMember from "../../modals/ModalAddNewMember"

const ProjectMembers = () => {
    const {
        members,
        setIsOpenModalAddNewMember
    } = useDetailProjectContext();

    const handleAddNewMember = () => setIsOpenModalAddNewMember(true);

    const renderAvatarMembers = () => {
        return (
            <AvatarGroup max={AVATAR_GROUP_MAX}>
                {members?.map((item)=>(
                    <Avatar key={item.id} text={item.name}></Avatar>
                ))}
            </AvatarGroup>
        )
    }
    
    return (
        <>
            <Stack direction={'row'}
            sx={{ 
                alignItems:'center',
                gap:2
             }}>
                {renderAvatarMembers()}
                <Button variant="text" type="button" startIcon={<GroupAdd></GroupAdd>} onClick={handleAddNewMember}>
                    Add member
                </Button>
             </Stack>
             <ModalAddNewMember></ModalAddNewMember>
        </>
    )
}

export default ProjectMembers