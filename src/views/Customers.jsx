import React, { useState } from 'react';
import CustomerList from './Customers/CustomerList';
import CustomerForm from './Customers/CustomerForm';
import CustomerDetails from './Customers/CustomerDetails';
import ImportCustomers from './Customers/ImportCustomers';

export default function Customers() {
  const [view, setView] = useState('list');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const navigate = (newView, customerId = null) => {
    setView(newView);
    setSelectedCustomerId(customerId);
  };

  switch (view) {
    case 'list':
      return <CustomerList onNavigate={navigate} onSelectCustomer={navigate} />;
    case 'add':
      return <CustomerForm onNavigate={navigate} />;
    case 'edit':
      return <CustomerForm customerId={selectedCustomerId} onNavigate={navigate} />;
    case 'details':
      return <CustomerDetails customerId={selectedCustomerId} onNavigate={navigate} />;
    case 'import':
      return <ImportCustomers onNavigate={navigate} />;
    default:
      return <CustomerList onNavigate={navigate} onSelectCustomer={navigate} />;
  }
}
