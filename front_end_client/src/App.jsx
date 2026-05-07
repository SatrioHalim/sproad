import {
  Box,
  createTheme,
  CssBaseline,
  Link,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createBrowserRouter, RouterProvider } from 'react-router';

import Login from './components/page/auth/login';
import Dashboard from './components/page/dashboard/Dashboard';
import DetailProject from './components/page/projects/detail_project';
import Pagination from './components/ui/pagination';
import Table from './components/ui/table/Table';

const theme = createTheme({
  typography: {
    fontFamily: ['Roboto', 'sans-serif'].join(','),
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Box>
        <Table
          columns={[
            {
              id: 'tugas',
              label: 'Tugas',
            },
            {
              id: 'status',
              label: 'Status',
            },
          ]}
          data={[
            {
              id: 1,
              tugas: 'Tugas 1',
              status: 'Baru',
            },
            {
              id: 2,
              tugas: 'Tugas 2',
              status: 'On-going',
            },
            {
              id: 3,
              tugas: 'Tugas 3',
              status: 'Done',
            },
          ]}
        />
        <Pagination
          count={10}
          onChange={(event, page) => {
            console.log('page: ', page);
          }}
        />
      </Box>
    ),
  },
  {
    path: '/link',
    element: (
      <Box>
        <Typography variant="h1">Login</Typography>
        <Link to={'/'}>Back to Home</Link>
      </Box>
    ),
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/projects/:id',
    element: <DetailProject />,
  },
  {
    path: '/projects',
    element: <DetailProject />,
  },
  {
    path: '/settings',
    element: <Typography>Pengaturan</Typography>,
  },
  
]);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <RouterProvider router={router} />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
