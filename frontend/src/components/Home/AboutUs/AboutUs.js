import React from "react";
import { Link } from "react-router-dom";
import "./AboutUs.css";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";

import imagemNos1 from "../../../assets/grupo.jpg";
import imagemNos2 from "../../../assets/jacee.jpg";
import imagemNos3 from "../../../assets/topcom.jpg";

const AboutUs = () => {
  return (
    <div className="green-bg">
      <div className="about-us" id="about-us">
        <MDBContainer>
          <MDBRow center>
            <MDBCol xs="11" lg="10">
              <h2>Um pouco sobre nós</h2>
            </MDBCol>
          </MDBRow>
          <MDBRow center>
            <MDBCol xs="11" lg="10">
              <p>
                Somos o grupo PET (Programa de Educação tutorial) do curso de
                Engenharia de Computação da Ufes. Somos compostos por 12
                bolsistas graduandos da Engenharia de Computação e um tutor
                professor, também bolsista. Não sabe o que é o PET?{" "}
                <a href="http://portal.mec.gov.br/pet">Conheça o Programa</a>.
              </p>
            </MDBCol>
          </MDBRow>
          <MDBRow center>
            <MDBCol xs="11" lg="10">
              <div>
                <MDBContainer className="d-block">
                  <MDBRow>
                    <MDBCol md="4" className="responsive-container">
                      <img
                        alt="Equipe Reunida no DiaPET2020"
                        src={imagemNos1}
                        className="image"
                      />
                    </MDBCol>
                    <MDBCol md="4" className="responsive-container">
                      <img alt="JACEE" src={imagemNos2} className="image" />
                    </MDBCol>
                    <MDBCol md="4" className="responsive-container">
                      <img alt="Topcom" src={imagemNos3} className="image" />
                    </MDBCol>
                  </MDBRow>
                </MDBContainer>
              </div>
            </MDBCol>
          </MDBRow>
          <MDBRow center>
            <MDBCol xs="11" lg="10">
              <p>
                Desenvolvemos diversas atividades de ensino, pesquisa e extensão
                a fim de promover crescimento acadêmico e pessoal, além de
                tentamos manter um bom contato com os demais graduandos dos
                cursos de computação da Ufes. Nossa porta esta sempre aberta!
                <br />
                Conheça <Link to="/sobre"> um pouco mais sobre nós </Link>, e
                descubra os <Link to="/projetos"> nossos projetos</Link>! Acesse
                também o <a href="http://pet.ufes.br/">site do PET Ufes </a>
                (mantido pelo nosso grupo) para conhecer os grupos PET de outros
                cursos dentro na nossa universidade!
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    </div>
  );
};

export default AboutUs;
