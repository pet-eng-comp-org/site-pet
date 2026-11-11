import Participant from "../Participant/Participant";
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
  // A equipe numa grade de cartões, na página branca, sob um título à
  // esquerda: dois por linha do tablet em diante, um no celular.
  <section className="px-(--margem) pb-[144px] max-desktop:pb-[120px] max-tablet:pb-[112px]">
    <div className="mx-auto max-w-[980px]">
      {/* A contagem fica no título da equipe, que chega junto com ela: no
          texto de cima, ela empurrava o parágrafo ao chegar. */}
      <h2 className="titulo-bloco mb-8">
        Hoje somos {petianos.filter((p) => !p.tutor).length} alunos e um
        professor tutor
      </h2>
      {/* Se sobrar um cartão, ele ocupa a linha. */}
      <div className="grid grid-cols-1 gap-5 tablet:grid-cols-2 tablet:[&>:last-child:nth-child(odd)]:col-span-full">
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
