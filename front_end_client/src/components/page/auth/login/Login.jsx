import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';

import AuthLayout from '@/components/layouts/authlayout';
import TextField from '@/components/ui/forms/textfield';
import services from '@/services';
import session from '@/utils/session';

const loginSchema = Yup.object({
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (formValues) => {
    setLoading(true);
    try {
      const response = await services.auth.login(formValues);
      session.setSession(response.data.data.access_token);
      navigate('/');
    } catch (error) {
      // console.error('Login failed:', error);
      alert(`login failed : ${error.response?.data?.message || error.message}`);
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
          <TextField
            id={'email'}
            label={'Email'}
            control={control}
            name={'email'}
          />
          <TextField
            id={'password'}
            label={'Password'}
            control={control}
            name={'password'}
            secureText
          />
          <Button type="submit" variant="contained" fullWidth loading={loading}>
            Login to your account
          </Button>
          <Button
            type="button"
            variant="text"
            fullWidth
            onClick={() => {
              navigate('/register');
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
