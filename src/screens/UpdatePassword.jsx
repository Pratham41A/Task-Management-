import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Stepper, Step, StepLabel, TextField, Stack, Typography } from '@mui/material';

import { forgotPasswordOtp, resetPassword, setAuthError, setIsLoggedIn, setUser, verifyForgotPasswordOtp } from '../slices/authSlice';
import { sendForgotPasswordOtpEmail } from '../services/mailService';

const steps = ['Send OTP', 'Verify OTP', 'Reset Password'];

export default function UpdatePassword() {
  const [currentStep, setCurrentStep] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.auth.error);
  const [email, setEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(setAuthError(null));
    };
  }, [dispatch]);

  async function handleSendOTP(e) {
    try {
      e.preventDefault();
      setIsLoading(true);
      const res = await dispatch(forgotPasswordOtp({ email })).unwrap();

      //await sendForgotPasswordOtpEmail(res, email);
      alert(`OTP is ${res}`);
      dispatch(setAuthError(null));
      dispatch(setIsLoggedIn(false));
      dispatch(setUser(null));
      setCurrentStep((prev) => prev + 1);
      setIsLoading(false);
    } catch (err) {
      if (err === 'Otp Already Sent') {
        alert('Otp Already Sent, Please Check Your Email');
        dispatch(setAuthError(null));
        dispatch(setIsLoggedIn(false));
        dispatch(setUser(null));
        setCurrentStep((prev) => prev + 1);
        setIsLoading(false);
      } else {
        dispatch(setAuthError(err));
        dispatch(setIsLoggedIn(false));
        dispatch(setUser(null));
        setIsLoading(false);
      }
    }
  }

  async function handleVerifyOTP(e) {
    try {
      e.preventDefault();
      setIsLoading(true);
      await dispatch(verifyForgotPasswordOtp({ email, otpInput })).unwrap();
      alert('OTP Verified, You can Reset Your Password Now');
      dispatch(setAuthError(null));
      dispatch(setIsLoggedIn(false));
      dispatch(setUser(null));
      setCurrentStep((prev) => prev + 1);
      setIsLoading(false);
    } catch (err) {
      dispatch(setAuthError(err));
      dispatch(setIsLoggedIn(false));
      dispatch(setUser(null));
      setIsLoading(false);
    }
  }

  function handleLogin() {
    navigate('/login');
  }

  async function handleResetPassword(e) {
    try {
      e.preventDefault();
      setIsLoading(true);
      await dispatch(resetPassword({ email, password })).unwrap();
      alert('Password Updated, Please Login');
      dispatch(setAuthError(null));
      dispatch(setIsLoggedIn(false));
      dispatch(setUser(null));
      navigate('/login');
    } catch (err) {
      dispatch(setAuthError(err));
      dispatch(setIsLoggedIn(false));
      dispatch(setUser(null));
      setIsLoading(false);
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh' }}>
      <Stepper activeStep={currentStep} alternativeLabel>
        {steps.map((value) => (
          <Step key={value}>
            <StepLabel slotProps={{ stepIcon: { sx: { fontSize: { xs: 30, sm: 40 } } } }} sx={{ '& .MuiStepLabel-label': { fontSize: { xs: 15, sm: 25 }, fontWeight: 'bold' } }}>{value}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box component={'form'} onSubmit={currentStep === 0 ? handleSendOTP : currentStep === 1 ? handleVerifyOTP : handleResetPassword} sx={{ mt: 10 }}>
        {currentStep === 0 && (
          <Stack spacing={2} alignItems={'center'}>
            <TextField
              label="Email"
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            <Typography fontSize={20} fontWeight={'bold'} color='red'>
              {error}
            </Typography>
            <Button loading={isLoading} variant="contained" sx={{ width: '40px', mx: 'auto' }} type='submit' color="primary">
              Send
            </Button>
          </Stack>
        )}

        {currentStep === 1 && (
          <Stack spacing={2} alignItems={'center'}>
            <TextField
              label="OTP"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              fullWidth
              required
            />
            <Typography fontSize={20} fontWeight={'bold'} color='red'>
              {error}
            </Typography>
            <Button loading={isLoading} variant="contained" sx={{ width: '70px', mx: 'auto' }} type='submit' color="primary">
              Verify
            </Button>
          </Stack>
        )}

        {currentStep === 2 && (
          <Stack spacing={2} alignItems={'center'}>
            <TextField
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              slotProps={{ htmlInput: { minLength: 6 } }}
            />
            <Typography fontSize={20} fontWeight={'bold'} color='red'>
              {error}
            </Typography>
            <Button loading={isLoading} variant="contained" sx={{ width: '60px', mx: 'auto' }} type='submit' color="primary">
              Reset
            </Button>
          </Stack>
        )}
      </Box>
      <Button variant='text' color="primary" onClick={handleLogin} sx={{ mt: 2, borderBottom: '1px solid black', borderRadius: 0 }}>Back to Login</Button>
    </Box>
  );
}
