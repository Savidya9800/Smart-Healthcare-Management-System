import React from 'react';
import PAdminLayout from './PAdminLayout';
import Stock from './Stock';

function StockAnalytics() {
  return (
    <PAdminLayout>
      <Stock /> {/* Add the Stock component here */}
    </PAdminLayout>
  );
}

export default StockAnalytics;
