import styled from "styled-components";
import { MDBCol } from "mdbreact";

export const ListLinks = styled.nav`
  display: flex;
  flex-direction: column;

  @media (max-width: 575.98px) {
    flex-direction: row;
    overflow-x: auto;
  }
`;

export const NavLink = styled.button`
  color: white;
  font-weight: 400;
  text-align: left;
  white-space: nowrap;
  min-height: 44px;
  background: none;
  border: 0;
  padding: 10px 12px;
  cursor: pointer;
  transition: linear 0.25s background-color, linear 0.25s color;

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: -4px;
  }

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

  @media (max-width: 575.98px) {
    &.sideBar {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
`;
