import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { Box } from "@mui/material";
import { Typography } from "@mui/material";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { Stack } from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";

import { login } from "../slices/authSlice.js";
import {Error} from "../components/Error.jsx";

const loginSchema = object({
  email: string().email("Invalid Email").required("Email Required"),
  password: string()
    .min(5, "Minimum 5 Password Characters")
    .required("Password Required"),
});

export function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, isLoading } = useSelector(function({ auth }) {
    return auth;
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleLogin(body) {
    try {
      await dispatch(login(body)).unwrap();
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
          Access Account
        </Typography>

        <Box component="form" onSubmit={handleSubmit(handleLogin)} noValidate>
          <Stack spacing={2}>
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
              Login
            </Button>

            <Button
              onClick={function() {
                navigate("/register");
              }}
              disabled={isLoading}
              sx={{
                textTransform: "none",
                borderBottom: "1px solid",
                borderRadius: 0,
                alignSelf: "center",
              }}
            >
              New User ?
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}