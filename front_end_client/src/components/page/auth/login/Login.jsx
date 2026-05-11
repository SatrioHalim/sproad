import { Button, Paper, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import AuthLayout from '@/components/layouts/authlayout';
import TextField from '@/components/ui/forms/textfield';
import session from '@/utils/session';
import { useState } from 'react';
import services from '@/services';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (formValues) => {
    setLoading(true);
    try {
      const response = await services.auth.login(formValues);
      session.setSession(response.data.data.access_token);
      navigate('/');
    } catch (error) {
      // console.error('Login failed:', error);
      alert('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
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
