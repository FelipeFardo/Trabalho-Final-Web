import { useState, useContext } from "react";
import Input from "../../form/Input";

import styles from "../../form/Form.module.css";

// Context
import { Context } from "../../../context/UserContext";
import { Link } from "react-router-dom";

function Login() {
  const [user, setUser] = useState({});
  const { login } = useContext(Context);

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    login(user);
  }

  return (
    <section className={styles.form_container}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <Input
          text="E-mail"
          type="email"
          name="email"
          placeholder="Digite o seu email"
          handleOnChange={handleChange}
        ></Input>
        <Input
          text="Senha"
          type="password"
          name="password"
          placeholder="Digite a sua senha"
          handleOnChange={handleChange}
        ></Input>
        <input type="submit" value="Entrar" />
      </form>
      <p>
        Não tem uma conta? <Link to="/register">Clique aqui!</Link>
      </p>
    </section>
  );
}

export default Login;
