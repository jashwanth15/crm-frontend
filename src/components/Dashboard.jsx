import { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, Users, Mail, CheckCircle2, XCircle, MousePointerClick } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/campaigns`);
      setCampaigns(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    const interval = setInterval(fetchCampaigns, 5000); // Polling every 5s for live updates
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Recent Campaigns</h2>
        <button 
          onClick={fetchCampaigns}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {campaigns.length === 0 && !loading && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <p className="text-gray-500">No campaigns launched yet. Head over to the AI Campaign Builder!</p>
        </div>
      )}

      <div className="grid gap-6">
        {campaigns.map(camp => (
          <div key={camp._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{camp.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Prompt: "{camp.audience_prompt}"</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                camp.status === 'COMPLETED' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700 animate-pulse'
              }`}>
                {camp.status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-gray-50">
              <StatCard icon={<Users size={18}/>} label="Pending" value={camp.stats?.PENDING || 0} color="text-gray-500" />
              <StatCard icon={<Mail size={18}/>} label="Sent" value={camp.stats?.SENT || 0} color="text-blue-500" />
              <StatCard icon={<CheckCircle2 size={18}/>} label="Delivered" value={camp.stats?.DELIVERED || 0} color="text-green-500" />
              <StatCard icon={<MousePointerClick size={18}/>} label="Opened/Clicked" value={(camp.stats?.OPENED || 0) + (camp.stats?.CLICKED || 0)} color="text-purple-500" />
              <StatCard icon={<XCircle size={18}/>} label="Failed" value={camp.stats?.FAILED || 0} color="text-red-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="flex flex-col space-y-1">
      <div className={`flex items-center space-x-1.5 ${color} mb-1`}>
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-2xl font-bold text-gray-900">{value}</span>
    </div>
  );
}
