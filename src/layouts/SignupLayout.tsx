import React from "react";
import styles from "../signup/Signup.module.css";
import { CircleArrowLeft } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const SignupLayout = () => {
  return (
    <>
      <SignupHeader />
      <Outlet />
    </>
  );
};

const SignupHeader = () => {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const handleClickBackBtn = () => {
    if (pathname === "/signup/user-like") {
      navigate("/signup");
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className={styles.signup_header} onClick={handleClickBackBtn}>
      <CircleArrowLeft size={30} color="#333" />
    </div>
  );
};
export default SignupLayout;
