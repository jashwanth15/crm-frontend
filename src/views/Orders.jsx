import React, { useState } from 'react';
import OrderList from './Orders/OrderList';
import OrderForm from './Orders/OrderForm';
import OrderDetails from './Orders/OrderDetails';
import ImportOrders from './Orders/ImportOrders';

export default function Orders() {
  const [view, setView] = useState('list');
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const navigate = (newView, orderId = null) => {
    setView(newView);
    setSelectedOrderId(orderId);
  };

  switch (view) {
    case 'list':
      return <OrderList onNavigate={navigate} onSelectOrder={navigate} />;
    case 'add':
      return <OrderForm onNavigate={navigate} />;
    case 'edit':
      return <OrderForm orderId={selectedOrderId} onNavigate={navigate} />;
    case 'details':
      return <OrderDetails orderId={selectedOrderId} onNavigate={navigate} />;
    case 'import':
      return <ImportOrders onNavigate={navigate} />;
    default:
      return <OrderList onNavigate={navigate} onSelectOrder={navigate} />;
  }
}
