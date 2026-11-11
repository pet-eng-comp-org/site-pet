import Link from "next/link";
import type { CSSProperties } from "react";

// Ícone de traço no verde de ação: o SVG do projeto vira máscara (--icone).
export const ICONE = "bg-acao [-webkit-mask:var(--icone)_center/contain_no-repeat] [mask:var(--icone)_center/contain_no-repeat]";
import slug from "../../../utils/slug";
import iconeProjeto from "../../../utils/iconeProjeto";

// O cartão é uma chamada: o nome em verde e uma frase curta. A descrição
// inteira fica na página do projeto. Projeto novo, sem frase aqui, usa a
// primeira frase da descrição.
const FRASES: Record<string, string> = {
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
const primeiraFrase = (texto: string) => texto.match(/^[\s\S]*?[.!?](?=\s|$)/)?.[0] || texto;

// O cartão inteiro é o link para a página do projeto.
interface Props {
  title: string;
  description: string;
  icon?: string;
  onClick?: () => void;
}

function Project({ title, description, icon, onClick }: Props) {
  const src = iconeProjeto(title, icon);

  return (
    // O nome do link é o título; a frase vem como descrição. Antes o leitor
    // de tela lia o cartão inteiro como nome, com 150 caracteres.
    <Link
      // Branco, cantos de 28 px, sombra leve, 28 px de folga em cima e 30 px
      // dos lados. No hover a sombra cresce e o cartão aumenta 1%.
      className="relative flex h-full min-h-[240px] w-full flex-col items-start rounded-cartao bg-fundo px-[30px] pt-[28px] pb-[72px] text-left text-texto no-underline shadow-[2px_4px_12px_rgba(0,0,0,0.08)] transition-[box-shadow,scale] duration-300 ease-[cubic-bezier(0,0,0.5,1)] hover:scale-[1.01] hover:shadow-[2px_4px_16px_rgba(0,0,0,0.16)] motion-reduce:transition-none motion-reduce:hover:scale-100"
      href={`/projetos/${slug(title)}`}
      onClick={onClick}
      aria-labelledby={`projeto-${slug(title)}`}
      aria-describedby={`projeto-${slug(title)}-frase`}
    >
      {/* O ícone (traço branco) vira máscara pintada no verde de ação. */}
      <span
        className={`mb-[14px] size-14 ${ICONE}`}
        style={src ? ({ "--icone": `url("${src}")` } as CSSProperties) : undefined}
      />
      {/* A chamada: o nome em verde e a frase em tinta, numa frase só de 24 px. */}
      <h2 className="m-0 max-w-[22ch] text-28 font-semibold max-desktop:text-24 max-tablet:text-21 text-pretty">
        <span id={`projeto-${slug(title)}`} className="text-acao">
          {title}.
        </span>{" "}
        <span id={`projeto-${slug(title)}-frase`}>
          {FRASES[slug(title)] || primeiraFrase(description)}
        </span>
      </h2>
      {/* O cartão inteiro é o link; o botão "›" no canto só mostra isso. */}
      <span
        className="absolute right-5 bottom-5 size-9 rounded-full bg-[#e8e8ed] after:absolute after:inset-0 after:m-auto after:h-[14px] after:w-[8px] after:translate-x-[1px] after:bg-[rgba(0,0,0,0.56)] after:[-webkit-mask:var(--seta)_center/contain_no-repeat] after:[mask:var(--seta)_center/contain_no-repeat]"
        aria-hidden="true"
      />
    </Link>
  );
}

export default Project;
