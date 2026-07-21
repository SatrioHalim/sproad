import { Book, Monitor, Settings } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { useNavigate } from 'react-router';

import { APP_VERSION } from '@/utils/constants';

const SidebarMenu = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        width: 200,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 1,
      }}
    >
      <MenuList>
        <MenuItem onClick={() => navigate('/')} sx={{ position: 'relative' }}>
          <ListItemIcon>
            <Monitor fontSize="small" />
          </ListItemIcon>
          <ListItemText>Dashboard</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => navigate('/projects')}>
          <ListItemIcon>
            <Book fontSize="small" />
          </ListItemIcon>
          <ListItemText>Project</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => navigate('/settings')}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
      </MenuList>
      <Box
        sx={{
          mt: 'auto',
          px: 2,
          pb: 1.5,
          pt: 1,
          color: 'text.secondary',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            fontSize: '0.72rem',
            lineHeight: 1.2,
            letterSpacing: '0.04em',
            textTransform: 'none',
          }}
        >
          ({APP_VERSION})
        </Typography>
      </Box>
    </Box>
  );
};

export default SidebarMenu;
