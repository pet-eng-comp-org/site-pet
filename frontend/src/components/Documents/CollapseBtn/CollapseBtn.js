import React, { Component } from "react";
import { Link } from "react-router-dom";
import { MDBCollapse, MDBIcon } from "mdbreact";
import openNewTab from "../../../utils/openNewTab";

class CollapseBtn extends Component {
  state = {
    collapseID: "",
  };

  constructor(props) {
    super(props);
    this.state = {
      icone: <MDBIcon className="collapseIcon" far icon="angle-down" />,
    };
  }

  toggleCollapse = (collapseID) => () => {
    this.setState((prevState) => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : "",
    }));
  };

  colorSwitch = () => {
    this.setState({
      switchColor: !this.state.switchColor,
    });
  };

  returnDocList = (document) => {
    let docList = [];
    let url = `${process.env.REACT_APP_API_URL}api/file/downloadDocument/`;
    for (let i = 0; i < document.files.length; i++) {
      docList.push(
        <div
          className="docItem"
          key={document.files[i]._id}
          style={{ background: i % 2 === 0 ? "white" : "#eeeeee" }}
        >
          <Link
            to="#"
            className="bodyLinks"
            onClick={(e) => {
              e.preventDefault();
              openNewTab(url + document.files[i]._id);
            }}
          >
            {document.files[i].name}
          </Link>
          <MDBIcon className="docIcon" size="lg" far icon="file-pdf" />
        </div>
      );
    }
    return docList;
  };

  render() {
    let { document } = this.props;
    return (
      <>
        {document.files.length > 0 && (
          <>
            <button
              onClick={this.toggleCollapse("basicCollapse")}
              className="collapseBtn"
            >
              <div className="contentBtn">{document.title}</div>
            </button>
            <MDBCollapse
              className="conteudoCollapse"
              onOpened={() =>
                this.setState({
                  icone: (
                    <MDBIcon className="collapseIcon" far icon="angle-up" />
                  ),
                })
              }
              onClosed={() =>
                this.setState({
                  icone: (
                    <MDBIcon className="collapseIcon" far icon="angle-down" />
                  ),
                })
              }
              id="basicCollapse"
              isOpen="basicCollapse"
              //isOpen={this.state.collapseID} // Se quiser a função de abrir e fechar do collapse descomente essa linha e exclua a de cima
            >
              {this.returnDocList(document)}
            </MDBCollapse>
          </>
        )}
      </>
    );
  }
}
export default CollapseBtn;
