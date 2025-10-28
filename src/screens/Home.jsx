  import  { useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { useNavigate } from "react-router-dom";

  import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Typography,Box,CircularProgress, Button,} from "@mui/material";
  import EditSquareIcon from '@mui/icons-material/EditSquare';

  import dayjs from "dayjs";

  import { deleteTask, getTasks, setTaskError, setTasks } from "../slices/taskSlice";
  import { logout, setAuthError, setIsLoggedIn } from "../slices/authSlice";
  import { GridDeleteIcon } from "@mui/x-data-grid";


  export default function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isFetch, setIsFetch] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const error=useSelector((state) => state.task.error);
    const tasks=useSelector((state) => state.task.tasks);

  useEffect(() => {
    return () => {
    dispatch(setTaskError(null));
    }
  }, []);

      useEffect(() => {
      (async () => {
        try{
          setIsLoading(true);
        const res = await dispatch(getTasks()).unwrap()
          dispatch(setTasks(res))
          dispatch(setTaskError(null))
          setIsLoading(false)
        }
        catch(err){
        dispatch(setTaskError(err.message))
        setIsLoading(false)
        }})();

        return () => {
          dispatch(setTaskError(null));
        };
      }, [isFetch]);


    function handleEditTask(taskId) {
  
      navigate(`/task/${taskId}`);
    }
    async function handleDeleteTask(taskId) {
      try{
        await dispatch(deleteTask(taskId)).unwrap()
        dispatch(setTasks(tasks.filter((task) => task._id !== taskId)));
        setIsFetch((prev) => !prev);
      }
      catch(err){
        dispatch(setTaskError(err))
      }
    }
    async function handleLogout() {
      try{
        await dispatch(logout()).unwrap()
        dispatch(setIsLoggedIn(false))
        navigate('/login')
      }
      catch(err){
        dispatch(setAuthError(err))
      }
      
      }

    return (
      <Box >
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ textAlign: "center" }}>
            {error}
          </Typography>
        ) : (
          <Box>
          <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <Box >
            <Button variant='outlined' onClick={()=>navigate('/')}>Home</Button>
            <Button variant='outlined' onClick={()=>navigate('/task')}>Create</Button>
            </Box>
            <Box>
            <Button variant='outlined'  onClick={handleLogout}>Logout</Button>
            <Button variant='outlined'  onClick={()=>navigate('/profile')}>Profile</Button>
            </Box>
            </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Title</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell><strong>Expiry</strong></TableCell>
                  <TableCell><strong>Priority</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Assigned To</strong></TableCell>
                  <TableCell><strong>Created By</strong></TableCell>
                  <TableCell><strong>Updated By</strong></TableCell>
                  <TableCell><strong>Created At</strong></TableCell>
                  <TableCell><strong>Updated At</strong></TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks?.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>
                      {dayjs(task.expiryDateTime).format("DD-MM-YYYY hh:mm A")}
                    </TableCell>
                    <TableCell>{task.priority}</TableCell>
                    <TableCell>{task.status}</TableCell>
                    <TableCell>
                      {Array.isArray(task.assignedTo)
                        ? task.assignedTo.map(user => user.username).join(",")
                        : ""}
                    </TableCell>
                      <TableCell>
                      {task.createdBy?.username}
                    </TableCell>
                    <TableCell>
                      {task.updatedBy?.username}
                    </TableCell>
                    <TableCell>
                      {dayjs(task.createdAt).format("DD-MM-YYYY hh:mm A")}
                    </TableCell>
                    <TableCell>
                      {dayjs(task.updatedAt).format("DD-MM-YYYY hh:mm A")}
                    </TableCell>
                    <TableCell align="center">
                      <EditSquareIcon
                        style={{ cursor: "pointer" }}
                        color="primary"
                        onClick={() => handleEditTask(task._id)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <GridDeleteIcon
                        style={{ cursor: "pointer" }}
                        color="primary"
                        onClick={() => handleDeleteTask(task._id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          </Box>
        )}
      </Box>
    );
  }
