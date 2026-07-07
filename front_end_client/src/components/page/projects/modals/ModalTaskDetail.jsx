import { Delete } from '@mui/icons-material';
import { Box, Button, colors, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

import useModalTaskDetail from './hooks/useModalTaskDetail';
import ModalTaskDetailProvider from './ModalTaskDetailContext';

import DatePicker from '@/components/ui/forms/datepicker';
import TextField from '@/components/ui/forms/textfield';
import Modal from '@/components/ui/modal';
import datetime from '@/utils/datetime';

const ModalTaskDetail = () => {
  return (
    <ModalTaskDetailProvider>
      <ModalTaskDetail />
    </ModalTaskDetailProvider>
  );
};

export default ModalTaskDetail;
