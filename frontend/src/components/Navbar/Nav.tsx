"use client";

import { useState, useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useApi from "../../services/useApi";
import isAuth from "../../services/Auth";
import type { Selecao } from "../../tipos";

// Aviso em todas as páginas enquanto a seleção estiver aberta: o último dia,
// ou null.
const fimDaSelecaoAberta = (s?: Selecao | null) => {
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
const LINHAS: [string, string, string][] = [
  ["baixo", "2 12, 16 12", "3.5 15, 15 3.5"],
  ["cima", "2 5, 16 5", "3.5 3.5, 15 15"],
];
const MEIO = "2 9, 16 9";

function IconeMenu({ aberto }: { aberto: boolean }) {
  const svg = useRef<SVGSVGElement>(null);
  const antes = useRef(aberto);
  useEffect(() => {
    if (antes.current === aberto) return;
    antes.current = aberto;
    const parado = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (const [nome, fechado, xis] of LINHAS) {
      const linha = svg.current?.querySelector(`[data-linha=${nome}]`);
      const anim = linha?.querySelector<SVGAnimateElement>(aberto ? "[data-abre]" : "[data-fecha]");
      if (!linha || !anim) continue;
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
    <svg ref={svg} className="block size-[18px]" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
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

// A curva de todas as transições da barra.
// O topo guarda o lugar da barra com uma faixa escura sólida (48 px no
// celular, 44 px a partir de 834 px), e a barra fica fixa por cima dela.
const TOPO = "relative z-[1020] h-[48px] bg-(--barra-solida) menu:h-[44px]";

// A barra: só o símbolo e os links. Vidro: o conteúdo aparece borrado por
// baixo ao rolar; sem suporte ao filtro (ou com transparência reduzida),
// fica sólida. Margem de 16 px no celular e, a partir de 834 px, a coluna de
// 980 px (pelo menos 22 px).
const BARRA = [
  "fixed inset-x-0 top-0 flex min-h-[48px] flex-wrap items-center justify-between bg-(--barra-solida) px-4",
  "supports-[backdrop-filter:blur(1px)]:bg-(--vidro-fundo) supports-[backdrop-filter:blur(1px)]:[-webkit-backdrop-filter:var(--vidro-filtro)] supports-[backdrop-filter:blur(1px)]:[backdrop-filter:var(--vidro-filtro)]",
  "[@media(prefers-reduced-transparency:reduce)]:bg-(--barra-solida)! [@media(prefers-reduced-transparency:reduce)]:[backdrop-filter:none]!",
  "menu:min-h-[44px] menu:px-[max(22px,calc((100%-980px)/2))]",
  "max-menu:[transition:background-color_0.24s_cubic-bezier(0.4,0,0.6,1)_80ms] motion-reduce:[transition:none]!",
].join(" ");

// Menu aberto no celular: fundo sólido, sem o vidro.
const BARRA_ABERTA = "max-menu:bg-(--menu-fundo)! max-menu:[backdrop-filter:none]! max-menu:[-webkit-backdrop-filter:none]!";

// Só o símbolo, numa caixa da altura da barra para o toque. No celular, com o
// menu aberto, some mas guarda o lugar: o X não pula.
const MARCA = "group/marca -ml-2 flex min-h-[44px] min-w-[44px] items-center justify-center px-2 no-underline motion-reduce:[transition:none]!";
const MARCA_VISIVEL = "max-menu:[transition:opacity_0.24s_cubic-bezier(0.4,0,0.6,1)_80ms,visibility_0.24s_steps(1,start)_80ms]";
const MARCA_ESCONDIDA = "max-menu:invisible max-menu:opacity-0 max-menu:[transition:opacity_0.24s_cubic-bezier(0.4,0,0.6,1),visibility_0.24s_steps(1)]";

// O símbolo a 80%, aceso por inteiro sob o ponteiro.
const SIMBOLO = "block h-[22px] w-[18px] opacity-80 transition-opacity duration-320 ease-[cubic-bezier(0.4,0,0.6,1)] group-hover/marca:opacity-100 group-focus-visible/marca:opacity-100";

// Botão de 48 px com o ícone de 18 px. A margem negativa leva a caixa até a
// borda da tela; o contorno de foco fica dentro dela. Some a partir de 834
// px, e sem JavaScript, que ele não abriria nada.
const BOTAO_MENU =
  "-mr-4 flex size-12 cursor-pointer items-center justify-center rounded-[4px] border-0 bg-transparent p-0 text-(--menu-texto) focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-(--barra-texto) menu:hidden [.sem-js_&]:hidden";

// Os links. No celular, sempre na página, de altura zero e invisíveis quando
// fechados, para animar a abertura: o fundo desce em 0,24 s depois de 80 ms
// e ocupa a tela menos a barra (100% aqui é a altura da barra). Sem
// JavaScript, ficam à vista. A partir de 834 px, em fila na barra.
const LINKS = [
  "hidden basis-full [.sem-js_&]:block! menu:flex menu:flex-1",
  "max-menu:absolute max-menu:inset-x-0 max-menu:top-full max-menu:block max-menu:overscroll-contain max-menu:bg-(--menu-fundo) max-menu:px-12 motion-reduce:[transition:none]!",
  "max-menu:[.sem-js_&]:visible! max-menu:[.sem-js_&]:static! max-menu:[.sem-js_&]:h-auto!",
].join(" ");
const LINKS_FECHADOS =
  "max-menu:invisible max-menu:h-0 max-menu:overflow-hidden max-menu:[transition:height_0.24s_cubic-bezier(0.4,0,0.6,1)_80ms,visibility_0s_linear_0.32s]";
const LINKS_ABERTOS =
  "max-menu:visible max-menu:h-[calc(100dvh-100%)] max-menu:overflow-y-auto max-menu:pb-[calc(2rem+env(safe-area-inset-bottom))] max-menu:[transition:height_0.24s_cubic-bezier(0.4,0,0.6,1)_80ms,visibility_0s]";

// O ::before vazio é o primeiro da fila: entre ele e o primeiro link fica o
// mesmo espaço que entre os links, e assim o símbolo também.
const LISTA = "m-0 flex list-none flex-col p-0 menu:flex-1 menu:flex-row menu:justify-between menu:before:content-['']";

// No celular, os itens descem 8 px a partir de 0,2 s, um a cada 20 ms; ao
// fechar, saem todos juntos.
const ITEM = "group/item motion-reduce:[transition:none]! [.sem-js_&]:opacity-100! [.sem-js_&]:[transform:none]!";
const ITEM_ESCONDIDO = "max-menu:[transform:translateY(-8px)] max-menu:opacity-0 max-menu:[transition:opacity_0.16s_cubic-bezier(0.4,0,0.6,1),transform_0.16s_cubic-bezier(0.4,0,0.6,1)]";
const ITEM_VISIVEL = `max-menu:[transform:none] max-menu:opacity-100 max-menu:[transition:opacity_0.24s_cubic-bezier(0.4,0,0.6,1)_calc(0.2s+var(--ordem)*20ms),transform_0.24s_cubic-bezier(0.4,0,0.6,1)_calc(0.2s+var(--ordem)*20ms)]`;

// Toque de 44 px, texto a 80% da cor e inteiro sob o ponteiro, sem marcar a
// página atual (o aria-current fica para o leitor de tela). Teclado: contorno
// branco. No celular, letra de 28 px em peso 600, um item a cada 46 px; a
// partir de 834 px, texto de 12 px, e o do último link encosta na margem.
const LINK = [
  "flex min-h-[44px] items-center py-2 font-medium text-[color-mix(in_srgb,var(--barra-texto)_80%,transparent)] no-underline transition-colors duration-320 ease-[cubic-bezier(0.4,0,0.6,1)]",
  "hover:text-(--barra-texto) focus-visible:rounded-[4px] focus-visible:text-(--barra-texto) focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-(--barra-texto)",
  "max-menu:min-h-[46px] max-menu:p-0 max-menu:text-[1.75rem] max-menu:leading-[1.1] max-menu:font-semibold max-menu:tracking-[0.007em] max-menu:text-(--menu-texto)!",
  "menu:min-h-[44px] menu:px-2 menu:py-0 menu:text-[12px] menu:font-normal menu:tracking-[-0.01em] menu:group-last/item:-mr-2",
].join(" ");

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const fimSelecao = fimDaSelecaoAberta(
    useApi("api/selection/openSelection").data?.selection
  );
  const showMessage = Boolean(fimSelecao);
  // Lido depois de montar, e de novo a cada troca de página (entrar e sair
  // trocam de página): o HTML pronto das páginas é o de quem não entrou.
  const [logado, setLogado] = useState(false);
  const pathname = usePathname();
  useEffect(() => setLogado(Boolean(isAuth())), [pathname]);


  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  // Esc fecha o menu aberto e devolve o foco ao botão que o abriu; tocar
  // fora do topo também fecha.
  const botaoMenu = useRef<HTMLButtonElement>(null);
  const topo = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const fechaComEsc = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setIsOpen(false);
      botaoMenu.current?.focus();
    };
    const fechaAoTocarFora = (e: PointerEvent) => {
      if (!topo.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("keydown", fechaComEsc);
    document.addEventListener("pointerdown", fechaAoTocarFora);
    return () => {
      document.removeEventListener("keydown", fechaComEsc);
      document.removeEventListener("pointerdown", fechaAoTocarFora);
    };
  }, [isOpen]);

  const comFaixa = showMessage && pathname !== "/inscricoes";

  // A página atual e as de dentro dela (um projeto marca "Projetos").
  const atual = (to: string) => (to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`));

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
    const atras = [...document.querySelectorAll<HTMLElement>("main, footer")];
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
      <header className={TOPO} ref={topo}>
        <nav className={`${BARRA} ${isOpen ? BARRA_ABERTA : ""}`} aria-label="Principal">
          <Link href="/" onClick={fecharMenu} className={`${MARCA} ${isOpen ? MARCA_ESCONDIDA : MARCA_VISIVEL}`}>
            <img
              alt="PET Engenharia de Computação, página inicial"
              src="/imagens/logo_pet_simbolo.svg"
              width="18"
              height="22"
              className={SIMBOLO}
            />
          </Link>
          <button
            type="button"
            className={BOTAO_MENU}
            ref={botaoMenu}
            onClick={toggleCollapse}
            aria-controls="menu-principal"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          >
            <IconeMenu aberto={isOpen} />
          </button>

          <div id="menu-principal" className={`${LINKS} ${isOpen ? LINKS_ABERTOS : LINKS_FECHADOS}`}>
            <ul className={LISTA}>
              {paginas.map(([to, rotulo], i) => (
                <li key={to} className={`${ITEM} ${isOpen ? ITEM_VISIVEL : ITEM_ESCONDIDO}`} style={{ "--ordem": i } as CSSProperties}>
                  <Link href={to} className={LINK} aria-current={atual(to) ? "page" : undefined} onClick={fecharMenu}>
                    {rotulo}
                  </Link>
                </li>
              ))}
              {/* Só para quem entrou. O Sair fica no painel, junto da senha:
                  é coisa da conta, não uma página do site. */}
              {logado && (
                <li className={`${ITEM} ${isOpen ? ITEM_VISIVEL : ITEM_ESCONDIDO}`} style={{ "--ordem": paginas.length } as CSSProperties}>
                  <Link href="/admin" className={LINK} aria-current={atual("/admin") ? "page" : undefined} onClick={fecharMenu}>
                    Painel
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </header>
      {/* Faixa de aviso logo abaixo da barra, que sai com a rolagem: 14 px no
          centro, no fundo da página (cinza em Projetos, que tem fundo cinza).
          O servidor já busca a seleção antes de montar a página, então ela vem
          no HTML e não empurra nada ao carregar. No Faça parte não aparece:
          lá o aviso já está no conteúdo. */}
      {comFaixa && (
        <aside
          className={`px-(--margem) py-4 text-center text-[0.875rem] leading-[1.42859] ${pathname === "/projetos" ? "bg-superficie" : "bg-fundo"}`}
          aria-label="Inscrições abertas"
        >
          <p className="m-0 tracking-[-0.016em]">
            Inscrições abertas até {fimSelecao}.{" "}
            {/* O link não se parte: a quebra, se houver, vem antes dele. */}
            <Link className="link-mais whitespace-nowrap" href="/inscricoes">
              Saiba como participar
            </Link>
          </p>
        </aside>
      )}
    </>
  );
}

export default Nav;
