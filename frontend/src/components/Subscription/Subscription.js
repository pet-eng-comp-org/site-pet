import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  SelectionContext,
  SelectionProvider,
} from "./SelectionContext/SelectionContext";
import ClosedSelection from "./ClosedSelection/ClosedSelection";
import OpenedSelection from "./OpenedSelection/OpenedSelection";
import goUp from "../../utils/goUp";
import Loader from "../Loader/Loader";

import "./Subscription.css";
import { MDBAnimation, MDBCol, MDBContainer, MDBRow } from "mdbreact";

function Subscription() {
  function Content() {
    useEffect(() => {
      goUp();
    }, []);

    const [selection] = useContext(SelectionContext);

    const renderSelection = () => {
      if (selection === "loading") return <Loader />;

      if (!selection) return <ClosedSelection />;

      if (
        Date.now() > Date.parse(selection.dateBegin) &&
        Date.now() < Date.parse(selection.dateEnd)
      )
        return <OpenedSelection />;
      else return <ClosedSelection />;
    };

    return (
      <>
        <div className="text-content">
          <MDBContainer className="ft-normal">
            <MDBRow center>
              <MDBCol xs="11" lg="10">
                <h1 className="text-align-left">
                  Faça parte do PET Engenharia de Computação!
                </h1>
              </MDBCol>
            </MDBRow>
            <MDBRow center>
              <MDBCol xs="11" lg="10">
                <p>
                  Você tem interesse em participar do nosso grupo? Você pode
                  fazer parte de algum projeto conosco (confira os{" "}
                  <Link className="link" to="/projetos">
                    {" "}
                    nossos projetos{" "}
                  </Link>{" "}
                  e entre em contato conosco caso tenha interesse de atuar em
                  algum deles) ou você pode passar pelo processo seletivo de PET
                  Eng Comp, caso atenda aos seguintes critérios:
                </p>
              </MDBCol>
            </MDBRow>
            <MDBRow center>
              <MDBCol xs="11" lg="10">
                <ul className="requirements">
                  <li>Cursar Engenharia de Computação na Ufes Goiabeiras</li>
                  <li>Estar entre o segundo e quarto períodos</li>
                  <li>Ter um CR de 5.0 ou maior</li>
                  <li>Ter vontade de aprender o se auto desenvolver</li>
                </ul>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </div>
        {renderSelection()}
      </>
    );
  }

  return (
    <SelectionProvider>
      <MDBAnimation type="fadeIn">
        <Content />
      </MDBAnimation>
    </SelectionProvider>
  );
}

export default Subscription;
