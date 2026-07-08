import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import useModalTaskDetailContext from './useModalTaskDetailContext';

import services from '@/services';

const taskAttachmentSchema = Yup.object({
  attachments: Yup.array(Yup.mixed()).min(1).required(),
});

const useTaskAttachments = () => {
  const [isLoading, setLoading] = useState();
  const [
    isShowConfirmDeleteTaskAttachment,
    setShowConfirmDeleteTaskAttachment,
  ] = useState({
    show: false,
    item: null,
  });

  const { taskDetailData, taskId, fetchTaskDetail } =
    useModalTaskDetailContext();

  const formTaskAttachment = useForm({
    defaultValues: {
      attachments: [],
    },
    resolver: yupResolver(taskAttachmentSchema),
  });

  const onSubmitTaskAttachment = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      values.attachments.forEach((file) => {
        formData.append('files', file);
      });
      await services.cards.uploadAttachment(taskDetailData.public_id, formData);
      await fetchTaskDetail(taskId);
      formTaskAttachment.reset({
        attachments: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const onDeleteTaskAttachment = async (attachmentId) => {
    setLoading(true);
    try {
      await services.cards.deleteAttachment(
        taskDetailData.public_id,
        attachmentId,
      );
      await fetchTaskDetail(taskId);
    } finally {
      setLoading(false);
      setShowConfirmDeleteTaskAttachment({
        show: false,
        item: null,
      });
    }
  };

  return {
    taskDetailData,
    formTaskAttachment,
    isShowConfirmDeleteTaskAttachment,
    setShowConfirmDeleteTaskAttachment,
    isLoading,
    setLoading,
    onSubmitTaskAttachment,
    onDeleteTaskAttachment,
  };
};

export default useTaskAttachments;
