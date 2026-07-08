import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import useModalTaskDetailContext from './useModalTaskDetailContext';

import services from '@/services';

const useTaskAssignees = () => {
  const {
    fetchTaskDetail,
    taskId,
    membersData,
    taskDetailData,
    setTaskDetailData,
  } = useModalTaskDetailContext();

  const formTaskAssignees = useForm({
    defaultValues: {
      members: [],
    },
  });

  const [isLoading, setLoading] = useState(false);
  const [showFormAssignees, setShowFormAssignees] = useState(false);

  const normalizeAssignees = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) return value;
    if (Array.isArray(value?.assignees)) return value.assignees;
    if (Array.isArray(value?.assignee_users)) return value.assignee_users;
    if (Array.isArray(value?.members)) return value.members;
    if (Array.isArray(value?.users)) return value.users;

    return [];
  };

  const getAssigneeId = (item) =>
    item?.user?.public_id ||
    item?.public_id ||
    item?.user_public_id ||
    item?.user_id ||
    item?.id ||
    null;

  const currentAssignees = useMemo(() => {
    return normalizeAssignees(taskDetailData);
  }, [taskDetailData]);

  const currentAssigneeIds = useMemo(() => {
    return new Set(currentAssignees.map(getAssigneeId).filter(Boolean));
  }, [currentAssignees]);

  const availableMembers = useMemo(() => {
    return Array.isArray(membersData)
      ? membersData.filter(
          (item) =>
            !currentAssigneeIds.has(item.public_id) &&
            !currentAssigneeIds.has(item.id),
        )
      : [];
  }, [membersData, currentAssigneeIds]);

  useEffect(() => {
    formTaskAssignees.reset({
      members: [],
    });
  }, [taskDetailData?.public_id, formTaskAssignees]);

  const onSubmitTaskAssignees = async (values) => {
    if (!taskDetailData?.public_id || !taskId) return;

    const selectedMembers = Array.isArray(values.members)
      ? values.members.filter(Boolean)
      : values.members
        ? [values.members]
        : [];
    const nextMembers = selectedMembers.filter(
      (memberId) =>
        !currentAssigneeIds.has(memberId) &&
        !currentAssigneeIds.has(String(memberId)),
    );

    if (nextMembers.length === 0) {
      setShowFormAssignees(false);
      formTaskAssignees.reset({
        members: [],
      });
      return;
    }

    setLoading(true);
    try {
      const optimisticAssignees = nextMembers.map((memberId) => {
        const member = membersData?.find(
          (item) => item.public_id === memberId || item.id === memberId,
        );

        return {
          user: {
            name: member?.name || memberId,
            public_id: member?.public_id || memberId,
          },
          public_id: member?.public_id || memberId,
        };
      });

      setTaskDetailData((prev) => {
        const nextAssignees = [
          ...normalizeAssignees(prev),
          ...optimisticAssignees,
        ].filter(
          (item, index, self) =>
            index ===
            self.findIndex(
              (candidate) => getAssigneeId(candidate) === getAssigneeId(item),
            ),
        );

        return {
          ...prev,
          assignees: nextAssignees,
        };
      });

      await services.cards.addAssignees(taskDetailData.public_id, nextMembers);
      await fetchTaskDetail(taskId);
      formTaskAssignees.reset({
        members: [],
      });
    } finally {
      setLoading(false);
      setShowFormAssignees(false);
    }
  };

  const handleCancelAssignees = () => {
    formTaskAssignees.reset({
      members: [],
    });
    setShowFormAssignees(false);
  };

  return {
    isLoading,
    membersData,
    availableMembers,
    currentAssignees,
    formTaskAssignees,
    onSubmitTaskAssignees,
    taskDetailData,
    showFormAssignees,
    setShowFormAssignees,
    handleCancelAssignees,
  };
};

export default useTaskAssignees;
