import { useState } from 'react';
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

  const onSubmitTaskAssignees = async (values) => {
    if (!taskDetailData?.public_id || !taskId) return;

    const selectedMembers = Array.isArray(values.members)
      ? values.members.filter(Boolean)
      : values.members
        ? [values.members]
        : [];

    if (selectedMembers.length === 0) {
      setShowFormAssignees(false);
      return;
    }

    setLoading(true);
    try {
      const optimisticAssignees = selectedMembers.map((memberId) => {
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

      setTaskDetailData((prev) => ({
        ...prev,
        assignees: [
          ...normalizeAssignees(prev),
          ...optimisticAssignees.filter(
            (item, index, self) =>
              index ===
              self.findIndex(
                (candidate) => candidate.public_id === item.public_id,
              ),
          ),
        ],
      }));

      await services.cards.addAssignees(
        taskDetailData.public_id,
        selectedMembers,
      );
      await fetchTaskDetail(taskId);
    } finally {
      setLoading(false);
      setShowFormAssignees(false);
    }
  };

  return {
    isLoading,
    membersData,
    formTaskAssignees,
    onSubmitTaskAssignees,
    taskDetailData,
    showFormAssignees,
    setShowFormAssignees,
  };
};

export default useTaskAssignees;
