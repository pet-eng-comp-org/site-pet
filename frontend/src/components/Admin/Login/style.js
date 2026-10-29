import styled from "styled-components";

// Mesmo cartão do formulário de contato, numa coluna só, que entrar é uma tarefa só.
export const CartaoLogin = styled.form`
  max-width: 26rem;
  margin: 0 auto;
  padding: 1.75rem;
  border-radius: 16px;
  background: #fff;

  .App & h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    font-weight: 600;
    margin: 0 0 0.35rem;
  }

  .form-control {
    min-height: 44px;
    margin-bottom: 1.25rem;
  }

  .botao-principal {
    width: 100%;
    justify-content: center;
    border: 0;
    cursor: pointer;
  }
`;
