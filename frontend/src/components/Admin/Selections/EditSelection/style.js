import styled from "styled-components";

export const DivPhases = styled.div`
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  flex-wrap: inherit;
`;

export const Phase = styled.div`
  display: flex;
  font-weight: 200;
  padding: 3px 5px 0;
  box-sizing: unset;
  white-space: nowrap;
  margin: 0 10px 10px 0;
  border: 1px solid #cdc7c2;
  border-radius: 3px;
  width: max-content;

  .infoPhase {
    margin-left: 30px;
  }

  .removePhase {
    color: #dc3545;
    cursor: pointer;
    margin-left: 30px;
    transform: translateY(3px);
  }
`;
