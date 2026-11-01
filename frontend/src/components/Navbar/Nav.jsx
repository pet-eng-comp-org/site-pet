import React, { useState, useEffect, useRef } from "react";
import "./Nav.css";
import Icone from "../Icone/Icone";
import logoPet from "../../assets/logo_pet.svg";
import logoPetEscuro from "../../assets/logo_pet_escuro.svg";
import useApi from "../../services/useApi";
import { Link, NavLink, useHistory, useLocation } from "react-router-dom";

// Aviso em todas as páginas enquanto a seleção estiver aberta: o último dia,
// ou null.
const fimDaSelecaoAberta = (s) => {
  const agora = Date.now();
  if (s && agora > Date.parse(s.dateBegin) && agora < Date.parse(s.dateEnd))
    return new Date(s.dateEnd).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      timeZone: "America/Sao_Paulo",
    });
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
  const fimSelecao = fimDaSelecaoAberta(
    useApi("api/selection/openSelection").data?.selection
  );
  const [fechouAviso, setFechouAviso] = useState(false);
  const showMessage = Boolean(fimSelecao) && !fechouAviso;
  // Lido depois de montar, e de novo a cada troca de página (entrar e sair
  // trocam de página): o HTML pronto das páginas é o de quem não entrou.
  const [logado, setLogado] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setLogado(Boolean(localStorage.getItem("LOGINPET_TOKEN"))), [pathname]);
  const history = useHistory();


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

  // A altura da faixa de inscrições abertas vira --faixa no <html>: o rodapé
  // cresce nessa altura e a rolagem até o foco deixa essa folga embaixo.
  // Medida, e não fixa, porque ela quebra em mais linhas na tela estreita.
  const faixa = useRef();
  const comFaixa = showMessage && pathname !== "/inscricoes";
  useEffect(() => {
    const raiz = document.documentElement.style;
    if (!comFaixa) {
      raiz.removeProperty("--faixa");
      return;
    }
    const medir = new ResizeObserver(([e]) =>
      raiz.setProperty("--faixa", `${e.target.offsetHeight}px`)
    );
    medir.observe(faixa.current);
    // O navegador só rola até o foco quando ele está fora da tela; um campo
    // alto podia ficar meio coberto pela faixa. Rola o que faltar.
    // O que não cabe entre o topo fixo (64 px) e a faixa (o <main>, ao
    // trocar de página ou fechar a faixa) fica onde está.
    const mostrarFoco = (e) => {
      if (faixa.current.contains(e.target)) return;
      const foco = e.target.getBoundingClientRect();
      const topoDaFaixa = faixa.current.getBoundingClientRect().top;
      if (foco.height > topoDaFaixa - 64 - 32) return;
      const falta = foco.bottom - topoDaFaixa + 16;
      if (falta > 0) window.scrollBy(0, falta);
    };
    document.addEventListener("focusin", mostrarFoco);
    return () => {
      medir.disconnect();
      document.removeEventListener("focusin", mostrarFoco);
      raiz.removeProperty("--faixa");
    };
  }, [comFaixa]);

  // Fechar a faixa leva o foco ao conteúdo, e não ao começo da página.
  const fecharFaixa = () => {
    setFechouAviso(true);
    document.querySelector("main").focus({ preventScroll: true });
  };

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
      {comFaixa && (
        <div
          className="message"
          role="region"
          aria-label="Inscrições abertas"
          ref={faixa}
        >
          <p>
            Inscrições abertas até {fimSelecao}.{" "}
            <Link to="/inscricoes">Saiba como participar</Link>
          </p>
          <button
            type="button"
            className="message-fechar"
            onClick={fecharFaixa}
            aria-label="Fechar aviso"
          >
            <Icone nome="fechar" />
          </button>
        </div>
      )}

      <nav className="barra" aria-label="Principal">
        <Link to="/" onClick={fecharMenu} className="barra-marca">
          {/* No modo escuro, a versão do logo para fundo escuro, do pacote da
              identidade (logo-completo-sem-ufes-principal-fundo-tinta). */}
          <picture>
            <source srcSet={logoPetEscuro} media="(prefers-color-scheme: dark)" />
            <img
              alt="PET Engenharia de Computação, página inicial"
              src={logoPet}
              width="120"
              height="52"
              className="logo-nav"
            />
          </picture>
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
