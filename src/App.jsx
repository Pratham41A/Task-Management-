import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Task from "./screens/Task"
import Login from "./screens/Login"
import IsLoggedIn from './screens/IsLoggedIn'
import Register from "./screens/Register"
import UpdatePassword from "./screens/UpdatePassword"
import Home from "./screens/Home"
import Profile from "./screens/Profile"

function App() {
  

  return (
    <>
    <BrowserRouter>
  <Routes>
    <Route path="/login" element={
      <Login/>
      } />
    <Route path="register" element={<Register/>} />
<Route path="/" element={
  <IsLoggedIn>
  <Home/>
  </IsLoggedIn>
  } />
    <Route path="updatePassword" element={<UpdatePassword/>} />
    <Route path="/task/:value?" element={
      <IsLoggedIn>
      <Task/>
      </IsLoggedIn>
    } />
          
    <Route path="profile" element={
      <IsLoggedIn>
      <Profile/>
      </IsLoggedIn>
      } />
      <Route path="*" element={<Navigate to="/" />} />

  </Routes>
</BrowserRouter>

    </>
  )
}

export default App
