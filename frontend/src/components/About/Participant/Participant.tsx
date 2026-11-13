"use client";

import { useEffect, useRef, useState } from "react";
import Icone from "../../Icone/Icone";
import { ehDupla } from "../../../utils/fotoDupla";
import slug from "../../../utils/slug";
import linkDaRede from "../../../utils/redes";
import Link from "next/link";
import { API } from "../../../services/apiUrl";
import type { Comissao, Etiqueta, Membro } from "../../../tipos";

// "Game Jam", "GameJam" e "PET Game Jam" são o mesmo projeto: compara sem
// "pet", sem separador e sem plural.
const chave = (titulo: string) =>
  slug(titulo).replace(/pet/g, "").replace(/-/g, "").replace(/s$/, "");

const desde = (participant: Membro) => {
  const mes = new Date(participant.startPet).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
    // A data de entrada é gravada como meia-noite UTC; em Brasília cairia no dia anterior.
    timeZone: "UTC",
  });
  return `${participant.tutor ? "Tutor" : "No PET"} desde ${mes}`;
};

// Foto dupla (ver utils/fotoDupla): a de cima fica à mostra e a descontraída
// aparece com o mouse em cima ou, no celular, com um toque.
// O círculo de 96 px da foto, em cima à esquerda do cartão.
const CIRCULO = "relative col-start-1 row-start-1 block size-24 overflow-hidden rounded-full bg-superficie-suave";

const Foto = ({ src }: { src: string }) => {
  const [dupla, setDupla] = useState(false);
  const [virada, setVirada] = useState(false);
  const img = useRef<HTMLImageElement>(null);
  const medir = () => {
    if (!img.current) return;
    const { complete, naturalWidth, naturalHeight } = img.current;
    if (complete && naturalWidth) setDupla(ehDupla(naturalWidth, naturalHeight));
  };
  // A página vem pronta do servidor: a foto pode ter carregado antes do React
  // chegar, e aí o onLoad não dispara.
  useEffect(medir, [src]);
  return (
    <span
      className={`group ${CIRCULO}`}
      onPointerUp={(e) => dupla && e.pointerType !== "mouse" && setVirada(!virada)}
    >
      {/* Na foto dupla, "cover" no círculo mostra só a metade de cima (a de
          sempre); a cópia com a metade de baixo (a descontraída) aparece por
          cima com o mouse ou, no celular, com um toque (o :hover lá grudaria
          depois do toque e a foto não voltaria). */}
      <img className="block size-full object-cover object-top" ref={img} src={src} alt="" loading="lazy" onLoad={medir} />
      {dupla && (
        <img
          className={`absolute inset-0 size-full object-cover object-bottom opacity-0 transition-opacity duration-250 ease-[ease] group-hover:opacity-100 motion-reduce:transition-none ${virada ? "opacity-100" : ""}`}
          src={src}
          alt=""
        />
      )}
    </span>
  );
};

const Participant = ({ participant, projetos }: { participant: Membro; projetos: Comissao[] }) => {
  // A etiqueta mostra o nome do projeto como está na página Projetos e leva a ele.
  const projetoDa = (tag: Etiqueta) =>
    projetos.find((p) => chave(p.title) === chave(tag.title));

  return (
    // Cada pessoa num cartão cinza: a foto redonda e as redes em cima, depois
    // o nome, desde quando está no PET, a frase e as comissões, que descem
    // para o fim do cartão.
    <div data-revela className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto_auto_auto_1fr] items-start rounded-cartao bg-superficie p-[30px] text-texto">
      <div className="contents">
        {/* Cadastro cuja foto não subiu fica sem ela, e não derruba a página. */}
        {participant.profilePhoto ? (
          <Foto
            src={`${API}api/file/getProfilePhoto/${participant.profilePhoto._id}?v=${participant.profilePhoto.key}`}
          />
        ) : (
          <span className={CIRCULO} aria-hidden="true" />
        )}
        <div className="col-start-2 row-start-1 -mr-[10px] flex justify-self-end">
          {participant.socialMidia.map((icon, index) => (
            <a
              href={linkDaRede(icon)}
              key={index}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-[22px] text-texto-suave hover:text-texto"
              aria-label={`${icon.name} de ${participant.memberName}`}
            >
              <Icone nome={icon.name} />
            </a>
          ))}
        </div>
      </div>
      <div className="col-span-full mt-5 text-21 font-semibold">
        {participant.memberName}
      </div>
      <div className="col-span-full mt-1 text-14 text-texto-suave">{desde(participant)}</div>
      <div className="col-span-full mt-3 text-17 tracking-[-0.022em]">{participant.description}</div>
      <div className="col-span-full mt-5 flex flex-wrap gap-x-2 gap-y-3 self-end">
        {/* Só etiqueta de projeto: "Tutor" já está em "Tutor desde…". */}
        {participant.tags
          ?.map(projetoDa)
          .filter((p, i, todos): p is Comissao => p !== undefined && todos.indexOf(p) === i)
          .map((projeto) => (
            // Pílula branca de 32 px, com toque de 44 px: a área invisível passa
            // 6 px acima e abaixo, sem encostar na da linha de baixo.
            <Link
              className="relative inline-flex min-h-[32px] items-center rounded-capsula bg-fundo px-3 text-14 text-texto no-underline after:absolute after:inset-x-0 after:-inset-y-[6px] hover:bg-[#e8e8ed]"
              key={projeto._id}
              href={`/projetos/${slug(projeto.title)}`}
            >
              {projeto.title}
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Participant;
