import React from "react";
import logoPet from "../../assets/logo_pet_branca.svg";
import iconeInstagram from "../../assets/icone_instagram.svg";
import iconeEmail from "../../assets/icone_email.svg";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="rodape">
      <div className="rodape-faixa">
        <img
          alt="PET Engenharia de Computação"
          src={logoPet}
          className="logoPet"
        />
        <a
          className="rodape-endereco"
          href="https://www.google.com/maps?ll=-20.273378,-40.305981&z=14&t=m&hl=pt-BR&gl=BR&mapclient=embed&cid=8957845249469204268"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sala 18, 2º andar do CT XIII
          <br />
          Ufes, campus de Goiabeiras, Vitória (ES), 29075-073
        </a>
        <ul className="rodape-contatos">
          <li>
            <a
              href="https://www.instagram.com/petengcomp/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img alt="" src={iconeInstagram} className="icone" />
              petengcomp
            </a>
          </li>
          <li>
            <a href="mailto:petengcomp.ufes@gmail.com">
              <img alt="" src={iconeEmail} className="icone" />
              petengcomp.ufes@gmail.com
            </a>
          </li>
        </ul>
      </div>
      <div className="rodape-direitos">
        © {new Date().getFullYear()} PET Engenharia de Computação · Ufes
      </div>
    </footer>
  );
};

export default Footer;
