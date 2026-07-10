import { TabPanel } from '@mui/lab';
import { Typography } from '@mui/material';

const DashboardPanel = ({ value }) => {
  return (
    <TabPanel
      value={value}
      sx={{
        paddingY: 3,
        paddingX: 0,
      }}
    >
      <Typography>Dashboard</Typography>
    </TabPanel>
  );
};

export default DashboardPanel;
