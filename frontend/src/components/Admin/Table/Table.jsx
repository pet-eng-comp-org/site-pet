import React from "react";
import { MDBDataTableS } from "./style.js";

const Table = ({ rows, columns }) => {
  return (
    <MDBDataTableS
      striped
      bordered
      small
      responsive
      hover
      data={{ rows, columns }}
      entriesLabel="Mostrar"
      searchLabel="Buscar"
      infoLabel={["Mostrando", "a", "de", "itens"]}
      paginationLabel={["Anterior", "Próxima"]}
      noRecordsFoundLabel="Nada encontrado"
    />
  );
};

export default Table;
