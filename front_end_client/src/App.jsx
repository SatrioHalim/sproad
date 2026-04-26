import { Box,Typography,Link,createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import {
  createBrowserRouter, RouterProvider
} from 'react-router';

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
        <Typography variant='h1'>Home</Typography>
        <Link to={"/login"}>Login</Link>
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
