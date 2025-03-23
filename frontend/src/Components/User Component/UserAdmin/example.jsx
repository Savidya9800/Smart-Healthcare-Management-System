import React from 'react';
import AdminLayout from './AdminLayout';

function ExamplePage() {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-800">Welcome to the Example Page!</h1>
      <p className="mt-2 text-gray-600">This is a sample page using the ModernAdminLayout.</p>
    </AdminLayout>
  );
}

export default ExamplePage;
