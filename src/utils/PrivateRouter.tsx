import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { api } from "./api";
import Loading from "../global_components/Loading";

const PrivateRouter = () => {
  const [isAuth, setIsAuth] = useState<null | boolean>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.post("/user/auth");
        setIsAuth(true);
      } catch {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuth === null) {
    return <Loading />;
  }

  if (isAuth === false) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRouter;
