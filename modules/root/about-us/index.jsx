import React from 'react';
import Image from 'next/image';
import Container from '@/components/shared/Container';
import Light from '@/public/image/light.jpeg';
import { Move, Truck, Sparkles, CheckCircle } from 'lucide-react';

const ABOUT_US_DATA = {
  hero: {
    title: 'Who We Are',
    content: `Think of MovMonkey as a helpful neighbour. A caring neighbour who helps you move, delivers your stuff, or cleans up your lawn whenever you are away, all without any surprise costs. We make moving, delivery, and cleaning easier, affordable, and worry-free. Tired of the "oops, we lost your stuff" stories, the "will they, won't they" arrive on time saga, and the surprise fee trap? MovMonkey ensures your things get where they're going safely and on time, just like a caring neighbour would.`
  },
  story: {
    title: 'Our Story',
    highlights: [
      {
        icon: Truck,
        text: `Imagine a world where about 65% of removal, delivery, and cleaning companies lost customers because they couldn't get the cleaning or removal right. That was what MovMonkey's founder, Moses, saw in December 2024.`
      },
      {
        icon: Sparkles,
        text: `As a result, he started MovMonkey with one big goal: to make sure cleaning, moving, and delivery are done the right way and at the right price.`
      },
      {
        icon: CheckCircle,
        text: `With MovMonkey, your only surprise would be how easy life just got. Watch yourself go from "Oh no" to "Oh wow" in minutes. Think we can't do that? Try us and watch us prove you wrong.`
      }
    ]
  },
  mission: {
    title: 'Our Mission',
    description: `MovMonkey's mission is to match our customers with reliable, top-rated service providers. We are your personal service provider shopper, offering you a variety of quotes from pre-checked service providers. While we have done the heavy lifting, it's still your job to pick the one that fits your needs and wallet. Feeling stuck on choosing the right service provider for your specific needs? Oh, we know the feeling. But guess what? You are not alone.`,
    benefits: [
      'Quicker quote offers',
      'Zero hidden fees',
      'Access to top-rated service providers',
      'Track your removal, delivery and cleaning job in one pot'
    ]
  }
};

const AboutUsPage = () => {
  return (
    <div className="bg-white">
      {/* Integrated Hero and Who We Are Section */}
      <div className="bg-gray-50 py-16">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-2xl md:text-4xl font-bold text-primary">
                {ABOUT_US_DATA.hero.title}
                <div className='h-1 w-20 bg-secondary rounded-3xl mt-3'></div>
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed">
                {ABOUT_US_DATA.hero.content}
              </p>
            </div>
            <div>
              <Image
                src={Light}
                alt="MovMonkey Services"
                className="w-full h-auto rounded-2xl shadow-lg object-cover"
              />
            </div>
          </div>
        </Container>
      </div>

      <Container>
        {/* Story Highlights */}
        <section className="py-16 bg-white">
          <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-12">
            {ABOUT_US_DATA.story.title}
            <div className='h-1 w-20 bg-secondary mx-auto rounded-3xl mt-3'></div>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {ABOUT_US_DATA.story.highlights.map((highlight, index) => {
              const IconComponent = highlight.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-all"
                >
                  <div className="flex justify-center mb-4">
                    <IconComponent
                      className="text-secondary w-16 h-16 stroke-[1.5]"
                    />
                  </div>
                  <p className="text-gray-700">
                    {highlight.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-primary">
                  {ABOUT_US_DATA.mission.title}
                  <div className='h-1 w-20 bg-secondary rounded-3xl mt-3'></div>
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {ABOUT_US_DATA.mission.description}
                </p>
                <p className="font-semibold text-primary">
                  The good news is that MovMonkey is on a mission to change the game! Simply choose MovMonkey and enjoy a triple win:
                </p>
              </div>
              <div className="space-y-4">
                {ABOUT_US_DATA.mission.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="bg-secondary/15 p-4 rounded-lg flex items-center space-x-4"
                  >
                    <Move className="text-primary w-6 h-6" />
                    <span className="text-gray-800 font-semibold">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
};

export default AboutUsPage;