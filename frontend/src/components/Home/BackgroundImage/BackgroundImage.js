import React from "react";
import "./BackgroundImage.css";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
const BackgroundImage = () => {
  return (
    <MDBContainer fluid className="bg d-flex ">
      <MDBRow middle>
        <MDBCol className="ml-5 mr-5 ft-normal">
          <h1>PET Engenharia de Computação</h1>
          <h5>
            Programa de Educação Tutorial do curso de Engenharia de Computação
            Ufes
          </h5>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default BackgroundImage;
