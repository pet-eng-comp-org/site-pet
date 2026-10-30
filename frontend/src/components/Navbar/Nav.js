import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import {
  MDBNavbar,
  MDBNavbarNav,
  MDBNavItem,
  MDBCollapse,
  MDBNavbarBrand,
  MDBIcon,
} from "mdbreact";
import "./Nav.css";
import logoPet from "../../assets/logo_pet.svg";
import App from "../../App";
import api from "../../services/api";
import { Link, NavLink } from "react-router-dom";

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

const paginas = [
  ["/", "Início"],
  ["/sobre", "Quem somos"],
  ["/projetos", "Projetos"],
  ["/documentos", "Documentos"],
  ["/contato", "Contato"],
  ["/inscricoes", "Faça parte"],
];

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

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  // Esc fecha o menu aberto e devolve o foco ao botão que o abriu.
  const botaoMenu = useRef();
  useEffect(() => {
    if (!isOpen) return;
    const fechaComEsc = (e) => {
      if (e.key !== "Escape") return;
      setIsOpen(false);
      botaoMenu.current.focus();
    };
    document.addEventListener("keydown", fechaComEsc);
    return () => document.removeEventListener("keydown", fechaComEsc);
  }, [isOpen]);

  // No celular, escolher uma página fecha o menu, que senão cobre o título.
  const fecharMenu = () => setIsOpen(false);

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
          <Link to="/" onClick={fecharMenu}>
            <img
              alt="PET Engenharia de Computação, página inicial"
              src={logoPet}
              width="111"
              height="48"
              className="logo-nav"
            />
          </Link>
        </MDBNavbarBrand>
        <button
          type="button"
          className="navbar-toggler"
          ref={botaoMenu}
          onClick={toggleCollapse}
          aria-controls="navbarCollapse3"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <MDBCollapse id="navbarCollapse3" isOpen={isOpen} navbar>
          <MDBNavbarNav right>
            {paginas.map(([to, rotulo]) => (
              <MDBNavItem key={to}>
                <NavLink
                  to={to}
                  exact={to === "/"}
                  className="nav-link nav-links"
                  activeClassName="active-link"
                  onClick={fecharMenu}
                >
                  {rotulo}
                </NavLink>
              </MDBNavItem>
            ))}
            {localStorage.getItem("LOGINPET_TOKEN") && (
              <>
                <MDBNavItem>
                  <NavLink
                    to="/admin"
                    className="nav-link nav-links"
                    activeClassName="active-link"
                    onClick={fecharMenu}
                  >
                    Admin
                  </NavLink>
                </MDBNavItem>
                <MDBNavItem>
                  <button
                    type="button"
                    onClick={logout}
                    className="nav-link nav-links nav-sair"
                  >
                    Sair
                  </button>
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
