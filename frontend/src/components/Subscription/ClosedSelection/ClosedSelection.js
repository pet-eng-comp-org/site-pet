import { MDBCol, MDBContainer, MDBRow } from "mdbreact";
import React from "react";
import "./ClosedSelection.css";

function ClosedSelection() {
  return (
    <MDBContainer>
      <MDBRow center>
        <MDBCol xs="11" lg="10">
          <p className="text-content closed-selection ft-normal">
            No momento, não temos nenhum processo seletivo aberto. Mas não se
            preocupe, geralmente todo semestre abrem novas vagas! Assim que
            abrirmos um novo processo seletivo, enviaremos emails e
            divulgasremos em nosso Instagram
            <a
              href="https://www.instagram.com/petengcomp/?hl=pt-br"
              target="_blank"
              rel="noopener noreferrer"
              className="bodyLinks"
            >
              @petengcomp
            </a>
            .
          </p>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
export default ClosedSelection;
