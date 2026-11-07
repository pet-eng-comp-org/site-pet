import React, { useEffect } from "react";
import Hero from "./Hero/Hero";
import News from "./News/News";
import goUp from "../../utils/goUp";
import AboutUs from "./AboutUs/AboutUs";
import Vitrine from "./Vitrine/Vitrine";
import useTitulo from "../../utils/useTitulo";

function Home() {
  useTitulo();
  useEffect(() => {
    goUp();
  }, []);

  return (
    <>
      <Hero />
      <Vitrine />
      <AboutUs />
      {/* Por último: só aparece quando a API responde e há notícia recente,
          e embaixo não empurra o que já está na tela. */}
      <News />
    </>
  );
}

export default Home;
