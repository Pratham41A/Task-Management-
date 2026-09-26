import { Typography } from "@mui/material";

export function Error({ message }) {
  if (!message) return null;

  return (
    <Typography
      color="error"
      textAlign="center"
      variant="body2"
      role="alert"
    >
      {message}
    </Typography>
  );
}
