import { Box, Button, Link, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useDebounce } from 'use-debounce';

import SidebarLayout from '@/components/layouts/sidebarlayout';
import TextField from '@/components/ui/forms/textfield';
import Table from '@/components/ui/table';
import services from '@/services';
import datetime from '@/utils/datetime';
import Pagination from '@/components/ui/pagination';
import ModalAddNewProject from './modals/ModalAddNewProject';

const Projects = () => {
  // loading
  const [isLoading, setLoading] = useState(false);
  const [boardsData, setBoardsData] = useState([]);
  const [boardsMeta, setBoardsMeta] = useState({});
  const [page, setPage] = useState(1);
  const [openModalAddNewProject, setOpenModalAddNewProject] = useState(false);

  const { control } = useForm({
    defaultValues: {
      search: '',
    },
  });

  const watchSearch = useWatch({
    control,
    name: 'search',
  });

  const [debouncedSearch] = useDebounce(watchSearch, 1000); // debounce 1 detik

  console.log('debounced search', debouncedSearch);

  useEffect(() => {
    const fetchBoardsData = async () => {
      setLoading(true);
      const response = await services.boards.myBoards({
        filter: debouncedSearch,
        limit:5,
        page
      });
      setBoardsData(response.data.data);
      setBoardsMeta(response.data.meta);
      setLoading(false);
    };

    fetchBoardsData();
  }, [debouncedSearch,page]); // onMounted

  const handleOpenAddNewProject = () => {
    setOpenModalAddNewProject(true);
  }
  const handleCloseAddNewProject = () => {
    setOpenModalAddNewProject(false);
  }

  return (
    <>
    <SidebarLayout
      pageTitle="Project List"
      breadcrumbs={[
        {
          label: 'Project List',
        },
      ]}
    >
      <Stack direction={'row'} sx={{ 
        justifyContent:"space-between",
        alignItems:"center"
       }}>
        <Box>
          <TextField
            control={control}
            label={'Find project name'}
            id={'search'}
            name={'search'}
            size={'small'}
           />
        </Box>
        <Box>
          <Button type='button' variant='contained' onClick={handleOpenAddNewProject}>
            Add Project
          </Button>
        </Box>
      </Stack>
      <Table
        isLoading={isLoading}
        data={boardsData}
        columns={[
          {
            id: 'title',
            label: 'Project Name',
          },
          {
            id: 'description',
            label: 'Description',
          },
          {
            id: 'date',
            label: 'Created At',
            render(data) {
              return (
                <Box>{datetime.format(data.created_at, 'DD/MM/YYYY')}</Box>
              );
            },
          },
          {
            id: 'action',
            label: 'Actions',
            render(data) {
              return (
                <Link to={`/projects/${data.public_id}`}>
                  <Button type="button" variant="outlined">
                    Detail Project
                  </Button>
                </Link>
              );
            },
          },
        ]}
      />
      <Pagination
      count={boardsMeta.total_pages}
      onChange={(e,page)=>{
        setPage(page);
      }}
      ></Pagination>
    </SidebarLayout>
    <ModalAddNewProject open={openModalAddNewProject} handleClose={handleCloseAddNewProject}></ModalAddNewProject>
    </>
  );
};

export default Projects;
