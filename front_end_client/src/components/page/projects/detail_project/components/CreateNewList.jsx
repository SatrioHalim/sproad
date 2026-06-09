import { Box, Button, Stack, Typography } from "@mui/material"
import useCreateNewList from "../hooks/useCreateNewList"
import { PlusOne } from "@mui/icons-material";
import TextField from "@/components/ui/forms/textfield";

const CreateNewList = () => {
    const {
        showFormCreateList,
        handleOpenFormCreateList,
        control,
        handleSubmit,
        handleCloseFormCreateList,
        onSubmitCreateList,
        isLoadingCreateList
    } = useCreateNewList();
    return (
        <Box sx={{ 
            flexBasis:300,
            flexShrink:0,
            overflow:"auto"
         }}>
            {
                showFormCreateList ? (
                    <Box sx={{ 
                        p:1
                     }} component={"form"} onSubmit={handleSubmit(onSubmitCreateList)}>
                        <TextField
                            control={control}
                            name={"title"}
                            label={"List Task Name"}
                            fullWidth
                            autoFocus
                        ></TextField>
                        <Stack direction={"row"} sx={{ 
                            gap:2,
                            justifyContent:"flex-end"
                         }}>
                            <Button type="submit" variant="contained" size="small" disabled={isLoadingCreateList} loading={isLoadingCreateList}>
                                Save
                            </Button>
                            <Button type="button" variant="outlined" size="small"
                            onClick={handleCloseFormCreateList} disableElevation>
                                Cancel
                            </Button>
                         </Stack>
                    </Box>
                ) : (
                    <Button 
                        fullWidth
                        size="large"
                        type="button"
                        variant="contained"
                        onClick={handleOpenFormCreateList}
                        startIcon={<PlusOne />}
                        >Create New List</Button>
                )
            }
         </Box>
    )
}

export default CreateNewList