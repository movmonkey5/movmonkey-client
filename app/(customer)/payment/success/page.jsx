import PaymentSuccess from "@/modules/customer/payment/success/PaymentSuccess";

export const metadata = {
  title: "Customer payment Success - MovMonkey",
};

export default function CustomerProfile({ searchParams }) {
  return <PaymentSuccess searchParams={searchParams} />;
}
