import {
  Box,
  Button,
  Link,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import SidebarLayout from '@/components/layouts/sidebarlayout';
import Table from '@/components/ui/table';
import services from '@/services';
import datetime from '@/utils/datetime';

const Projects = () => {
  // loading
  const [isLoading, setLoading] = useState(false);
  const [boardsData, setBoardsData] = useState([]);

  const { control } = useForm({
    defaultValues: {
      search: '',
    },
  });

  useEffect(() => {
    const fetchBoardsData = async () => {
      setLoading(true);
      const response = await services.boards.myBoards({
        filter: debounceSearch,
      });
      setBoardsData(response.data.data);
      setLoading(false);
    };

    fetchBoardsData();
  }, []); // onMounted

  return (
    <SidebarLayout
      pageTitle="Project Detail"
      breadcrumbs={[
        {
          label: 'Project List',
        },
      ]}
    >
      <Table
        isLoading={isLoading}
        data={boardsData}
        columns={[
          {
            id: 'title',
            label: 'Nama proyek',
          },
          {
            id: 'description',
            label: 'Deskripsi',
          },
          {
            id: 'title',
            label: 'Tanggal dibuat',
            render(data) {
              return (
                <Box>{datetime.format(data.created_at, 'DD/MM/YYYY')}</Box>
              );
            },
          },
          {
            id: 'title',
            label: 'Aksi',
            render(data) {
              return (
                <Link to={`/projects/${data.public_id}`}>
                  <Button type="button" variant="outlined">
                    Detail proyek
                  </Button>
                </Link>
              );
            },
          },
        ]}
      />
    </SidebarLayout>
  );
};

export default Projects;
