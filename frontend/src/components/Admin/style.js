import styled from "styled-components";
import { MDBCol } from "mdbreact";

export const ListLinks = styled.ul`
  padding: 0;
`;

export const NavLink = styled.li`
  color: white;
  font-weight: 400;
  list-style-type: none;
  padding: 10px 12px;
  cursor: pointer;
  transition: linear 0.25s background-color, linear 0.25s color;

  &:hover {
    color: #444;
    background-color: #ddd;
  }

  &.activeTab {
    color: black;
    background-color: #f4f4f4;
  }
`;

export const MDBColS = styled(MDBCol)`
  padding-top: 2rem;
  justify-content: start;
  padding-bottom: 15px;

  &.sideBar {
    background-color: #404040;
  }
`;
