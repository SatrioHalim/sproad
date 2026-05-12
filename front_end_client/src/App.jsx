import {
  createTheme,
  CssBaseline,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createBrowserRouter, RouterProvider } from 'react-router';

import authLoader from './components/layouts/authlayout/AuthLayout.loader';
import sidebarLoader from './components/layouts/sidebarlayout/SidebarLayout.loader';
import Login from './components/page/auth/login';
import Dashboard from './components/page/dashboard/Dashboard';
import DetailProject from './components/page/projects/detail_project';
import Register from './components/page/auth/register';

const theme = createTheme({
  typography: {
    fontFamily: ['Roboto', 'sans-serif'].join(','),
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    loader: sidebarLoader,
    element: <Dashboard />,
  },
  {
    path: '/login',
    loader: authLoader,
    element: <Login />,
  },
  {
    path: '/register',
    loader: authLoader,
    element: <Register />,
  },
  {
    path: '/projects/:id',
    loader: sidebarLoader,
    element: <DetailProject />,
  },
  {
    path: '/projects',
    loader: sidebarLoader,
    element: <DetailProject />,
  },
  {
    path: '/settings',
    loader: sidebarLoader,
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
