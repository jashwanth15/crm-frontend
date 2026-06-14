import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Edit2, Package, Calendar, DollarSign, Tag, User, Hash, AlertCircle, CreditCard, Trash2 } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import toast from 'react-hot-toast';

export default function OrderDetails({ orderId, onNavigate }) {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'danger', title: '', message: '', confirmText: '', action: null });

  const closeConfirm = () => setConfirmModal({ ...confirmModal, isOpen: false });

  const handleDelete = () => {
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: 'Delete Order',
      message: 'Are you sure you want to delete this order? This action cannot be undone.',
      confirmText: 'Delete',
      action: async () => {
        try {
          await axios.delete(`/api/orders/${orderId}`);
          toast.success('Order deleted');
          onNavigate('list');
        } catch (err) {
          toast.error('Failed to delete order');
          console.error(err);
        }
      }
    });
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  if (isLoading) return <div className="flex justify-center py-12">Loading...</div>;
  if (!order) return <div className="flex justify-center py-12">Order not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('list')} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Order Details</h1>
        </div>
        <button onClick={() => onNavigate('edit', orderId)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
          <Edit2 size={16} /> Edit Order
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Order ID</span>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-mono">{order._id}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{order.productName}</h2>
          </div>
          <div className="flex gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${order.orderStatus === 'Completed' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}>
              Status: {order.orderStatus}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${order.paymentStatus === 'Paid' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
              Payment: {order.paymentStatus}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Package size={16} className="text-gray-400" />
                Product Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-sm">Category</span>
                  <span className="font-medium text-gray-900 text-sm">{order.category || 'Uncategorized'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-sm">Quantity</span>
                  <span className="font-medium text-gray-900 text-sm">{order.quantity}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-sm">Total Amount</span>
                  <span className="font-bold text-gray-900 text-sm">₹{order.amount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-gray-500 text-sm">Order Date</span>
                  <span className="font-medium text-gray-900 text-sm">{new Date(order.orderDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <User size={16} className="text-gray-400" />
                Customer Information
              </h3>
              {order.customerId ? (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="font-bold text-gray-900 mb-1">{order.customerId.name}</div>
                  <div className="text-sm text-gray-500 mb-1">{order.customerId.email}</div>
                  <div className="text-sm text-gray-500">{order.customerId.phone || 'No phone provided'}</div>
                </div>
              ) : (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm flex items-start gap-2 border border-red-100">
                  <AlertCircle size={16} className="mt-0.5" />
                  <span>Customer profile has been deleted or is missing.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200 mt-8">
        <button 
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
        >
          <Trash2 size={16} /> Delete Order
        </button>
      </div>

      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmModal.action}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        type={confirmModal.type}
      />
    </div>
  );
}
