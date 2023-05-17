import styled from 'styled-components';

export const Tags = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  @media (min-width: 568px) {
    padding: 0px;
  }

  @media (max-width: 567px) {
    padding-top: 10px;
  }
`;

export const Tag = styled.a`
  background-color: ${(props) => props.backColor};
  color: ${(props) => props.color};
  padding: 3px 5px 0;
  border-radius: 5px;
  font-weight: 500;
  font-size: 14px;
  max-width: -webkit-fit-content;
  max-width: -moz-fit-content;
  max-width: fit-content;
  box-sizing: unset;
  margin: 0 8px 8px 0;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &&&&:not([href]):not([tabindex]), &&&&:not([href]):not([tabindex]):focus,&&&:hover, &&&&:not([href]):not([tabindex]):hover{
    color: ${(props) => props.color};
  }

  &:hover {
    filter: brightness(0.85);
  }
`;
