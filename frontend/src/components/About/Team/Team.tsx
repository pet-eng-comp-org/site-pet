import Participant from "../Participant/Participant";
import "./Team.css";
import type { Comissao, Membro } from "../../../tipos";

// O tutor abre a lista (é quem professores e parceiros procuram); depois, os
// alunos do mais novo para o mais antigo no grupo.
const ordenar = (petianos: Membro[]) => {
  const alunos = petianos
    .filter((p) => !p.tutor)
    .sort((a, b) => Date.parse(b.startPet) - Date.parse(a.startPet));
  return [...petianos.filter((p) => p.tutor), ...alunos];
};

const Team = ({ petianos, projetos }: { petianos: Membro[]; projetos: Comissao[] }) => (
  <section className="equipe">
    <div className="equipe-conteudo">
      {/* A contagem fica no título da equipe, que chega junto com ela: no
          texto de cima, ela empurrava o parágrafo ao chegar. */}
      <h2 className="titulo-bloco">
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
