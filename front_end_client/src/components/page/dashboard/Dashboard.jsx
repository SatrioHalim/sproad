import { colors, Paper, Typography } from '@mui/material';
import { useState } from 'react';

import SidebarLayout from '../../layouts/sidebarlayout';

const Dashboard = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
  return (
    <SidebarLayout pageTitle={'Dashboard'}>
      <Paper
        sx={{
          padding: 2,
          background: colors.lightBlue[100],
        }}
      >
        <Typography>Menampilkan dashboard</Typography>
      </Paper>
    </SidebarLayout>
  );
};

export default Dashboard;
