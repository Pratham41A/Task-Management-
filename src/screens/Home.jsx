import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
  Dashboard as DashboardIcon,
  Delete as DeleteIcon,
  EditSquare as EditSquareIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

import { deleteTask, getTasks } from "../slices/taskSlice.js";

import { getCurrentUser, logout} from "../slices/authSlice.js";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import {Error} from "../components/Error.jsx";
import {Loader} from "../components/Loader.jsx";

dayjs.extend(utc);
dayjs.extend(timezone);

export function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, tasks, isLoading } = useSelector(function({ task = {} }) {
    return task;
  });
  const { user : { _id: currentUserId, username = "User" } } = useSelector(function({ auth = {} }) {
    return auth;
  });

  const { length: tasksLength } = tasks;

  const [taskIdToDelete, setTaskIdToDelete] = useState(null);
  const [taskTitleToDelete, setTitleToDelete] = useState(null);
  
  useEffect(function () {
    (async function() {
      try {
        await dispatch(getCurrentUser()).unwrap();
      } catch (_) {}
    })();
  }, [dispatch]);

  useEffect(function() {
    (async function() {
      try {
        await dispatch(getTasks()).unwrap();
      } catch (_) {}
    })();
  }, [dispatch]);

  function handleEditTask(taskId) {
    navigate(`/task/${taskId}`);
  }

  function handleCreateTask() {
    navigate("/task");
  }

  async function handleDeleteTask(taskId) {
    try {
      await dispatch(deleteTask(taskId)).unwrap();
    } catch (_) {}
  }

  function handleDeleteTaskClick(taskId, taskTitle) {
    setTaskIdToDelete(taskId);
    setTitleToDelete(taskTitle);
  }

  async function handleDeleteTaskConfirmation() {
    try {
      await handleDeleteTask(taskIdToDelete);
      await dispatch(getTasks()).unwrap();
    } catch (_) {
    }
    finally {
      handleDeleteTaskDialogClose();
    }
  }

  async function handleLogout() {
    try {
      await dispatch(logout()).unwrap();
      navigate("/login");
    } catch (_) {}
  }

  function handleDeleteTaskDialogClose() {
    setTaskIdToDelete(null);
    setTitleToDelete(null);
  }
  function getPriorityColor(priority) {
    const PRIORITY_COLOR_MAP = {
      High: "error",
      Normal: "default",
      Low: "default",
    };
    return PRIORITY_COLOR_MAP[priority];
  };

  function getStatusColor(status) {
    const STATUS_COLOR_MAP = {
      Completed: "success",
      Started: "primary",
      Pending: "warning",
      Expired: "error",
    };
    return STATUS_COLOR_MAP[status];
  };

  function formatLocalDateTime(date) {
    //12 Hour Format with AM/PM
    return dayjs.utc(date).local().format("DD-MM-YYYY hh:mm A");
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#fafbfc", py: 4 }}>
      <Container maxWidth="lg">
        {(function () {
          if (isLoading) {
            return <Loader />;
          } else {
            return (
          <Stack spacing={4}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                <DashboardIcon sx={{ fontSize: 40, color: "#2c3e50" }} />
                <Typography variant="h4" fontWeight={400} color="#1f2937">
                  Task Management
                </Typography>
              </Stack>
            </Box>

            <Box sx={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }}>
              <Box sx={{ p: 3 }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  spacing={2}
                >
                  <Stack direction="row" alignItems="center" spacing={2.5}>
                    <Avatar
                      sx={{
                        bgcolor: "#e5e7eb",
                        color: "#2c3e50",
                        width: { xs: 48, md: 56 },
                        height: { xs: 48, md: 56 },
                        fontWeight: 600,
                        fontSize: "1.25rem",
                      }}
                    >
                      {(username).charAt(0).toUpperCase()}
                    </Avatar>

                    <Stack spacing={0.25}>
                      <Typography variant="h6" fontWeight={600} color="#1f2937">
                        {username}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} width={{ xs: "100%", sm: "auto" }}>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleCreateTask}
                      sx={{
                        borderRadius: 1.5,
                        fontWeight: 500,
                        textTransform: "none",
                        borderColor: "#d1d5db",
                        color: "#2c3e50",
                      }}
                    >
                      New
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<LogoutIcon />}
                      onClick={handleLogout}
                      sx={{
                        borderRadius: 1.5,
                        fontWeight: 500,
                        textTransform: "none",
                        borderColor: "#d1d5db",
                        color: "#2c3e50",
                      }}
                    >
                      Logout
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Box>

            <Error message={error} />

            {(function () {
              if (tasksLength === 0) {
                return (
                  <Box sx={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }}>
                <Box sx={{ py: 8, textAlign: "center" }}>
                  <Stack alignItems="center" spacing={1}>
                    <AssignmentIcon sx={{ fontSize: 48, color: "#d1d5db" }} />
                    <Typography variant="h6" color="#6b7280">
                      No Task
                    </Typography>
                    <Typography variant="body2" color="#9ca3af">
                      Create a New Task
                    </Typography>
                  </Stack>
                </Box>
                  </Box>
                );
              } else {
                return (
                  <TableContainer component={Box} sx={{ border: "1px solid #e5e7eb" }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                      <TableCell sx={{ fontWeight: 600, color: "#374151", fontSize: "0.9rem", borderBottom: "1px solid #e5e7eb" }}>
                        Title
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#374151", fontSize: "0.9rem", borderBottom: "1px solid #e5e7eb" }}>
                        Description
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#374151", fontSize: "0.9rem", borderBottom: "1px solid #e5e7eb" }}>
                        Expiry
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#374151", fontSize: "0.9rem", borderBottom: "1px solid #e5e7eb" }}>
                        Priority
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#374151", fontSize: "0.9rem", borderBottom: "1px solid #e5e7eb" }}>
                        Status
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#374151", fontSize: "0.9rem", borderBottom: "1px solid #e5e7eb" }}>
                        Assigned To
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#374151", fontSize: "0.9rem", borderBottom: "1px solid #e5e7eb" }}>
                        Created By
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#374151", fontSize: "0.9rem", borderBottom: "1px solid #e5e7eb" }}>
                        Updated By
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#374151", fontSize: "0.9rem", borderBottom: "1px solid #e5e7eb" }}>
                        Created At
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#374151", fontSize: "0.9rem", borderBottom: "1px solid #e5e7eb" }}>
                        Updated At
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600, color: "#374151", fontSize: "0.9rem", borderBottom: "1px solid #e5e7eb" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {tasks.map(function(task = {}) {
                      const {
                        _id,
                        title,
                        description,
                        expiryDateTime,
                        priority,
                        status,
                        assignedTo = [],
                        createdBy = {},
                        updatedBy = {},
                        createdAt,
                        updatedAt,
                      } = task;

                      const { _id: createdByUserId, username: createdByUsername } = createdBy;
                      const { username: updatedByUsername } = updatedBy;

                      return (
                        <TableRow
                          key={_id}
                          sx={{
                            backgroundColor: "#fff",
                            borderBottom: "1px solid #f3f4f6"
                          }}
                        >
                          <TableCell sx={{ color: "#6b7280", fontSize: "0.9rem" }}>
                            <Typography noWrap variant="body2">
                              {title}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.9rem", color: "#6b7280" }}>
                            <Typography noWrap variant="body2">
                              {description}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.9rem", color: "#6b7280" }}>
                            {formatLocalDateTime(expiryDateTime)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={priority}
                              size="small"
                              color={getPriorityColor(priority)}
                              variant="filled"
                              sx={{ borderRadius: 1 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={status}
                              size="small"
                              color={getStatusColor(status)}
                              variant="filled"
                              sx={{ borderRadius: 1 }}
                            />
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.9rem", color: "#6b7280" }}>
                            <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                              {(assignedTo).map(function({ _id, username }) {
                                return (
                                  <Chip
                                    key={_id}
                                    label={username}
                                    size="small"
                                    color="default"
                                  variant="filled"
                                  sx={{ borderRadius: 1 }}
                              />
                              )})}
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.9rem", color: "#6b7280" }}>
                                <Chip
                                  key={_id}
                                  label={createdByUsername}
                                  size="small"
                                  color="default"
                                  variant="filled"
                                  sx={{ borderRadius: 1 }}
                              />
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.9rem", color: "#6b7280" }}>
                            {(function () {
                              if (updatedByUsername) {
                                return (
                                <Chip
                                  key={_id}
                                  label={updatedByUsername}
                                  size="small"
                                  color="default"
                                  variant="filled"
                                  sx={{ borderRadius: 1 }}
                                />
                                );
                              }
                            })()}
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.9rem", color: "#6b7280" }}>
                            {formatLocalDateTime(createdAt)}
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.9rem", color: "#6b7280" }}>
                            {(function () {
                              if (updatedAt) {
                                return formatLocalDateTime(updatedAt);
                              }
                            })()}
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={1.5} justifyContent="center">
                              <EditSquareIcon
                                onClick={function() {
                                  handleEditTask(_id);
                                }}
                                sx={{
                                  fontSize: 20,
                                  cursor: "pointer",
                                  color: "#3b82f6",
                                  transition: "0.2s"
                                }}
                              />
                              {(function () {
                                if (createdByUserId === currentUserId) {
                                  return (
                                <DeleteIcon
                                  onClick={function() {
                                    handleDeleteTaskClick(_id, title);
                                  }}
                                  sx={{
                                    fontSize: 20,
                                    cursor: "pointer",
                                    color: "#ef4444",
                                    transition: "0.2s"
                                  }}
                                  />
                                  );
                                }
                              })()}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                  </TableContainer>
                );
              }
            })()}

            </Stack>
            );
          }
        })()}
      </Container>
      <Dialog
        open={taskIdToDelete}
        onClose={handleDeleteTaskDialogClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
          {taskTitleToDelete}
        </DialogTitle>

        <DialogContent>
          <DialogContentText color="text.secondary">
            Confirm Deletion ?
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={handleDeleteTaskDialogClose}
            disabled={isLoading}
            variant="outlined"
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleDeleteTaskConfirmation}
            disabled={isLoading}
            variant="contained"
            color="error"
            disableElevation
            sx={{ textTransform: "none" }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}