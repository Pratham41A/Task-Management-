import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { refresh } from "../slices/authSlice.js";
import {Loader} from "../components/Loader.jsx";

export function Public({ children }) {
  const dispatch = useDispatch();
  const { isLoggedIn, isAuthenticationChecked } = useSelector(function({ auth = {} }) {
    return auth;
  });

  useEffect(function() {
    (async function() {
      try {
        if (!isAuthenticationChecked) {
          await dispatch(refresh()).unwrap();
        }
      } catch (error) {
      }
    })();
  }, [dispatch, isAuthenticationChecked]);

  if (!isAuthenticationChecked) {
    return <Loader />;
  }
  if (isLoggedIn) {
    return <Navigate to="/" />;
  }
  return children;
}