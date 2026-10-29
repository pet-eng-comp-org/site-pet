import React from "react";
import { Link } from "react-router-dom";
import { MDBIcon } from "mdbreact";
import slug from "../../../utils/slug";
import {
  Perfil,
  Photo,
  Social,
  Name,
  Start,
  Description,
  Tags,
  Tag,
} from "./style";

// "Game Jam", "GameJam" e "PET Game Jam" são o mesmo projeto: compara sem
// "pet", sem separador e sem plural.
const chave = (titulo) =>
  slug(titulo).replace(/pet/g, "").replace(/-/g, "").replace(/s$/, "");

const desde = (participant) => {
  const mes = new Date(participant.startPet).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  });
  return `${participant.tutor ? "Tutor" : "No PET"} desde ${mes}`;
};

const Participant = ({ participant, projetos }) => {
  // A etiqueta mostra o nome do projeto como está na página Projetos e leva a ele.
  const projetoDa = (tag) =>
    projetos.find((p) => chave(p.title) === chave(tag.title));

  return (
    <Perfil>
      <Photo
        src={`${process.env.REACT_APP_API_URL}api/file/getProfilePhoto/${participant.profilePhoto._id}`}
        alt=""
        loading="lazy"
      />
      <Social>
        {participant.socialMidia.map((icon, index) => (
          <a
            href={icon.link}
            key={index}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${icon.name} de ${participant.memberName}`}
          >
            <MDBIcon
              fab
              icon={icon.name === "facebook" ? "facebook-square" : icon.name}
            />
          </a>
        ))}
      </Social>
      <Name>{participant.memberName}</Name>
      <Start>{desde(participant)}</Start>
      <Description>{participant.description}</Description>
      <Tags>
        {participant.tags?.map((tag, index) => {
          const projeto = projetoDa(tag);
          return projeto ? (
            <Tag as={Link} key={index} to={`/projetos/${slug(projeto.title)}`}>
              {projeto.title}
            </Tag>
          ) : (
            <Tag key={index}>{tag.title.trim()}</Tag>
          );
        })}
      </Tags>
    </Perfil>
  );
};

export default Participant;
