import React, { useEffect } from "react";
import Hero from "./Hero/Hero";
import News from "./News/News";
import goUp from "../../utils/goUp";
import AboutUs from "./AboutUs/AboutUs";
import Destaques from "./Destaques/Destaques";
import useTitulo from "../../utils/useTitulo";

function Home() {
  useTitulo();
  useEffect(() => {
    goUp();
  }, []);

  return (
    <>
      <Hero />
      <Destaques />
      <AboutUs />
      {/* Por último: só aparece quando a API responde e há notícia recente,
          e embaixo não empurra o que já está na tela. */}
      <News />
    </>
  );
}

export default Home;
