import React from "react";
import { Link } from "react-router-dom";
import logoPet from "../../assets/logo_pet_branca.svg";
import iconeInstagram from "../../assets/icone_instagram.svg";
import iconeFacebook from "../../assets/icone_facebook.svg";
import iconeEmail from "../../assets/icone_email.svg";
import { MDBCol, MDBContainer, MDBRow, MDBFooter } from "mdbreact";
import "./Footer.css";

const Footer = () => {
  return (
    <MDBFooter color="elegant-color-dark" className="font-small pt-4 mt-4">
      <MDBContainer fluid>
        <MDBRow>
          <MDBCol md="9" className="colLogo">
            <MDBRow>
              <MDBCol md="2">
                <img alt="logoPET" src={logoPet} className="logoPet" />
              </MDBCol>
              <MDBCol middle>
                <p>
                  <a
                    href="https://www.google.com/maps?ll=-20.273378,-40.305981&z=14&t=m&hl=pt-BR&gl=BR&mapclient=embed&cid=8957845249469204268"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    PET Engenharia de Computação
                    <br />
                    CT VII – UFES – Goiabeiras, Vitória – ES, 29075-073. Sala
                    36, 2º andar
                  </a>
                </p>
              </MDBCol>
            </MDBRow>
          </MDBCol>

          <MDBCol middle>
            <MDBRow end>
              <MDBCol md="auto">
                <a
                  href="https://www.instagram.com/petengcomp/?hl=pt-br"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p>
                    <img
                      alt="iconeInstagram"
                      src={iconeInstagram}
                      className="icone"
                    />{" "}
                    petengcomp
                  </p>
                </a>
              </MDBCol>
              <MDBCol md="auto">
                <a
                  href="https://www.facebook.com/PETEngCompUfes/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p>
                    <img
                      alt="iconeFacebook"
                      src={iconeFacebook}
                      className="icone"
                    />{" "}
                    PET EngComp Ufes
                  </p>
                </a>
              </MDBCol>
              <MDBCol md="auto">
                <Link to="/contato">
                  <p>
                    <img alt="iconeEmail" src={iconeEmail} className="icone" />{" "}
                    petengcomp@inf.ufes.br
                  </p>
                </Link>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <div className="footer-copyright text-center py-2">
        &copy; {new Date().getFullYear()} Copyright: PET Engenharia de
        Computação - Ufes
      </div>
    </MDBFooter>
  );
};

export default Footer;
