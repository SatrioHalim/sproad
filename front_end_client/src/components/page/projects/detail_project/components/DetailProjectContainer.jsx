import { Box, Button, colors, Link, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import SidebarLayout from '@/components/layouts/sidebarlayout';
import Table from '@/components/ui/table';
import services from '@/services';
import datetime from '@/utils/datetime';
import { href, useLoaderData } from 'react-router';
import useDetailProjectContext from '../hooks/useDetailProjectContext';

const DetailProjectContainer = () => {
  // loading
  // const [isLoading, setLoading] = useState(false);
  // const [boardsData, setBoardsData] = useState([]);

  const detailProjectData = useLoaderData();
  const detailProjectContext = useDetailProjectContext();

  return (
    <SidebarLayout
      pageTitle={`${detailProjectData.title} (${detailProjectContext.getProjectInitials})`}
      breadcrumbs={[
        {
          label: 'Project List',
          href:'/projects',
        },
        {
          label: detailProjectData.title,
          href: `/projects/${detailProjectData.public_id}`,
        }
      ]}
    > 
    </SidebarLayout>
  );
};

export default DetailProjectContainer;
