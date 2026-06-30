import { AddCircle } from "@mui/icons-material"
import { Box, Button, Stack } from "@mui/material"
import useCreateNewTask from "../hooks/useCreateNewTask"
import TextField from "@/components/ui/forms/textfield";

const CreateNewTask = ({listId}) => {
    const {
        isLoading,
        isShowFormCreateNewTask,
        control,
        handleSubmit,
        handleOpenFormCreateNewTask,
        handleCloseFormCreateNewTask,
        onSubmit
    } =  useCreateNewTask(listId);

    if(isShowFormCreateNewTask){
        return (
            <Box 
            sx={{ p:1 }} component={"form"} onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    control={control}
                    name={'Title'}
                    label={'Task name'}
                    fullWidth
                    autoFocus
                ></TextField>
                <Stack 
                direction={'row'}
                sx={{ 
                    gap:1,
                    justifyContent:'flex-end'
                 }}
                >
                    <Button type="submit" variant="contained" size="small" disabled={isLoading} loading={isLoading}>Save</Button>
                    <Button type="button" variant="outlined" size="small" disabled={isLoading} onClick={handleCloseFormCreateNewTask}>Cancel</Button>
                </Stack>
            </Box>
        )
    }

    return (
        <Button type="button" variant="text"  fullWidth startIcon={<AddCircle></AddCircle>}>
            Create New Task
        </Button>
    )
}

export default CreateNewTask