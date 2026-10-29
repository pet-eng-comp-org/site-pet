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
import api from "../../services/api";
import { Link } from "react-router-dom";

// Aviso no topo de todas as páginas enquanto a seleção estiver aberta.
const fimDaSelecaoAberta = async () => {
  try {
    const { data } = await api.get("api/selection/openSelection");
    const s = data.selection;
    const agora = Date.now();
    if (s && agora > Date.parse(s.dateBegin) && agora < Date.parse(s.dateEnd))
      return new Date(s.dateEnd).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        timeZone: "America/Sao_Paulo",
      });
  } catch (err) {}
  return null;
};

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [fimSelecao, setFimSelecao] = useState();

  useEffect(() => {
    fimDaSelecaoAberta().then((fim) => {
      setFimSelecao(fim);
      setShowMessage(Boolean(fim));
    });
  }, []);
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
          Inscrições abertas para o PET até {fimSelecao}.{" "}
          <Link to="/inscricoes">Saiba como participar</Link>
        </p>
        <button
          type="button"
          className="message-fechar"
          onClick={() => setShowMessage(false)}
          aria-label="Fechar aviso"
        >
          <MDBIcon icon="times" />
        </button>
      </div>

      <MDBNavbar color="white" expand="md" light>
        <MDBNavbarBrand>
          <Link to="/" onClick={() => setTabActive("inicio")}>
            <img
              alt="PET Engenharia de Computação, página inicial"
              src={logoPet}
              className="logo-nav"
            />
          </Link>
        </MDBNavbarBrand>
        <MDBNavbarToggler onClick={toggleCollapse} />

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
                Quem somos
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
                Participe
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
