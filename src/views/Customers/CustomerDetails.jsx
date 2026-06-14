import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Edit2, MapPin, Mail, Phone, Calendar, User as UserIcon, Tag, ShoppingCart, Megaphone, Sparkles, Trash2 } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import toast from 'react-hot-toast';

export default function CustomerDetails({ customerId, onNavigate }) {
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'danger', title: '', message: '', confirmText: '', action: null });

  const closeConfirm = () => setConfirmModal({ ...confirmModal, isOpen: false });

  const handleDelete = () => {
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: 'Delete Customer',
      message: 'Are you sure you want to delete this customer? This action cannot be undone.',
      confirmText: 'Delete',
      action: async () => {
        try {
          await axios.delete(`/api/customers/${customerId}`);
          toast.success('Customer deleted');
          onNavigate('list');
        } catch (err) {
          toast.error('Failed to delete customer');
          console.error(err);
        }
      }
    });
  };

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const [custRes, ordersRes] = await Promise.all([
          axios.get(`/api/customers/${customerId}`),
          axios.get(`/api/orders`, { params: { customerId } })
        ]);
        setCustomer(custRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
      
      try {
        setIsSummaryLoading(true);
        const aiRes = await axios.get(`/api/copilot/customer-summary/${customerId}`);
        setAiSummary(aiRes.data.summary);
      } catch (err) {
        console.error('Failed to load AI summary', err);
        setAiSummary('Failed to load AI insights. Please try again later.');
      } finally {
        setIsSummaryLoading(false);
      }
    };
    if (customerId) fetchCustomer();
  }, [customerId]);

  if (isLoading) return <div className="flex justify-center py-12">Loading...</div>;
  if (!customer) return <div className="flex justify-center py-12">Customer not found</div>;

  const timelineItems = [
    ...orders.map(o => ({
      id: o._id,
      type: 'order',
      date: new Date(o.orderDate),
      title: `Placed Order: ${o.productName}`,
      subtitle: `Amount: ₹${o.amount?.toFixed(2)} • Status: ${o.orderStatus}`,
      icon: 'order'
    })),
    ...(customer.campaignLogs || []).map(l => ({
      id: l._id,
      type: 'campaign',
      date: new Date(l.sentAt || l.createdAt || Date.now()),
      title: `Received Campaign: ${l.campaign_id?.name || 'Campaign'}`,
      subtitle: `Channel: ${l.channel} • Status: ${l.status}`,
      icon: 'campaign'
    }))
  ].sort((a, b) => b.date - a.date);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('list')} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Customer Profile</h1>
        </div>
        <button onClick={() => onNavigate('edit', customerId)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
          <Edit2 size={16} /> Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Basic Info & Tags */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center font-bold text-2xl mb-4 shadow-inner border border-blue-200">
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{customer.name}</h2>
            <p className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-1">
              <MapPin size={14} /> 
              {customer.city ? `${customer.city}${customer.state ? `, ${customer.state}` : ''}` : 'Location unknown'}
            </p>
            
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {customer.tags && customer.tags.length > 0 ? (
                customer.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold border border-gray-200 flex items-center gap-1">
                    <Tag size={12} className="text-gray-400" /> {tag}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-xs italic">No tags assigned</span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="text-gray-400 mt-0.5" size={16} />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Email Address</p>
                  <p className="text-sm text-gray-900">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="text-gray-400 mt-0.5" size={16} />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Phone Number</p>
                  <p className="text-sm text-gray-900">{customer.phone || '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UserIcon className="text-gray-400 mt-0.5" size={16} />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Gender</p>
                  <p className="text-sm text-gray-900">{customer.gender || '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="text-gray-400 mt-0.5" size={16} />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Date of Birth</p>
                  <p className="text-sm text-gray-900">{customer.dob ? new Date(customer.dob).toLocaleDateString() : '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI & Activity */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-indigo-600" />
              <h3 className="font-bold text-indigo-900">AI Summary</h3>
            </div>
            <p className="text-sm text-indigo-800 leading-relaxed">
              {isSummaryLoading ? 'Generating AI insights... Please wait.' : (aiSummary || 'No summary available.')}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-2">
                <ShoppingCart size={18} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{customer.purchase_frequency || 0}</p>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">Total Orders</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-2">
                <span className="font-bold">₹</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">₹{(customer.lifetime_value || 0).toFixed(2)}</p>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">Total Spend</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center justify-center text-center col-span-2 lg:col-span-1">
              <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-2">
                <Megaphone size={18} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{customer.campaignsReceivedCount || 0}</p>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">Campaigns Received</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Customer Timeline</h3>
            </div>
            <div className="p-0">
              {timelineItems.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">
                  <p>No activity recorded yet.</p>
                  <p className="text-xs mt-1 text-gray-400">Future orders and campaigns will appear here.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {timelineItems.map(item => (
                    <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-4">
                      {item.type === 'order' ? (
                        <div className="mt-1 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <ShoppingCart size={14} />
                        </div>
                      ) : (
                        <div className="mt-1 w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                          <Megaphone size={14} />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-medium text-gray-900">{item.title}</p>
                          <span className="text-xs text-gray-500">{item.date.toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{item.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button 
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
        >
          <Trash2 size={16} /> Delete Customer
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
