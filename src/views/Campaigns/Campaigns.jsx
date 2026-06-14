import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Megaphone, Search, Filter } from 'lucide-react';
import CampaignTable from '../../components/Campaigns/CampaignTable';
import ConfirmModal from '../../components/ConfirmModal';
import toast from 'react-hot-toast';

export default function Campaigns({ onNavigate }) {
  const [campaigns, setCampaigns] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'danger', title: '', message: '', confirmText: '', action: null });

  const closeConfirm = () => setConfirmModal({ ...confirmModal, isOpen: false });

  useEffect(() => {
    fetchCampaigns();
  }, [search, filter]);

  const fetchCampaigns = async () => {
    try {
      let url = '/api/campaigns';
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filter) params.append('status', filter);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await axios.get(url);
      setCampaigns(res.data);
    } catch (error) {
      console.error('Error fetching campaigns', error);
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: 'Delete Campaign',
      message: 'Are you sure you want to delete this campaign? This action cannot be undone.',
      confirmText: 'Delete',
      action: async () => {
        try {
          await axios.delete(`/api/campaigns/${id}`);
          toast.success('Campaign deleted');
          fetchCampaigns();
        } catch (err) {
          toast.error('Failed to delete campaign');
          console.error(err);
        }
      }
    });
  };

  const handleLaunch = (id) => {
    setConfirmModal({
      isOpen: true,
      type: 'primary',
      title: 'Launch Campaign',
      message: 'Are you sure you want to launch this campaign now?',
      confirmText: 'Launch',
      action: async () => {
        try {
          await axios.put(`/api/campaigns/${id}`, { status: 'Running' });
          toast.success('Campaign launched!');
          fetchCampaigns();
        } catch (err) {
          toast.error('Failed to launch campaign');
          console.error(err);
        }
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Campaigns</h1>
          <p className="text-gray-500 mt-1">Manage and track your marketing campaigns.</p>
        </div>
        <button 
          onClick={() => onNavigate('create-campaign')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Megaphone size={16} />
          Create Campaign
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-colors"
            placeholder="Search Campaign..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <select 
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Running">Running</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <CampaignTable 
        campaigns={campaigns} 
        onLaunch={handleLaunch}
        onEdit={(id) => onNavigate('edit-campaign', id)}
        onDelete={handleDelete}
        onView={(id) => onNavigate('campaign-details', id)}
        onCreate={() => onNavigate('create-campaign')}
        hasFilters={!!(search || filter)}
      />

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
