import React from "react";
import { Link } from "react-router-dom";
import useApi from "../../../services/useApi";
import Project from "../../Projects/Project/Project";
import "../../Projects/Projects.css";
import "./Vitrine.css";

// Três projetos na abertura da inicial, nos mesmos cartões da página
// Projetos, com o caminho para os outros. Sem a API, a abertura fica só com
// o texto.
const DESTAQUES = ["Topcom", "IntroComp", "PET Game Jam"];

const Vitrine = () => {
  const comissoes = useApi("api/comissions").data?.comissions;
  const projetos = DESTAQUES.map((t) => comissoes?.find((c) => c.title === t)).filter(Boolean);
  if (!projetos.length) return null;
  return (
    <div className="vitrine">
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
  );
};

export default Vitrine;
