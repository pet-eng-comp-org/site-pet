import React, { useState, useEffect } from "react";
import { MDBContainer } from "mdbreact";
import "./Project.css";
import "../Projects.css";

function Project({ title, description, icon, alt }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    if (icon) {
      setSrc(
        `${
          process.env.REACT_APP_API_URL + "api/file/getComissionPhoto/"
        }${icon}`
      );
    }
  }, [icon]);

  return (
    <MDBContainer>
      {/* <div className="circle-image"> */}
      <div className="d-flex flex-column justify-content-center">
        <img className="card-img-top card-image" src={src} alt={alt} />
        <span className="card-image-background"></span>
      </div>
      <br />
      <div>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </MDBContainer>
  );
}

export default Project;
