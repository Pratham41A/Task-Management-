import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import { refreshToken, setAuthError, setIsLoggedIn, setUser } from "../slices/authSlice";


export default function IsLoggedIn({children}) {
    const dispatch = useDispatch();
    const {isLoggedIn} = useSelector((state) => state.auth);
      useEffect(() => {

  (async function () {
    try{
    await dispatch(refreshToken()).unwrap();
        dispatch(setAuthError(null))
       dispatch(setIsLoggedIn(true))
    }
    catch(err){
       dispatch(setAuthError(err))
       dispatch(setIsLoggedIn(false))
         dispatch(setUser(null));
    }
  })();
      }, []);

      if (isLoggedIn) {
        return children;
      }
      else{
        return <Navigate to="/login" />;
      }
}