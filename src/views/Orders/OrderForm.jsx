import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Save } from 'lucide-react';

export default function OrderForm({ orderId, onNavigate }) {
  const [formData, setFormData] = useState({
    customerId: '',
    productName: '',
    category: '',
    quantity: 1,
    amount: 0,
    orderDate: new Date().toISOString().split('T')[0],
    orderStatus: 'Completed',
    paymentStatus: 'Paid'
  });
  
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch customers for the dropdown
    const fetchCustomers = async () => {
      try {
        const res = await axios.get('/api/customers');
        setCustomers(res.data);
      } catch (err) {
        console.error('Failed to load customers');
      }
    };
    fetchCustomers();

    if (orderId) {
      const fetchOrder = async () => {
        try {
          const res = await axios.get(`/api/orders/${orderId}`);
          const data = res.data;
          if (data.orderDate) data.orderDate = data.orderDate.split('T')[0];
          setFormData({
            ...data,
            customerId: data.customerId?._id || data.customerId || ''
          });
        } catch (err) {
          setError('Failed to load order details');
        }
      };
      fetchOrder();
    }
  }, [orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (orderId) {
        await axios.put(`/api/orders/${orderId}`, formData);
      } else {
        await axios.post('/api/orders', formData);
      }
      onNavigate('list');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('list')} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{orderId ? 'Edit Order' : 'Add New Order'}</h1>
            <p className="text-gray-500 text-sm mt-1">{orderId ? 'Update order details.' : 'Create a new customer order manually.'}</p>
          </div>
        </div>
        <button onClick={handleSubmit} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
          <Save size={16} />
          {isLoading ? 'Saving...' : 'Save Order'}
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 text-sm">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <form className="p-6 space-y-8" onSubmit={handleSubmit}>
          
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Order Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
                <select required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700" value={formData.customerId} onChange={e => setFormData({...formData, customerId: e.target.value})}>
                  <option value="">Select Customer</option>
                  {customers.map(c => (
                    <option key={c._id} value={c._id}>{c.name} ({c.email})</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.productName} onChange={e => setFormData({...formData, productName: e.target.value})} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              </div>
              <div className="col-span-2 sm:col-span-1 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                  <input required type="number" min="1" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount (₹) *</label>
                  <input required type="number" min="0" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} />
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Date *</label>
                <input required type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700" value={formData.orderDate} onChange={e => setFormData({...formData, orderDate: e.target.value})} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700" value={formData.orderStatus} onChange={e => setFormData({...formData, orderStatus: e.target.value})}>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Returned">Returned</option>
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700" value={formData.paymentStatus} onChange={e => setFormData({...formData, paymentStatus: e.target.value})}>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
