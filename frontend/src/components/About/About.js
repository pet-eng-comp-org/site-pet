import React, { useState, useEffect } from "react";
import Team from "./Team/Team";
import goUp from "../../utils/goUp";
import api from "../../services/api";
import "./About.css";
import Loader from "../Loader/Loader";
import { MDBAnimation, MDBCol, MDBContainer, MDBRow } from "mdbreact";

const About = () => {
  const [petianos, setPetianos] = useState();

  useEffect(() => {
    goUp();
  }, []);

  useEffect(() => {
    const getPetianos = async () => {
      try {
        const response = await api.get("api/members/");
        setPetianos(response.data.members.filter((p) => p.active));
      } catch (err) {
        console.log(err.response.data);
      }
    };

    getPetianos();
  }, []);

  return (
    <>
      {!petianos ? (
        <div className="divloader">
          <Loader />
        </div>
      ) : (
        <MDBAnimation type="fadeIn">
          <div className="about">
            <MDBContainer>
              <MDBRow center>
                <MDBCol xs="11" lg="10">
                  <h1>O que é o PET?</h1>
                </MDBCol>
              </MDBRow>
              <MDBRow center>
                <MDBCol xs="11" lg="10">
                  <p className="ft-normal">
                    O{" "}
                    <a href="http://portal.mec.gov.br/pet">
                      PET – Programa de Educação Tutorial
                    </a>{" "}
                    é um programa que foi criado e implantado em 1979, com o
                    nome inicial de Programa Especial de Treinamento, pela CAPES
                    que a partir de 31 de dezembro de 1999, teve sua gestão
                    transferida para a SESu. É destinado a grupos de alunos que
                    demonstrem potencial, interesse e habilidades destacadas em
                    cursos de graduação reconhecidos pelo Conselho Nacional de
                    Educação. Só na Ufes, temos 13 grupos PET. Para saber mais,
                    visite o<a href="http://pet.ufes.br/"> site do PET Ufes </a>
                    .
                    <br />
                    <br />O PET Engenharia de Computação é um dos PETs originais
                    da Ufes, criado em 1993. Hoje é composto por{" "}
                    {petianos?.length - 1} alunos e um professor tutor.
                  </p>
                </MDBCol>
              </MDBRow>
              <MDBRow center>
                <MDBCol xs="11" lg="10">
                  <h1>Petianos atuais</h1>
                </MDBCol>
              </MDBRow>
              <MDBRow center>
                <MDBCol xs="11" lg="10">
                  <p className="ft-normal">
                    Somos, atualmente, {petianos?.length - 1} petianos alunos e
                    um professor tutor. Conheça um pouquinho sobre quem compõe
                    esse grupo:
                  </p>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
            <div style={{ margin: "100px 0" }}>
              <Team petianos={petianos} />
            </div>
            <MDBContainer>
              <MDBRow center>
                <MDBCol sm="11" lg="10">
                  <p className="ft-normal">
                    Muitas pessoas entram e saem do PET Engenharia de
                    Computação. Assim, em breve estaremos lançando nossa página
                    de egressos, fique ligado!
                  </p>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </div>
        </MDBAnimation>
      )}
    </>
  );
};

export default About;
