import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import {Task} from "./screens/Task.jsx"
import {Login} from "./screens/Login.jsx"
import {Private} from './screens/PrivateRoute.jsx'
import {Public} from './screens/PublicRoute.jsx'
import {Register} from "./screens/Register.jsx"
import {Home} from "./screens/Home.jsx"

export function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Public><Login /></Public>} />
          <Route path="register" element={<Public><Register /></Public>} />
          <Route path="/" element={<Private><Home /></Private>} />
          <Route path="/task/:id?" element={<Private><Task /></Private>} />
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </BrowserRouter>

    </>
  )
}
