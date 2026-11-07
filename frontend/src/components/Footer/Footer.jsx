import React from "react";
import "./Footer.css";

const MAPA =
  "https://www.google.com/maps?ll=-20.273378,-40.305981&z=14&t=m&hl=pt-BR&gl=BR&mapclient=embed&cid=8957845249469204268";

// Como o rodapé do apple.com: texto miúdo em cinza, links na cor de ação,
// uma linha fina e o copyright embaixo. Sem logo nem ícones: a marca já
// está no topo, e o rodapé só responde onde estamos e como falar com a gente.
const Footer = () => {
  return (
    <footer className="rodape">
      <div className="rodape-conteudo">
        <p className="rodape-info">
          Estamos na sala 18, 2º andar do CT XIII, Ufes, campus de Goiabeiras,
          Vitória (ES), 29075-073 (
          <a href={MAPA} target="_blank" rel="noopener noreferrer">
            ver no mapa
          </a>
          ). Fale com a gente pelo e-mail{" "}
          <a href="mailto:petengcomp.ufes@gmail.com">petengcomp.ufes@gmail.com</a>{" "}
          ou no Instagram{" "}
          <a
            href="https://www.instagram.com/petengcomp/"
            target="_blank"
            rel="noopener noreferrer"
          >
            @petengcomp
          </a>
          .
        </p>
        <p className="rodape-direitos">
          Copyright © {new Date().getFullYear()} PET Engenharia de Computação.
          Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
