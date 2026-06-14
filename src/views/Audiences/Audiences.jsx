import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, Search, Plus, Sparkles, Eye, Edit, Trash2 } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import toast from 'react-hot-toast';

export default function Audiences({ onNavigate }) {
  const [audiences, setAudiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'danger', title: '', message: '', confirmText: '', action: null });

  const closeConfirm = () => setConfirmModal({ ...confirmModal, isOpen: false });

  useEffect(() => {
    fetchAudiences();
  }, []);

  const fetchAudiences = async () => {
    try {
      const res = await axios.get('/api/audience');
      setAudiences(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: 'Delete Audience',
      message: 'Are you sure you want to delete this audience? This action cannot be undone.',
      confirmText: 'Delete',
      action: async () => {
        try {
          await axios.delete(`/api/audience/${id}`);
          toast.success('Audience deleted');
          setAudiences(audiences.filter(a => a._id !== id));
        } catch (err) {
          toast.error('Failed to delete audience');
          console.error(err);
        }
      }
    });
  };

  const filteredAudiences = audiences.filter(a => {
    const term = searchTerm.toLowerCase();
    const matchesName = a.name.toLowerCase().includes(term);
    const matchesRules = a.rules?.some(r => 
      r.field?.toLowerCase().includes(term) || 
      r.value?.toString().toLowerCase().includes(term)
    );
    return matchesName || matchesRules;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audiences</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your customer segments for targeted campaigns.</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => onNavigate('create-audience')}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            Manual Builder
          </button>
          <button 
            onClick={() => onNavigate('create-audience-ai')}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Sparkles size={16} />
            AI Builder
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search audiences by name or rules..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading audiences...</div>
        ) : filteredAudiences.length === 0 ? (
          searchTerm ? (
            <div className="p-16 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-200/50">
                <Search size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No Results Found</h3>
              <p className="text-gray-500 max-w-sm mx-auto">We couldn't find any audiences matching your search criteria. Try checking for typos or searching another term.</p>
            </div>
          ) : (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Target size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Audiences Found</h3>
              <p className="text-gray-500 mb-6 max-w-md">You haven't created any audience segments yet. Use the AI Builder to generate one instantly from plain English.</p>
              <button 
                onClick={() => onNavigate('create-audience')}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Your First Audience
              </button>
            </div>
          )
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-white border-b border-gray-100 text-gray-500 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Customers</th>
                  <th className="px-6 py-4">Est. Revenue</th>
                  <th className="px-6 py-4 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAudiences.map(audience => (
                  <tr key={audience._id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onNavigate('audience-details', audience._id)}>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Target size={16} />
                        </div>
                        {audience.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {audience.customerCount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      ₹{audience.estimatedRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(audience.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
