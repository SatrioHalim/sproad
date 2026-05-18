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

const Projects = () => {
  // loading
  const [isLoading, setLoading] = useState(false);
  const [boardsData, setBoardsData] = useState([]);
  const [boardsMeta, setBoardsMeta] = useState({});
  const [page, setPage] = useState(1);

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

  return (
    <SidebarLayout
      pageTitle="Project List"
      breadcrumbs={[
        {
          label: 'Project List',
        },
      ]}
    >
      <Stack>
        <Box>
          <TextField
            control={control}
            label={'Find project name'}
            id={'search'}
            name={'search'}
            size={'small'}
           />
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
  );
};

export default Projects;
