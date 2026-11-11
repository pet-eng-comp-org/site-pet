import Link from "next/link";

const NaoEncontrada = () => {
  return (
    <div className="pagina pagina-centro">
      <h1>Página não encontrada</h1>
      <p className="pagina-intro">
        O endereço pode estar errado ou a página mudou de lugar.
      </p>
      <Link className="botao-principal" href="/">
        Ir para a página inicial
      </Link>
    </div>
  );
};

export default NaoEncontrada;
