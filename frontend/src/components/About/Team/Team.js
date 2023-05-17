import React, { useEffect, useState } from "react";
import { MDBCol, MDBRow, MDBContainer } from "mdbreact";
import Participant from "../Participant/Participant";
import "./Team.css";
import Loader from "../../Loader/Loader";

const Team = ({ petianos }) => {
  const [team, setTeam] = useState();

  useEffect(() => {
    let aux = [...petianos];

    let tutor;

    aux.sort((a, b) => {
      if (
        new Date(a.startPet) <= new Date(b.startPet) &&
        !a.tutor &&
        !b.tutor
      ) {
        return 1;
      } else {
        return -1;
      }
    });

    tutor = { ...aux[0] };
    for (let i = 0; i < aux.length - 1; i++) {
      aux[i] = aux[i + 1];
    }
    aux[aux.length - 1] = { ...tutor };

    setTeam([...aux]);
  }, [petianos]);

  return (
    <>
      {!team ? (
        <Loader />
      ) : (
        <div className="green-bg">
          <MDBContainer>
            <MDBRow>
              {team.map((participant, index) => (
                <MDBCol xs="12" lg="6" className="pb-4 pt-4" key={index}>
                  <Participant participant={participant} />
                </MDBCol>
              ))}
            </MDBRow>
          </MDBContainer>
        </div>
      )}
    </>
  );
};

export default Team;
