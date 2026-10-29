import React, { useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
} from "mdbreact";

// A data vem do banco como instante; o campo de data quer o dia em Vitória.
const diaEmVitoria = (data) =>
  data
    ? new Date(data).toLocaleDateString("en-CA", {
        timeZone: "America/Sao_Paulo",
      })
    : "";

const campo = { width: "100%", minHeight: 38 };

// Formulário de criar e de editar seleção. As inscrições são feitas no Google
// Forms: aqui só entram o período e o link, e o site mostra o botão
// "Inscreva-se" do primeiro ao último dia.
const FormularioSelecao = ({ isOpen, toggle, titulo, inicial, onSubmit }) => {
  const [title, setTitle] = useState(inicial?.title || "");
  const [dateBegin, setDateBegin] = useState(diaEmVitoria(inicial?.dateBegin));
  const [dateEnd, setDateEnd] = useState(diaEmVitoria(inicial?.dateEnd));
  const [formLink, setFormLink] = useState(inicial?.formLink || "");

  const envia = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      dateBegin: `${dateBegin}T00:00:00-03:00`,
      dateEnd: `${dateEnd}T23:59:59-03:00`,
      formLink: formLink.trim(),
    });
  };

  return (
    <MDBModal isOpen={isOpen} toggle={toggle} size="lg">
      <MDBModalHeader toggle={toggle}>{titulo}</MDBModalHeader>
      <form onSubmit={envia}>
        <MDBModalBody>
          <label htmlFor="selecao-titulo">Título</label>
          <input
            id="selecao-titulo"
            style={campo}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Seleção 2027/1"
            minLength={5}
            maxLength={30}
            required
          />
          <br />
          <br />
          <label htmlFor="selecao-forms">Link do Google Forms</label>
          <input
            id="selecao-forms"
            style={campo}
            type="url"
            value={formLink}
            onChange={(e) => setFormLink(e.target.value)}
            placeholder="https://forms.gle/..."
            pattern="https://.*"
            required
          />
          <br />
          <br />
          <label htmlFor="selecao-inicio">Primeiro dia de inscrição</label>
          <input
            id="selecao-inicio"
            style={campo}
            type="date"
            value={dateBegin}
            onChange={(e) => setDateBegin(e.target.value)}
            required
          />
          <br />
          <br />
          <label htmlFor="selecao-fim">Último dia de inscrição</label>
          <input
            id="selecao-fim"
            style={campo}
            type="date"
            value={dateEnd}
            min={dateBegin}
            onChange={(e) => setDateEnd(e.target.value)}
            required
          />
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn type="button" onClick={toggle}>
            Cancelar
          </MDBBtn>
          <MDBBtn color="primary" type="submit">
            Salvar
          </MDBBtn>
        </MDBModalFooter>
      </form>
    </MDBModal>
  );
};

export default FormularioSelecao;
