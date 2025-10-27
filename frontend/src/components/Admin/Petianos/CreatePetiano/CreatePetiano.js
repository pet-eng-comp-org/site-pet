import React, { useState } from "react";
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
import Dropzone from "../../Dropzone/Dropzone";
import api from "../../../../services/api";
import PickColor from "../../PickColor/PickColor";
import { Tag, DivTags } from "./style.js";
import { toast } from "react-toastify";
import { maskCellphone } from "../../../../utils/masks";

const inputStyle = { width: "100%" };

const CreatePetiano = ({ isOpen, toggle, getPetianos }) => {
  const [selectedFile, setSelectedFile] = useState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPass, setRepeatPass] = useState("");
  const [validPass, setValidPass] = useState(true);
  const [description, setDescription] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [date, setDate] = useState("");
  const [tutor, setTutor] = useState(false);
  const [titleTag, setTitleTag] = useState("");
  const [colorTag, setColorTag] = useState("#FFFFFF");
  const [backColorTag, setBackColorTag] = useState("#2bbbad");
  const [tags, setTags] = useState([]);
  const [nameMidia, setNameMidia] = useState("facebook");
  const [linkMidia, setLinkMidia] = useState("");
  const [midias, setMidias] = useState([]);

  const addTag = () => {
    let aux = {
      title: titleTag,
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

  const addMidia = () => {
    let aux = {
      name: nameMidia,
      link: linkMidia,
    };
    if (midias.length < 3) setMidias([...midias, aux]);
  };

  const removeMidia = (index) => {
    let aux = [...midias];
    aux.splice(index, 1);

    setMidias([...aux]);
  };

  const checkPass = () => {
    if (password !== repeatPass) setValidPass(false);
    else setValidPass(true);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Nenhuma foto selecionada.");
      return null;
    }

    if (tags.length < 1) {
      toast.error("Insira pelo menos 1 comissão.");
      return null;
    }

    if (midias.length < 1) {
      toast.error("Insira pelo menos 1 rede social.");
      return null;
    }

    const data = new FormData();
    data.append("profilePhoto", selectedFile);

    const token = localStorage.getItem("LOGINPET_TOKEN");

    try {
      const responsePost = await api.post(
        "api/members",
        {
          memberName: name,
          description,
          email,
          password,
          phone: cellphone,
          startPet: date,
          tutor,
          socialMidia: midias,
          tags,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      try {
        await api.patch(
          `api/members/firstProfilePhoto/${responsePost.data}`,
          data,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        getPetianos();
        toast.success("Petiano criado com sucesso!");
        toggle();
      } catch (err) {
        console.log(err.response.data);
        toast.error(err.response.data);
      }
    } catch (err) {
      console.log(err.response.data);
      toast.error(err.response.data);
    }
  }

  return (
    <MDBModal isOpen={isOpen} toggle={toggle} size="lg">
      <MDBModalHeader toggle={toggle}>Cadastro de novo Petiano</MDBModalHeader>
      <form onSubmit={handleSubmit}>
        <MDBModalBody>
          <MDBContainer fluid>
            <MDBRow>
              <MDBCol md="12">
                <label htmlFor="iname">Nome completo:</label>
                <br />
                <input
                  style={inputStyle}
                  id="iname"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  required
                />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol md="12">
                <label htmlFor="iemail">Email:</label>
                <br />
                <input
                  style={inputStyle}
                  id="iemail"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol md="12">
                <label htmlFor="ipassword">Senha:</label>
                <br />
                <input
                  style={inputStyle}
                  id="ipassword"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={validPass ? "" : "form-control is-invalid"}
                  type="password"
                  minLength="6"
                  required
                />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol md="12">
                <label htmlFor="irepeatPass">Repita sua senha:</label>
                <br />
                <input
                  style={inputStyle}
                  id="irepeatPass"
                  name="repeatPass"
                  value={repeatPass}
                  onChange={(e) => setRepeatPass(e.target.value)}
                  onBlur={checkPass}
                  className={validPass ? "" : "form-control is-invalid"}
                  type="password"
                  minLength="6"
                  required
                />
                {!validPass && (
                  <div className="invalid-feedback">
                    As senhas não coincidem!
                  </div>
                )}
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol md="12">
                <label htmlFor="idescription">
                  Descrição <small>(restam {160 - description.length})</small>:
                </label>
                <br />
                <textarea
                  style={inputStyle}
                  id="idescription"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength="160"
                  rows="2"
                  required
                />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol md="12">
                <label htmlFor="icellphone">Celular:</label>
                <br />
                <input
                  style={inputStyle}
                  id="icellphone"
                  name="cellphone"
                  value={cellphone}
                  onChange={(e) => setCellphone(maskCellphone(e.target.value))}
                  type="text"
                  maxLength="15"
                  minLength="14"
                  required
                />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol md="12">
                <label htmlFor="idate">Data que entrou:</label>
                <br />
                <input
                  style={{ width: "100%", height: 34 }}
                  id="idate"
                  name="date"
                  onChange={(e) => setDate(e.target.value)}
                  type="date"
                  required
                />
              </MDBCol>
            </MDBRow>
            <br />
            <fieldset>
              <legend>Comissões</legend>
              <MDBRow>
                <MDBCol md="5">
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
            <fieldset>
              <legend>
                Redes Sociais{" "}
                <span style={{ fontSize: 14 }}>&nbsp;(max: 3)</span>
              </legend>
              <MDBRow>
                <MDBCol md="3">
                  <label htmlFor="idate">Rede:</label>
                  <br />
                  <select
                    style={{ width: "100%", height: 34, fontWeight: 200 }}
                    onChange={(e) => setNameMidia(e.target.value)}
                  >
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="linkedin">Linkedin</option>
                    <option value="twitch">Twitch</option>
                    <option value="twitter">Twitter</option>
                    <option value="youtube">YouTube</option>
                  </select>
                </MDBCol>
                <MDBCol md="5">
                  <label htmlFor="ilinkmidia">Link:</label>
                  <br />
                  <input
                    style={inputStyle}
                    id="ilinkmidia"
                    name="linkmidia"
                    value={linkMidia}
                    onChange={(e) => setLinkMidia(e.target.value)}
                  />
                </MDBCol>
                <MDBCol md="1">
                  <label htmlFor="">Add:</label>
                  <br />
                  <MDBIcon
                    className="cyan-text pr-3"
                    size="lg"
                    icon="plus"
                    style={{ cursor: "pointer" }}
                    onClick={() => addMidia()}
                  />
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <DivTags>
                  {midias.map((midia, index) => (
                    <Tag key={index} backColor="#d4d4d4" color="#000">
                      <a
                        href={midia.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {midia.name}
                      </a>
                      <MDBIcon
                        className="removeTag"
                        onClick={() => removeMidia(index)}
                        icon="times"
                      />
                    </Tag>
                  ))}
                </DivTags>
              </MDBRow>
            </fieldset>
            <fieldset>
              <legend>Cargo</legend>
              <MDBRow>
                <MDBCol md="12">
                  <input
                    id="itutor"
                    name="tutor"
                    value={tutor}
                    checked={tutor}
                    onChange={() => setTutor((old) => !old)}
                    type="checkbox"
                  />
                  <label htmlFor="itutor">&nbsp;Tutor</label>
                </MDBCol>
              </MDBRow>
            </fieldset>
            <br />
            <MDBRow>
              <MDBCol md="12">
                <strong>OBS:</strong> a foto DEVE seguir o formato (mesmo
                tamanho e divisão) das fotos nesse link:{" "}
                <a
                  href="https://drive.google.com/drive/u/0/folders/1ezYMSkr950aAhwV0xQgyEiTmuR1qvvYZ"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Fotos
                </a>
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol md="12">
                <Dropzone
                  onFileUploaded={setSelectedFile}
                  text="Uma foto bem bonita 😉"
                />
              </MDBCol>
            </MDBRow>
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

export default CreatePetiano;
