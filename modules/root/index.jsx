import { Input } from "@/components/ui/input";
import Banner from "./components/Banner";
import Card from "./components/Card";
import KeyPoints from "./components/KeyPoints";
import QuoteButton from "./components/QuoteButton";
import Slider from "./components/Slider";
import TestimonialSlider from "./components/Testimonial";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div>
      <Banner />
      {/* <Slider /> */}
      <Card />
      <KeyPoints />
      {/* <TestimonialSlider /> */}
      <div className="mb-24 mt-4 w-full">
        <div className="flex w-full flex-col-reverse items-center justify-center gap-6 md:flex-row">
          <div className="flex w-full md:max-w-96 lg:justify-center">
            <button className="mx-20 w-full rounded-xl bg-secondary px-10 py-4  text-white md:mx-0">
              Subscribe
            </button>
          </div>

          <Input
            type="text"
            placeholder="Please enter your email to subscribe"
            className=" h-12 w-[300px] md:max-w-96 mx-8  text-black placeholder:line-clamp-1 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
          />
        </div>
      </div>
    </div>
  );
}
