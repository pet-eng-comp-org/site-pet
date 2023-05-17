import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import CreateCommissions from "./CreateCommission/CreateCommission";
import DeleteCommission from "./DeleteCommission/DeleteCommission";
import EditCommission from "./EditCommission/EditCommission";
import { MDBBtn, MDBIcon, MDBListGroup } from "mdbreact";
import { useHistory } from "react-router-dom";
import {
  SpanIcon,
  DivButtons,
  Tag,
  Commission,
  Actions,
  Description,
  Image,
  Name,
  DivTags,
} from "./style";

const Commissions = () => {
  const history = useHistory();

  const [isShown, setIsShown] = useState(false);
  const [commissions, setCommissions] = useState([]);
  const [idCommission, setIdCommission] = useState("");
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const [rows, setRows] = useState([]);

  const formatedDescription = (text) => {
    let str = text.substr(0, 180);

    if (str.length >= 180) str = str.concat("...");

    return str;
  };

  const getCommissions = async () => {
    try {
      const response = await api.get("api/comissions/");
      setCommissions(response.data.comissions);
    } catch (err) {
      console.log(err.response);
    }
  };

  useEffect(() => {
    getCommissions();
  }, []);

  useEffect(() => {
    const populateTable = () => {
      const commissionTable = [];
      commissions.forEach((commission) => {
        commissionTable.push({
          id: commission._id,
          title: commission.title,
          description: commission.description,
          tags: commission.tags,
          actions: (
            <DivButtons>
              <SpanIcon
                background="#ffc107"
                onClick={() => {
                  setIdCommission(commission._id);
                  setModalEdit((old) => !old);
                  // history.push(`/admin/${commission._id}`);
                }}
              >
                <MDBIcon icon="edit" />
              </SpanIcon>
              <SpanIcon
                background="#dc3545"
                onClick={() => {
                  setIdCommission(commission._id);
                  setModalDelete((m) => !m);
                  // history.push(`/admin/${commission._id}`);
                }}
              >
                <MDBIcon icon="trash" />
              </SpanIcon>
            </DivButtons>
          ),
        });
      });
      setRows(commissionTable);
    };

    if (commissions) populateTable();
  }, [commissions, history]);

  return (
    <>
      <CreateCommissions
        getCommissions={getCommissions}
        isOpen={isShown}
        toggle={() => setIsShown(!isShown)}
      />

      <DeleteCommission
        idCommission={idCommission}
        getCommissions={getCommissions}
        isOpen={modalDelete}
        toggle={() => {
          setModalDelete(!modalDelete);
          // history.push("/admin");
        }}
      />

      <EditCommission
        idCommission={idCommission}
        getCommissions={getCommissions}
        isOpen={modalEdit}
        toggle={() => {
          setModalEdit((old) => !old);
          // history.push("/admin");
        }}
      />

      <MDBBtn
        style={{ fontWeight: "bold" }}
        onClick={() => {
          setIsShown(!isShown);
        }}
      >
        Cadastrar nova comissão
      </MDBBtn>

      <MDBListGroup id="list-group" style={{ width: "38rem" }}>
        {rows !== [] &&
          rows.map((commission, index) => {
            let imgUrl =
              "https://image.freepik.com/fotos-gratis/gotas-de-oleo" +
              "-na-imagem-abstrata-padrao-psicodelico-de-agua_23-2148290141.jpg";

            return (
              <Commission key={index}>
                <Image url={imgUrl} />
                <Actions>{commission.actions}</Actions>
                <Name>{commission.title}</Name>
                <Description>
                  {formatedDescription(commission.description)}
                </Description>
                <DivTags>
                  {commission.tags?.map((tag, index) => (
                    <span key={index}>
                      {tag.link ?
                        <Tag color={tag.color} backColor={tag.backgroundColor} href={tag.link} target="_blank" >
                          {tag.title}
                        </Tag>
                        :
                        <Tag color={tag.color} backColor={tag.backgroundColor}  >
                          {tag.title}
                        </Tag>
                      }
                    </span>
                  ))}
                </DivTags>
                <br />
              </Commission>
            );
          })}
      </MDBListGroup>
    </>
  );
};

export default Commissions;
