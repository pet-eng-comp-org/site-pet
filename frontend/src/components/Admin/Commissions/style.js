import styled from "styled-components";

export const DivButtons = styled.div`
  display: flex;
  width: 200px;
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

  &:not(:first-child) {
    margin-left: 10px;
  }
`;

export const Tag = styled.a`
  display: flex;
  font-weight: 200;
  background-color: ${(props) => props.backColor};
  color: ${(props) => props.color};
  padding: 3px 5px 0;
  border-radius: 5px;
  text-decoration:none;
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
  &&&&:not([href]):not([tabindex]), &&&&:not([href]):not([tabindex]):focus,&&&:hover, &&&&:not([href]):not([tabindex]):hover{
    color: ${(props) => props.color};
  }

  

`;

export const Commission = styled.div`
  color: black;
  font-weight: lighter;

  display: grid;

  grid-template-columns: 140px auto auto;
  grid-template-rows: auto 100px auto;

  background-color: white;
  padding: 15px 15px 0 15px;
  border: 1px solid rgba(0, 0, 0, 0.125);
  margin: 15px 0.375rem;

  grid-template-areas:
    "IM NM NM NM"
    "IM DP DP DP"
    "AC TG TG TG";
`;

export const Image = styled.div`
  grid-area: IM;

  z-index: 999;
  width: 140px;
  height: 140px;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url(${(props) => props.url});
`;

export const Actions = styled.div`
  grid-area: AC;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Name = styled.div`
  grid-area: NM;
  font-size: 25px;

  margin-bottom: 10px;
  padding: 0 20px;
`;

export const Description = styled.div`
  grid-area: DP;

  font-size: 16px;
  overflow: hidden;

  padding: 0 20px;
`;

export const DivTags = styled.div`
  grid-area: TG;

  display: flex;
  align-items: center;
  flex-wrap: wrap;

  padding: 10px 20px 0 20px;
`;
