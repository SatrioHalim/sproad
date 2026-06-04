import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoaderData } from 'react-router';
import * as yup from 'yup';

import useDetailProjectContext from './useDetailProjectContext';

import services from '@/services';

const createListSchema = yup.object({
  title: yup.string().required('Title is required'),
});

const useCreateNewList = () => {
  const detailProjectData = useLoaderData();
  const detailProjectContext = useDetailProjectContext();

  const [isLoadingCreateList, setLoadingCreateList] = useState(false);
  const [showFormCreateList, setShowFormCreateList] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: '',
      board_public_id: detailProjectData.public_id,
    },
    resolver: yupResolver(createListSchema),
  });

  const handleOpenFormCreateList = () => {
    setShowFormCreateList(true);
  };
  const handleCloseFormCreateList = async () => {
    setShowFormCreateList(false);
    setLoadingCreateList(false);
    reset();
    await detailProjectContext.fetchBoardLists();
  };

  const onSubmitCreateList = async (values) => {
    setLoadingCreateList(true);
    await services.lists.create(values);
    handleCloseFormCreateList();
  };

  return {
    isLoadingCreateList,
    showFormCreateList,
    control,
    handleSubmit,
    onSubmitCreateList,
    handleOpenFormCreateList,
    handleCloseFormCreateList,
  };
};

export default useCreateNewList;
