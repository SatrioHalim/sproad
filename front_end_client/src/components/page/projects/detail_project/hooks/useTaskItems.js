import { useMemo } from 'react';

import useDetailProjectContext from './useDetailProjectContext';

const useTaskItems = (listId) => {
  const detailProjectContext = useDetailProjectContext();
  const taskItemsData = detailProjectContext.getTaskItemsByListId(listId);

  const taskitemDataIds = useMemo(() => {
    return taskItemsData.map((item) => item.public_id);
  }, [taskItemsData]);

  return {
    detailProjectContext,
    taskItemsData,
    taskitemDataIds,
  };
};

export default useTaskItems;
