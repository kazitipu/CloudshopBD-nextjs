import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import PaymentConfirmation from "@/components/othersPages/PaymentConfirmation";
import React from "react";
// import { useRouter } from "next/router";
export const metadata = {
  title: "Payment Confirmation || Ecomus - Ultimate Nextjs Ecommerce Template",
  description: "Ecomus - Ultimate Nextjs Ecommerce Template",
};
export default function page({ searchParams }) {
  // const router = useRouter();
  const orderId = searchParams.orderId;
  return (
    <>
      <Header2 />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        <img src={"/images/animation.gif"} alt="my-animation" />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "#5bcc9b", fontSize: 20, fontWeight: "bold" }}>
          Order placed successfully!
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 7,
        }}
      >
        <div style={{ fontSize: 20, fontWeight: "bold" }}>
          Order Id: {orderId}
        </div>
      </div>

      <PaymentConfirmation />
      <Footer1 />
    </>
  );
}
