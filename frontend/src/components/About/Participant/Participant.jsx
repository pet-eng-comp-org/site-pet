import React, { useEffect, useRef, useState } from "react";
import Icone from "../../Icone/Icone";
import { ehDupla } from "../../../utils/fotoDupla";
import slug from "../../../utils/slug";
import linkDaRede from "../../../utils/redes";
import { Link } from "react-router-dom";
import "./Participant.css";

// "Game Jam", "GameJam" e "PET Game Jam" são o mesmo projeto: compara sem
// "pet", sem separador e sem plural.
const chave = (titulo) =>
  slug(titulo).replace(/pet/g, "").replace(/-/g, "").replace(/s$/, "");

const desde = (participant) => {
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
const Foto = ({ src }) => {
  const [dupla, setDupla] = useState(false);
  const [virada, setVirada] = useState(false);
  const img = useRef(null);
  const medir = () => {
    const { complete, naturalWidth, naturalHeight } = img.current;
    if (complete && naturalWidth) setDupla(ehDupla(naturalWidth, naturalHeight));
  };
  // A página vem pronta do servidor: a foto pode ter carregado antes do React
  // chegar, e aí o onLoad não dispara.
  useEffect(medir, [src]);
  return (
    <span
      className={`petiano-foto${dupla ? " petiano-foto-dupla" : ""}${virada ? " virada" : ""}`}
      onPointerUp={(e) => dupla && e.pointerType !== "mouse" && setVirada(!virada)}
    >
      <img ref={img} src={src} alt="" loading="lazy" onLoad={medir} />
      {dupla && <img className="petiano-foto-descontraida" src={src} alt="" />}
    </span>
  );
};

const Participant = ({ participant, projetos }) => {
  // A etiqueta mostra o nome do projeto como está na página Projetos e leva a ele.
  const projetoDa = (tag) =>
    projetos.find((p) => chave(p.title) === chave(tag.title));

  return (
    <div className="petiano">
      <div className="petiano-lado">
        {/* Cadastro cuja foto não subiu fica sem ela, e não derruba a página. */}
        {participant.profilePhoto ? (
          <Foto
            src={`${import.meta.env.VITE_API_URL}api/file/getProfilePhoto/${participant.profilePhoto._id}?v=${participant.profilePhoto.key}`}
          />
        ) : (
          <span className="petiano-foto" aria-hidden="true" />
        )}
        <div className="petiano-redes">
          {participant.socialMidia.map((icon, index) => (
            <a
              href={linkDaRede(icon)}
              key={index}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${icon.name} de ${participant.memberName}`}
            >
              <Icone nome={icon.name} />
            </a>
          ))}
        </div>
      </div>
      <div className="petiano-nome">{participant.memberName}</div>
      <div className="petiano-desde">{desde(participant)}</div>
      <div className="petiano-descricao">{participant.description}</div>
      <div className="petiano-etiquetas">
        {/* Só etiqueta de projeto: "Tutor" já está em "Tutor desde…". */}
        {participant.tags
          ?.map(projetoDa)
          .filter((p, i, todos) => p && todos.indexOf(p) === i)
          .map((projeto) => (
            <Link className="petiano-etiqueta" key={projeto._id} to={`/projetos/${slug(projeto.title)}`}>
              {projeto.title}
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Participant;
