import React from "react";
import logoPet from "../../assets/logo_pet_branca.svg";
import iconeInstagram from "../../assets/icone_instagram.svg";
import iconeEmail from "../../assets/icone_email.svg";
import { MDBCol, MDBContainer, MDBRow, MDBFooter } from "mdbreact";
import "./Footer.css";

const Footer = () => {
  return (
    <MDBFooter color="elegant-color-dark" className="font-small pt-4">
      <MDBContainer fluid>
        <MDBRow>
          <MDBCol md="9" className="colLogo">
            <MDBRow>
              <MDBCol md="4" lg="3">
                <img alt="PET Engenharia de Computação" src={logoPet} className="logoPet" />
              </MDBCol>
              <MDBCol middle>
                <p>
                  <a
                    href="https://www.google.com/maps?ll=-20.273378,-40.305981&z=14&t=m&hl=pt-BR&gl=BR&mapclient=embed&cid=8957845249469204268"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Sala 18, 2º andar do CT XIII
                    <br />
                    Ufes, campus de Goiabeiras, Vitória (ES), 29075-073
                  </a>
                </p>
              </MDBCol>
            </MDBRow>
          </MDBCol>

          <MDBCol middle>
            <MDBRow end>
              <MDBCol md="auto">
                <a
                  href="https://www.instagram.com/petengcomp/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p>
                    <img
                      alt=""
                      src={iconeInstagram}
                      className="icone"
                    />{" "}
                    petengcomp
                  </p>
                </a>
              </MDBCol>
              <MDBCol md="auto">
                <a href="mailto:petengcomp.ufes@gmail.com">
                  <p>
                    <img alt="" src={iconeEmail} className="icone" />{" "}
                    petengcomp.ufes@gmail.com
                  </p>
                </a>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <div className="footer-copyright text-center py-2">
        © {new Date().getFullYear()} PET Engenharia de Computação · Ufes
      </div>
    </MDBFooter>
  );
};

export default Footer;
