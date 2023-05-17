import { MDBCol, MDBContainer, MDBRow } from "mdbreact";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { SelectionContext } from "../SelectionContext/SelectionContext";
import SubscribeForm from "./SubscribeForm/SubscribeForm";

function OpenedSelection() {
  const [selection] = useContext(SelectionContext);

  return (
    <div className="selection-description" style={{ marginBottom: "5rem" }}>
      <div className="text-content ft-normal">
        <MDBContainer>
          <MDBRow center>
            <MDBCol xs="11" lg="10">
              <h1>Seleção</h1>
            </MDBCol>
          </MDBRow>
          <MDBRow center>
            <MDBCol xs="11" lg="10">
              <p>{selection?.description}</p>
            </MDBCol>
          </MDBRow>
          <MDBRow center>
            <MDBCol xs="11" lg="10">
              <p>
                Para compreender melhor o processo seletivo, leia o edital que
                está na nossa
                <Link to="/documentos" className="bodyLinks">
                  página de Documentos
                </Link>
                .
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
      <SubscribeForm idSelection={selection._id} />
    </div>
  );
}
export default OpenedSelection;
