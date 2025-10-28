import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  useNavigate, useParams } from "react-router-dom";

import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import dayjs from "dayjs"


import {TextField,Button,MenuItem,Select,FormControl,FormHelperText,Grid,Box,InputLabel} from "@mui/material";
import { DateTimeField } from "@mui/x-date-pickers/DateTimeField";
import { createTask, getTaskById, setTaskError, updateTask } from "../slices/taskSlice";



const taskSchema = yup.object().shape({
  title: yup.string().trim().required("Title is Required"),
  description: yup.string().trim(),
expiryDateTime: yup
  .mixed()
  .required("Expiry is Required")
  .test("valid-date", "Expiry must be Valid Date", (value) => {
    return dayjs(value).isValid();
  })
  .test("valid-future", "Expiry must be in Future", (value) => {
  return dayjs(value).isAfter(dayjs());
  }),
  priority: yup
    .string()
    .required("Priority is Required")
    .oneOf(["Low", "Normal", "High"]),
  status: yup
    .string()
    .required("Status is Required")
    .oneOf(["Pending", "Completed"]),
  assignedTo: yup
    .array()
    .min(1, "At least one Assigned User is Required")
    .of(yup
        .string()
        .length(24, "Each assigned user ID must be exactly 24 characters")),
});



export default function Task() {
  const dispatch=useDispatch();
const {value}=useParams();
   const navigate = useNavigate();
  const error = useSelector(state => state.task.error);
  const [isLoading,setIsLoading]= useState(false)
    const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(taskSchema),
 defaultValues: {
      title: "",
      description: "",
      expiryDateTime: dayjs().add(1, "day").startOf("day"),
      priority: "Normal",        
      status: "Pending",         
      assignedTo: []
    }
  });

  useEffect(() => {
    (async function () {

       if (!value) {

    return;
  }
    if(value.length===24){

      try{
const res=await    dispatch(getTaskById(value)).unwrap()

          reset({
            title: res.title,
            description: res.description,
            expiryDateTime: dayjs(res.expiryDateTime),
            priority: res.priority ,
            status: res.status,
            assignedTo: res.assignedTo
          });
          return;
        }
        catch(err){
       navigate("/task", { replace: true });
        }
  }
navigate("/task", { replace: true });
})();
  }, []);

useEffect(()=>{

  return ()=>{
        dispatch(setTaskError(null))
  }

},[])







  async function handleTaskSubmit(data) {
    setIsLoading(true)
    const body={
      title: data.title,
      description: data.description,
      expiryDateTime: dayjs(data.expiryDateTime).toDate(),
      priority: data.priority,
      status: data.status,
      assignedTo: data.assignedTo,
    }
    if (value) {
      try{
  await  dispatch(updateTask({id:value,...body})).unwrap()
 dispatch(setTaskError(null))
 navigate("/");
      }
      catch(err){
dispatch(setTaskError(err))
 setIsLoading(false)
      }
    } else {
      try{
await dispatch(createTask(body)).unwrap();
  dispatch(setTaskError(null))
  navigate("/");
      }
      catch(err){
dispatch(setTaskError(err))
setIsLoading(false)
      }

    }
  }

  return (
<Box>
  <Button variant="outlined"  onClick={()=>navigate('/')}>Home</Button>
    <Box component="form"  noValidate={false}>
      <Grid container spacing={4} columns={{ xs: 1, md: 2, }} sx={{m:4}}>      
       <Grid size={{ xs: 1, md: 1 }} >
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Title"
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            )}
          />
          </Grid>
           <Grid size={{ xs: 1, md: 1 }}  >
   <Controller
              name="expiryDateTime"
              control={control}
              render={({ field }) => (
                <DateTimeField
                  sx={{ width: "100%" }}
                  format="DD-MM-YYYY hh:mm A"
                  label="Expiry (Default : Tomorrow)"
      value={field.value ?? expiryDateTime}
      onChange={(val) => field.onChange(val)}
                  slotProps={{
                    textField: {
                      error: !!errors.expiryDateTime,
                      helperText: errors.expiryDateTime?.message,
                    },
                  }}
                />
              )}
            />
</Grid>
  <Grid size={{ xs: 1, sm: 1 }} >
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                rows={4}
                label="Description"
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 1, sm: 1 }}>
          <FormControl fullWidth error={!!errors.priority}>
            <InputLabel id="priority-label">Priority</InputLabel>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select labelId="priority-label" label="Priority" {...field}>
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Normal">Normal</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              )}
            />
            <FormHelperText>{errors.priority?.message}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 1, sm: 1 }}>
          <Controller
            name="assignedTo"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Assigned To (comma separated)"
                value={Array.isArray(field.value) ? field.value.join(",") : ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value
                      .split(",")
                      .map((value) => value.trim())
                  )
                }
                error={!!errors.assignedTo}
               helperText={
  Array.isArray(errors.assignedTo)
    ? (()=>{const index = errors.assignedTo.findIndex((error) => error.type === "length") 
      return `The id at ${index+1} index must be of 24 length.`;
    })()
    : errors.assignedTo?.message
  }

              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 1, sm: 1 }}>
          <FormControl fullWidth error={!!errors.status}>
            <InputLabel id="status-label">Status</InputLabel>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select labelId="status-label" label="Status" {...field}>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              )}
            />
            <FormHelperText>{errors.status?.message}</FormHelperText>
          </FormControl>
        </Grid>


<Box sx={{ display: "flex", justifyContent: "center", width: "100%"}} >
  <Button type="submit" onClick={handleSubmit(handleTaskSubmit)} loading={isLoading} variant="contained" color="primary">
    {value&&value.length===24?"Update":"Create"}
  </Button>
</Box>


      </Grid>
      <div  style={{display: "flex",justifyContent: "center", color: "red" ,fontWeight: "bold"}}>{error}</div>
    </Box>
 </Box>
  );
}
