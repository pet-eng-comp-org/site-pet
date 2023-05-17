import React, { useState } from "react";
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
import { useHistory } from "react-router-dom";
import { MDBIcon } from "mdbreact";

const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const Participant = ({ participant }) => {
  const [position, setPosition] = useState("top");
  const history = useHistory();

  const formatDate = () => {
    let formated;

    let d = new Date(participant.startPet);

    formated = `${meses[d.getMonth()]} de ${d.getFullYear()}`;

    return formated;
  };

  // console.log(participant);
  return (
    <Perfil>
      <Photo
        url={`${process.env.REACT_APP_API_URL}api/file/getProfilePhoto/${participant.profilePhoto._id}`}
        bgPosition={position}
        onMouseEnter={() => setPosition("bottom")}
        onMouseLeave={() => setPosition("top")}
      />
      <Social>
        {participant.socialMidia.map((icon, index) => (
          <a
            href={icon.link}
            key={index}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MDBIcon
              fab
              icon={icon.name === "facebook" ? "facebook-square" : icon.name}
            />
          </a>
        ))}
      </Social>
      <Name>{participant.memberName}</Name>
      <Start>{formatDate()}</Start>
      <Description>{participant.description}</Description>
      <Tags>
        {participant.tags?.map((tag, index) => (
          <span key={index}>
            <Tag
              onClick={() => history.push("/projetos")}
              color={tag.color}
              backColor={tag.backgroundColor}
            >
              {tag.title}
            </Tag>
          </span>
        ))}
      </Tags>
    </Perfil>
  );
};

export default Participant;
