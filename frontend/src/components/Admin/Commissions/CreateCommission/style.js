import styled from "styled-components";

export const Tag = styled.span`
  display: flex;
  font-weight: 200;
  background-color: ${(props) => props.backColor};
  color: ${(props) => props.color};
  padding: 3px 5px 0;
  border-radius: 5px;
  font-weight: 500;
  max-width: -webkit-fit-content;
  max-width: -moz-fit-content;
  max-width: fit-content;
  box-sizing: unset;
  white-space: nowrap;
  margin: 0 10px 10px 0;

  .removeTag {
    cursor: pointer;
    margin-left: 5px;
    transform: translateY(3px);
  }
`;

export const DivTags = styled.div`
  padding: 10px 15px;
  display: flex;
  flex-wrap: inherit;
`;
