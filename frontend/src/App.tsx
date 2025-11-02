import { useEffect, useState } from "react";
import { Login } from "./views/login";
import { Register } from "./views/register";
import { Home } from "./views/home";
import { ToastContainer } from "react-toastify";
import { useViewStore } from "../store/viewStore";
import { useAuthStore } from "../store/authStore";

const App = () => {

  const { view, changeView } = useViewStore();
  const { setIsLogin, setIsAdmin } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      changeView("home");
    }
    setIsLogin();
    setIsAdmin();
  }, [])

  return <>
    <ToastContainer position="top-right" />
    {view == "login" && <Login />}
    {view == "register" && <Register />}
    {view == "home" && <Home />}

  </>
};

export default App;