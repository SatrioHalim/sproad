import { Stack } from '@mui/material';
import { useLoaderData } from 'react-router';

import useDetailProjectContext from '../hooks/useDetailProjectContext';

import CreateNewList from './CreateNewList';

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
        sx={{
          height: 800,
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          flexDirection: 'row',
          gap: 2,
          overflow: 'auto',
          pb: 5,
        }}
      >
        <CreateNewList />
      </Stack>
    </SidebarLayout>
  );
};

export default DetailProjectContainer;
