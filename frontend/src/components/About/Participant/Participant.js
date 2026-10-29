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

// A cor das tags vem do painel; texto branco em fundo claro (ciano, cinza)
// ficava ilegivel. Se a cor escolhida nao contrasta 4,5:1, usa tinta escura.
const luminancia = (hex) => {
  const h = (hex || "").replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(h)) return null;
  const c = [0, 2, 4].map((i) => {
    const v = parseInt(h.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contraste = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const corLegivel = (fundo, texto) => {
  const lf = luminancia(fundo);
  const lt = luminancia(texto);
  if (lf === null || lt === null || contraste(lf, lt) >= 4.5) return texto;
  return contraste(lf, 0) >= contraste(lf, 1) ? "#000000" : "#ffffff";
};

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
      <Start>{formatDate()}</Start>
      <Description>{participant.description}</Description>
      <Tags>
        {participant.tags?.map((tag, index) => (
          <span key={index}>
            <Tag
              onClick={() => history.push("/projetos")}
              color={corLegivel(tag.backgroundColor, tag.color)}
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
