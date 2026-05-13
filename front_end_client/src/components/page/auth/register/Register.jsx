import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';

import AuthLayout from '@/components/layouts/authlayout';
import Dialog from '@/components/ui/dialog';
import TextField from '@/components/ui/forms/textfield';
import services from '@/services';

const registerSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState({
    title: '',
    message: '',
  });
  const [dialogActions, setDialogActions] = useState([]);
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (formValues) => {
    setLoading(true);
    try {
      const response = await services.auth.register(formValues);
      navigate('/login');
    } catch (error) {
      setOpenDialog(true);
      setDialogMessage({
        title: 'Registration Failed',
        message:
          error?.response?.data?.message ??
          'An error occurred during registration. Please try again.',
      });
      setDialogActions([
        {
          label: 'Understand',
          onClick() {
            setOpenDialog(false);
          },
        },
      ]);
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
          Register
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
            id={'name'}
            label={'Name'}
            control={control}
            name={'name'}
          />
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
          <TextField
            id={'confirmPassword'}
            label={'Confirm Password'}
            control={control}
            name={'confirmPassword'}
            secureText
          />
          <Button type="submit" variant="contained" fullWidth loading={loading}>
            Register for an account
          </Button>
          <Button
            type="button"
            variant="text"
            fullWidth
            onClick={() => {
              navigate('/login');
            }}
          >
            Already have an account? Login here
          </Button>
        </Stack>
      </Paper>
      <Dialog
        open={openDialog}
        actions={dialogActions}
        {...dialogMessage}
       />
    </AuthLayout>
  );
};

export default Register;
