import api from "../../../utils/api";
import { useState, useEffect } from "react";

import styles from "./Profile.module.css";
import formStyles from "../../form/Form.module.css";

import Input from "../../form/Input";

import useFlashMessage from "../../../hooks/useFlashMessage";
import RoundedImage from "../../layouts/RoundedImage";

const Profile = () => {
  const [user, setUser] = useState({});
  const [preview, setPreview] = useState();
  const [token] = useState(localStorage.getItem("token") || "");
  const { setFlashMessage } = useFlashMessage();
  useEffect(() => {
    api.get("/users/checkuser").then((response) => {
      setUser(response.data);
    });
  }, [token]);

  function onFileChange(e) {
    setPreview(e.target.files[0]);
    setUser({ ...user, [e.target.name]: e.target.files[0] });
  }

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let msgType = "success";

    const formData = new FormData();

    await Object.keys(user).forEach((key) => formData.append(key, user[key]));

    const data = await api
      .patch(`/users/edit/${user._id}`, user, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((err) => {
        msgType = "error";
        return err.response.data;
      });
    setFlashMessage(data.message, msgType);
  }

  return (
    <section>
      <div className={styles.profile_header}>
        <h1>Perfil</h1>
        {(user.image || preview) && (
          <RoundedImage
            src={
              preview
                ? URL.createObjectURL(preview)
                : `${process.env.REACT_APP_API}/images/users/${user.image}`
            }
            alt={user.name}
          />
        )}
        <p>Preview Imagem</p>
      </div>
      <form className={formStyles.form_container} onSubmit={handleSubmit}>
        <Input
          text="Imagem"
          type="file"
          name="image"
          handleOnChange={onFileChange}
        ></Input>
        <Input
          text="E-mail"
          type="email"
          name="email"
          placeholder="Digite o seu email"
          handleOnChange={handleChange}
          value={user.email || ""}
        ></Input>
        <Input
          text="Nome"
          type="text"
          name="name"
          placeholder="Digite o seu nome"
          handleOnChange={handleChange}
          value={user.name || ""}
        ></Input>
        <Input
          text="Telefone"
          type="text"
          name="phone"
          placeholder="Digite o seu Telefone"
          handleOnChange={handleChange}
          value={user.phone || ""}
        ></Input>
        <Input
          text="Senha"
          type="password"
          name="password"
          placeholder="Digite a sua senha"
          handleOnChange={handleChange}
        ></Input>
        <Input
          text="Confirmação de senha"
          type="password"
          name="confirmpassword"
          placeholder="Confirme a sua senha"
          handleOnChange={handleChange}
        ></Input>
        <input type="submit" value="Editar" />
      </form>
    </section>
  );
};

export default Profile;
