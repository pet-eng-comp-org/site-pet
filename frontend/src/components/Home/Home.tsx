import Hero from "./Hero/Hero";
import News from "./News/News";
import AboutUs from "./AboutUs/AboutUs";

function Home() {
  return (
    <>
      <Hero />
      <AboutUs />
      {/* Por último: só aparece quando a API responde e há notícia recente,
          e embaixo não empurra o que já está na tela. */}
      <News />
    </>
  );
}

export default Home;
