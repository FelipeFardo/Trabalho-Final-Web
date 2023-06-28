import api from "../../../utils/api";
//hooks
import useFlashMessage from "../../../hooks/useFlashMessage";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import styles from "./PetDetails.module.css";

function PetDetails() {
  const [pet, setPet] = useState({});
  const { id } = useParams();
  const { setFlashMessage } = useFlashMessage();
  const [token] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    api.get(`/pets/${id}`).then((response) => setPet(response.data.pet));
  }, [id]);

  async function schedule() {
    let msgType = "success";

    const data = await api
      .patch(`pets/schedule/${pet._id}`)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        msgType = "error";
        return err.response.data;
      });
    setFlashMessage(data.message, msgType);
  }

  return (
    <>
      {pet.name && (
        <section className={styles.pet_details_container}>
          <div className={styles.pet_details_header}>
            <h1>Conhecendo o Pet: {pet.name}</h1>
            <p>Se tiver interesse, marque uma visita para conhecê-lo</p>
          </div>
          <div className={styles.pet_images}>
            {pet.images.map((image, index) => (
              <img
                src={`${process.env.REACT_APP_API}/images/pets/${image}`}
                alt={pet.name}
                key={index}
              />
            ))}
          </div>
          <p>
            <span className="bold">Peso: </span>
            {pet.weight} kg
          </p>
          <p>
            <span className="bold">Idade: </span>
            {pet.age} ano(s)
          </p>
          <p>
            <span className="bold">Cor: </span>
            {pet.color}
          </p>
          {token ? (
            <button onClick={schedule}>Solicitar uma visita</button>
          ) : (
            <p>
              Você precisa <Link to="/register">criar um conta</Link> para
              solicitar a visita
            </p>
          )}
        </section>
      )}
    </>
  );
}

export default PetDetails;
