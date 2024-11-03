import Payment from "@/modules/customer/payment";

export const metadata = {
  title: "Customer payment - MovMonkey",
};

export default function CustomerProfile({params}) {
  return <Payment params={params} />;
}
