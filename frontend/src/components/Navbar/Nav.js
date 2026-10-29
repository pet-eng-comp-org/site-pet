import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  MDBNavbar,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavLink,
  MDBNavbarToggler,
  MDBCollapse,
  MDBNavbarBrand,
  MDBIcon,
} from "mdbreact";
import "./Nav.css";
import logoPet from "../../assets/logo_pet.svg";
import App from "../../App";
import { Link } from "react-router-dom";

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [tabActive, setTabActive] = useState("");

  useEffect(() => {
    let path = window.location.pathname.replace("/", "") || "inicio";
    if (path.lastIndexOf("/") > 0) {
      path = path.split("/")[0];
    }
    let link = document.querySelector(`#${path}`);
    if (link) link.classList.add("active-link");
    if (path !== "inicio")
      document.getElementById("inicio").classList.remove("active-link");
  }, [tabActive]);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  const logout = () => {
    localStorage.removeItem("LOGINPET_TOKEN");
    ReactDOM.render(<App />, document.querySelector("#root"));
  };

  return (
    <div className="sticky-top">
      <div
        className="message"
        style={{ display: showMessage ? "flex" : "none" }}
      >
        <p style={{ margin: 0 }}>
          Processo seletivo aberto! <a href="/subscription">Saiba mais</a>
        </p>
        <span
          style={{ marginLeft: "auto", cursor: "pointer" }}
          onClick={() => setShowMessage(!showMessage)}
        >
          <MDBIcon icon="times" />
        </span>
      </div>

      <MDBNavbar color="white" expand="md" light>
        <MDBNavbarToggler onClick={toggleCollapse} />
        <MDBNavbarBrand>
          <Link to="/" onClick={() => setTabActive("inicio")}>
            <img
              alt="PET Engenharia de Computação, página inicial"
              src={logoPet}
              className="logo-nav"
            />
          </Link>
        </MDBNavbarBrand>

        <MDBCollapse id="navbarCollapse3" isOpen={isOpen} navbar>
          <MDBNavbarNav right>
            <MDBNavItem>
              <MDBNavLink
                to="/"
                id="inicio"
                onClick={() => setTabActive("inicio")}
                className="nav-links"
              >
                Início
              </MDBNavLink>
            </MDBNavItem>

            <MDBNavItem>
              <MDBNavLink
                to="/sobre"
                id="sobre"
                onClick={() => setTabActive("sobre")}
                className="nav-links"
              >
                Quem Somos
              </MDBNavLink>
            </MDBNavItem>

            <MDBNavItem>
              <MDBNavLink
                to="/projetos"
                id="projetos"
                onClick={() => setTabActive("projetos")}
                className="nav-links"
              >
                Projetos
              </MDBNavLink>
            </MDBNavItem>

            <MDBNavItem>
              <MDBNavLink
                to="/documentos"
                id="documentos"
                className="nav-links"
                onClick={() => setTabActive("documentos")}
              >
                Documentos
              </MDBNavLink>
            </MDBNavItem>

            <MDBNavItem>
              <MDBNavLink
                to="/contato"
                id="contato"
                onClick={() => setTabActive("contato")}
                className="nav-links"
              >
                Contato
              </MDBNavLink>
            </MDBNavItem>

            <MDBNavItem>
              <MDBNavLink
                to="/inscricoes"
                id="inscricoes"
                className="nav-links"
                onClick={() => setTabActive("inscricoes")}
              >
                Participe!
              </MDBNavLink>
            </MDBNavItem>
            {localStorage.getItem("LOGINPET_TOKEN") && (
              <>
                <MDBNavItem>
                  <MDBNavLink
                    to="/admin"
                    id="admin"
                    className="nav-links"
                    onClick={() => setTabActive("admin")}
                  >
                    Admin
                  </MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                  <MDBNavLink
                    to="#!"
                    onClick={() => logout()}
                    className="nav-links"
                  >
                    Sair
                  </MDBNavLink>
                </MDBNavItem>
              </>
            )}
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBNavbar>
    </div>
  );
}

export default Nav;
