import React, { useState, useEffect, useRef } from "react";
import "./Nav.css";
import logoPet from "../../assets/logo_pet_simbolo.svg";
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
// em 18 px, traço de 1,2 e 0,24 s. Cada linha: fechado e aberto.
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
  const showMessage = Boolean(fimSelecao);
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

  const comFaixa = showMessage && pathname !== "/inscricoes";

  // No celular, escolher uma página fecha o menu, que senão cobre o título.
  const fecharMenu = () => setIsOpen(false);

  // Menu aberto: a página fica parada atrás dele, e fora
  // do alcance do Tab e do VoiceOver (inert), que senão andavam pelo que o
  // menu cobre. A tela que passa de 833 px (iPad girado) mostra os links na
  // barra e fecha o menu, no mesmo ponto.
  useEffect(() => {
    if (!isOpen) return;
    const raiz = document.documentElement.style;
    raiz.overflow = "hidden";
    const atras = [...document.querySelectorAll("main, footer")];
    atras.forEach((e) => (e.inert = true));
    const largo = window.matchMedia("(min-width: 834px)");
    const fecharSeLargo = () => largo.matches && setIsOpen(false);
    largo.addEventListener("change", fecharSeLargo);
    return () => {
      raiz.overflow = "";
      atras.forEach((e) => (e.inert = false));
      largo.removeEventListener("change", fecharSeLargo);
    };
  }, [isOpen]);

  return (
    <>
    <header className={`topo ${isOpen ? "menu-aberto" : ""}`} ref={topo}>
      <nav className="barra" aria-label="Principal">
        <Link to="/" onClick={fecharMenu} className="barra-marca">
          <img
            alt="PET Engenharia de Computação, página inicial"
            src={logoPet}
            width="18"
            height="22"
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
    {/* Faixa de aviso logo abaixo da barra, que sai com a rolagem. O servidor
        já busca a seleção antes de montar a página, então ela vem no HTML e
        não empurra nada ao carregar. No Faça parte não aparece: lá o aviso
        já está no conteúdo. */}
    {comFaixa && (
      <aside className="faixa-aviso" aria-label="Inscrições abertas">
        <p>
          Inscrições abertas até {fimSelecao}.{" "}
          <Link className="link-mais" to="/inscricoes">
            Saiba como participar
          </Link>
        </p>
      </aside>
    )}
    </>
  );
}

export default Nav;
