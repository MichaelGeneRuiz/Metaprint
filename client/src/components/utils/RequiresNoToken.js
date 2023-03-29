import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";

import Spinner from "react-bootstrap/Spinner";

import AuthContext from "../../context/AuthContext";

function RequiresNoToken() {
  const { isLoggedIn, loading } = useContext(AuthContext);

  if (loading) {
    return <Spinner />;
  }

  return !isLoggedIn ? <Outlet /> : <Navigate to="/" />;
}

export default RequiresNoToken;
