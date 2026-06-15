import { Stack } from '@mui/material';
import { useLoaderData } from 'react-router';

import useDetailProjectContext from '../hooks/useDetailProjectContext';

import CreateNewList from './CreateNewList';
import ListSortableItem from './ListSortableItem';

import SidebarLayout from '@/components/layouts/sidebarlayout';

const DetailProjectContainer = () => {
  const detailProjectData = useLoaderData();
  const detailProjectContext = useDetailProjectContext();

  return (
    <SidebarLayout
      pageTitle={`${detailProjectData.title} (${detailProjectContext.getProjectInitials})`}
      breadcrumbs={[
        {
          label: 'Project List',
          href: '/projects',
        },
        {
          label: detailProjectData.title,
          href: `/projects/${detailProjectData.public_id}`,
        },
      ]}
    >
      <Stack
        direction={'row'}
        sx={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: 2,
          pb: 5,
          overflowX: 'auto',
        }}
      >
        {Array.from({ length: 3 }, (k, v) => (
          <ListSortableItem />
        ))}
        <CreateNewList />
      </Stack>
    </SidebarLayout>
  );
};

export default DetailProjectContainer;
