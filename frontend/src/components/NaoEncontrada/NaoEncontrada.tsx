import Link from "next/link";

const NaoEncontrada = () => {
  return (
    <div className="pagina pagina-centro">
      <h1>Página não encontrada</h1>
      <p className="pagina-intro">
        O endereço pode estar errado ou a página mudou de lugar.
      </p>
      {/* Um link de texto com a seta, e não um botão: a página só aponta o
          caminho de volta. */}
      <Link className="link-mais" href="/">
        Ir para a página inicial
      </Link>
    </div>
  );
};

export default NaoEncontrada;
