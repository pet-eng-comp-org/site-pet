import styled from "styled-components";

export const Perfil = styled.div`
  color: white;
  font-weight: 400;

  @media (min-width: 568px) {
    display: grid;

    grid-template-columns: 140px auto auto auto;
    grid-template-rows: auto auto auto auto;

    grid-template-areas:
      "PH NM NM NM"
      "PH SP SP SP"
      "PH DP DP DP"
      "SM TG TG TG";
  }

  @media (max-width: 567px) {
    display: grid;

    grid-template-columns: 90px 1fr;
    column-gap: 1rem;
    align-items: center;

    grid-template-areas:
      "PH NM"
      "PH SP"
      "PH SM"
      "DP DP"
      "TG TG";
  }
`;

export const Photo = styled.div`
  grid-area: PH;

  z-index: 999;
  width: 140px;
  height: 140px;
  background-size: cover;
  background-position-y: ${(props) => props.bgPosition};
  border-radius: 50%;
  background-repeat: no-repeat;
  background-image: url(${(props) => props.url});

  @media (max-width: 567px) {
    width: 90px;
    height: 90px;
  }
`;

export const Social = styled.div`
  grid-area: SM;

  display: flex;
  align-items: center;
  justify-content: center;

  a {
    color: white;
    font-size: 30px;
    margin: 0px 5px;
  }
  @media (max-width: 567px) {
    justify-content: flex-start;

    a {
      margin: 0 0.75rem 0 0;
    }
  }
`;

export const Name = styled.div`
  grid-area: NM;
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.2;

  @media (min-width: 568px) {
    margin-bottom: 10px;
    padding: 0 20px;
  }

  @media (max-width: 567px) {
    margin-bottom: 0.25rem;
  }
`;

export const Start = styled.div`
  grid-area: SP;
  font-size: 0.9rem;
  opacity: 0.85;
  margin-bottom: 0.5rem;

  @media (min-width: 568px) {
    padding: 0 20px;
  }

  @media (max-width: 567px) {
    margin-bottom: 0.25rem;
  }
`;

export const Description = styled.div`
  grid-area: DP;

  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
  overflow: hidden;

  @media (min-width: 568px) {
    padding: 0 20px;
  }

  @media (max-width: 567px) {
    padding-top: 1rem;
  }
`;

export const Tags = styled.div`
  grid-area: TG;

  display: flex;
  align-items: center;
  flex-wrap: wrap;

  @media (min-width: 568px) {
    padding: 0 20px;
  }

  @media (max-width: 567px) {
    padding-top: 10px;
  }
`;

export const Tag = styled.span`
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

  &:hover {
    filter: brightness(0.85);
  }
`;
