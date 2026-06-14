import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Send, CheckCircle2, Eye, MousePointerClick, XCircle, Activity, BarChart3, Clock } from 'lucide-react';

export default function CampaignLaunch({ campaignId, onNavigate }) {
  const [campaign, setCampaign] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    if (!campaignId) return;
    
    // Initial fetch
    fetchData();

    // Poll every 2 seconds for live updates
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [campaignId]);

  const fetchData = async () => {
    try {
      const [campRes, logsRes] = await Promise.all([
        axios.get(`/api/campaigns/${campaignId}`),
        axios.get(`/api/campaigns/${campaignId}/logs`)
      ]);
      setCampaign(campRes.data);
      // Sort logs by newest first based on their latest timestamp
      const sortedLogs = logsRes.data.sort((a, b) => {
        const getLatest = (log) => new Date(log.clickedAt || log.openedAt || log.failedAt || log.deliveredAt || log.sentAt || log.createdAt || 0).getTime();
        return getLatest(b) - getLatest(a);
      });
      setLogs(sortedLogs);
    } catch (error) {
      console.error('Failed to fetch campaign data', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 animate-in fade-in">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Loading Live Tracker...</p>
      </div>
    );
  }

  if (!campaign) return <div className="p-8 text-center text-red-500">Campaign not found</div>;

  // Calculate Funnel Stats
  const stats = {
    TOTAL: logs.length,
    SENT: logs.filter(l => ['SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'FAILED'].includes(l.status)).length,
    DELIVERED: logs.filter(l => ['DELIVERED', 'OPENED', 'CLICKED'].includes(l.status)).length,
    OPENED: logs.filter(l => ['OPENED', 'CLICKED'].includes(l.status)).length,
    CLICKED: logs.filter(l => l.status === 'CLICKED').length,
    FAILED: logs.filter(l => l.status === 'FAILED').length,
    PENDING: logs.filter(l => l.status === 'PENDING').length
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'ALL') return true;
    if (filter === 'PENDING') return log.status === 'PENDING';
    if (filter === 'SENT') return ['SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'FAILED'].includes(log.status);
    if (filter === 'DELIVERED') return ['DELIVERED', 'OPENED', 'CLICKED'].includes(log.status);
    if (filter === 'OPENED') return ['OPENED', 'CLICKED'].includes(log.status);
    if (filter === 'CLICKED') return log.status === 'CLICKED';
    if (filter === 'FAILED') return log.status === 'FAILED';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded-full font-medium border border-gray-150">Pending</span>;
      case 'SENT': return <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium flex items-center gap-1 border border-blue-100"><Send size={12}/> Sent</span>;
      case 'DELIVERED': return <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full font-medium flex items-center gap-1 border border-indigo-100"><CheckCircle2 size={12}/> Delivered</span>;
      case 'OPENED': return <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full font-medium flex items-center gap-1 border border-purple-100"><Eye size={12}/> Opened</span>;
      case 'CLICKED': return <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium flex items-center gap-1 border border-green-100"><MousePointerClick size={12}/> Clicked</span>;
      case 'FAILED': return <span className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full font-medium flex items-center gap-1 border border-red-100"><XCircle size={12}/> Failed</span>;
      default: return null;
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '--';
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getLatestTimestamp = (log) => {
    return formatTime(log.clickedAt || log.openedAt || log.failedAt || log.deliveredAt || log.sentAt || log.createdAt);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('campaigns')}
            className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
          >
            <ArrowLeft size={18} className="text-gray-500" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                campaign.status === 'Running' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                campaign.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                'bg-gray-50 text-gray-700 border-gray-200'
              }`}>
                {campaign.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Audience: <span className="font-semibold text-gray-700">{campaign.audience}</span> • 
              Channel: <span className="font-semibold text-gray-700">{campaign.channel}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <Activity size={16} className={campaign.status === 'Running' ? 'text-blue-500 animate-pulse' : 'text-gray-400'} />
          {campaign.status === 'Running' ? 'Live Monitoring Active' : 'Simulation Complete'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Funnel Stats */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 size={16} className="text-blue-500"/> Funnel Overview
          </h3>
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Total Audience</span>
                <span className="text-lg font-bold text-gray-900">{stats.TOTAL}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-gray-300 h-full w-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-600 flex items-center gap-1.5"><Send size={14}/> Sent</span>
                <span className="text-lg font-bold text-gray-900">{stats.SENT}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${(stats.SENT / Math.max(1, stats.TOTAL)) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-indigo-600 flex items-center gap-1.5"><CheckCircle2 size={14}/> Delivered</span>
                <span className="text-lg font-bold text-gray-900">{stats.DELIVERED}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${(stats.DELIVERED / Math.max(1, stats.TOTAL)) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-purple-600 flex items-center gap-1.5"><Eye size={14}/> Opened</span>
                <span className="text-lg font-bold text-gray-900">{stats.OPENED}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${(stats.OPENED / Math.max(1, stats.TOTAL)) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-green-600 flex items-center gap-1.5"><MousePointerClick size={14}/> Clicked</span>
                <span className="text-lg font-bold text-gray-900">{stats.CLICKED}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${(stats.CLICKED / Math.max(1, stats.TOTAL)) * 100}%` }}></div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm font-medium text-red-600 flex items-center gap-1.5"><XCircle size={14}/> Failed</span>
              <span className="text-lg font-bold text-red-600">{stats.FAILED}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Event Log */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Clock size={16} className="text-indigo-500"/> Live Event Feed
            </h3>
            <div className="flex items-center gap-2">
              {['ALL', 'PENDING', 'SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'FAILED'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    filter === f 
                      ? 'bg-gray-800 text-white border-transparent' 
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {f} {f === 'ALL' ? '' : `(${stats[f] || 0})`}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Channel</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Latest Event</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-500">No events found for this filter.</td>
                    </tr>
                  ) : (
                    filteredLogs.map(log => (
                      <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{log.customer_id?.name || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">{log.customer_id?.email || log.customer_id?.phone}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-medium text-gray-600">{log.channel}</span>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(log.status)}
                        </td>
                        <td className="py-3 px-4 text-right text-sm text-gray-500 font-mono">
                          {getLatestTimestamp(log)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
