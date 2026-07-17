import { TabContext, TabList } from '@mui/lab';
import { Tab } from '@mui/material';
import { useState } from 'react';

import ModalTaskDetail from '../../modals/ModalTaskDetail';
import useDetailProjectContainer from '../hooks/useDetailProjectContainer';

import Dashboard from './dashboard';
import ProjectBoardPanel from './ProjectBoardPanel';

import SidebarLayout from '@/components/layouts/sidebarlayout';

const DetailProjectContainer = () => {
  const [activeTab, setactiveTab] = useState(2);
  const handleChangeTab = (_, newValue) => {
    setactiveTab(newValue);
  };

  const { detailProjectData, detailProjectContext } =
    useDetailProjectContainer();

  return (
    <>
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
        <TabContext value={activeTab}>
          <TabList onChange={handleChangeTab}>
            <Tab label="Dashboard" value={1} />
            <Tab label="Project" value={2} />
          </TabList>
          {activeTab == 1 ? (
            <Dashboard />
          ) : (
            <ProjectBoardPanel value={2} />
          )}
        </TabContext>
      </SidebarLayout>
      <ModalTaskDetail />
    </>
  );
};

export default DetailProjectContainer;
