import React, { useState } from "react";
import { MDBBtn } from "mdbreact";
import ListSelections from "./ListSelections/ListSelections";
import InspectSelection from "./InspectSelection/InspectSelection";

const Selections = () => {
  const [activeItem, setActiveItem] = useState(1);
  const [idSelection, setIdSelection] = useState();

  const togglePanel = (tab, id) => {
    if (activeItem !== tab) {
      setIdSelection(id);
      setActiveItem(tab);
    }
  };

  const renderSelected = () => {
    if (activeItem === 1) return <ListSelections goToInspect={togglePanel} />;

    return (
      <>
        <div>
          <MDBBtn onClick={() => togglePanel(1)}>Voltar</MDBBtn>
        </div>
        <InspectSelection idSelection={idSelection} />
      </>
    );
  };

  return renderSelected();
};

export default Selections;
