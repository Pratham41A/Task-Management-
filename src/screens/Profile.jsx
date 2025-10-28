import { useEffect } from "react"
import { getUserData, setAuthError } from "../slices/authSlice"
import { useDispatch, useSelector } from "react-redux"
import { Box, Button, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"

export default function Profile() {
  const dispatch = useDispatch()
  const navigate=useNavigate()
  const user = useSelector((state) => state.auth.user)
    useEffect(() => {
        (async () => {
            try {
                await dispatch(getUserData('me')).unwrap()
                dispatch(setAuthError(null))
            } catch (err) {
               dispatch(setAuthError(err))
            }
        })()
    }, [])
  
    return (
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center',justifyContent: 'center',height:'80vh'}}>
        <Button variant="outlined" onClick={() => navigate('/')} sx={{position:'absolute',top:20,left:20}}>Home</Button>
        <Box sx={{color:'white',backgroundColor:'#1976d2',display:'flex',flexDirection:'column',gap:3,padding:{xs:2,sm:5},borderRadius:10}}>
    <Typography fontSize={{xs:30,sm:60}} fontWeight={'bold'}>Profile</Typography>
  <Typography fontSize={{xs:15,sm:30}}  >UserId : {user._id}</Typography>
  <Typography fontSize={{xs:15,sm:30}}  >Username : {user.username}</Typography>
  <Typography fontSize={{xs:15,sm:30}}  >Email : {user.email}</Typography>
    </Box>
    </Box>
    )
}