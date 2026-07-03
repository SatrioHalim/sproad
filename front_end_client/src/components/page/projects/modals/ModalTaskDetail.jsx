import { Box, Button, colors, Stack, Typography } from '@mui/material';

import useModalTaskDetail from './hooks/useModalTaskDetail';

import TextField from '@/components/ui/forms/textfield';
import Modal from '@/components/ui/modal';

const ModalTaskDetail = () => {
  const {
    taskId,
    handleClose,
    taskDetailData,
    editTitle,
    setEditTitle,
    formTask,
    onSubmit,
    isLoading,
    editDescription,
    setEditDescription,
  } = useModalTaskDetail();

  const renderTitle = () => {
    return (
      <Stack sx={{ gap: 2 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
          }}
        >
          Title
        </Typography>
        {editTitle ? (
          <Box component={'form'} onSubmit={formTask.handleSubmit(onSubmit)}>
            <TextField
              control={formTask.control}
              name={'title'}
              fullWidth
              disabled={isLoading}
            />
            <Stack
              direction={'row'}
              sx={{ justifyContent: 'flex-end', gap: 1 }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                loading={isLoading}
              >
                Save
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={() => setEditTitle(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        ) : (
          <Typography
            component={'a'}
            variant="body2"
            sx={{
              display: 'block',
              ':hover': {
                background: colors.grey[100],
                cursor: 'pointer',
                p: 1,
                borderRadius: 1,
              },
            }}
            onClick={() => setEditTitle(true)}
          >
            {taskDetailData.title || 'No title yet, click to edit'}
          </Typography>
        )}
      </Stack>
    );
  };
  const renderDescription = () => {
    return (
      <Stack sx={{ gap: 2 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
          }}
        >
          Task Description
        </Typography>
        {editDescription ? (
          <Box component={'form'} onSubmit={formTask.handleSubmit(onSubmit)}>
            <TextField
              control={formTask.control}
              name={'description'}
              multiline
              rows={10}
              fullWidth
              disabled={isLoading}
            />
            <Stack
              direction={'row'}
              sx={{ justifyContent: 'flex-end', gap: 1 }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                loading={isLoading}
              >
                Save
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={() => setEditDescription(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        ) : (
          <Typography
            component={'a'}
            variant="body2"
            sx={{
              display: 'block',
              ':hover': {
                background: colors.grey[100],
                cursor: 'pointer',
                p: 1,
                borderRadius: 1,
              },
            }}
            onClick={() => setEditDescription(true)}
          >
            {taskDetailData.description || 'No description yet, click to edit'}
          </Typography>
        )}
      </Stack>
    );
  };

  return (
    <Modal
      open={taskId}
      handleClose={handleClose}
      title={taskDetailData?.title || ''}
    >
      <Stack
        direction={'row'}
        sx={{
          width: 1000,
          height: 600,
          overflowY: 'auto',
          gap: 2,
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          p: 2,
        }}
      >
        <Stack
          sx={{
            width: '65%',
            gap: 2,
          }}
        >
          {renderTitle()}
          {renderDescription()}
        </Stack>
      </Stack>
    </Modal>
  );
};

export default ModalTaskDetail;
