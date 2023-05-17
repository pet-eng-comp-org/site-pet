import React from "react";
import Dropzone from "react-dropzone";
import { DropContainer, UploadMessage } from "./style";

function Upload(props) {
  const { file, setFile } = props;

  function renderDragMessage(isDragActive, isDragReject) {
    if (!isDragActive) {
      return <UploadMessage>Arraste o arquivo ou click</UploadMessage>;
    }
    if (isDragReject) {
      return <UploadMessage type="error">Arquivo não suportado</UploadMessage>;
    }
    return <UploadMessage type="success">Solte o arquivo aqui</UploadMessage>;
  }

  return (
    <Dropzone
      accept=".zip, application/zip, application/octet-stream"
      onDropAccepted={(files) => {
        setFile(files[0]);
      }}
    >
      {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
        <DropContainer
          {...getRootProps()}
          isDragActive={isDragActive}
          isDragReject={isDragReject}
          uploaded={file}
        >
          <input {...getInputProps()} />
          {file ? (
            <UploadMessage type="uploaded">
              Tudo Certo <i className="fas fa-file-archive file-icon"></i>
            </UploadMessage>
          ) : (
            renderDragMessage(isDragActive, isDragReject)
          )}
        </DropContainer>
      )}
    </Dropzone>
  );
}

export default Upload;
