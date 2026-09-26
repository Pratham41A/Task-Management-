import { useDispatch, useSelector } from "react-redux";
import {  useNavigate } from "react-router-dom";
import { useState } from "react";
import { Box, Typography, TextField, Button, Stack } from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";

import { register } from "../slices/authSlice.js";
import {Error} from "../components/Error.jsx";

const registerSchema = object({
  username: string().required("Username Required"),
  email: string()
    .email("Invalid Email")
    .required("Email Required"),
  password: string()
    .min(5, "Minimum 5 Password Characters")
    .required("Password Required"),
});

export function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, isLoading } = useSelector(function({ auth = {} }) {
    return auth;
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function handleRegister(body) {
    try {
      await dispatch(register(body)).unwrap();
      alert("Registration Successful. Please Login.");
      navigate("/login");
    } catch (_) {
    }
    finally {
      setIsSubmitted(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: 400 },
          maxWidth: 400,
          p: 4,
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={500}
          textAlign="center"
          marginBottom={5}
        >
          Create Account
        </Typography>

        <Box component="form" onSubmit={handleSubmit(handleRegister)} noValidate>
          <Stack spacing={2}>
            <Controller
              name="username"
              control={control}
              render={function({ field }) {
                const { username: { message } = {} } = errors || {};
                return (
                  <TextField
                    {...field}
                    label="Username"
                    fullWidth
                    error={message}
                    helperText={message}
                  />
                );
              }}
            />

            <Controller
              name="email"
              control={control}
              render={function({ field }) {
                const { email: { message } = {} } = errors || {};

                return (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    fullWidth
                    error={message}
                    helperText={message}
                  />
                );
              }}
            />

            <Controller
              name="password"
              control={control}
              render={function({ field }) {
                const { password: { message } = {} } = errors || {};

                return (
                  <TextField
                    {...field}
                    label="Password"
                    type="password"
                    fullWidth
                    error={message}
                    helperText={message}
                  />
                );
              }}
            />

            {isSubmitted && <Error message={error} />}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              loading={isLoading}
              sx={{ py: 1.2 }}
            >
              Register
            </Button>

            <Button
              onClick={function() {
                navigate("/login");
              }}
              disabled={isLoading}
              sx={{
                textTransform: "none",
                borderBottom: "1px solid",
                borderRadius: 0,
                alignSelf: "center",
              }}
            >
              Existing User ?
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}