import React, { useEffect, useState } from "react";
import goUp from "../../utils/goUp";
import { MDBContainer, MDBRow } from "mdbreact";
import { ListLinks, NavLink, MDBColS } from "./style.js";
import Petianos from "./Petianos/Petianos";
import Selections from "./Selections/ListSelections/ListSelections";
import Documents from "./Documents/Documents";
import News from "./News/News";
import Commissions from "./Commissions/Commissions";
import useTitulo from "../../utils/useTitulo";

const Admin = () => {
  useTitulo("Painel");
  const [activeItem, setActiveitem] = useState(0);
  const [activeOption, setActiveOption] = useState(["activeTab", "", ""]);

  useEffect(() => {
    goUp();
  }, []);

  const changeActive = (id) => {
    if (id !== activeItem) {
      let vetAux = [];
      for (let i = 0; i < 5; i++) {
        if (i !== id) vetAux[i] = "";
        else vetAux[i] = "activeTab";
      }

      setActiveitem(id);
      setActiveOption(vetAux);
    }
  };

  const renderSelected = () => {
    switch (activeItem) {
      case 0:
        return <Petianos />;

      case 1:
        return <Documents />;

      case 2:
        return <News />;

      case 3:
        return <Commissions/>;

      case 4:
        return <Selections />;
      default:
        return <Petianos />;
    }
  };

  return (
    <>
      <MDBContainer fluid>
        <MDBRow>
          <MDBColS size="12" sm="3" md="2" className="sideBar">
            <ListLinks aria-label="Seções do painel">
              <NavLink
                onClick={() => changeActive(0)}
                className={activeOption[0]}
                aria-current={activeOption[0] ? "page" : undefined}
              >
                Petianos
              </NavLink>
              <NavLink
                onClick={() => changeActive(1)}
                className={activeOption[1]}
                aria-current={activeOption[1] ? "page" : undefined}
              >
                Documentos
              </NavLink>
              <NavLink
                onClick={() => changeActive(2)}
                className={activeOption[2]}
                aria-current={activeOption[2] ? "page" : undefined}
              >
                Notícias
              </NavLink>
              <NavLink
                onClick={() => changeActive(3)}
                className={activeOption[3]}
                aria-current={activeOption[3] ? "page" : undefined}
              >
                Comissões
              </NavLink>
              <NavLink
                onClick={() => changeActive(4)}
                className={activeOption[4]}
                aria-current={activeOption[4] ? "page" : undefined}
              >
                Seleções
              </NavLink>
            </ListLinks>
          </MDBColS>
          <MDBColS size="12" sm="9" md="10">
            {renderSelected()}
          </MDBColS>
        </MDBRow>
      </MDBContainer>
    </>
  );
};

export default Admin;
