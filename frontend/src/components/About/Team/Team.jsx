import React from "react";
import Participant from "../Participant/Participant";
import "./Team.css";

// O tutor abre a lista (é quem professores e parceiros procuram); depois, os
// alunos do mais novo para o mais antigo no grupo.
const ordenar = (petianos) => {
  const alunos = petianos
    .filter((p) => !p.tutor)
    .sort((a, b) => new Date(b.startPet) - new Date(a.startPet));
  return [...petianos.filter((p) => p.tutor), ...alunos];
};

const Team = ({ petianos, projetos }) => (
  <section className="green-bg equipe">
    <div className="equipe-conteudo">
      {/* A contagem fica no título da equipe, que chega junto com ela: no
          texto de cima, ela empurrava o parágrafo ao chegar. */}
      <h2>
        Hoje somos {petianos.filter((p) => !p.tutor).length} alunos e um
        professor tutor
      </h2>
      <div className="equipe-grade">
        {ordenar(petianos).map((participant) => (
          <Participant
            participant={participant}
            projetos={projetos}
            key={participant._id}
          />
        ))}
      </div>
    </div>
  </section>
);

export default Team;
