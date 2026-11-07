import React from "react";
import { Link } from "react-router-dom";
import useApi from "../../../services/useApi";
import Project from "../../Projects/Project/Project";
import "../../Projects/Projects.css";
import "./Vitrine.css";

// Três projetos na inicial, nos mesmos cartões da página Projetos, com o
// caminho para os outros.
const DESTAQUES = ["Topcom", "IntroComp", "PET Game Jam"];

const Vitrine = () => {
  const comissoes = useApi("api/comissions").data?.comissions;
  const projetos = DESTAQUES.map((t) => comissoes?.find((c) => c.title === t)).filter(Boolean);
  if (!projetos.length) return null;
  return (
    <section className="bloco vitrine">
      <div className="vitrine-conteudo">
        <h2 className="titulo-bloco">Conheça os projetos.</h2>
        <ul className="projetos-grade vitrine-grade">
          {projetos.map((c) => (
            <li key={c._id}>
              <Project title={c.title} description={c.description} icon={c.photos[0]} />
            </li>
          ))}
        </ul>
        <p className="vitrine-todos">
          <Link className="link-mais" to="/projetos">
            Todos os projetos
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Vitrine;
