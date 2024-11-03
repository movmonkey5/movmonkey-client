import Container from "@/components/shared/Container";
import point1 from "@/public/image/card1.png";
import point2 from "@/public/image/card2.png";
import point3 from "@/public/image/card3.png";
import point4 from "@/public/image/card4.png";
import point5 from "@/public/image/card5.png";
import point6 from "@/public/image/card6.png";
import point7 from "@/public/image/card7.png";
import presentation from "@/public/image/presentation.png";
import Image from "next/image";

export default function KeyPoints() {
  return (
    <div className="select-none ">
      <div className="flex h-max flex-col items-center justify-center   pb-6 pt-8 text-center text-2xl  font-semibold text-black md:text-4xl">
        <div>
          <p className="font-semibold">Why MovMonkey</p>
          <p className="mt-6 text-center text-xl  font-normal md:text-2xl">
            Here is what makes us different:
          </p>
        </div>
        <Container>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 ">
            <div>
              <Image
                src={point1}
                alt="point1"
                className="aspect-auto"
                quality={100}
              />
            </div>
            <div>
              <Image
                src={point2}
                alt="point2"
                className="aspect-auto"
                quality={100}
              />
            </div>
            <div>
              <Image
                src={point3}
                alt="point3"
                className="aspect-auto"
                quality={100}
              />
            </div>
            <div>
              <Image
                src={point4}
                alt="point4"
                className="aspect-auto"
                quality={100}
              />
            </div>
          </div>
          <div className="grid mt-8 grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:px-[10%]">
            <div>
              <Image
                src={point5}
                alt="point5"
                className="aspect-auto"
                quality={100}
              />
            </div>
            <div>
              <Image
                src={point6}
                alt="point6"
                className="aspect-auto"
                quality={100}
              />
            </div>
            <div>
              <Image
                src={point7}
                alt="point6"
                className="aspect-auto"
                quality={100}
              />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
