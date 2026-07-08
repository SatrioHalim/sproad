import { Person, PlusOne } from '@mui/icons-material';
import { Button, colors, Stack, Typography } from '@mui/material';

import useTaskAssignees from '../hooks/useTaskAssignees';

import Select from '@/components/ui/forms/select';

const TaskAssignees = () => {
  const {
    isLoading,
    formTaskAssignees,
    onSubmitTaskAssignees,
    availableMembers,
    currentAssignees,
    showFormAssignees,
    setShowFormAssignees,
    handleCancelAssignees,
  } = useTaskAssignees();

  const getAssigneeLabel = (item) => {
    return item?.user?.name || item?.name || 'Unknown user';
  };

  return (
    <Stack sx={{ gap: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Assignee
      </Typography>
      <Stack sx={{ gap: 2 }}>
        {currentAssignees.map((item, index) => (
          <Stack
            key={item?.public_id || `${getAssigneeLabel(item)}-${index}`}
            direction={'row'}
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              border: `1px solid ${colors.grey[300]}`,
              borderRadius: 1,
              p: 1,
            }}
          >
            <Stack
              direction={'row'}
              sx={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Person />
              <Typography
                variant="body2"
                sx={{
                  color: colors.grey[700],
                }}
              >
                {getAssigneeLabel(item)}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
      {showFormAssignees ? (
        <Stack
          sx={{
            gap: 1,
          }}
          component={'form'}
          onSubmit={formTaskAssignees.handleSubmit(onSubmitTaskAssignees)}
        >
          <Select
            control={formTaskAssignees.control}
            name={'members'}
            label={'Select members'}
            options={availableMembers?.map((item) => ({
              label: item.name,
              value: item.public_id,
            }))}
            size={'small'}
            multiple
          />
          <Stack
            direction={'row'}
            sx={{
              justifyContent: 'flex-end',
              gap: 1,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              size="small"
            >
              Save
            </Button>
            <Button
              type="button"
              variant="outlined"
              disabled={isLoading}
              size="small"
              onClick={handleCancelAssignees}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Button
          type="button"
          variant="outlined"
          startIcon={<PlusOne />}
          onClick={() => setShowFormAssignees(true)}
        >
          Add assignee
        </Button>
      )}
    </Stack>
  );
};

export default TaskAssignees;
