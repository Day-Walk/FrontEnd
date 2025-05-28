import React from "react";
import Header from "../global_components/Header/Header";
import { Outlet } from "react-router-dom";

const HeaderLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default HeaderLayout;
