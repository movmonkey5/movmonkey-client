import React from "react";
import CardImage from "@/public/image/truck.jpeg";
import Image from "next/image";
import Container from "@/components/shared/Container";

const Card = () => {
  return (
    <Container>
      <div className="mx-auto my-6 flex  w-full items-center justify-center overflow-hidden pt-2 md:!my-12 md:w-5/6 ">
        <Image
          src={CardImage}
          alt="Card Image"
          className="h-[512px] w-[90%] rounded-xl object-cover object-center lg:h-[745px] 2xl:h-[645px]"
        />
      </div>
    </Container>
  );
};

export default Card;
