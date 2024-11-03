"use client";

import Container from "@/components/shared/Container";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Minus, Plus } from "lucide-react";
import React, { useState } from "react";

const faqData = [
  {
    question:
      "Why choose MovMonkey for your moving, delivery and cleaning needs?",
    answer:
      "Whether you're moving locally or internationally, MovMonkey makes it easy to find and compare excellent moving, delivery and cleaning services. Our platform is dedicated to introducing you to the best local professionals, all of whom have been thoroughly vetted by our staff. Transparency is our guiding principle, so you can easily browse through service providers' experiences and reviews to assess the quality of their services and the prices they offer. You can count on MovMonkey to make your trip easy from start to finish.",
  },
  {
    question: "Does MovMonkey provide ratings for each service provider?",
    answer:
      "Of course we do! Customers can quickly review the facts and biography of each provider, including customer testimonials and star ratings within their reviews. Our feedback policy ensures reliability by limiting reviewers to previous users of the platform. Remember, we are new, would you please be the first to review our service provider?",
  },
  {
    question:
      "Can I update the details of my quote request after I have submitted it?",
    answer:
      "Your quote request cannot be changed once it has been submitted; it is automatically sent to suppliers. However, if you're in contact with the supplier, you can let them know of any changes immediately. Any additional work will be charged separately.",
  },
  {
    question:
      "How soon will I hear from a service provider company after requesting a quote?",
    answer:
      "As soon as you submit your request, local service providers are alerted. If they are available, you should receive a quote within 48 hours.",
  },
  {
    question:
      "What steps can I take to make sure my cleaning, removal or delivery service goes well?",
    answer: (
      <>
        <p className="text-black">
          <strong>Give clear instructions:</strong> Make sure service providers
          can easily locate your location by sharing access codes, a detailed
          chat, or other specific instructions in the booking.
        </p>
        <p className="text-black">
          <strong>Express specific requests:</strong> Let service providers know
          if you have any requests or tasks you would like them to focus on
          during your booking.
        </p>
        <p className="text-black">
          <strong>Be available:</strong> When they arrive, try to be there or
          available by phone if they have any queries.
        </p>
        <p className="text-black">
          <strong>Research sources:</strong> Once payment has been made, you
          will have access to all the service provider's details. Use this data
          to look up their references, reviews, and ratings online to verify
          their legitimacy.
        </p>
      </>
    ),
  },
  {
    question: "How do I contact service providers?",
    answer:
      "Once you have submitted a quote request and hand-picked your service provider, and completed the payment, the channels of communication between you and your chosen service provider are open. You can contact them by phone, email, or instant chat. Alternatively, the quote will include contact details for direct correspondence. Thank you for choosing our service. A notification will follow your selection.",
  },
  {
    question: "How many quotes can I expect to receive?",
    answer:
      "Depending on the services you've booked through our platform, you can often expect to receive up to four quotes from reputable removal, delivery, and cleaning companies when you request a price. On the other hand, all other quotes will be cancelled as soon as you accept one. Although it is rare, we may be able to forward your quote to the nearest suppliers if the one you have chosen is unable to meet your requirements. If there aren't any qualified removals companies in your chosen location on our platform at the time, you may not receive a quote.",
  },
  {
    question:
      "Why weren't any service providers able to accept my request after I submitted my quote?",
    answer:
      "This could be because the service providers are not working in your area or are too busy to be available at the moment.",
  },
  {
    question: "Is my personal information safe?",
    answer:
      "Of course it is! Your personal information is completely safe with us. It will only be used by us to process your quote request. Please read our privacy page for more information about how we handle and protect your information.",
  },
  {
    question: "How do we select service providers for you?",
    answer:
      "Our sophisticated technology relies on a comprehensive vetting process. We also take into account consumer reviews, value, proximity, relevance, services provided, and reviews from previous customers when matching you with qualified professionals who meet your needs.",
  },
  {
    question: "How to access provider information and reviews?",
    answer:
      "Each service provider's profile includes information and reviews from previous customers when they submit a quote. These profiles show past performance as well as client reviews, ensuring recommendations from highly qualified experts.",
  },
  {
    question: "How much does it cost to use MovMonkey?",
    answer:
      "You can use our platform for free! We don't charge any fees to clients who wish to use our services.",
  },
  {
    question: "How does the quote request process work?",
    answer:
      "It's really easy to get a quote on our site! Simply enter your specifications and click on the 'Quote' button. Your request will be submitted in a matter of a few minutes. Based on your requirements, our closest service providers will be notified immediately and will provide a cost based on this information. Check the details, included services, and price (including VAT) when you receive your quote.",
  },
  {
    question: "What do the ratings and reviews mean for the service providers?",
    answer:
      "We ask customers to provide a review after they have received a service from our service providers. They rate the service provider based on quality, customer service, and value for money. Reviews can be favourable, unfavourable, or neutral; we only publish reviews that meet our standards. When you get a quote, you can see these reviews on the supplier's profile.",
  },
  {
    question: "Can you accommodate my specific service times?",
    answer:
      "Our advanced technology notifies providers in your area as soon as you submit your request. Please let us and your chosen service provider know if you need to change the times or if there are any other factors that may affect the job. Remember that moving on public holidays and bank holidays generally results in higher moving costs.",
  },
];

export default function FAQPage() {
  const [showFaq, setShowFaq] = useState(Array(faqData.length).fill(false));

  const toggleFaq = (index) => {
    const newShowFaq = [...showFaq];
    newShowFaq[index] = !newShowFaq[index];
    setShowFaq(newShowFaq);
  };

  return (
    <div className="mb-2 lg:mb-10">
      <Container>
        <div className="mb-16 flex min-h-16 items-center justify-center rounded-xl bg-primary px-5 py-8 text-center text-2xl font-semibold text-white md:h-30 md:text-4xl">
          Frequently Asked Questions
        </div>

        {faqData.map((faq, index) => (
          <React.Fragment key={index}>
            <Collapsible
              className="my-4 cursor-pointer space-y-4 rounded-lg border border-green-200 bg-green-50 px-6 py-4 shadow-sm"
              open={showFaq[index]}
              onOpenChange={() => toggleFaq(index)}
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                <p className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                  <span className="text-green-600">≡</span> {/* Icon */}
                  {faq.question}
                </p>
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-2 space-y-2 text-base font-normal text-gray-600">
                {faq.answer}
              </CollapsibleContent>
            </Collapsible>
          </React.Fragment>
        ))}
      </Container>
    </div>
  );
}
