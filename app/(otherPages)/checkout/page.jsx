import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Checkout from "@/components/othersPages/Checkout";
import React from "react";

export const metadata = {
  title: "Checkout || CloudShopBD",
  description: "CloudShopBD",
};
export default function page() {
  return (
    <>
      <Header2 />
      <Checkout />
      <Footer1 />
    </>
  );
}
