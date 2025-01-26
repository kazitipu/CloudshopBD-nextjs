import React from "react";
import Invoice from "@/components/invoice";
export default function page({ searchParams }) {
  const orderId = searchParams.orderId;
  return (
    <>
      <Invoice orderId={orderId} />
    </>
  );
}
