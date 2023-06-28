import api from "../utils/api";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFlashMessage from "./useFlashMessage";

export default function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.authorization = `Bearer ${JSON.parse(token)}`;
      setAuthenticated(true);
    }
  }, []);

  async function register(user) {
    let msgText = "Cadastro realizado com sucesso!";
    let msgType = "success";
    try {
      const data = await api.post("/users/register", user).then((response) => {
        return response.data;
      });
      authUser(data);
    } catch (error) {
      msgText = error.response.data.message;
      msgType = "error";
    }

    setFlashMessage(msgText, msgType);
  }

  async function login(user) {
    let msgText = "Login realizado com sucesso!";
    let msgType = "success";

    try {
      const data = await api.post("/users/login", user).then((response) => {
        return response.data;
      });

      authUser(data);
    } catch (error) {
      // tratar erro
      msgText = error.response.data.message;
      msgType = "error";
    }

    setFlashMessage(msgText, msgType);
  }

  function authUser(data) {
    localStorage.setItem("token", JSON.stringify(data.token));
    api.defaults.headers.authorization = `Bearer ${data.token}`;
    setAuthenticated(true);
    navigate("/");
  }

  function logout() {
    const msgText = "Logout realizado com sucesso!";
    const msgType = "success";
    setAuthenticated(false);
    localStorage.removeItem("token");
    api.defaults.headers.authorization = undefined;
    navigate("/");
    setFlashMessage(msgText, msgType);
  }
  return { register, login, authenticated, logout };
}
