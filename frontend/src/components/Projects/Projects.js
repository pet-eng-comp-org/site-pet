import React, { useState, useEffect } from "react";
import Project from "./Project/Project";
import "./Projects.css";
import api from "../../services/api";
import { MDBContainer, MDBCard, MDBIcon, MDBRow, MDBAnimation } from "mdbreact";

import Modal from "./Modal/Modal";
import Loader from "../Loader/Loader";

const Projects = () => {
  const [modal, setModal] = useState();
  const [idComission, setIdComission] = useState("");
  const [comissions, setComissions] = useState([]);

  const getComissions = async () => {
    try {
      const response = await api.get("api/comissions");
      setComissions([...response.data.comissions]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getComissions();
  }, []);

  return (
    <div>
      <MDBAnimation type="fadeIn">
        {!comissions ? (
          <div className="divloader">
            <Loader />
          </div>
        ) : (
          <>
            <MDBContainer className="text-content">
              <h1>Projetos</h1>
              <p style={{ fontWeight: "normal" }}>
                Devido a natureza dos grupos PET no Brasil, nossos projetos se
                baseiam no triplé acadêmico de pesquisa, ensino e extensão. O
                PET Engenharia de Computação Ufes divide suas tarefas em várias
                comissões. Cada comissão possui um líder que coordena todos os
                projetos pertencentes a ela. Logo abaixo é possível conhecer um
                pouco mais sobre nosso trabalho.
              </p>
            </MDBContainer>

            <MDBContainer className="cards-projects">
              <MDBRow center>
                {comissions.map((comission) => {
                  return (
                    <MDBCard className="card-project" key={comission._id}>
                      <Project
                        title={comission.title}
                        description={comission.description}
                        icon={comission.photos[0]}
                        alt={`Ícone da comissao ${comission.title}`}
                      />
                      <MDBIcon
                        icon="plus-circle"
                        size="3x"
                        className="modal-button"
                        onClick={() => {
                          setModal((old) => !old);
                          setIdComission(comission._id);
                        }}
                      />
                    </MDBCard>
                  );
                })}
              </MDBRow>
            </MDBContainer>
          </>
        )}
      </MDBAnimation>
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
