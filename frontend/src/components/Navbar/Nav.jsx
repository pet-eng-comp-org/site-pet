import React, { useState, useEffect, useRef } from "react";
import "./Nav.css";
import Icone from "../Icone/Icone";
import logoPet from "../../assets/logo_pet.svg";
import api from "../../services/api";
import { Link, NavLink, useHistory, useLocation } from "react-router-dom";

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
  // Lido depois de montar, e de novo a cada troca de página (entrar e sair
  // trocam de página): o HTML pronto das páginas é o de quem não entrou.
  const [logado, setLogado] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setLogado(Boolean(localStorage.getItem("LOGINPET_TOKEN"))), [pathname]);
  const history = useHistory();

  useEffect(() => {
    fimDaSelecaoAberta().then((fim) => {
      setFimSelecao(fim);
      setShowMessage(Boolean(fim));
    });
  }, []);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  // Esc fecha o menu aberto e devolve o foco ao botão que o abriu; tocar
  // fora do topo também fecha.
  const botaoMenu = useRef();
  const topo = useRef();
  useEffect(() => {
    if (!isOpen) return;
    const fechaComEsc = (e) => {
      if (e.key !== "Escape") return;
      setIsOpen(false);
      botaoMenu.current.focus();
    };
    const fechaAoTocarFora = (e) => {
      if (!topo.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("keydown", fechaComEsc);
    document.addEventListener("pointerdown", fechaAoTocarFora);
    return () => {
      document.removeEventListener("keydown", fechaComEsc);
      document.removeEventListener("pointerdown", fechaAoTocarFora);
    };
  }, [isOpen]);

  // No celular, escolher uma página fecha o menu, que senão cobre o título.
  const fecharMenu = () => setIsOpen(false);

  const logout = () => {
    localStorage.removeItem("LOGINPET_TOKEN");
    history.push("/");
  };

  return (
    <header className="topo" ref={topo}>
      {/* Fixo no pé da tela, por cima da página: ele só chega depois da
          API, e no topo empurrava a página inteira para baixo. No Faça parte
          não aparece, que lá o aviso já está no conteúdo. */}
      {showMessage && pathname !== "/inscricoes" && (
        <div className="message" role="region" aria-label="Inscrições abertas">
          <p>
            Inscrições abertas até {fimSelecao}.{" "}
            <Link to="/inscricoes">Saiba como participar</Link>
          </p>
          <button
            type="button"
            className="message-fechar"
            onClick={() => setShowMessage(false)}
            aria-label="Fechar aviso"
          >
            <Icone nome="fechar" />
          </button>
        </div>
      )}

      <nav className="barra" aria-label="Principal">
        <Link to="/" onClick={fecharMenu} className="barra-marca">
          <img
            alt="PET Engenharia de Computação, página inicial"
            src={logoPet}
            width="111"
            height="48"
            className="logo-nav"
          />
        </Link>
        <button
          type="button"
          className="barra-menu"
          ref={botaoMenu}
          onClick={toggleCollapse}
          aria-controls="menu-principal"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        >
          <span className={`barra-menu-icone ${isOpen ? "aberto" : ""}`} />
        </button>

        <div
          id="menu-principal"
          className={`barra-links ${isOpen ? "aberto" : ""}`}
        >
          <ul className="barra-lista">
            {paginas.map(([to, rotulo]) => (
              <li key={to}>
                <NavLink
                  to={to}
                  exact={to === "/"}
                  className="barra-link"
                  activeClassName="active-link"
                  onClick={fecharMenu}
                >
                  {rotulo}
                </NavLink>
              </li>
            ))}
            {logado && (
              <>
                <li>
                  <NavLink
                    to="/admin"
                    className="barra-link"
                    activeClassName="active-link"
                    onClick={fecharMenu}
                  >
                    Admin
                  </NavLink>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={logout}
                    className="barra-link nav-sair"
                  >
                    Sair
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Nav;
