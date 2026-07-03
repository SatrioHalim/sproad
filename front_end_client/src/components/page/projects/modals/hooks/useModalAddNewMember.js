import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useLoaderData } from 'react-router';
import { useDebounce } from 'use-debounce';

import useDetailProjectContext from '../../detail_project/hooks/useDetailProjectContext';

import { useSnackbar } from '@/components/ui/snackbar';
import services from '@/services';

const useModalAddnewMember = () => {
  const detailProjectData = useLoaderData();
  const detailProjectContext = useDetailProjectContext();

  const { control, reset } = useForm({
    defaultValues: {
      email: '',
    },
  });

  const watchEmail = useWatch({
    control,
    name: 'email',
  });

  const [isLoading, setLoading] = useState(false);
  const [isLoadingAddMember, setLoadingAddMember] = useState(false);
  const [usersData, setUsersData] = useState(null);
  const [debounceEmail] = useDebounce(watchEmail, 1000);

  const snackbar = useSnackbar();
  const snackbarRef = useRef(snackbar);

  useEffect(() => {
    snackbarRef.current = snackbar;
  }, [snackbar]);

  useEffect(() => {
    let isActive = true;

    const fetchUserByEmail = async (email) => {
      if (!email) {
        if (isActive) {
          setUsersData(null);
        }
        return;
      }

      try {
        if (isActive) {
          setLoading(true);
        }
        const response = await services.users.getUsers({
          filter: email,
          limit: 1,
          page: 1,
        });
        if (isActive) {
          setUsersData(response.data.data);
        }
      } catch {
        if (isActive) {
          snackbarRef.current.toggleSnackbar(true, 'Failed to fetch users');
          setUsersData(null);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchUserByEmail(debounceEmail);

    return () => {
      isActive = false;
    };
  }, [debounceEmail]);

  const handleClose = async () => {
    reset();
    setUsersData(null);
    detailProjectContext.setIsOpenModalAddNewMember(false);
    await detailProjectContext.fetchBoardMembers();
  };

  const handleAddMember = async () => {
    try {
      setLoadingAddMember(true);
      const userIds = usersData.map((item) => item.public_id);
      await services.boards.addMember(detailProjectData.public_id, userIds);
      snackbar.toggleSnackbar(true, 'Member added successfully');
    } catch {
      snackbar.toggleSnackbar(true, 'Failed to add member');
    } finally {
        detailProjectContext.setIsOpenModalAddNewMember(false);
        setLoadingAddMember(false);
        await detailProjectContext.fetchBoardMembers();
    }
  };

  return {
    control,
    isLoading,
    isLoadingAddMember,
    handleAddMember,
    handleClose,
    detailProjectContext,
    detailProjectData,
    usersData,
    debounceEmail,
    setUsersData,
  };
};

export default useModalAddnewMember;
