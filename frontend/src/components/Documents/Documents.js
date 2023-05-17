import React, { Component } from "react";
import Loader from "../Loader/Loader";
import goUp from "../../utils/goUp";
import api from "../../services/api";
import { MDBAnimation, MDBCol, MDBContainer, MDBRow } from "mdbreact";
import CollapseBtn from "./CollapseBtn/CollapseBtn";
import "./Documents.css";

class Documents extends Component {
  state = {
    Documents: false,
  };

  async getDocuments() {
    try {
      const response = await api.get("api/documents/");
      this.setState({
        Documents: response.data.documents,
      });
    } catch (err) {
      console.log(err.response);
    }
  }
  componentWillMount() {
    goUp();
    this.getDocuments();
  }

  render() {
    return (
      <>
        {this.state.Documents === false ? (
          <div className="divloader">
            <Loader />
          </div>
        ) : (
          <MDBAnimation type="fadeIn">
            <div className="text-content">
              <MDBContainer>
                <MDBRow center>
                  <MDBCol xs="11" lg="10">
                    <h1>Documentos</h1>
                  </MDBCol>
                </MDBRow>
                <MDBRow center>
                  <MDBCol xs="11" lg="10">
                    <p className="ft-normal">
                      Abaixo estão disponibilizados alguns documentos
                      importantes do PET Engenharia de Computação - Ufes. Uma
                      documentação complementar pode ser encontrada na seção de
                      documentos do site do{" "}
                      <a
                        className="bodyLinks"
                        target="_blank"
                        href="http://pet.ufes.br/documentos/"
                        rel="noopener noreferrer"
                      >
                        PET Ufes
                      </a>
                      .
                    </p>
                  </MDBCol>
                </MDBRow>
                <MDBRow center>
                  <MDBCol xs="11" md="9" lg="8">
                    {this.state.Documents.map((document) => (
                      <CollapseBtn key={document._id} document={document} />
                    ))}
                  </MDBCol>
                </MDBRow>
                <MDBRow center>
                  <MDBCol xs="11" lg="10">
                    <p style={{ marginTop: "3vw" }} className="ft-normal">
                      Além disso, a legislação do programa PET pode ser
                      encontrado neste{" "}
                      <a
                        className="bodyLinks"
                        target="_blank"
                        href="http://portal.mec.gov.br/component/content/article?id=12227%3Alegislacao-pet"
                        rel="noopener noreferrer"
                      >
                        site
                      </a>
                      .
                    </p>
                  </MDBCol>
                </MDBRow>
              </MDBContainer>
            </div>
          </MDBAnimation>
        )}
      </>
    );
  }
}

export default Documents;
