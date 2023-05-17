import styled from "styled-components";

export const DivButtons = styled.div`
  display: flex;
  padding: 0.5rem;
  justify-content: space-between;
  align-items:end;
  width: 32%;
`;

export const SpanIcon = styled.span`
  padding: 3px 20px;
  cursor: pointer;
  border-radius: 3px;
  box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.15);
  background-color: ${(props) => props.background};
  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
  box-shadow 0.15s ease-in-out;
  color: #fff;

  &:hover {
    box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18);
  }
`;

