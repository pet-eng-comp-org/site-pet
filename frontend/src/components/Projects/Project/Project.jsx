import React from "react";
import { Link } from "react-router-dom";
import slug from "../../../utils/slug";

// O cartão é uma chamada: o nome em verde e uma frase curta. A descrição
// inteira fica na página do projeto. Projeto novo, sem frase aqui, usa a
// primeira frase da descrição.
const FRASES = {
  eletropet: "Eletrônica e microcontroladores na prática.",
  introcomp: "Programação para alunos do ensino médio público.",
  pulga: "As artes de todas as comissões do PET.",
  "mobiliza-pet": "Os grupos PET da Ufes em defesa do programa.",
  topcom: "O maior torneio de programação do Espírito Santo.",
  dev: "Os sistemas web do PET, como este site.",
  manutencao: "A rede, as máquinas e os servidores do PET.",
  interpet: "Os grupos PET da Ufes trabalhando juntos.",
  monitorias: "Monitoria de Programação I e II para a graduação.",
  "pet-game-jam": "Competição de programação de um dia, em equipes.",
  pesquisa: "Iniciação científica e artigos feitos no PET.",
};
const primeiraFrase = (texto) => texto.match(/^[\s\S]*?[.!?](?=\s|$)/)?.[0] || texto;

// O cartão inteiro é o link para a página do projeto.
function Project({ title, description, icon, onClick }) {
  const src = icon
    ? `${import.meta.env.VITE_API_URL}api/file/getComissionPhoto/${icon}`
    : "";

  return (
    // O nome do link é o título; a frase vem como descrição. Antes o leitor
    // de tela lia o cartão inteiro como nome, com 150 caracteres.
    <Link
      className="projeto"
      to={`/projetos/${slug(title)}`}
      onClick={onClick}
      aria-labelledby={`projeto-${slug(title)}`}
      aria-describedby={`projeto-${slug(title)}-frase`}
    >
      {/* O ícone (traço branco) vira máscara pintada no verde de ação. */}
      <span
        className="projeto-icone"
        style={src ? { "--icone": `url("${src}")` } : undefined}
      />
      <h2 className="projeto-chamada">
        <span id={`projeto-${slug(title)}`} className="projeto-nome">
          {title}.
        </span>{" "}
        <span id={`projeto-${slug(title)}-frase`}>
          {FRASES[slug(title)] || primeiraFrase(description)}
        </span>
      </h2>
      {/* O cartão inteiro é o link; o botão "›" no canto só mostra isso. */}
      <span className="projeto-ir" aria-hidden="true" />
    </Link>
  );
}

export default Project;
