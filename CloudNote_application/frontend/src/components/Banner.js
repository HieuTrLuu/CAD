import React from "react";
import Carousel from "react-bootstrap/Carousel";
export default function Banner(props) {
  return (
    <Carousel>
      <Carousel.Item>
        <img width="100%" height={200} alt="900x500" src="black-screen.png" />
        <Carousel.Caption>
          <h3>Welcome to CloudNote</h3>
          <p>Share your knowledge with the world</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img width="100%" height={200} alt="900x500" src="black-screen.png" />
        <Carousel.Caption>
          <h3>Help us expand</h3>
          <p>Contribute notes</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}
