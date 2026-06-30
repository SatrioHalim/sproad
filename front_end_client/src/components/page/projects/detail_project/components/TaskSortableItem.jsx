import { CSS } from '@dnd-kit/utilities';
import { Paper, Stack, Typography } from '@mui/material';

import useTaskSortableItem from '../hooks/useTaskSortableItem';
const TaskSortableItem = ({ id, item, listId }) => {
  const {
    attributes,
    detailProjectContext,
    listeners,
    isDragging,
    setNodeRef,
    transform,
    transition,
  } = useTaskSortableItem({ id, item, listId });
  return (
    <Paper
      ref={setNodeRef}
      sx={{
        transform: CSS.Translate.toString(transform),
        transition,
        cursor: 'pointer',
        opacity: isDragging ? 0 : 1,
      }}
      elevation={2}
      {...attributes}
      {...listeners}
    >
      <Stack
        sx={{
          minHeight: 80,
          p: 1,
          gap: 2,
          justifyContent: 'space-between',
        }}
      >
        <Typography>{item.title}</Typography>
        <Typography>
          {detailProjectContext.getProjectInitials}-{item.internal_id}
        </Typography>
      </Stack>
    </Paper>
  );
};

export default TaskSortableItem;
