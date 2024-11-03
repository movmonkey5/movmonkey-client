"use client";

import slider1 from "@/public/image/home-slider1.png";
import slider2 from "@/public/image/home-slider2.png";
import slider3 from "@/public/image/home-slider3.png";
import Slider from "react-slick";

import Container from "@/components/shared/Container";
import Image from "next/image";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const slides = [slider1, slider2, slider3];

export default function HomeSlider() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 1,
    arrows: false,
  };
  return (
    <div className="mt-80">
      <h4 className="mx-auto px-5 text-center text-lg font-semibold sm:max-w-lg lg:max-w-6xl lg:text-4xl">
        {`Enjoy verified providers, clear pricing, secure transactions. Simplify
        tasks; join us today!`}
      </h4>

      <Container>
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <div key={index}>
              <Image
                src={slide}
                alt="slide"
                quality={100}
                className="aspect-auto"
              />
            </div>
          ))}
        </Slider>
      </Container>
    </div>
  );
}
