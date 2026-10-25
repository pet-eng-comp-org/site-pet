import styled from "styled-components";

export const Button = styled.div`
  margin-bottom: 10;
  border-radius: 3px;
  color: white;
  font-weight: bold;
  background-color: #404040;
  width: 100%;
  height: 40px;
  padding: 0px 10px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
`;

export const Row = styled.div`
  background-color: ${(props) => (props.background % 2 ? "#eee" : "#ddd")};
  display: flex;
  align-items: center;
  height: 32px;
  font-weight: lighter;
  padding: 0px 10px;
  justify-content: space-between;

  &&&.addFile {
    justify-content: center;
    background-color: #186a6c17;
    color: #186a6c;
    border: dashed 2px #186a6c;
    margin: 4px;
    transition: color linear 0.25s;
    cursor: pointer;

    &:hover {
      color: #186a6caa;
    }
  }
`;

export const InputFile = styled.div`
  width: 100%;
  label {
    margin: 0px;
    cursor: pointer;
    width: 100%;
    text-align: center;
  }

  input {
    display: none;
  }
`;

export const Text = styled.a`
  &&& {
    color: black;

    transition: color linear 0.25s;

    &:hover {
      color: #555;
    }
  }
`;

export const Icon = styled.span`
  cursor: pointer;

  .edit {
    color: #ffc107;
    transition: color linear 0.25s;

    &:hover {
      color: #ffcf40;
    }
  }

  .delete {
    margin-left: 16px;
    color: #dc3545;
    transition: color linear 0.25s;

    &:hover {
      color: red;
    }
  }
`;
