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
    <div className="mt-5 lg:mt-20 ">
      <Container>
        <div className="relative rounded bg-primary text-black">
          <div className="mx-auto space-y-4 px-5 py-5 lg:py-20 2xl:max-w-5xl">
            <h3 className="text-2xl font-semibold lg:text-3xl">Who We Are</h3>
            <p className="text-xl md:text-2xl">
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

            <div className="flex items-center gap-2 pt-5 lg:pt-10">
              <Link href={""}>
                <DarkTwitter className="h-6 w-6 text-black" />
              </Link>
              <Link href={""}>
                <DarkFacebook className="h-6 w-6 text-black" />
              </Link>
              <Link href={""}>
                <DarkInstagram className="h-6 w-6 text-black" />
              </Link>
              <Link href={""}>
                <DarkYoutube className="h-6 w-6 text-black" />
              </Link>
            </div>
          </div>

          <div className="absolute -left-20 top-1/2 hidden h-40 w-40 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-secondary text-2xl font-semibold text-white lg:text-3xl 2xl:flex">
            About Us
          </div>
        </div>
      </Container>

      <div className="mb-2 mt-5 flex min-h-16 items-center justify-center bg-primary px-5 py-2 text-center text-2xl font-semibold text-black md:h-20 md:text-4xl lg:mt-20">
        Our Story
      </div>

      <Container>
        <p className="text-xl md:text-2xl">
          {`Imagine a world where about 65% of removal, delivery, and cleaning companies lost customers because they couldn’t get the cleaning or removal right. That was what MovMonkey's founder, Moses, saw in July 2024. As a result, he started MovMonkey with one big goal: to make sure cleaning, moving, and delivery are done the right way and at the right price. With MovMonkey, your only surprise would be how easy life just got. Watch yourself go from "Oh no" to "Oh wow" in minutes. Think we can't do that? Try us and watch us prove you wrong.`}
        </p>
      </Container>

      <div className="mb-2 mt-5 flex min-h-16 items-center justify-center bg-primary px-5 py-2 text-center text-2xl font-semibold text-black md:h-20 md:text-4xl lg:mt-20">
        Our Mission
      </div>

      <Container>
        <p className="text-xl md:text-2xl">
          {` MovMonkey’s mission is to match our customers with reliable, top-rated service providers. We are your personal service provider shopper, offering you a variety of quotes from pre-checked service providers. While we have done the heavy lifting, it's still your job to pick the one that fits your needs and wallet. Feeling stuck on choosing the right service provider for your specific needs? Oh, we know the feeling. But guess what? You are not alone.`}
        </p>
        <p className="pt-8 text-xl md:text-2xl">
          {`The good news is that MovMonkey is on a mission to change the game! Simply choose MovMonkey and enjoy a triple win:`}
        </p>

        <ul className=" list-disc pt-8 text-xl md:text-2xl">
          <li className="ml-9 block">&#8226; Quicker quote offers</li>
          <li className="ml-9 block">&#8226; Zero hidden fees</li>
          <li className="ml-9 block">
            &#8226; Access to top-rated service providers
          </li>
          <li className="ml-9 block">
            &#8226; Track your removal, delivery and cleaning job in one pot
          </li>
        </ul>
      </Container>
      <div>
          <div className="w-full mt-4">
            <Image src={Light} alt="About Us" className="h-auto w-full" />
          </div>
      </div>
    </div>
  );
}
