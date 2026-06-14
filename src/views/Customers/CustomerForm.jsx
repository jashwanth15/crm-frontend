import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Save } from 'lucide-react';

export default function CustomerForm({ customerId, onNavigate }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    city: '',
    state: '',
    country: '',
    tags: []
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const availableTags = ['VIP', 'Premium', 'Regular', 'New Customer', 'Inactive'];

  useEffect(() => {
    if (customerId) {
      const fetchCustomer = async () => {
        try {
          const res = await axios.get(`/api/customers/${customerId}`);
          const data = res.data;
          if (data.dob) data.dob = data.dob.split('T')[0]; // Format for date input
          setFormData(data);
        } catch (err) {
          setError('Failed to load customer details');
        }
      };
      fetchCustomer();
    }
  }, [customerId]);

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...(prev.tags || []), tag]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (customerId) {
        await axios.put(`/api/customers/${customerId}`, formData);
      } else {
        await axios.post('/api/customers', formData);
      }
      onNavigate('list');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save customer');
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
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{customerId ? 'Edit Customer' : 'Add New Customer'}</h1>
            <p className="text-gray-500 text-sm mt-1">{customerId ? 'Update customer details and tags.' : 'Create a new customer profile manually.'}</p>
          </div>
        </div>
        <button onClick={handleSubmit} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
          <Save size={16} />
          {isLoading ? 'Saving...' : 'Save Customer'}
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 text-sm">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <form className="p-6 space-y-8" onSubmit={handleSubmit}>
          
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input required type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="col-span-2 sm:col-span-1 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700" value={formData.gender || ''} onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700" value={formData.dob || ''} onChange={e => setFormData({...formData, dob: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Location</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.state || ''} onChange={e => setFormData({...formData, state: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.country || ''} onChange={e => setFormData({...formData, country: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Customer Tags</h3>
            <div className="flex flex-wrap gap-3">
              {availableTags.map(tag => (
                <label key={tag} className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition-colors ${formData.tags?.includes(tag) ? 'bg-blue-50 border-blue-500 text-blue-800' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  <input type="checkbox" className="hidden" checked={formData.tags?.includes(tag)} onChange={() => handleTagToggle(tag)} />
                  <span className="text-sm font-medium">{tag}</span>
                </label>
              ))}
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
