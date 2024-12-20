import React from "react";
import Image from "next/image";

const Card = ({ title, description, icon, index }) => {
  return (
    <div
      className={`relative rounded-lg border border-[#D4EED4] ${index % 2 !== 0 ? "bg-white" : "bg-[#EDF8ED]"} cursor-pointer p-6 shadow-sm transition-shadow hover:shadow-md`}
    >
      <div className="transformjustify-center absolute left-[50%] top-0 mb-4 flex -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#F8F7F7] p-2">
          <Image
            src={icon}
            className="absolute left-[50%] top-[50%] w-24 -translate-x-1/2 -translate-y-1/2 transform"
            alt="icon"
          />
        </div>
      </div>
      <h3 className="mb-2 mt-16 text-center text-lg font-semibold text-gray-800">
        {title}
      </h3>
      <p className="px-2 pb-4 text-center text-sm font-normal md:px-0">
        {description}
      </p>
    </div>
  );
};

const CardsContainer = ({ cards }) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-16 px-4">
      <div className="mt-12 grid grid-cols-1 gap-6 gap-y-32 sm:grid-cols-2 lg:grid-cols-4">
        {cards.slice(0, 4).map((card, index) => (
          <Card
            key={index}
            title={card.title}
            description={card.description}
            icon={card.icon}
            index={index}
          />
        ))}
      </div>
      <div className="mt-12 grid w-full grid-cols-1 gap-6 gap-y-32 sm:grid-cols-2 lg:max-w-[80%]  lg:grid-cols-3">
        {cards.slice(-3).map((card, index) => (
          <Card
            key={index}
            title={card.title}
            description={card.description}
            icon={card.icon}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default CardsContainer;
