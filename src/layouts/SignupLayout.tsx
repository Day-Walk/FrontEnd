import React from "react";
import styles from "../signup/Signup.module.css";
import { CircleArrowLeft } from "lucide-react";
import { Outlet } from "react-router-dom";

const SignupLayout = () => {
  return (
    <>
      <SignupHeader />
      <Outlet />
    </>
  );
};

const SignupHeader = () => {
  return (
    <div className={styles.signup_header}>
      <CircleArrowLeft size={30} color="#333" />
    </div>
  );
};
export default SignupLayout;
