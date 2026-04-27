import { Box,Typography,Link,createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import {
  createBrowserRouter, RouterProvider
} from 'react-router';
import Table from './components/ui/table/Table';

const theme = createTheme({
  typography: {
    fontFamily: ['Roboto', 'sans-serif'].join(','),
  },
});

const router = createBrowserRouter([
  {
    path:"/",
    element: (
      <Box>
        <Table columns={[
          {
            id:'tugas',
            label:'Tugas'
          },
          {
            id:'status',
            label:'Status'
          }
        ]} data={[
          {
            id:1,
            tugas:'Tugas 1',
            status:'Baru'
          },
          {
            id:2,
            tugas:'Tugas 2',
            status:'On-going'
          },
          {
            id:3,
            tugas:'Tugas 3',
            status:'Done'
          },
        ]}></Table>
      </Box>
    )
  },
  {
    path: "/login",
    element:(
      <Box>
        <Typography variant='h1'>Login</Typography>
        <Link to={"/"}>Back to Home</Link>
      </Box>
    )
  }
]);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router}></RouterProvider>
    </ThemeProvider>
  );
};

export default App;
