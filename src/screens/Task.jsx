import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { object, string, date, array } from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Box,
  Button,
  Chip,
  ClickAwayListener,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { createTask, getSpecificTask, updateTask } from "../slices/taskSlice.js";
import { getUsers } from "../slices/authSlice.js";

import {Error} from "../components/Error.jsx";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { DateTimePicker } from "@mantine/dates";

dayjs.extend(utc);
dayjs.extend(timezone);

const taskSchema = object({
  title: string().trim().required("Title Required"),
  description: string().trim(),
  expiryDateTime: date()
    .required("Expiry Required")
    .test("future-expiry", "Invalid Expiry", function (value) {
      const dateVal = dayjs(value);
      return dateVal.isValid() && dateVal.isAfter(dayjs());
    }),
  priority: string()
    .required("Priority Required")
    .oneOf(["Low", "Normal", "High"]),
  status: string()
    .required("Status Required")
    .oneOf(["Pending", "Started", "Completed", "Expired"]),
  assignedTo: array()
    .min(1, "Minimum 1 Assigned To")
    .required("Assigned To Required"),
});

export function Task() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const { error } = useSelector(function ({ task = {} }) {
    return task;
  });
  const { isLoading } = useSelector(function ({ auth = {} }) {
    return auth;
  });

  const originalAssignedToIds = useRef([]);
  const selectedAssignedToIdsRef = useRef(new Set());

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [areMoreUsers, setAreMoreUsers] = useState(false);
  const [isAssignedToDropdownVisible, setIsAssignedToDropdownVisible] = useState(false);
  const currentPageRef = useRef(1);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      expiryDateTime: dayjs().add(1, "day").startOf("day").toDate(),
      priority: "Normal",
      status: "Pending",
      assignedTo: [],
    },
  });

  const {
    title: { message: titleError } = {},
    description: { message: descriptionError } = {},
    priority: { message: priorityError } = {},
    status: { message: statusError } = {},
    expiryDateTime: { message: expiryDateTimeError } = {},
    assignedTo: { message: assignedToError } = {},
  } = errors || {};

  useEffect(function () {
    if (!id) return;

    const { length: idLength } = id || {};

    if (idLength !== 24) {
      navigate("/task");
      return;
    }

    (async function () {
      try {
        const task = await dispatch(getSpecificTask(id)).unwrap();

        const {
          assignedTo = [],
          title,
          description,
          expiryDateTime,
          priority,
          status,
        } = task;

        originalAssignedToIds.current = assignedTo.map(function ({ _id }) {
          return _id;
        });

        selectedAssignedToIdsRef.current = new Set(
          assignedTo.map(function ({ _id }) {
            return _id;
          })
        );

        reset({
          title,
          description,
          expiryDateTime: dayjs.utc(expiryDateTime).local().toDate(),
          priority,
          status,
          assignedTo,
        });
      } catch (_) {
      }
    })()

  }, [dispatch, id, navigate, reset]);

  async function handleGetUsers(input) {
    try {
      while (true) {
        const page = currentPageRef.current;
        
        const responseUsers = await dispatch(
          getUsers({ page, search: input })
        ).unwrap();

        const { length: responseUsersLength } = responseUsers || {};

        if (responseUsersLength === 0) {
          setAreMoreUsers(false);
          return
        }
        
        const newUsers = responseUsers.filter(
          function ({ _id }) {
            return !selectedAssignedToIdsRef.current.has(_id);
          }
        );

        const { length: newUsersLength } = newUsers || {};

        if (newUsersLength) {
          setUsers(function (currentUsers) {
            return page === 1 ? newUsers : [...currentUsers, ...newUsers];
          });
          setAreMoreUsers(responseUsersLength === 5);
          return;
        }

        if (responseUsersLength === 5) {
          setAreMoreUsers(true);
          currentPageRef.current += 1;
        } else {
          setAreMoreUsers(false);
          return;
        }
      }
    } catch (_) {
    }
  }

  useEffect(function () {
    const { length: searchLength } = search || {};

    currentPageRef.current = 1;
    setUsers([]);
    setAreMoreUsers(false);

    if (searchLength >= 5) {
      setIsAssignedToDropdownVisible(true);
      (async function () {
        try {
          await handleGetUsers(search);
        } catch (_) {
        }
      })();
    } else {
      setIsAssignedToDropdownVisible(false);
    }
  }, [dispatch, search]);

  async function handleLoadMoreUsers() {
    try {
      currentPageRef.current += 1;
      await handleGetUsers(search);
    } catch (_) {
    }
  }

  async function handleTaskSubmit(body) {
    try {
      const {
        title,
        description,
        expiryDateTime,
        priority,
        status,
        assignedTo = [],
      } = body || {};

      const assignedToIds = assignedTo.map(function({ _id }) {
        return _id;
      });

      body = {
        title,
        description,
        expiryDateTime: dayjs(expiryDateTime).utc(),
        priority,
        status,
      };

      if (id) {
        const assignedToAdd = assignedToIds.filter(
          function (id) {
            return !originalAssignedToIds.current.includes(id);
          }
        );

        const assignedToRemove = originalAssignedToIds.current.filter(
          function (id) {
            return !assignedToIds.includes(id);
          }
        );

        body = {
          ...body,
          assignedTo: { add: assignedToAdd, remove: assignedToRemove },
        };

        await dispatch(updateTask({ id, ...body })).unwrap();
        navigate("/");
      } else {
        body = {
          ...body,
          assignedTo: assignedToIds,
        };
        await dispatch(createTask(body)).unwrap();
        navigate("/");
      }
    } catch (_) {
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fb 0%, #eef3f8 100%)",
        py: { xs: 3, md: 6 },
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={function () {
                navigate("/");
              }}
              sx={{
                borderRadius: 1.5,
                fontWeight: 500,
                textTransform: "none",
                borderColor: "#cbd5e1",
                color: "#334155",
                backgroundColor: "rgba(255, 255, 255, 0.72)",
              }}
            >
              Back
            </Button>
          </Stack>

          <Error message={error} />

          <Box
            sx={{
              backgroundColor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 3,
              boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: { xs: 2.5, sm: 4, md: 5 },
                py: { xs: 3, sm: 4, md: 5 },
              }}
            >
              <Stack component="form" spacing={3} onSubmit={handleSubmit(handleTaskSubmit)}>
                <Box>
                  <Controller
                    name="title"
                    control={control}
                    render={function ({ field }) {
                      return (
                        <TextField
                          {...field}
                          fullWidth
                          label="Title"
                          placeholder="Title"
                        error={titleError}
                        helperText={titleError}
                        variant="outlined"
                      />
                    )}}
                  />
                </Box>

                <Box>
                  <Controller
                    name="description"
                    control={control}
                    render={function ({ field }) {
                      return (
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          rows={4}
                          label="Description"
                          placeholder="Description"
                          error={descriptionError}
                          helperText={descriptionError}
                          variant="outlined"
                      />
                    )}}
                  />
                </Box>

                <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                  <Box sx={{ flex: 1 }}>
                    <FormControl fullWidth error={priorityError}>
                      <InputLabel id="priority-label">Priority</InputLabel>
                      <Controller
                        name="priority"
                        control={control}
                        render={function ({ field }) {
                          return (
                            <Select
                              labelId="priority-label"
                              label="Priority"
                              {...field}
                              sx={{
                              borderRadius: 1.5,
                              backgroundColor: "#f8fafc",
                            }}
                          >
                            <MenuItem value="Low">Low</MenuItem>
                            <MenuItem value="Normal">Normal</MenuItem>
                            <MenuItem value="High">High</MenuItem>
                          </Select>
                        )}}
                      />
                      {priorityError && <FormHelperText>{priorityError}</FormHelperText>}
                    </FormControl>
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <FormControl fullWidth error={statusError}>
                      <InputLabel id="status-label">Status</InputLabel>
                      <Controller
                        name="status"
                        control={control}
                        render={function ({ field }) {
                          return (
                            <Select
                              labelId="status-label"
                              label="Status"
                              {...field}
                              sx={{
                              borderRadius: 1.5,
                              backgroundColor: "#f8fafc",
                            }}
                          >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Started">Started</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                            <MenuItem value="Expired">Expired</MenuItem>
                          </Select>
                        )}}
                      />
                      {statusError && <FormHelperText>{statusError}</FormHelperText>}
                    </FormControl>
                  </Box>
                </Stack>

                <Box>
                  <Controller
                    name="expiryDateTime"
                    control={control}
                    render={function ({ field }) {
                      const { value, onChange } = field;
                      return (
                        <DateTimePicker
                          w="100%"
                          size="md"
                          radius="sm"
                          label="Expiry Date & Time"
                          value={value}
                          onChange={function (value) {
                            onChange(value ? dayjs(value).toDate() : null);
                          }}
                          valueFormat="DD-MM-YYYY HH:mm"
                          minDate={new Date()}
                          timePickerProps={{
                            format: "24h",
                          }}
                          error={expiryDateTimeError}
                        />
                      );
                    }}
                  />
                </Box>
                <Box>
                  <Stack spacing={0.5} sx={{ mb: 1.5 }}>
                    <Typography variant="subtitle1" fontWeight={700} color="#1f2937">
                      Assigned Users
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Search by Username
                    </Typography>
                  </Stack>

                  <Controller
                    name="assignedTo"
                    control={control}
                    render={function ({ field }) {
                      const { value = [] } = field || {};
                      const { length: usersLength } = users || {};

                      return (
                        <ClickAwayListener
                          onClickAway={function () {
                            setIsAssignedToDropdownVisible(false);
                          }}
                        >
                          <Box>
                          <TextField
                            label="Search User"
                            placeholder="Type Minimum 5 Characters"
                            value={search}
                            onChange={function (event) {
                              let { target: { value: newInput } } = event || {};
                                newInput = newInput.trim()
                                const { length: newInputLength } = newInput || {};
                                setSearch(newInput);
                                setIsAssignedToDropdownVisible(newInputLength >= 5);
                            }}
                            spellCheck={false}
                            error={assignedToError}
                            helperText={assignedToError}
                            fullWidth
                          />

                          {isAssignedToDropdownVisible && (
                            <Box
                              sx={{
                                mt: 0.5,
                                border: "1px solid #e5e7eb",
                                borderRadius: 1.5,
                                overflow: "hidden",
                                backgroundColor: "#fff",
                                boxShadow: "0 10px 25px rgba(15, 23, 42, 0.12)",
                              }}
                            >
                              {isLoading ? (
                                <Typography sx={{ px: 2, py: 1.5 }} color="text.secondary">
                                  Searching Users
                                </Typography>
                              ) : usersLength > 0 ? (
                                <List disablePadding sx={{ maxHeight: 280, overflowY: "auto" }}>
                                  {users.map(function (user) {
                                    const { _id: userId, username } = user || {};
                                    return (
                                      <ListItem key={userId} disablePadding>
                                        <Button
                                          fullWidth
                                          onClick={function () {
                                            field.onChange([...value, user]);
                                            setUsers(function (currentUsers) {
                                              return currentUsers.filter(function ({ _id }) {
                                                return _id !== userId;
                                              });
                                            });
                                            selectedAssignedToIdsRef.current.add(userId);
                                        }}
                                        sx={{
                                          justifyContent: "flex-start",
                                          px: 2,
                                          py: 1.25,
                                          borderRadius: 0,
                                          color: "#1f2937",
                                          textTransform: "none",
                                          fontWeight: 500,
                                        }}
                                      >
                                        {username}
                                      </Button>
                                    </ListItem>
                                  );
                                }
                                  )}
                                </List>
                              ) : (
                                <Typography sx={{ px: 2, py: 1.5 }} color="text.secondary">
                                    No User
                                </Typography>
                              )}

                              {areMoreUsers && (
                                <Box sx={{ p: 1, borderTop: "1px solid #f1f5f9" }}>
                                  <Button
                                    fullWidth
                                    size="small"
                                    onClick={handleLoadMoreUsers}
                                    sx={{
                                      borderRadius: 1,
                                      textTransform: "none",
                                      fontWeight: 600,
                                    }}
                                  >
                                    Load More Users
                                  </Button>
                                </Box>
                              )}
                            </Box>
                          )}

                          {selectedAssignedToIdsRef.current.size > 0 && (
                            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1.5 }}>
                              {value.map(function (user) {
                                const { _id: userId, username } = user || {};

                                return (
                                <Chip
                                  key={userId}
                                  label={username}
                                  onDelete={function () {
                                    field.onChange(value.filter(function ({ _id }) {
                                      return _id !== userId;
                                    }));
                                    setUsers(function (currentUsers) {
                                      return [...currentUsers, user];
                                    });
                                    selectedAssignedToIdsRef.current.delete(userId);
                                  }}
                                  sx={{
                                    borderRadius: 1,
                                    backgroundColor: "#eef0f4",
                                    color: "#0b0c0d",
                                    fontWeight: 600,
                                  }}
                                />
                                );
                              })}
                            </Stack>
                          )}
                          </Box>
                        </ClickAwayListener>
                      );
                    }
                  }
                  />
                </Box>

                <Stack direction="row" spacing={2} justifyContent="flex-end" pt={2}>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    variant="contained"
                    size="large"
                    sx={{
                      minWidth: 120,
                      borderRadius: 1.5,
                      boxShadow: "none",
                      textTransform: "none",
                      fontWeight: 700,
                      backgroundColor: "#2563eb",
                    }}
                  >
                    {id ? "Update" : "Create"}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
