import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

const TextField = ({
  control,
  name,
  label,
  defaultValue = '',
  helperText,
  id,
  secureText = false,
  multiline = false,
  rows,
  children,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(() => secureText);
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue || ''}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => {
        return (
          <FormControl
            sx={{
              marginBottom: 2,
            }}
            variant="outlined"
            {...props}
          >
            <InputLabel htmlFor={id}>{label}</InputLabel>
            <OutlinedInput
              {...props}
              multiline={multiline}
              rows={rows}
              fullWidth
              label={label}
              variant="outlined"
              type={showPassword ? 'password' : 'text'}
              value={value}
              onBlur={onBlur}
              onChange={onChange}
              error={Boolean(error)}
              endAdornment={
                secureText ? (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ) : (
                  <></>
                )
              }
            />
            <FormHelperText error={Boolean(error)}>
              {error?.message ? error?.message : helperText}
            </FormHelperText>
            {children}
          </FormControl>
        );
      }}
    />
  );
};

export default TextField;
