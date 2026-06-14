import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, ArrowLeft, Edit, Megaphone, Users, IndianRupee, Trash2 } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import toast from 'react-hot-toast';

export default function AudienceDetails({ audienceId, onNavigate }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'danger', title: '', message: '', confirmText: '', action: null });

  const closeConfirm = () => setConfirmModal({ ...confirmModal, isOpen: false });

  const handleDelete = () => {
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: 'Delete Audience',
      message: 'Are you sure you want to delete this audience? This action cannot be undone.',
      confirmText: 'Delete',
      action: async () => {
        try {
          await axios.delete(`/api/audience/${audienceId}`);
          toast.success('Audience deleted');
          onNavigate('audience');
        } catch (err) {
          toast.error('Failed to delete audience');
          console.error(err);
        }
      }
    });
  };

  useEffect(() => {
    fetchAudience();
  }, [audienceId]);

  const fetchAudience = async () => {
    try {
      const res = await axios.get(`/api/audience/${audienceId}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading audience details...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Failed to load audience.</div>;

  const { audience, previewCustomers } = data;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('audience')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {audience.name}
            </h1>
            <p className="text-gray-500 text-sm mt-1">Created on {new Date(audience.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onNavigate('edit-audience', audience._id)}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <Edit size={16} /> Edit Rules
          </button>
          <button 
            onClick={() => toast.error("Campaigns module coming next!")}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Megaphone size={16} /> Create Campaign
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2">
            <Users size={18} />
          </div>
          <p className="text-3xl font-bold text-gray-900">{audience.customerCount.toLocaleString()}</p>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">Total Customers</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-2">
            <IndianRupee size={18} />
          </div>
          <p className="text-3xl font-bold text-gray-900">₹{audience.estimatedRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">Estimated Revenue</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center justify-center text-center col-span-2 lg:col-span-1">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-2">
            <Target size={18} />
          </div>
          <p className="text-3xl font-bold text-gray-900">{audience.rules.length}</p>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">Active Rules</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Segmentation Rules</h3>
            </div>
            <div className="p-4 space-y-3">
              {audience.rules.length === 0 ? (
                <p className="text-sm text-gray-500">All Customers</p>
              ) : (
                audience.rules.map((rule, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded border border-gray-100 text-sm flex flex-wrap gap-2 items-center">
                    <span className="font-medium text-gray-700">{rule.field}</span>
                    <span className="text-blue-600 font-bold">{rule.operator}</span>
                    <span className="text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">{rule.value}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Customer Sample */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Customer Preview</h3>
              <span className="text-xs text-gray-500">Showing top results</span>
            </div>
            <div className="p-0">
              {previewCustomers.length > 0 ? (
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3">Customer</th>
                      <th className="px-6 py-3">Location</th>
                      <th className="px-6 py-3">Spend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {previewCustomers.map(c => (
                      <tr key={c._id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-medium text-gray-900">
                          {c.name}
                          <div className="text-xs text-gray-500 font-normal">{c.email}</div>
                        </td>
                        <td className="px-6 py-3">{c.city || '-'}</td>
                        <td className="px-6 py-3">₹{(c.lifetime_value || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No customers match these rules.
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
          <Trash2 size={16} /> Delete Audience
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
