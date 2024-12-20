"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import Container from "@/components/shared/Container";

const testimonials = [
  {
    name: "Thomas W.",
    role: "Trader",
    image:
      "https://img.freepik.com/free-photo/portrait-successful-man-having-stubble-posing-with-broad-smile-keeping-arms-folded_171337-1267.jpg?semt=ais_hybrid",
    quote:
      "This service is straightforward and works great! I plan to use it often. It’s affordable and really takes the hassle out of moving big items !",
  },
  {
    name: "Kerry C.",
    role: "Entrepreneur",
    image:
      "https://img.freepik.com/free-photo/pretty-smiling-joyfully-female-with-fair-hair-dressed-casually-looking-with-satisfaction_176420-15187.jpg?semt=ais_hybrid",
    quote:
      "Within hours, I received a budget-friendly offer from a top-rated company. I love how I can rely on MovMonkey to deliver my special finds from across the country at a fair price.",
  },
  {
    name: "Johnson K.",
    role: " Business Owner",
    image:
      "https://img.freepik.com/free-photo/handsome-bearded-guy-posing-against-white-wall_273609-20597.jpg?semt=ais_hybrid",
    quote:
      "MovMonkey bridges the gap between getting bulky items picked up and delivered without you having to do it yourself. I've used them many times, and it saves me both time and money.",
  },
  {
    name: "Andrew S.",
    role: "Freelancer",
    image:
      "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg?semt=ais_hybrid",
    quote:
      "Everything went smoothly and easily with the courier I chose. They were friendly, communicated well, and were very helpful. I couldn’t find any faults and will definitely use them again. I also appreciate the privacy—no random calls or emails from others.",
  },
];
const TestimonialSlider = () => {
  return (
    <Container>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        modules={[Pagination, Autoplay]}
        className="w-full"
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index} className="pb-12">
            <div className="mx-6  flex  h-[450px] flex-col rounded-lg  border-t-4 border-[#FFA620] bg-white p-6 text-center shadow-lg">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="mx-auto mb-4 h-16 w-16 rounded-full object-cover"
              />
              <blockquote className="mb-4 flex-grow text-sm italic text-gray-600 sm:text-base">
                "{testimonial.quote}"
              </blockquote>
              <div className="mt-auto text-center">
                <p className="font-semibold text-gray-800">
                  {testimonial.name}
                </p>
                <p className="text-xs text-gray-500 sm:text-sm">
                  {testimonial.role}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
};

export default TestimonialSlider;
