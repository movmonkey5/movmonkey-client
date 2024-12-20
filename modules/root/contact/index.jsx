import Container from "@/components/shared/Container";
import ContactForm from "./components/ContactForm";

export default function ContactPage() {
  return (
    <div>
      <div className="bg-primary">
        <Container>
          <div className="space-y-6 py-10">
            <h2 className="text-center text-3xl font-medium lg:text-4xl">
              Get in Touch with <span className="font-bold">MOV</span>MONKEY
            </h2>
            <p className="mx-auto max-w-6xl text-xl md:text-2xl lg:text-center">
              We are here to help and answer any questions you might have.
              Please feel free to get in touch. We will get back to you as soon.
            </p>
          </div>
        </Container>
      </div>

      <ContactForm />
    </div>
  );
}
