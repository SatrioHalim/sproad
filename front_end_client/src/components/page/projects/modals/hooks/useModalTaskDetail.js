import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoaderData, useSearchParams } from 'react-router';

import useDetailProjectContext from '../../detail_project/hooks/useDetailProjectContext';

import useModalTaskDetailContext from './useModalTaskDetailContext';

import services from '@/services';
import datetime from '@/utils/datetime';

const useModalTaskDetail = () => {
  const [_, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [editDueDate, setEditDueDate] = useState(false);
  const [isShowConfirmDelete, setIsShowConfirmDelete] = useState(false);

  const detailProjectData = useLoaderData();
  const detailProjectContext = useDetailProjectContext();
  const modalTaskDetailContext = useModalTaskDetailContext();

  const taskId = modalTaskDetailContext.taskId;
  const listId = modalTaskDetailContext.listId;
  const taskDetailData = modalTaskDetailContext.taskDetailData;
  const fetchTaskDetail = modalTaskDetailContext.fetchTaskDetail;

  const formTask = useForm({
    defaultValues: {
      title: '',
      description: '',
      due_date: null,
    },
  });

  useEffect(() => {
    if (!taskDetailData?.public_id) return;

    formTask.reset({
      title: taskDetailData.title || '',
      description: taskDetailData.description || '',
      due_date:
        taskDetailData.due_date &&
        taskDetailData.due_date !== '0001-01-01T00:00:00Z'
          ? dayjs(taskDetailData.due_date)
          : null,
    });
  }, [
    taskDetailData?.public_id,
    taskDetailData?.title,
    taskDetailData?.description,
    taskDetailData?.due_date,
    formTask.reset,
  ]);

  const onSubmit = async (values) => {
    if (!taskDetailData?.public_id) return;

    setIsLoading(true);
    try {
      await services.cards.update(taskDetailData.public_id, {
        list_id: listId,
        title: values.title ?? taskDetailData.title,
        description: values.description ?? taskDetailData.description,
        due_date: values.due_date
          ? datetime.getIsoString(values.due_date)
          : taskDetailData.due_date,
        position: taskDetailData.position,
      });
      await fetchTaskDetail(taskId);
    } finally {
      setIsLoading(false);
      setEditDescription(false);
      setEditTitle(false);
      setEditDueDate(false);
    }
  };

  const handleDeleteTask = async () => {
    setIsLoading(true);
    await services.cards.remove(taskDetailData.public_id);
    handleClose();
  };

  const handleClose = async () => {
    setSearchParams({});
    setIsLoading(false);
    setIsShowConfirmDelete(false);
    await detailProjectContext.fetchBoardLists();
  };

  // useEffect(() => {
  //   if (taskId && listId) {
  //     let isActive = true;

  //     const loadTaskDetail = async () => {
  //       const response = await services.cards.getDetail(taskId);
  //       if (isActive) {
  //         setTaskDetailData(response.data.data);
  //       }
  //     };

  //     loadTaskDetail();

  //     return () => {
  //       isActive = false;
  //     };
  //   }
  // }, [taskId, listId]);

  return {
    taskDetailData,
    isLoading,
    editDescription,
    editTitle,
    editDueDate,
    isShowConfirmDelete,
    setIsLoading,
    setEditDescription,
    setEditTitle,
    setEditDueDate,
    setIsShowConfirmDelete,
    detailProjectData,
    taskId,
    listId,
    formTask,
    onSubmit,
    handleDeleteTask,
    handleClose,
  };
};

export default useModalTaskDetail;
