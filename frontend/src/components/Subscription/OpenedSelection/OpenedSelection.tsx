import Link from "next/link";
import { AVISO, FRASE } from "../aviso";

const ultimoDia = (data: string) =>
  new Date(data).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    timeZone: "America/Sao_Paulo",
  });

// fim e formulario vêm da seleção aberta; a reserva de altura (Subscription)
// usa valores de exemplo.
function OpenedSelection({ edital, fim, formulario }: { edital: string | null; fim: string; formulario: string }) {
  return (
    <section className={AVISO}>
      <h2>Inscrições abertas até {ultimoDia(fim)}</h2>
      <p className={FRASE}>
        Antes de se inscrever, leia o{" "}
        {edital ? (
          <a
            href={edital}
            target="_blank"
            rel="noopener noreferrer"
            className="link-texto"
          >
            edital
          </a>
        ) : (
          <Link href="/documentos" className="link-texto">
            edital
          </Link>
        )}
        .
      </p>
      <a
        className="botao-principal mt-4"
        href={formulario}
        target="_blank"
        rel="noopener noreferrer"
      >
        Inscreva-se
      </a>
    </section>
  );
}
export default OpenedSelection;
