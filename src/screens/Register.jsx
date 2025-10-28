import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Box, Button, TextField,  Stack,  Typography } from '@mui/material';

import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { register,setAuthError, setIsLoggedIn, setUser } from '../slices/authSlice';

const registerSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function Register() {
    const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
    const dispatch = useDispatch();
    const error=useSelector((state) => state.auth.error);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });
  useEffect(() => {
    return () => {
        dispatch(setAuthError(null))
    }
  },[])

async function handleRegister(formData){
try{
    setIsLoading(true);
await dispatch(register(formData)).unwrap();

    alert('Registration Successfull, Please Login');
    dispatch(setIsLoggedIn(false));
    dispatch(setAuthError(null));
    dispatch(setUser(null));
      navigate('/login');
      //No Need Of setIsLoading(false), Because Navigation Resets State.
    }
    catch(err){
      dispatch(setAuthError(err));
      dispatch(setUser(null));
      dispatch(setIsLoggedIn(false));
setIsLoading(false);
    }
}


  function handleLogin(){
    navigate('/login');
}

  return (
      <Box component="form" onSubmit={handleSubmit(handleRegister)} >
        <Stack spacing={1} sx={{ display: 'flex', flexDirection: 'column',alignItems: 'center',justifyContent: 'center',height: '100vh',width:{xs:'200px',sm:'300px'},mx:'auto'}}>
            
          <Controller
            name="username"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                label="Username"
                fullWidth
                required
                {...field}
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                label="Email"
                type="email"
                fullWidth
                {...field}
                required
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                label="Password"
                type="password"
                fullWidth
                {...field}
                required
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />
    <Typography  sx={{fontSize:{xs:'15px',sm:'20px'},color:'red',textAlign:'center'}}>{error}    </Typography>
          <Button type="submit" loading={isLoading} variant="contained" color="primary">
            Register
          </Button>

          <Button variant="outlined" color="primary" onClick={handleLogin}>
            Existing User ?
          </Button>
        </Stack>
    </Box>
    )
}
