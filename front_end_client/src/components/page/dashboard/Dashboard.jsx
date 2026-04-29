import { Box, Button } from '@mui/material';
import { useState } from 'react';

import Modal from '../../ui/modal';

const Dashboard = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
  return (
    <Box>
      <Button type="button" variant="contained" onClick={handleOpen}>
        Open modal
      </Button>
      <Modal open={openModal} handleClose={handleClose} title={'Judul modal'}>
        <Box
          sx={{
            padding: 2,
            width: 500,
          }}
        >
          Isi Modal
        </Box>
      </Modal>
    </Box>
  );
};

export default Dashboard;
