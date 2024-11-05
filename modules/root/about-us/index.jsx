import Container from "@/components/shared/Container";
import Image from "next/image";
import Light from "@/public/image/light.jpeg";

import Link from "next/link";
import DarkFacebook from "@/components/icon/DarkFacebook";
import DarkTwitter from "@/components/icon/DarkTwitter";
import DarkInstagram from "@/components/icon/DarkInstagram";
import DarkYoutube from "@/components/icon/DarkYoutube";

export default function AboutUsPage() {
  return (
    <div className="mt-5 ">
      <Container>
        <div className="relative rounded text-black">
          <div className="mx-auto mt-4 px-5 pt-5 2xl:max-w-5xl">
            <h3 className="text-2xl bg-primary font-semibold text-center lg:p-5 md:p-4 p-3.5 text-white rounded-md lg:text-3xl">Who We Are</h3>
            <p className="md:text-lg mt-3">
              {`Think of MovMonkey as a helpful neighbour. A caring neighbour who
              helps you move, delivers your stuff, or cleans up your lawn
              whenever you are away, all without any surprise costs. That's
              precisely what we do. We make moving, delivery, and cleaning
              easier, affordable, and worry-free. Tired of the “oops, we lost
              your stuff” stories, the “will they, won't they” arrive on time
              saga, and the surprise fee trap? MovMonkey ensures your things get
              where they're going safely and on time, just like a caring
              neighbour would.`}
            </p>
          </div>

          <div className="absolute -left-20 top-1/2 hidden h-40 w-40 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-secondary text-2xl font-semibold text-white lg:text-3xl 2xl:flex">
            About Us
          </div>
        </div>
      </Container>

      <Container extraClassName="grid grid-cols-1 md:grid-cols-2">
      <Container>
      <div className="mb-5 flex min-h-16 items-center justify-center bg-[#49b74b28] px-5 pb-2 text-center text-2xl font-semibold text-primary md:h-20 md:text-3xl lg:mt-5 rounded-2xl">
        Our Story
      </div>
        <div className="border rounded-2xl p-5 ">
        <p className="md:text-lg">
          {`Imagine a world where about 65% of removal, delivery, and cleaning companies lost customers because they couldn’t get the cleaning or removal right. That was what MovMonkey's founder, Moses, saw in December 2024. `}
        </p>
        <p className="md:text-lg my-3">
          {`As a result, he started MovMonkey with one big goal: to make sure cleaning, moving, and delivery are done the right way and at the right price.  `}
        </p>
        <p className="md:text-lg">
          {`With MovMonkey, your only surprise would be how easy life just got `}
        </p>
        <p className="md:text-lg mt-3">
          {`Watch yourself go from "Oh no" to "Oh wow" in minutes. Think we can't do that? Try us and watch us prove you wrong.`}
        </p>
        </div>
      </Container>
       
      <Container>
      <div className="mb-5 flex min-h-16 items-center justify-center bg-[#49b74b28] px-5 py-2 text-center text-2xl font-semibold text-primary md:h-20 md:text-3xl lg:mt-5 rounded-2xl">
        Our Mission
      </div>
       <div className="border rounded-2xl ">
       <p className="md:text-lg  px-5 pt-5">
          {`MovMonkey’s mission is to match our customers with reliable, top-rated service providers. We are your personal service provider shopper, offering you a variety of quotes from pre-checked service providers. While we have done the heavy lifting, it's still your job to pick the one that fits your needs and wallet. Feeling stuck on choosing the right service provider for your specific needs? Oh, we know the feeling. But guess what? You are not alone.`}
        </p>
        <p className="my-3 px-5 font-semibold md:text-lg">
          {`The good news is that MovMonkey is on a mission to change the game! Simply choose MovMonkey and enjoy a triple win:`}
        </p>
        <ul className=" pt-5 md:text-lg">
          <li className=" block bg-[#49b74b28] rounded-xl pl-5 p-1"> Quicker quote offers</li>
          <li  className="block bg-[#49b74b28] rounded-xl pl-5 p-1 my-1">Zero hidden fees</li>
          <li className=" block bg-[#49b74b28] rounded-xl pl-5 p-1 mb-1">
             Access to top-rated service providers
          </li>
          <li className="block bg-[#49b74b28] rounded-xl pl-5 p-1">
            Track your removal, delivery and cleaning job in one pot
          </li>
        </ul>
       </div>
      
      </Container>
      </Container>

      <Container>
          <div className="w-full mt-4">
            <Image src={Light} alt="About Us" className="h-auto w-full rounded-2xl mb-10" />
          </div>
      </Container>
    </div>
  );
}
