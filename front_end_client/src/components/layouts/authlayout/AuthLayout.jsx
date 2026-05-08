import { Stack } from '@mui/material';

const AuthLayout = ({ children }) => {
  return (
    <Stack
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
      }}
    >
      {children}
    </Stack>
  );
};

export default AuthLayout;
