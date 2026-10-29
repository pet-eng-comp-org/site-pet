import React, { useState, useEffect } from "react";
import Project from "./Project/Project";
import "./Projects.css";
import api from "../../services/api";
import goUp from "../../utils/goUp";

import Modal from "./Modal/Modal";
import Loader from "../Loader/Loader";

const Projects = () => {
  const [modal, setModal] = useState();
  const [idComission, setIdComission] = useState("");
  const [comissions, setComissions] = useState();

  useEffect(() => {
    goUp();
    const getComissions = async () => {
      try {
        const response = await api.get("api/comissions");
        setComissions([...response.data.comissions]);
      } catch (err) {
        console.log(err);
      }
    };
    getComissions();
  }, []);

  if (!comissions) {
    return (
      <div className="divloader">
        <Loader />
      </div>
    );
  }

  return (
    <div className="pagina">
      <h1>Projetos</h1>
      <p className="pagina-intro">
        Como todo grupo PET, trabalhamos no tripé de ensino, pesquisa e
        extensão. As atividades se dividem em comissões, cada uma com um líder
        que coordena os seus projetos. Escolha uma para saber mais.
      </p>

      <ul className="projetos-grade">
        {comissions.map((comission) => (
          <li key={comission._id}>
            <Project
              title={comission.title}
              description={comission.description}
              icon={comission.photos[0]}
              onClick={() => {
                setModal(true);
                setIdComission(comission._id);
              }}
            />
          </li>
        ))}
      </ul>

      <Modal
        idComission={idComission}
        isOpen={modal}
        toggle={() => {
          setModal((old) => !old);
        }}
      />
    </div>
  );
};

export default Projects;
