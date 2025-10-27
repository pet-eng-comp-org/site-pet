import React, { useState, useEffect } from "react";
import {
  MDBBtn,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
  MDBRow,
} from "mdbreact";
import { uniqueId } from "lodash";
import filesize from "filesize";
import Upload from "../Dropzone/src/components/Upload";
import FileList from "../Dropzone/src/components/FileList";
import api from "../../../../services/api";
import { toast } from "react-toastify";
import PickColor from "../../PickColor/PickColor";
import { Tag, DivTags } from "./style.js";

//import NewsPreview from "../NewsPreview/NewsPreview";

const inputStyle = { width: "100%" };
const CreateCommission = ({ isOpen, toggle, getCommissions, idCommission }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [commission, setCommission] = useState();
  const [titleTag, setTitleTag] = useState("");
  const [colorTag, setColorTag] = useState("#FFFFFF");
  const [linkTag, setLinkTag] = useState("");
  const [backColorTag, setBackColorTag] = useState("#2bbbad");
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const getCommission = async () => {
      try {
        const response = await api.get(`api/comissions/${idCommission}`);

        setCommission(response.data.comission);
        setTitle(response.data.comission.title);
        setDescription(response.data.comission.description);
        setTags(response.data.comission.tags);
        const photos = response.data.comission.photos;
        let aux = [];
        for (let index = 0; index < photos.length; index++) {
          const img = await api.get(
            `api/file/getComissionPhoto/${photos[index]._id}`
          );

          const url = `${process.env.REACT_APP_API_URL}api/file/getComissionPhoto/${photos[index]._id}`;
          const obj = {
            file: img,
            id: photos[index]._id,
            name: photos[index].name,
            readableSize: filesize(photos[index].size),
            preview: url,
            uploaded: true,
            url: url,
          };

          aux.push(obj);
        }

        setSelectedFiles(aux);
      } catch (err) {
        console.log(err);
        console.log(err.response);
      }
    };
    if (idCommission) getCommission();
  }, [idCommission]);

  function updateFile(id, data) {
    const uploadedFiles = selectedFiles;
    setSelectedFiles(
      uploadedFiles.map((uploadedFile) => {
        return id === uploadedFile.id
          ? { ...uploadedFile, ...data }
          : uploadedFile;
      })
    );
  }

  function handleUpload(files) {
    let aux = [...selectedFiles];

    const uploadedFiles = files.map((file) => ({
      file,
      id: uniqueId(),
      name: file.name,
      readableSize: filesize(file.size),
      preview: URL.createObjectURL(file),
      progress: 0,
      uploaded: false,
      error: false,
      url: null,
    }));

    aux = aux.concat(uploadedFiles);

    setSelectedFiles([...aux]);

    // uploadedFiles.forEach(file=>processUpload(file));
  }

  async function handleDelete(id) {
    try {
      const token = localStorage.getItem("LOGINPET_TOKEN");

      await api.patch(
        `api/comissions/removePhoto/${commission._id}`,
        { photoId: id },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const aux = selectedFiles;

      setSelectedFiles(aux.filter((file) => file.id !== id));
    } catch (err) {
      console.log(err);
    }
  }

  const addTag = () => {
    let aux = {
      title: titleTag,
      link: linkTag,
      color: colorTag,
      backgroundColor: backColorTag,
    };
    setTags([...tags, aux]);
  };

  const removeTag = (index) => {
    let aux = [...tags];
    aux.splice(index, 1);

    setTags([...aux]);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!selectedFiles) {
      toast.error("Nenhuma foto selecionada.");
      return null;
    }

    const data = {
      title: title,
      description: description,
      tags: tags,
    };

    const token = localStorage.getItem("LOGINPET_TOKEN");

    try {
      await api.put(`api/comissions/${commission._id}`, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      for (let index = 0; index < selectedFiles.length; index++) {
        const photo = new FormData();

        photo.append("photo", selectedFiles[index].file);
        if (selectedFiles[index].uploaded === true) {
          continue;
        }
        api
          .patch(`api/comissions/addPhoto/${commission._id}`, photo, {
            headers: {
              Authorization: "Bearer " + token,
            },
            onUploadProgress: (e) => {
              const progress = parseInt(Math.round((e.loaded * 100) / e.total));

              updateFile(selectedFiles[index].id, {
                progress,
              });
            },
          })
          .then((response) => {
            updateFile(selectedFiles[index].id, {
              uploaded: true,
              id: response.data._id,
              url: response.data.url,
            });
          })
          .catch(() => {
            updateFile(selectedFiles[index].id, {
              error: true,
            });
          });
      }
      getCommissions();
      toast.success("Comissão editada com sucesso!");
      toggle();
    } catch (err) {
      console.log(err.response);
      toast.error(err.response.data);
    }
  }

  return (
    <MDBModal isOpen={isOpen} toggle={toggle} size="lg">
      <MDBModalHeader toggle={toggle}>Editar Comissão</MDBModalHeader>
      <form onSubmit={handleSubmit}>
        <MDBModalBody>
          <MDBContainer fluid>
            <MDBRow>
              <MDBCol md="12">
                <label htmlFor="iname">Nome:</label>
                <br />
                <input
                  style={inputStyle}
                  id="ititle"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  required
                />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol md="12">
                <label htmlFor="idescription">Descrição:</label>
                <br />
                <textarea
                  style={inputStyle}
                  id="idescription"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="5"
                  required
                />
              </MDBCol>
            </MDBRow>
            <br />
            <MDBRow>
              <MDBCol md="12">
                Coloque fotos da comissão aqui em baixo. O ícone da comissão
                deve ser a primeira imagem!
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol md="12">
                <Upload onUpload={handleUpload} />
                {!!selectedFiles.length && (
                  <FileList files={selectedFiles} onDelete={handleDelete} />
                )}
              </MDBCol>
            </MDBRow>
            <br />
            <fieldset>
              <legend>Classificações</legend>
              <MDBRow>
                <MDBCol md="3">
                  <label htmlFor="ititleTag">Nome:</label>
                  <br />
                  <input
                    style={inputStyle}
                    id="ititleTag"
                    name="titleTag"
                    value={titleTag}
                    onChange={(e) => setTitleTag(e.target.value)}
                  />
                </MDBCol>
                <MDBCol md="2">
                  <label htmlFor="ititleTag">Link:</label>
                  <br />
                  <input
                    style={inputStyle}
                    id="ilinkTag"
                    name="linkTag"
                    value={linkTag}
                    onChange={(e) => setLinkTag(e.target.value)}
                  />
                </MDBCol>
                <MDBCol md="3">
                  <label htmlFor="ipickColor">Cor Texto:</label>
                  <br />
                  <PickColor id="ipickColor" colorForm={setColorTag} />
                </MDBCol>
                <MDBCol md="3">
                  <label htmlFor="ipickBackColor">Cor Fundo:</label>
                  <br />
                  <PickColor id="ipickBackColor" colorForm={setBackColorTag} />
                </MDBCol>
                <MDBCol md="1">
                  <label htmlFor="idate">Add:</label>
                  <br />
                  <MDBIcon
                    className="cyan-text pr-3"
                    icon="plus"
                    size="lg"
                    style={{ cursor: "pointer" }}
                    onClick={() => addTag()}
                  />
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <DivTags>
                  {tags.map((tag, index) => (
                    <Tag
                      key={index}
                      backColor={tag.backgroundColor}
                      color={tag.color}
                    >
                      {tag.title}
                      <MDBIcon
                        className="removeTag"
                        onClick={() => removeTag(index)}
                        icon="times"
                      />
                    </Tag>
                  ))}
                </DivTags>
              </MDBRow>
            </fieldset>
          </MDBContainer>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn type="reset" onClick={toggle}>
            Cancelar
          </MDBBtn>
          <MDBBtn color="primary" type="submit">
            Enviar
          </MDBBtn>
        </MDBModalFooter>
      </form>
    </MDBModal>
  );
};

export default CreateCommission;
