import React from "react";
import { NavLink, Redirect, Route, Switch } from "react-router-dom";
import { ComAvisos } from "./ui";
import Petianos from "./Petianos";
import Projetos from "./Projetos";
import Documentos from "./Documentos";
import Noticias from "./Noticias";
import Selecoes from "./Selecoes";
import "./Painel.css";

// O painel de quem mantém o site: o mesmo visual, a mesma grade e os mesmos
// botões das páginas públicas, e cada seção com endereço próprio.
const secoes = [
  ["petianos", "Petianos", Petianos],
  ["projetos", "Projetos", Projetos],
  ["documentos", "Documentos", Documentos],
  ["noticias", "Notícias", Noticias],
  ["selecoes", "Seleções", Selecoes],
];

const Painel = () => (
  <ComAvisos>
    <div className="pagina painel">
      <h1>Painel</h1>
      <nav aria-label="Seções do painel">
        <ul className="painel-secoes">
          {secoes.map(([caminho, nome]) => (
            <li key={caminho}>
              <NavLink to={`/admin/${caminho}`} activeClassName="ativa">
                {nome}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <Switch>
        {secoes.map(([caminho, , Secao]) => (
          <Route key={caminho} path={`/admin/${caminho}`} exact component={Secao} />
        ))}
        <Redirect to="/admin/petianos" />
      </Switch>
    </div>
  </ComAvisos>
);

export default Painel;
