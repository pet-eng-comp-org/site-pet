import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import "./Modal.css";
import { Tag, Tags } from "./style";
import { LogoDefault } from '../../../assets/icone_pet.svg'
import Carousel from "../Carousel/Carousel";
import {
  MDBContainer,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBCol,
  MDBRow,
} from "mdbreact";

function Modal({ isOpen, toggle, idComission }) {
  const [comission, setComission] = useState();
  const [src, setSrc] = useState("");

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

  useEffect(() => {
    if (comission) {
      let photo = comission.photos[0];

      if (photo) {
        setSrc(
          `${process.env.REACT_APP_API_URL + "api/file/getComissionPhoto/"}${photo._id
          }`
        );
      }
    }
  }, [comission]);

  return (
    <>
      <MDBContainer>
        <MDBModal isOpen={isOpen} toggle={toggle} size="lg">
          <MDBModalHeader className="text-white bg-dark" toggle={toggle}>
            {comission?.title}
          </MDBModalHeader>
          <MDBModalBody>
            <MDBContainer>
              <MDBRow>
                <MDBCol xl="5" lg="5" md="12" sm="12" xs="12">
                  <div className="modal-image">
                    <span>
                      <img
                        src={src}
                        style={{ height: "60%" }}
                        alt={`Imagem da comissão ${comission?.title}`}
                      />
                    </span>
                  </div>
                </MDBCol>
                <MDBCol>
                  <h1 className="comission-title">{comission?.title}</h1>
                  <p>{comission?.description}</p>
                  <Tags>
                    {comission?.tags?.map((tag, index) => (
                      // <span key={index}>
                      //   <Tag color={tag.color} backColor={tag.backgroundColor} link={tag.link ? tag.link : "#"}>
                      //     {tag.title}
                      //     {console.log(tag.link)}
                      //   </Tag>
                      // </span>
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
                  </Tags>
                </MDBCol>
              </MDBRow>
              <br />
              {comission?.photos && (
                <Carousel imagesArray={comission?.photos} />
              )}
            </MDBContainer>
          </MDBModalBody>
        </MDBModal>
      </MDBContainer>
    </>
  );
}

export default Modal;
