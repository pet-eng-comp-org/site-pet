import styled from "styled-components";
import { Link } from "react-router-dom";

export const Perfil = styled.div`
  color: white;
  font-weight: 400;

  @media (min-width: 568px) {
    display: grid;

    grid-template-columns: 140px 1fr;
    /* A foto ocupa 140 px; o que sobrar fica na descrição, não entre nome e data. */
    grid-template-rows: auto auto 1fr auto;

    grid-template-areas:
      "PH NM"
      "PH SP"
      "PH DP"
      "PH TG";
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

// Foto e redes sociais juntas, numa coluna; no celular cada uma vai para a sua área.
export const Lado = styled.div`
  grid-area: PH;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 567px) {
    display: contents;
  }
`;

export const Photo = styled.img`
  grid-area: PH;

  width: 140px;
  height: 140px;
  object-fit: cover;
  object-position: top;
  border-radius: 50%;

  @media (max-width: 567px) {
    width: 90px;
    height: 90px;
  }
`;

export const Social = styled.div`
  grid-area: SM;

  display: flex;
  justify-content: center;
  padding-top: 0.5rem;

  a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    min-height: 44px;
    color: white;
    font-size: 30px;
  }
  @media (max-width: 567px) {
    justify-content: flex-start;

    padding-top: 0;

    a {
      justify-content: flex-start;
      margin-right: 0.25rem;
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

// Uma cor só para todas as etiquetas, como na página de cada projeto.
export const Tag = styled(Link)`
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 0.75rem;
  margin: 0 0.5rem 0.5rem 0;
  border: 1px solid #fff;
  border-radius: 999px;
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;

  &:hover,
  &:focus {
    background: #fff;
    color: #1b3f3f;
    text-decoration: none;
  }
`;
