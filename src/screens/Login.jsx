import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

import { Box, Button } from '@mui/material';
import { SignInPage } from '@toolpad/core';

import { getUserData, login, setIsLoggedIn, setAuthError,setUser} from '../slices/authSlice';


export default function Login() {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const providers = [{ id: 'credentials', name: 'Email and Password' }];

 async function handleLogin(providers, formData) {
     
    const email = formData.get('email');
    const password = formData.get('password');
try{
     await dispatch(login({ email, password })).unwrap();
     const user=await   dispatch(getUserData('me')).unwrap();
     dispatch(setAuthError(null));
     dispatch(setIsLoggedIn(true));
     dispatch(setUser(user))
                return { type: 'Login' };
    }

catch(err){
  dispatch(setIsLoggedIn(false));
  dispatch(setAuthError(err));
  dispatch(setUser(null));
  return { type: 'Login', error: err };
    }
  }

useEffect(() => {
  return () => {
        dispatch(setAuthError(null))
  }
}, []);

function handleUpdatePassword(){

    navigate('/updatePassword')

}
function handleRegister(){

    navigate('/register')

}
  if (!isLoggedIn ) {
    return (
      <Box  sx={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <SignInPage
        sx={{position:'absolute',top:'40%',left:'50%',transform:'translate(-50%,-50%)',width:'100%'}}
          signIn={handleLogin}
          providers={providers}
          slotProps={{
emailField: {
  autoFocus: true,
  required: true,
},
passwordField: {
  slotProps: {
    htmlInput: {
      minLength: 6,
    }
  },
  required: true,
},
 submitButton: {
      sx: { width:'100px',marginTop:3,display: 'block',mx:'auto' }, 
    },
            form: { noValidate: false },
          }}  
          localeText={{
            signInTitle: 'Welcome Back',
            providerSignInTitle: () => 'Login',
            signInSubtitle: '',

          }}
        />
      
            <Button sx={{position:'absolute',top:'70%',left:'50%',transform:'translate(-50%,-50%)',borderBottom:'1px solid black',borderRadius:0}} onClick={handleUpdatePassword}>Forgot Password</Button>
          <Button sx={{position:'absolute',top:'80%',borderBottom:'1px solid black',borderRadius:0,left:'50%',transform:'translate(-50%,-50%)'}} onClick={handleRegister}>New User ?</Button>
        </Box>
    );
  }
else{
  return <Navigate to="/" replace />;
}
}
