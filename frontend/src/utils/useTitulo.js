import { useEffect } from "react";

// Título da aba começa pelo conteúdo da página: "Documentos · PET Eng Comp Ufes".
const useTitulo = (titulo) => {
  useEffect(() => {
    document.title = titulo
      ? `${titulo} · PET Eng Comp Ufes`
      : "PET Engenharia de Computação · Ufes";
  }, [titulo]);
};

export default useTitulo;
