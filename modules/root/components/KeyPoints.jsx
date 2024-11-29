import Container from "@/components/shared/Container";
import PrivacyIcon from "@/public/icon/privacy.png";
import SecurityIcon from "@/public/icon/security.png";
import VideoIcon from "@/public/icon/video.png";
import TimeIcon from "@/public/icon/watch.png";
import TrackIcon from "@/public/icon/tracking.png";
import RatingIcon from "@/public/icon/rating.png";
import InstantIcon from "@/public/icon/instant.png";

import CardsContainer from "./CardsContainer";

export default function KeyPoints() {
  const cardData = [
    {
      title: "Customer Privacy and Safety",
      description:
        "Tired of waking up to unwanted emails from every Tom, Dick, and Harry you didn't sign up for? MovMonkey respects your privacy more than your ex ever did. We promise not to share your private details with just anyone. Your details are shared only with the service provider you handpick—and not a soul more.",
      icon: PrivacyIcon,
    },
    {
      title: "Secure Payment System",
      description:
        "Imagine if your money had its own personal bodyguard. That's MovMonkey for you! We keep your payment on our secure payment platform, only letting it out once you and the service provider agree on a job well done.",
      icon: SecurityIcon,
    },
    {
      title: "Mileage Estimation",
      description:
        "Say goodbye to surprise fees! With our transparent mileage calculation, the only shock you'll get is how fair our prices are. Our tech makes sure your bill reflects the actual mileage of your goods.",
      icon: TimeIcon,
    },
    {
      title: "Real-Time Van Tracking",
      description:
        "Our real-time tracking feature is so good; you'll feel like you're on the road with your goods. Minus the tight seats, of course. All you have to do is sit back and watch your items move from point A to point B, all from the comfort of your chair.",
      icon: TrackIcon,
    },
    {
      title: "Ratings for Drivers & Service Providers",
      description:
        "Giving your stuff to someone you don’t trust or know can be challenging. We get it. That's why we make our drivers’ and service providers’ ratings available to you. So, choose wisely and rest easy, knowing you're in capable hands.",
      icon: RatingIcon,
    },
    {
      title: "Instant Quotes",
      description:
        "Need a quote? Just send your quote request and watch as up to 4 offers from our vetted, top-notch service providers flood in quotes as soon as possible",
      icon: InstantIcon,
    },
    {
      title: "Upload Images and/or Videos",
      description:
        "Got special items that need extra care? Use our videos and images upload feature to share pictures or short videos of your precious goods and attract the perfect service provider who knows exactly what you need. Safe to say, our secure payment system is the ultimate peacekeeper, making sure you and the service provider are on the same page before any funds make their grand exit.",
      icon: VideoIcon,
    },
  ];
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
          <CardsContainer cards={cardData} />
        </Container>
      </div>
    </div>
  );
}
