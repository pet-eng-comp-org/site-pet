import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import "./Modal.css";
import { MDBModal, MDBModalBody, MDBModalHeader } from "mdbreact";

const foto = (id) =>
  `${process.env.REACT_APP_API_URL}api/file/getComissionPhoto/${id}`;

// A primeira imagem da comissão é o ícone do cartão; as outras são fotos.
function Modal({ isOpen, toggle, idComission }) {
  const [comission, setComission] = useState();

  useEffect(() => {
    setComission(undefined);
    const getComission = async () => {
      try {
        const response = await api.get(`api/comissions/${idComission}`);
        setComission(response.data.comission);
      } catch (err) {
        console.log(err);
      }
    };
    if (idComission) getComission();
  }, [idComission]);

  const fotos = comission?.photos?.slice(1) || [];
  const links = comission?.tags?.filter((t) => t.link) || [];
  const ferramentas = comission?.tags?.filter((t) => !t.link) || [];

  return (
    <MDBModal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <MDBModalHeader className="comissao-cabecalho" toggle={toggle}>
        {comission?.title}
      </MDBModalHeader>
      <MDBModalBody className="comissao-corpo">
        <p className="comissao-descricao">{comission?.description}</p>

        {(links.length > 0 || ferramentas.length > 0) && (
          <ul className="comissao-tags">
            {links.map((tag) => (
              <li key={tag._id}>
                <a href={tag.link} target="_blank" rel="noopener noreferrer">
                  {tag.title.trim()}
                </a>
              </li>
            ))}
            {ferramentas.map((tag) => (
              <li key={tag._id}>
                <span>{tag.title.trim()}</span>
              </li>
            ))}
          </ul>
        )}

        {fotos.length > 0 && (
          <div className="comissao-fotos">
            {fotos.map((f) => (
              <img key={f._id} src={foto(f._id)} alt="" loading="lazy" />
            ))}
          </div>
        )}
      </MDBModalBody>
    </MDBModal>
  );
}

export default Modal;
