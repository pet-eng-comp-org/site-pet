
const MAPA =
  "https://www.google.com/maps?ll=-20.273378,-40.305981&z=14&t=m&hl=pt-BR&gl=BR&mapclient=embed&cid=8957845249469204268";

// Os links do endereço e do contato: na cor de link, sublinhados.
const LINK = "underline hover:decoration-2";

// Rodapé: texto miúdo em cinza, links na cor de link,
// uma linha fina e o copyright embaixo. Sem logo nem ícones: a marca já
// está no topo, e o rodapé só responde onde estamos e como falar com a gente.
const Footer = () => {
  return (
    // Fundo cinza sob a página branca, texto de 12 px com 16 px de entrelinha
    // a 56% do preto, 17 px em cima e uma linha fina antes do copyright.
    <footer className="mt-auto bg-superficie text-12 text-[rgba(0,0,0,0.56)]">
      {/* Na coluna de 980 px do cabeçalho e das páginas. */}
      <div className="mx-auto max-w-[calc(980px+2*var(--margem))] px-(--margem) pt-[17px] pb-[19px]">
        <p className="mt-0 mb-4 border-b border-separador pb-[19px] tracking-[inherit]">
          Estamos na sala 18, 2º andar do CT XIII, Ufes, campus de Goiabeiras,
          Vitória (ES), 29075-073 (
          <a className={LINK} href={MAPA} target="_blank" rel="noopener noreferrer">
            ver no mapa
          </a>
          ).
          <br />
          Fale com a gente pelo e-mail{" "}
          <a className={LINK} href="mailto:petengcomp@inf.ufes.br">petengcomp@inf.ufes.br</a>
          , no Instagram{" "}
          <a
            className={LINK}
            href="https://www.instagram.com/petengcomp/"
            target="_blank"
            rel="noopener noreferrer"
          >
            @petengcomp
          </a>{" "}
          ou no{" "}
          <a
            className={LINK}
            href="https://www.youtube.com/c/PETEngCompUfes"
            target="_blank"
            rel="noopener noreferrer"
          >
            YouTube
          </a>
          .
        </p>
        <p className="m-0 tracking-[inherit]">
          Copyright © {new Date().getFullYear()} PET Engenharia de Computação.
          Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
