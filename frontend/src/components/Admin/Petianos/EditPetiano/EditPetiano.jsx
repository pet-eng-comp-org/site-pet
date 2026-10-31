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
import Dropzone from "../../Dropzone/Dropzone";
import api from "../../../../services/api";
import PickColor from "../../PickColor/PickColor";
import { Tag, DivTags, DivChangePass } from "./style.js";
import { toast } from "react-toastify";
import { maskCellphone } from "../../../../utils/masks";

const inputStyle = { width: "100%" };

const EditPetiano = ({ isOpen, toggle, getPetianos, idPetiano }) => {
  const [selectedFile, setSelectedFile] = useState();
  const [changePass, setChangePass] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPass, setRepeatPass] = useState("");
  const [validPass, setValidPass] = useState(true);
  const [titleTag, setTitleTag] = useState("");
  const [colorTag, setColorTag] = useState("#FFFFFF");
  const [backColorTag, setBackColorTag] = useState("#186a6c");
  const [nameMidia, setNameMidia] = useState("facebook");
  const [linkMidia, setLinkMidia] = useState("");
  const [petiano, setPetiano] = useState();

  useEffect(() => {
    const getPetiano = async () => {
      const token = localStorage.getItem("LOGINPET_TOKEN");
      try {
        const response = await api.get(`api/members/${idPetiano}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        setPetiano(response.data.member);
      } catch (err) {
        console.log(err.response.data);
      }
    };
    if (idPetiano) getPetiano();
  }, [idPetiano]);

  const handleChange = (e) => {
    let aux = { ...petiano };

    if (e.target.name === "tutor") {
      aux.tutor = !aux.tutor;

      setPetiano({ ...aux });
      return;
    }

    if (e.target.name === "phone") {
      aux.phone = maskCellphone(e.target.value);

      setPetiano({ ...aux });
      return;
    }

    aux[e.target.name] = e.target.value;

    setPetiano({ ...aux });
  };

  const addTag = () => {
    let aux = {
      title: titleTag,
      color: colorTag,
      backgroundColor: backColorTag,
    };

    let petAux = { ...petiano };
    if (!petAux.tags) petAux.tags = [];
    petAux.tags.push(aux);

    setPetiano({ ...petAux });
  };

  const removeTag = (index) => {
    let aux = { ...petiano };
    aux.tags.splice(index, 1);

    setPetiano({ ...aux });
  };

  const addMidia = () => {
    let aux = {
      name: nameMidia,
      link: linkMidia,
    };

    let petAux = { ...petiano };
    if (!petAux.socialMidia) petAux.socialMidia = [];

    if (petAux.socialMidia.length < 3) {
      petAux.socialMidia.push(aux);

      setPetiano({ ...petAux });
    }
  };

  const removeMidia = (index) => {
    let aux = { ...petiano };
    aux.socialMidia.splice(index, 1);

    setPetiano({ ...aux });
  };

  const checkPass = () => {
    if (password !== repeatPass) {
      setValidPass(false);
      return false;
    } else {
      setValidPass(true);
      return true;
    }
  };

  const parseDate = (date) => {
    let d = new Date(date);

    let day = d.getUTCDate() < 10 ? "0" + d.getUTCDate() : d.getUTCDate();
    let month =
      d.getUTCMonth() + 1 < 10
        ? "0" + Number(d.getUTCMonth() + 1)
        : d.getUTCMonth() + 1;

    return `${d.getUTCFullYear()}-${month}-${day}`;
  };

  async function handleChangePass() {
    if (!checkPass()) return;

    const token = localStorage.getItem("LOGINPET_TOKEN");

    try {
      await api.patch(
        `api/login/changePassword/${idPetiano}`,
        { newPassword: password, oldPassword: oldPass },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      toast.success("Senha alterada com sucesso!");
      setPassword("");
      setRepeatPass("");
      setOldPass("");
      setChangePass(false);
    } catch (err) {
      toast.error(err.response.data);
    }
  }

  async function handleChangePhoto() {
    const data = new FormData();
    data.append("profilePhoto", selectedFile);

    const token = localStorage.getItem("LOGINPET_TOKEN");

    try {
      await api.patch(`api/members/updateProfilePhoto/${idPetiano}`, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      getPetianos();
      toast.success("Foto alterada com sucesso!");
    } catch (err) {
      console.log(err.response.data);
      toast.error(err.response.data);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!petiano.tags?.length) {
      toast.error("Insira pelo menos 1 comissão.");
      return null;
    }

    if (petiano.socialMidia?.length < 1 || !petiano.socialMidia) {
      toast.error("Insira pelo menos 1 rede social.");
      return null;
    }

    const token = localStorage.getItem("LOGINPET_TOKEN");

    try {
      await api.put(
        `api/members/${idPetiano}`,
        {
          memberName: petiano.memberName,
          description: petiano.description,
          email: petiano.email,
          phone: petiano.phone,
          startPet: petiano.startPet,
          tutor: petiano.tutor,
          socialMidia: petiano.socialMidia,
          tags: petiano.tags,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      toast.success("Dados alterados com sucesso!");
      getPetianos();
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
                  name="memberName"
                  value={petiano?.memberName || ""}
                  onChange={handleChange}
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
                  value={petiano?.email || ""}
                  onChange={handleChange}
                  type="email"
                  required
                />
              </MDBCol>
            </MDBRow>
            <br />
            <MDBRow>
              <MDBCol md="12">
                <input
                  id="ichangePass"
                  name="changePass"
                  checked={changePass}
                  onChange={() => setChangePass((old) => !old)}
                  type="checkbox"
                />
                <label htmlFor="ichangePass">&nbsp;Mudar senha</label>
              </MDBCol>
            </MDBRow>
            {changePass && (
              <DivChangePass>
                <MDBRow>
                  <MDBCol md="12">
                    <label htmlFor="ioldPass">Senha antiga:</label>
                    <br />
                    <input
                      style={inputStyle}
                      id="ioldPass"
                      name="oldPass"
                      value={oldPass}
                      onChange={(e) => setOldPass(e.target.value)}
                      type="password"
                      minLength="6"
                      required
                    />
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol md="12">
                    <label htmlFor="ipassword">Nova senha:</label>
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
                    <label htmlFor="irepeatPass">Repita sua nova senha:</label>
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
                <br />
                <MDBRow>
                  <MDBCol>
                    <MDBBtn onClick={() => handleChangePass()}>
                      Mudar Senha
                    </MDBBtn>
                  </MDBCol>
                </MDBRow>
              </DivChangePass>
            )}
            <MDBRow>
              <MDBCol md="12">
                <label htmlFor="idescription">
                  Descrição{" "}
                  <small>(restam {160 - (petiano?.description || "").length})</small>:
                </label>
                <br />
                <textarea
                  style={inputStyle}
                  id="idescription"
                  name="description"
                  value={petiano?.description || ""}
                  onChange={handleChange}
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
                  name="phone"
                  value={petiano?.phone || ""}
                  onChange={handleChange}
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
                  name="startPet"
                  onChange={handleChange}
                  type="date"
                  defaultValue={petiano ? parseDate(petiano.startPet) : ""}
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
                  {petiano?.tags?.map((tag, index) => (
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
                  {petiano?.socialMidia?.map((midia, index) => (
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
                    value={petiano?.tutor}
                    checked={petiano ? petiano.tutor : false}
                    onChange={handleChange}
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
                  type="petianos"
                  idPhoto={petiano?.profilePhoto?._id || null}
                />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol>
                <MDBBtn onClick={handleChangePhoto}>Enviar Foto</MDBBtn>
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

export default EditPetiano;
