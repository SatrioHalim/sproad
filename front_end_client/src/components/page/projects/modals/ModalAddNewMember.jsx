import { Warning } from '@mui/icons-material';
import { Box, Button, LinearProgress, Stack, Typography } from '@mui/material';

import useModalAddnewMember from './hooks/useModalAddNewMember';

import TextField from '@/components/ui/forms/textfield';
import Modal from '@/components/ui/modal';

const ModalAddNewMember = () => {
  const {
    control,
    handleAddMember,
    handleClose,
    isLoading,
    isLoadingAddMember,
    detailProjectContext,
    usersData,
    debounceEmail,
    setUsersData,
  } = useModalAddnewMember();

  const renderUsersResult = () => {
    if (!usersData && isLoading) return null;
    if (usersData && usersData.length == 0 && debounceEmail && !isLoading) {
      return (
        <Stack
          direction={'row'}
          sx={{
            gap: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <Warning />
          <Typography variant="body2">
            User{' '}
            <Typography
              component={'span'}
              sx={{
                fontWeight: 600,
              }}
            >
              {debounceEmail}
            </Typography>{' '}
            not found
          </Typography>
        </Stack>
      );
    }
    return (
      <>
        {usersData?.map((item) => (
          <Stack
            key={item.public_id}
            direction={'row'}
            sx={{
              gap: 1,
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 2,
            }}
          >
            <Stack>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                }}
              >
                {item.name}
              </Typography>
              <Typography variant="body2">{item.email}</Typography>
            </Stack>
            <Stack direction={'row'} sx={{ gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                disabled={isLoadingAddMember}
                loading={isLoadingAddMember}
                onClick={handleAddMember}
              >
                Add
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setUsersData(null)}
                disabled={isLoadingAddMember}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        ))}
      </>
    );
  };

  return (
    <Modal
      open={detailProjectContext.isOpenModalAddNewMember}
      handleClose={handleClose}
      title={'Add member'}
    >
      <Box
        sx={{
          width: 600,
          p: 2,
        }}
      >
        <TextField
          control={control}
          name={'email'}
          label={'Find user'}
          placeholder={'Input user email'}
          fullWidth
          disabled={isLoadingAddMember}
        />
        <Box sx={{ mt: 1 }}>
          {isLoading && <LinearProgress />}
          {renderUsersResult()}
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalAddNewMember;
