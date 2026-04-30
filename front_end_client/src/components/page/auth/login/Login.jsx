import { Paper, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';

import Select from '../../../ui/forms/select';

const Login = () => {
  const { control } = useForm();

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
        <Select
          name={'kagegori'}
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
