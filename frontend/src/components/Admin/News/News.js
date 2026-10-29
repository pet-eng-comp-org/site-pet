import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import CreateNews from "./CreateNews/CreateNews";
import DeleteNews from "./DeleteNews/DeleteNews";
import EditNews from "./EditNews/EditNews";
import NewsPreview from "./NewsPreview/NewsPreview";
import {
  MDBBtn,
  MDBIcon,
  MDBRow,
  MDBListGroup,
  MDBListGroupItem,
  MDBCol,
} from "mdbreact";
import { SpanIcon, DivButtons } from "./style";
import "./style.css";

const newsFormat = [
  {
    image: "",
    title: "",
    description: "",
    date: "",
    time: "",
    id: "",
  },
];

const News = () => {
  const [formatedNews, setFormatedNews] = useState(newsFormat);
  const [filteredNews, setFilteredNews] = useState(newsFormat);
  const [idNews, setIdNews] = useState("");
  const [news, setNews] = useState();
  const [order, setOrder] = useState("older");
  const [modalCreate, setModalCreate] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalPreview, setModalPreview] = useState(false);

  const getNews = async () => {
    try {
      const response = await api.get("api/news/");
      setNews([...response.data.news]);
    } catch (err) {
      console.log(err.response);
    }
  };

  const formatedDate = (date) => {
    let data = date.split("T")[0];
    data = data.replace(/-/g, "/");
    let d = data.split("/");
    data = d[2] + "/" + d[1] + "/" + d[0];
    const aux = String(date.split("T")[1]).split(":");
    const hora = aux[0] + ":" + aux[1];

    return [data, hora];
  };

  const formatedDescription = (text) => {
    let str = text.substr(0, 130);

    if (str.length >= 118) str = str.concat("...");

    return str;
  };

  const newsFilterOnChange = (e) => {
    // Variable to hold the original version of the list
    let currentList = [];
    // Variable to hold the filtered list before putting into state
    let newList = [];

    // If the search bar isn't empty
    if (e.target.value !== "") {
      // Assign the original list to currentList
      currentList = formatedNews.slice();

      // Use .filter() to determine which items should be displayed
      // based on the search terms
      newList = currentList.filter((item) => {
        const title = item.title.toLowerCase();
        const description = item.description.toLowerCase();
        const filter = e.target.value.toLowerCase().trim();
        // check to see if the current list item includes the search term
        // If it does, it will be added to newList. Using lowercase eliminates
        // issues with capitalization in search terms and search content
        return title.includes(filter) || description.includes(filter);
      });
    } else {
      newList = formatedNews.slice();
    }
    setFilteredNews(newList);
  };

  //  const sortNewsOnChange= () => {
  //     const newsAux = filteredNews.slice();

  //     const sortNewsByTitleZA =() => {
  //       newsAux.sort(function (a, b) {
  //         if (a.title.toUpperCase().trim() > b.title.toUpperCase().trim()) {
  //           return 1;
  //         }
  //         if (a.title.toUpperCase().trim() < b.title.toUpperCase().trim()) {
  //           return -1;
  //         }
  //         return 0;
  //       });
  //       setFilteredNews(newsAux);
  //     };

  //     const sortNewsByTitleAZ =  () => {
  //       newsAux.sort(function (a, b) {
  //         if (a.title.toUpperCase().trim() < b.title.toUpperCase().trim()) {
  //           return 1;
  //         }
  //         if (a.title.toUpperCase().trim() > b.title.toUpperCase().trim()) {
  //           return -1;
  //         }
  //         return 0;
  //       });
  //       setFilteredNews(newsAux);
  //     };

  //     const sortNewsByDate = () => {
  //       newsAux.sort(function (a, b) {
  //         if(order === "newer"){
  //           let aux = a;
  //           a = b;
  //           b = aux;
  //         }

  //         let dateA = b.date.split("/");
  //         let dateB = a.date.split("/");
  //         let timeA = b.time.split(":");
  //         let timeB = a.time.split(":");

  //         if (dateA[2] > dateB[2]) return 1;
  //         else if (dateA[2] < dateB[2]) return -1;
  //         else {
  //           if (dateA[1] > dateB[1]) return 1;
  //           else if (dateA[1] < dateB[1]) return -1;
  //           else {
  //             if (dateA[0] > dateB[0]) return 1;
  //             else if (dateA[0] < dateB[0]) return -1;
  //             else {
  //               if (timeA[0] > timeB[0]) return 1;
  //               else if (timeA[0] < timeB[0]) return -1;
  //               else {
  //                 if (timeA[1] > timeB[1]) return 1;
  //                 else if (timeA[1] < timeB[1]) return -1;
  //               }
  //             }
  //           }
  //         }
  //         return 0;
  //       });
  //       setFilteredNews( newsAux);
  //     };

  //     if (order === "za") sortNewsByTitleZA();
  //     else if (order === "az") sortNewsByTitleAZ();
  //     else if (order === "newer") sortNewsByDate();
  //     else if (order === "older") sortNewsByDate();

  //   };

  useEffect(() => {
    const newsAux = filteredNews.slice();

    const sortNewsByTitleAZ = () => {
      newsAux.sort(function (a, b) {
        if (a.title.toUpperCase().trim() > b.title.toUpperCase().trim()) {
          return 1;
        }
        if (a.title.toUpperCase().trim() < b.title.toUpperCase().trim()) {
          return -1;
        }
        return 0;
      });
      setFilteredNews(newsAux);
    };

    const sortNewsByTitleZA = () => {
      newsAux.sort(function (a, b) {
        if (a.title.toUpperCase().trim() < b.title.toUpperCase().trim()) {
          return 1;
        }
        if (a.title.toUpperCase().trim() > b.title.toUpperCase().trim()) {
          return -1;
        }
        return 0;
      });
      setFilteredNews(newsAux);
    };

    const sortNewsByDate = () => {
      newsAux.sort(function (a, b) {
        if (order === "older") {
          let aux = a;
          a = b;
          b = aux;
        }

        let dateA = b.date.split("/");
        let dateB = a.date.split("/");
        let timeA = b.time.split(":");
        let timeB = a.time.split(":");

        if (dateA[2] > dateB[2]) return 1;
        else if (dateA[2] < dateB[2]) return -1;
        else {
          if (dateA[1] > dateB[1]) return 1;
          else if (dateA[1] < dateB[1]) return -1;
          else {
            if (dateA[0] > dateB[0]) return 1;
            else if (dateA[0] < dateB[0]) return -1;
            else {
              if (timeA[0] > timeB[0]) return 1;
              else if (timeA[0] < timeB[0]) return -1;
              else {
                if (timeA[1] > timeB[1]) return 1;
                else if (timeA[1] < timeB[1]) return -1;
              }
            }
          }
        }
        return 0;
      });
      setFilteredNews(newsAux);
    };

    if (order === "za") sortNewsByTitleZA();
    else if (order === "az") sortNewsByTitleAZ();
    else if (order === "newer") sortNewsByDate();
    else if (order === "older") sortNewsByDate();
  }, [order]);

  useEffect(() => {
    getNews();
  }, []);

  useEffect(() => {
    const formatNews = () => {
      const singleNews = [];

      news.forEach((news) => {
        singleNews.push({
          id: news._id,
          image: news.file,
          title: news.title,
          description: news.text,
          date: formatedDate(news.date)[0],
          time: formatedDate(news.date)[1],
          actions: (
            <DivButtons>
              <SpanIcon title="Editar" aria-label="Editar"
                background="#ffc107"
                onClick={() => {
                  setIdNews(news._id);
                  setModalEdit((old) => !old);
                }}
              >
                <MDBIcon icon="edit" />
              </SpanIcon>
              <SpanIcon title="Excluir" aria-label="Excluir"
                background="#dc3545"
                onClick={() => {
                  setIdNews(news._id);
                  setModalDelete((old) => !old);
                }}
              >
                <MDBIcon icon="trash" />
              </SpanIcon>
              <SpanIcon
                background="#007bff"
                onClick={() => {
                  setIdNews(news._id);
                  setModalPreview((old) => !old);
                }}
              >
                <MDBIcon icon="fas fa-eye" />
              </SpanIcon>
            </DivButtons>
          ),
        });
      });
      setOrder("newer");
      setFormatedNews([...singleNews]);
      setFilteredNews([...singleNews]);
    };

    if (news) formatNews();
  }, [news]);

  return (
    <>
      <CreateNews
        getNews={getNews}
        isOpen={modalCreate}
        toggle={() => setModalCreate((old) => !old)}
      />
      <DeleteNews
        idNews={idNews}
        getNews={getNews}
        isOpen={modalDelete}
        toggle={() => setModalDelete((old) => !old)}
      />
      <EditNews
        idNews={idNews}
        getNews={getNews}
        isOpen={modalEdit}
        toggle={() => setModalEdit((old) => !old)}
      />
      <NewsPreview
        idNews={idNews}
        isOpen={modalPreview}
        toggle={() => setModalPreview((old) => !old)}
      />
      <MDBRow className="header">
        <MDBBtn onClick={() => setModalCreate((old) => !old)}>
          Cadastrar nova notícia
        </MDBBtn>
        <select className="order-by" onChange={(e) => setOrder(e.target.value)}>
          <option value="newer">Mais recentes</option>
          <option value="older">Mais antigos</option>
          <option value="az">Alfabética (A-Z)</option>
          <option value="za">Alfabética (Z-A)</option>
        </select>
        <div
          id="search"
          className="form-inline d-flex justify-content-center md-form form-sm mt-0"
        >
          <i className="fas fa-search" aria-hidden="true"></i>
          <input
            onChange={newsFilterOnChange}
            className="form-control form-control-sm ml-3 w-75"
            type="text"
            placeholder="Search"
            aria-label="Search"
          />
        </div>
      </MDBRow>
      <MDBListGroup id="list-group">
        {filteredNews.map((singleNews) => {
          let imgUrl = null;
          const getImg = async () => {
            try {
              imgUrl =
                `${process.env.REACT_APP_API_URL}api/file/getImageNews/` +
                singleNews.image._id;
            } catch (err) {
              console.log(err);
            }
          };
          getImg();

          return (
            <MDBListGroupItem key={singleNews.id}>
              <MDBRow size="10" className="news-rows">
                <MDBCol size="4" className="image-col">
                  <div className="col-">
                    <img
                      src={imgUrl}
                      style={{ maxWidth: 200, maxHeight: 130 }}
                      alt="imagem"
                    />
                  </div>
                </MDBCol>
                <MDBCol size="8" className="text-col">
                  <div style={{ padding: "0 1rem 0" }}>
                    <MDBRow size="2" style={{ justifyContent: "center" }}>
                      <h3>{singleNews.title}</h3>
                    </MDBRow>
                    <MDBRow size="2" className="header-news">
                      <div className="d-flex flex-row">
                        <div className="d-flex flex-row">
                          <h6>{singleNews.date}&nbsp;</h6>
                          <i className="far fa-calendar-alt" />
                        </div>
                        <div className="d-flex flex-row">
                          <h6>{singleNews.time}&nbsp;</h6>
                          <i className="far fa-clock"></i>
                        </div>
                      </div>
                    </MDBRow>
                    <MDBRow size="8">
                      {formatedDescription(singleNews.description)}
                    </MDBRow>
                  </div>
                </MDBCol>
              </MDBRow>
              <MDBRow className="news-row" size="2">
                {singleNews.actions}{" "}
              </MDBRow>
              <br />
            </MDBListGroupItem>
          );
        })}
      </MDBListGroup>
    </>
  );
};

export default News;
