import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';

import useDetailProjectContext from './useDetailProjectContext';

import services from '@/services';
import { transformTasksToWorkloadData } from '@/utils/dataTransform';

const useDashboardData = () => {
  const [totalTaskSummary, setTotalTaskSummary] = useState([]);
  const [workloadSummary, setWorkloadSummary] = useState([]);
  const [overdueTasksSummary, setOverdueTasksSummary] = useState([]);
  const [dueSoonTasksSummary, setDueSoonTasksSummary] = useState([]);

  const { isLoadingBoardLists, boardListData, getTaskItemsByListId } =
    useDetailProjectContext();

  const mergeListAndTaskData = useMemo(() => {
    const taskItems = boardListData.map((item) => {
      const { title } = item;
      const tasks = getTaskItemsByListId(item.public_id);
      return {
        ...item,
        title,
        tasks,
        count: tasks.length,
      };
    });
    return taskItems;
  }, [boardListData, getTaskItemsByListId]);

  const taskPercentageSummary = useMemo(() => {
    const taskItems = mergeListAndTaskData;
    const taskItemsTotal = taskItems.reduce((a, b) => {
      return a + b.count;
    }, 0);
    const result = [...taskItems].map((item) => ({
      name: item.title,
      count: item.count,
      value:
        taskItemsTotal > 0
          ? Math.floor((item.count / taskItemsTotal) * 100)
          : 0,
    }));
    return result;
  }, [mergeListAndTaskData]);

  const initDashboardData = useCallback(async () => {
    if (mergeListAndTaskData.length > 0 && !isLoadingBoardLists) {
      const tasks = [];
      const overdueTasks = [];
      const dueSoonTasks = [];

      for (const items of mergeListAndTaskData) {
        if (!Array.isArray(items.tasks) || items.tasks.length === 0) {
          continue;
        }

        const fetchTasks = await Promise.allSettled(
          items.tasks.map((item) => services.cards.getDetail(item.public_id)),
        );

        fetchTasks.forEach((result) => {
          if (result.status !== 'fulfilled') {
            return;
          }

          const taskData =
            result.value?.data?.data ?? result.value?.data ?? null;
          if (taskData) {
            tasks.push(taskData);
          }
        });
      }

      const workload = tasks.length
        ? transformTasksToWorkloadData(tasks, null)
        : [];

      for (const taskItem of tasks) {
        if (!taskItem?.due_date) {
          continue;
        }

        const now = dayjs();
        const dueDate = dayjs(taskItem.due_date);
        const daysUntilDue = dueDate
          .startOf('day')
          .diff(now.startOf('day'), 'day');

        if (dueDate.valueOf() <= now.valueOf()) {
          overdueTasks.push(taskItem);
        } else if (daysUntilDue >= 1 && daysUntilDue <= 3) {
          dueSoonTasks.push(taskItem);
        }
      }
      setWorkloadSummary(workload);
      setOverdueTasksSummary(overdueTasks);
      setDueSoonTasksSummary(dueSoonTasks);
      setTotalTaskSummary(tasks);
    }
  }, [mergeListAndTaskData, isLoadingBoardLists]);

  useEffect(() => {
    // Dashboard metrics are derived from async card-detail fetches.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    initDashboardData();
  }, [initDashboardData]);

  return {
    totalTaskSummary,
    workloadSummary,
    overdueTasksSummary,
    dueSoonTasksSummary,
    taskPercentageSummary,
    mergeListAndTaskData,
    isLoadingBoardLists,
  };
};

export default useDashboardData;
