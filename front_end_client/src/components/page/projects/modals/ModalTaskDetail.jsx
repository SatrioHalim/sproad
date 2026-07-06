import { Delete } from '@mui/icons-material';
import { Box, Button, colors, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

import useModalTaskDetail from './hooks/useModalTaskDetail';

import DatePicker from '@/components/ui/forms/datepicker';
import TextField from '@/components/ui/forms/textfield';
import Modal from '@/components/ui/modal';
import datetime from '@/utils/datetime';

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
    editDueDate,
    setEditDueDate,
    detailProjectData,
    isShowConfirmDelete,
    setIsShowConfirmDelete,
    handleDeleteTask,
  } = useModalTaskDetail();

  const projectDueDate = detailProjectData?.due_date
    ? dayjs(detailProjectData.due_date)
    : null;
  const isProjectDueDateValid = projectDueDate?.isValid?.() ?? false;
  const maxDate =
    isProjectDueDateValid && projectDueDate.isAfter(dayjs())
      ? projectDueDate
      : undefined;

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
          Description
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
  const renderDueDate = () => {
    return (
      <Stack sx={{ gap: 2 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
          }}
        >
          Deadline
        </Typography>
        {editDueDate ? (
          <Box component={'form'} onSubmit={formTask.handleSubmit(onSubmit)}>
            <DatePicker
              control={formTask.control}
              name={'due_date'}
              fullWidth
              disabled={isLoading}
              minDate={dayjs().startOf('day')}
              maxDate={maxDate}
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
                onClick={() => setEditDueDate(false)}
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
            onClick={() => setEditDueDate(true)}
          >
            {taskDetailData.due_date &&
            taskDetailData.due_date == '0001-01-01T00:00:00Z'
              ? 'Deadline not added yet, click to add'
              : datetime.format(taskDetailData.due_date, 'DD MMMM YYYY')}
          </Typography>
        )}
      </Stack>
    );
  };

  const renderTaskDetailActions = () => {
    return (
      <Stack
        sx={{
          position: 'sticky',
          bottom: 0,
          background: 'white',
          p: 2,
          justifyContent: 'flex-end',
          gap: 1,
          borderTop: `1px solid ${colors.grey[300]}`,
        }}
        direction={'row'}
      >
        {isShowConfirmDelete ? (
          <Stack direction={'row'} sx={{ gap: 1, alignItems: 'center' }}>
            <Typography variant="body2">Confirm delete ?</Typography>
            <Button
              type="button"
              color="error"
              onClick={handleDeleteTask}
              disabled={isLoading}
            >
              Yes
            </Button>
            <Button
              variant="text"
              onClick={() => setIsShowConfirmDelete(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </Stack>
        ) : (
          <>
            <Button
              startIcon={<Delete />}
              variant="outlined"
              color="error"
              onClick={() => setIsShowConfirmDelete(true)}
              disabled={isLoading}
            >
              Delete
            </Button>
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={isLoading}
            >
              Close
            </Button>
          </>
        )}
      </Stack>
    );
  };

  // add delete task card detail
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
        <Stack
          sx={{
            width: '35%',
            gap: 2,
          }}
        >
          {renderDueDate()}
        </Stack>
      </Stack>
      {renderTaskDetailActions()}
    </Modal>
  );
};

export default ModalTaskDetail;
