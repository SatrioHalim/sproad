import { Paper, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';

import Select from '../../../ui/forms/select';
import TextField from '../../../ui/forms/textfield';

const Login = () => {
  const { control, watch } = useForm({
    defaultValues: {
      username: '',
      category: '',
    },
  });
  const username = watch('username');
  const category = watch('category');

  console.log(`username : ${username}`);
  console.log(`category : ${category}`);

  return (
    <Stack
      spacing={2}
      alignItems={'center'}
      justifyContent={'center'}
      height={'100vh'}
    >
      <Paper
        sx={{
          width: 600,
          padding: 2,
        }}
      >
        <TextField name={'username'} control={control} label={'Username'} />
        <Select
          name={'category'}
          control={control}
          label={'Pilih Kategori'}
          options={[
            {
              value: 'Kategori 1',
              label: 'Kategori 1',
            },
            {
              value: 'Kategori 2',
              label: 'Kategori 2',
            },
            {
              value: 'Kategori 3',
              label: 'Kategori 3',
            },
          ]}
        />
      </Paper>
    </Stack>
  );
};

export default Login;
