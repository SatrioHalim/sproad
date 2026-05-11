import { Visibility, VisibilityOff } from '@mui/icons-material';
import { TextField as BaseTextField, Box, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

const TextField = ({
  control,
  name,
  label,
  defaultValue = '',
  helperText,
  id,
  secureText = false,
  ...props
}) => {

  const [showPassword, setShowPassword] = useState(false);

  useEffect(()=>{
    setShowPassword(secureText)
  },[secureText])
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue || ''}
      render={({ field: { value, onChange, onBlur },fieldState:{error} }) => {
        return (
          <FormControl
            sx={{
              marginBottom: 2,
            }}
            variant='outlined'
          >
            <InputLabel htmlFor={id}>{label}</InputLabel>
            <OutlinedInput
              {...props}
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
                  <InputAdornment position='end'>
                  <IconButton onClick={()=>{setShowPassword(!showPassword)}} edge='end'>
                    {showPassword ? <VisibilityOff></VisibilityOff>: <Visibility></Visibility>}
                  </IconButton>
                </InputAdornment>
                ) : (
                  <></>
                )
              }
            />
            <FormHelperText error={Boolean(error)}>{error ?.message ? error?.message : helperText}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
};

export default TextField;
