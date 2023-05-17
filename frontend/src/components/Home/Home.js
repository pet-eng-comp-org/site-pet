import React, { useEffect } from "react";
import BackgroundImage from "./BackgroundImage/BackgroundImage";
import News from "./News/News";
import goUp from "../../utils/goUp";
import AboutUs from "./AboutUs/AboutUs";
import { MDBAnimation } from "mdbreact";

function Home() {
  useEffect(() => {
    goUp();
  }, []);

  return (
    <MDBAnimation type="fadeIn">
      <BackgroundImage />
      <News />
      <AboutUs />
    </MDBAnimation>
  );
}

export default Home;
