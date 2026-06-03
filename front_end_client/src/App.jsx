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
import Register from './components/page/auth/register';
import Dashboard from './components/page/dashboard/Dashboard';
import Projects from './components/page/projects';
import DetailProject from './components/page/projects/detail_project';
import detailProjectLoader from './components/page/projects/detail_project/DetailProject.loader';
import SnackbarProvider from './components/ui/snackbar';

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
    path: '/projects',
    loader: sidebarLoader,
    children: [
      {
        path: '/projects',
        element: <Projects />,
      },
      {
        path: '/projects/:id',
        loader: detailProjectLoader,
        element: <DetailProject />,
      },
    ],
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
        <SnackbarProvider>
          <CssBaseline />
          <RouterProvider router={router} />
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
