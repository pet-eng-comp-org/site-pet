import { MDBIcon } from "mdbreact";
import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { DivDropzone } from "./style";

const Dropzone = ({ onFileUploaded, idPhoto, type, text, setFileUrl }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState("");
  const [path, setPath] = useState("");

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const fileUrl = URL.createObjectURL(file);

      setSelectedFileUrl(fileUrl);
      onFileUploaded(file);

      setFileUrl && setFileUrl(fileUrl);
    },
    [onFileUploaded, setFileUrl]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  useEffect(() => {
    if (type === "news") setPath("api/file/getImageNews/");
    else setPath("api/file/getProfilePhoto/");
  }, [type]);

  useEffect(() => {
    if (setFileUrl)
      setFileUrl(
        `${process.env.REACT_APP_API_URL + path}${idPhoto}?${Date.now()}`
      );
  }, [idPhoto, setFileUrl, path]);

  return (
    <DivDropzone {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />

      {selectedFileUrl ? (
        <img src={selectedFileUrl} alt="Preview" />
      ) : idPhoto ? (
        <img
          src={`${
            process.env.REACT_APP_API_URL + path
          }${idPhoto}?${Date.now()}`}
          alt="Preview"
        />
      ) : (
        <>
          <p>
            <MDBIcon icon="upload" size="2x" />
            {text}
          </p>
        </>
      )}
    </DivDropzone>
  );
};

export default Dropzone;
