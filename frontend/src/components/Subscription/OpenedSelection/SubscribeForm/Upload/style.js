import styled, { css } from "styled-components";

const dragActive = css`
  border-color: #03989f;
`;
const dragReject = css`
  border-color: #a3321f;
`;
const uploaded = css`
  border-color: #03989f;
`;

export const DropContainer = styled.div.attrs({
  className: "dropZone",
})`
  cursor: pointer;
  transition: height 0.2s ease;
  background-color: #fff;
  border-radius: 4px;
  padding: 10px;

  ${(props) => props.isDragActive && dragActive};
  ${(props) => props.isDragReject && dragReject};
  ${(props) => props.uploaded && uploaded};
`;

const messageColors = {
  default: "grey",
  uploaded: "#03989f",
  error: "#a3321f",
  success: "#03989f",
};

export const UploadMessage = styled.h6`
  display: flex;
  color: ${(props) => messageColors[props.type || "default"]};
  justify-content: center;
  align-items: center;
  padding: 15px 0;
  border: 1px dashed #ddd;
  margin-bottom: 0px;
  border-radius: 4px;
  text-align: center;
`;
