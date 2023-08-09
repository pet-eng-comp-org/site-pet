import Participant from "../Participant/Participant";
import "./Egress.css";
import Nav from "../../Navbar/Nav";

import React, { Component, Fragment, useEffect, useState } from "react";
import {
  MDBContainer,
  MDBIcon,
  MDBFormInline,
  MDBNav,
  MDBNavItem,
  MDBNavLink,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtnGroup,
  MDBBtn,
} from "mdbreact";
import api from "../../../services/api";

const Egress = () => {
  const [allEgress, setAllEgress] = useState([]);
  const [egress, setEgress] = useState([]);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState([false, false, false, false]);

  const handleQuery = (e) => {
    const q = e.target.value;
    setQuery(e.target.value);
    setEgress((prev) => {
      let newState = allEgress.filter((egress) => {
        return egress.memberName.toLowerCase().includes(query.toLowerCase());
      });
      if (q === "") newState = [...allEgress];
      return newState;
    });
  };

  const filterName = (egress) => {
    const array = [...egress];
    console.log(egress);
    return array.sort((a, b) => {
      return a.memberName.localeCompare(b.memberName, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });
  };

  const filterStart = (egress) => {
    const array = [...egress];
    console.log(egress);
    return array.sort((a, b) => {
      return new Date(a.startPet) - new Date(b.startPet);
    });
  };

  const filterEnd = (egress) => {
    const array = [...egress];
    console.log(egress);
    return array.sort((a, b) => {
      return new Date(b.endPet) - new Date(a.endPet);
    });
  };

  const filterTutor = (egress) => {
    const array = [...egress].filter((egress) => egress.tutor);
    return array;
  };

  const filtersFn = [filterName, filterStart, filterEnd, filterTutor];

  const handleFilter = (index) => {
    setFilters((prev) => {
      let newState = [...prev];
      newState[index] = !newState[index];

      newState.forEach((filterActive, index) => {
        if (filterActive) {
          setEgress(filtersFn[index](egress));
        }
      });
      return newState;
    });
  };

  useEffect(() => {
    const getPetianos = async () => {
      try {
        const response = await api.get("api/members/");
        setAllEgress(response.data.members.filter((p) => !p.active));
        setEgress(response.data.members.filter((p) => !p.active));
      } catch (err) {
        console.log(err.response.data);
      }
    };
    getPetianos();
  }, []);

  return (
    <div>
      <div className="egress">
        <div className="text-content">
          <h1>Petianos Egressos</h1>
          <p>
            O PET Eng Comp tem mais de 20 anos de existência e muitos petianos
            egressos. Confira aqui os membros que fizeram:
          </p>
        </div>
        <MDBContainer>
          <MDBRow>
            <MDBCol md="12" className="d-flex justify-content-center">
              <MDBFormInline className="md-form">
                <MDBIcon icon="search" />
                <MDBCol size="auto">
                  <input
                    className="form-control ml-3 mr-5 w-100"
                    type="text"
                    placeholder="Search"
                    aria-label="Search"
                    value={query}
                    onChange={handleQuery}
                  />
                </MDBCol>
                <MDBCol size="auto">
                  <MDBBtn
                    className="pt-2 pb-2 pl-3 pr-3"
                    active={filters[0]}
                    onClick={() => {
                      handleFilter(0);
                    }}
                  >
                    {" "}
                    Nome <MDBIcon icon="sort" className="pl-1" />
                  </MDBBtn>
                  <MDBBtn
                    className="pt-2 pb-2 pl-3 pr-3"
                    active={filters[1]}
                    onClick={() => {
                      handleFilter(1);
                    }}
                  >
                    {" "}
                    Entrada <MDBIcon icon="sort" className="pl-1" />
                  </MDBBtn>
                  <MDBBtn
                    className="pt-2 pb-2 pl-3 pr-3"
                    active={filters[2]}
                    onClick={() => {
                      handleFilter(2);
                    }}
                  >
                    {" "}
                    Saída <MDBIcon icon="sort" className="pl-1" />
                  </MDBBtn>
                  <MDBBtn
                    className="pt-2 pb-2 pl-3 pr-3"
                    active={filters[3]}
                    onClick={() => {
                      handleFilter(3);
                    }}
                  >
                    {" "}
                    Tutor <MDBIcon icon="sort" className="pl-1" />
                  </MDBBtn>
                </MDBCol>
              </MDBFormInline>
            </MDBCol>
          </MDBRow>
          <div className="green-bg d-flex flex-wrap">
            {egress.map((petiano, index) => {
              return (
                <MDBCol md={4} key={index}>
                  <Participant participant={petiano} />
                </MDBCol>
              );
            })}
          </div>
        </MDBContainer>
      </div>
    </div>
  );
};

export default Egress;
