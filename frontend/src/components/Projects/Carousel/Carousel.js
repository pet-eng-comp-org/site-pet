import React from "react";
import {
  MDBCarousel,
  MDBCarouselInner,
  MDBCarouselItem,
  MDBView,
} from "mdbreact";
import "./Carousel.css";

const Carousel = ({ imagesArray }) => {
  return (
    <>
      <MDBCarousel
        activeItem={1}
        length={imagesArray.length - 1}
        showControls={true}
        showIndicators={true}
        className="z-depth-1"
      >
        {
          <MDBCarouselInner>
            {imagesArray?.map((image, pos) => {
              return (
                <MDBCarouselItem key={image._id} itemId={pos}>
                  <MDBView>
                    <div
                      style={{
                        backgroundImage: `url(${process.env.REACT_APP_API_URL}api/file/getComissionPhoto/${image._id})`,
                        height: "75vh",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        maxWidth: "100%",
                      }}
                    >
                      <div
                        style={{
                          backgroundImage: `url(${process.env.REACT_APP_API_URL}api/file/getComissionPhoto/${image._id})`,
                          height: "100%",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "contain",
                          backgroundPosition: "center",
                          backdropFilter: "blur(10px)",
                          maxWidth: "100%",
                        }}
                      ></div>
                    </div>
                  </MDBView>
                </MDBCarouselItem>
              );
            })}
          </MDBCarouselInner>
        }
      </MDBCarousel>
    </>
  );
};

export default Carousel;
