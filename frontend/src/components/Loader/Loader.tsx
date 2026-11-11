"use client";

import { PropagateLoader } from "react-spinners";

// O react-spinners 0.12+ trocou a prop `css` (emotion) por `cssOverride`, um
// objeto de estilo comum.
const override = {
  display: "block",
  marginLeft: "50%",
  marginTop: "5%",
  paddingBottom: "30px",
  borderColor: "#186a6c",
};

const Loader = () => (
  <div className="sweet-loading">
    <PropagateLoader cssOverride={override} size={15} color="var(--cor-acao)" />
  </div>
);

export default Loader;
