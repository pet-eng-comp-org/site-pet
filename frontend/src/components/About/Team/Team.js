import React from "react";
import Participant from "../Participant/Participant";
import "./Team.css";

// Alunos do mais novo para o mais antigo no grupo; o tutor fecha a lista.
const ordenar = (petianos) => {
  const alunos = petianos
    .filter((p) => !p.tutor)
    .sort((a, b) => new Date(b.startPet) - new Date(a.startPet));
  return [...alunos, ...petianos.filter((p) => p.tutor)];
};

const Team = ({ petianos }) => (
  <section className="green-bg equipe">
    <div className="equipe-conteudo">
      <h2>Petianos atuais</h2>
      <div className="equipe-grade">
        {ordenar(petianos).map((participant) => (
          <Participant participant={participant} key={participant._id} />
        ))}
      </div>
    </div>
  </section>
);

export default Team;
