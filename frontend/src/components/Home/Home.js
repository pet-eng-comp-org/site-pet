import React, { useEffect } from "react";
import Hero from "./Hero/Hero";
import News from "./News/News";
import goUp from "../../utils/goUp";
import AboutUs from "./AboutUs/AboutUs";

function Home() {
  useEffect(() => {
    goUp();
  }, []);

  return (
    <>
      <Hero />
      <News />
      <AboutUs />
    </>
  );
}

export default Home;
