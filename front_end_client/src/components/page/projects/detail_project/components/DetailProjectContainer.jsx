import { useLoaderData } from 'react-router';

import useDetailProjectContext from '../hooks/useDetailProjectContext';

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
    />
  );
};

export default DetailProjectContainer;
