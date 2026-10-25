import styled from "styled-components";
import { MDBBtn } from "mdbreact";

export const Content = styled.div`
  text-align: center;
  -webkit-box-shadow: 5px 5px 15px -1px rgba(0, 0, 0, 0.44);
  -moz-box-shadow: 5px 5px 15px -1px rgba(0, 0, 0, 0.44);
  box-shadow: 5px 5px 15px -1px rgba(0, 0, 0, 0.44);
  background-color: #1b3f3f;
  color: #fff;
  padding: 0 25px;

  img {
    width: 100%;
  }
`;

export const Box = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 0 5% calc(80vh - 80vw) 5%;
`;

export const BtnS = styled(MDBBtn)`
  margin: 25px 0;
`;
