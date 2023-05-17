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
    />
  );
};

export default Table;
