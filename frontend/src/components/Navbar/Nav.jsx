import React, { useState, useEffect, useRef } from "react";
import "./Nav.css";
import Icone from "../Icone/Icone";
import logoPet from "../../assets/logo_pet.svg";
import useApi from "../../services/useApi";
import isAuth from "../../services/Auth";
import { Link, NavLink, useLocation } from "react-router-dom";

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

// O ícone do menu: duas linhas que se juntam no meio e giram até virar o X,
// com o desenho e o tempo do botão do apple.com (lido da página em
// 06/11/2026: 18 px, traço de 1,2, 0,24 s). Cada linha: fechado e aberto.
const LINHAS = [
  ["baixo", "2 12, 16 12", "3.5 15, 15 3.5"],
  ["cima", "2 5, 16 5", "3.5 3.5, 15 15"],
];
const MEIO = "2 9, 16 9";

function IconeMenu({ aberto }) {
  const svg = useRef();
  const antes = useRef(aberto);
  useEffect(() => {
    if (antes.current === aberto) return;
    antes.current = aberto;
    const parado = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (const [nome, fechado, xis] of LINHAS) {
      const linha = svg.current.querySelector(`[data-linha=${nome}]`);
      const anim = linha.querySelector(aberto ? "[data-abre]" : "[data-fecha]");
      // Sem animação, a linha vai direto ao fim.
      if (parado || !anim.beginElement) linha.setAttribute("points", aberto ? xis : fechado);
      else anim.beginElement();
    }
  }, [aberto]);
  const tempo = {
    attributeName: "points",
    keyTimes: "0;0.5;1",
    dur: "0.24s",
    begin: "indefinite",
    fill: "freeze",
    calcMode: "spline",
    keySplines: "0.42, 0, 1, 1;0, 0, 0.58, 1",
  };
  return (
    <svg ref={svg} className="barra-menu-icone" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      {LINHAS.map(([nome, fechado, xis]) => (
        <polyline
          key={nome}
          data-linha={nome}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={fechado}
        >
          <animate data-abre="" {...tempo} values={`${fechado}; ${MEIO}; ${xis}`} />
          <animate data-fecha="" {...tempo} values={`${xis}; ${MEIO}; ${fechado}`} />
        </polyline>
      ))}
    </svg>
  );
}

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
  useEffect(() => setLogado(Boolean(isAuth())), [pathname]);


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

  // Menu aberto: a página fica parada atrás dele, como no apple.com, e fora
  // do alcance do Tab e do VoiceOver (inert), que senão andavam pelo que o
  // menu cobre. A tela que passa de 768 px (iPad girado) mostra os links na
  // barra e fecha o menu.
  useEffect(() => {
    if (!isOpen) return;
    const raiz = document.documentElement.style;
    raiz.overflow = "hidden";
    const atras = [...document.querySelectorAll("main, footer")];
    atras.forEach((e) => (e.inert = true));
    const largo = window.matchMedia("(min-width: 768px)");
    const fecharSeLargo = () => largo.matches && setIsOpen(false);
    largo.addEventListener("change", fecharSeLargo);
    return () => {
      raiz.overflow = "";
      atras.forEach((e) => (e.inert = false));
      largo.removeEventListener("change", fecharSeLargo);
    };
  }, [isOpen]);

  return (
    <header className={`topo ${isOpen ? "menu-aberto" : ""}`} ref={topo}>
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
          <img
              alt="PET Engenharia de Computação, página inicial"
              src={logoPet}
              width="120"
              height="52"
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
          {/* Desenhado com a cor do texto: muda junto no modo escuro. */}
          <IconeMenu aberto={isOpen} />
        </button>

        <div
          id="menu-principal"
          className={`barra-links ${isOpen ? "aberto" : ""}`}
        >
          <ul className="barra-lista">
            {paginas.map(([to, rotulo], i) => (
              <li key={to} style={{ "--ordem": i }}>
                <NavLink
                  to={to}
                  exact={to === "/"}
                  className="barra-link"
                  onClick={fecharMenu}
                >
                  {rotulo}
                </NavLink>
              </li>
            ))}
            {/* Só para quem entrou. O Sair fica no painel, junto da senha:
                é coisa da conta, não uma página do site. */}
            {logado && (
              <li style={{ "--ordem": paginas.length }}>
                <NavLink
                  to="/admin"
                  className="barra-link"
                  onClick={fecharMenu}
                >
                  Painel
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Nav;
