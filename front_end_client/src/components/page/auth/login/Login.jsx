import { Button, Paper, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import AuthLayout from '@/components/layouts/authlayout';
import TextField from '@/components/ui/forms/textfield';
import session from '@/utils/session';

const Login = () => {
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm();
  const onSubmit = (formValues) => {
    console.log(`Login form submitted with values:`, formValues);
    session.setSession('dummy-token');
    navigate('/');
  };
  return (
    <AuthLayout>
      <Paper
        sx={{
          padding: 2,
          width: 500,
        }}
      >
        <Typography
          variant="h5"
          component={'h1'}
          align="center"
          sx={{
            marginBottom: 2,
          }}
        >
          Login
        </Typography>
        <Stack
          sx={{
            flexDirection: 'column',
            gap: 1,
          }}
          component={'form'}
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField label={'Email'} control={control} name={'email'} />
          <TextField
            label={'Password'}
            control={control}
            name={'password'}
            type="password"
          />
          <Button type="submit" variant="contained" fullWidth>
            Login to your account
          </Button>
          <Button
            type="button"
            variant="text"
            fullWidth
            onClick={() => {
              navigate('/signup');
            }}
          >
            Don&apos;t have an account? Register here
          </Button>
        </Stack>
      </Paper>
    </AuthLayout>
  );
};

export default Login;
