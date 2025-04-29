import React from "react";
import PAdminLayout from "./PAdminLayout";
import Stock from "./Stock";

function StockAnalytics() {
  return (
    <PAdminLayout>
      <Stock /> {/* Add the Stock component here */}
      //this is the stock analytics page for the pharmacy admin
    </PAdminLayout>
  );
}
//stockAnalytics pages
export default StockAnalytics;
