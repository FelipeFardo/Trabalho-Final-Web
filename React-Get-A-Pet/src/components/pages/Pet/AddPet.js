import api from "../../../utils/api";
import styles from "./AddPet.module.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

// components
import PetForm from "../../form/PetForm";

// hooks
import useFlashMessage from "../../../hooks/useFlashMessage";

function AddPet() {
  const [token] = useState(localStorage.getItem("token") || "");
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate();

  async function registerPet(pet) {
    let msgType = "success";
    const formData = new FormData();
    await Object.keys(pet).forEach((key) => {
      if (key === "images") {
        pet[key].forEach(function (image) {
          formData.append("images", image);
        });
      } else {
        formData.append(key, pet[key]);
      }
    });
    const data = await api
      .post("pets/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        msgType = "error";
        return err.response.message;
      });
    setFlashMessage(data.message, msgType);
    if ((msgType = "success")) navigate("/pet/mypets");
  }
  return (
    <section className={styles.addpet_header}>
      <div>
        <h1>Cadastre um Pet</h1>
        <p>Depois ele ficará disponível para adoção</p>
      </div>
      <PetForm handleSubmit={registerPet} btnText="Cadastrar Pet" />
    </section>
  );
}

export default AddPet;
