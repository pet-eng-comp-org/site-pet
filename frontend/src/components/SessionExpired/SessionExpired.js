import React from "react";
import { Content, Box, BtnS } from "./style";
import logoPET from "../../assets/logo_pet_branca.svg";

export default function SessionExpired() {
  localStorage.removeItem("LOGINPET_TOKEN");

  return (
    <Box style={{ justifyContent: "center" }}>
      <Content>
        <img src={logoPET} alt="logo PET" style={{ padding: "25px 0" }} />
        <h3>Sua sessão expirou</h3>
        <a href={window.origin + "/login"}>
          <BtnS btncolor="rgb(0, 121, 174)" size="md">
            Login
          </BtnS>
        </a>
      </Content>
    </Box>
  );
}
