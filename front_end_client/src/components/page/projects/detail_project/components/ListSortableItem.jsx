import { Delete } from "@mui/icons-material"
import { Box, colors, IconButton, Stack, Typography } from "@mui/material"

const ListSortableItem = () => {
    const renderDeleteList = () => {
        return (
            <IconButton size="small" color="error" onClick={()=>{}}>
                <Delete></Delete>
            </IconButton>
        )
    }


    return (
        <Box
            sx={{ 
                flexBasis:300,
                flexShrink:0,
                overflowX:'hidden',
                borderRadius:1,
                px:0.5,
                mx: -0.5,
                background:colors.grey[50]
             }}
        >
            <Stack
            direction={'row'}
            sx={{ 
                justifyContent:'space-between',
                alignItems:'center',
                p:2,
                borderBottom:`1 px solid ${colors.grey[300]}`,
                cursor:'grab',
                borderTopRightRadius:1,
                borderTopLeftRadius:1
             }}
            >
                <Stack direction={'row'}
                sx={{ 
                    alignItems:'center',
                    gap:1
                 }}>
                    <Typography variant="body1" sx={{ 
                        fontWeight:600
                     }}>List Title</Typography>
                     <Stack sx={{ 
                        justifyContent:'center',
                        alignItems:'center',
                        width:26,
                        height:26,
                        borderRadius:1,
                        backgroundColor:colors.orange[100]
                      }}>
                        <Typography variant="caption" sx={{ 
                            fontWeight:600
                         }}>10</Typography>
                     </Stack>
                </Stack>
                {renderDeleteList()}
            </Stack>               
        </Box>
    )
}

export default ListSortableItem