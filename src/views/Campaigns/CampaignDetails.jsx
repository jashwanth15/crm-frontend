import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Megaphone, Users, Smartphone, BarChart3, Clock, CheckCircle2, X, Send, Eye, MousePointerClick, XCircle, Timer, Trash2, Activity } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import toast from 'react-hot-toast';

export default function CampaignDetails({ campaignId, onNavigate }) {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [logs, setLogs] = useState([]);
  const [showConfig, setShowConfig] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'danger', title: '', message: '', confirmText: '', action: null });

  const closeConfirm = () => setConfirmModal({ ...confirmModal, isOpen: false });

  const handleDelete = () => {
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: 'Delete Campaign',
      message: 'Are you sure you want to delete this campaign? This action cannot be undone.',
      confirmText: 'Delete',
      action: async () => {
        try {
          await axios.delete(`/api/campaigns/${campaignId}`);
          toast.success('Campaign deleted');
          onNavigate('campaigns');
        } catch (err) {
          toast.error('Failed to delete campaign');
          console.error(err);
        }
      }
    });
  };

  const fetchData = async (isPolling = false) => {
    try {
      const campRes = await axios.get(`/api/campaigns/${campaignId}`);
      setCampaign(campRes.data);
      
      if (campRes.data.status !== 'Draft') {
        const logsRes = await axios.get(`/api/campaigns/${campaignId}/logs`);
        const sortedLogs = logsRes.data.sort((a, b) => {
          const getLatest = (log) => new Date(log.clickedAt || log.openedAt || log.failedAt || log.deliveredAt || log.sentAt || log.createdAt || 0).getTime();
          return getLatest(b) - getLatest(a);
        });
        setLogs(sortedLogs);
      }
    } catch (error) {
      console.error('Error fetching campaign details', error);
    } finally {
      if (!isPolling) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!campaignId) return;
    
    fetchData();

    // Poll every 3 seconds to get live performance updates while campaign is running/completed
    const intervalId = setInterval(() => {
      fetchData(true);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [campaignId]);

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading campaign details...</div>;
  if (!campaign) return <div className="p-8 text-center text-red-500">Failed to load campaign</div>;

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
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                campaign.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 
                campaign.status === 'Running' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                'bg-gray-50 text-gray-700 border-gray-200'
              }`}>
                {campaign.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Audience: <span className="font-semibold text-gray-700">{campaign.audience || 'All Customers'}</span> • Channel: <span className="font-semibold text-gray-700">{campaign.channel || 'N/A'}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {campaign.status === 'Draft' ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onNavigate('edit-campaign', campaign._id)} 
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm transition-colors"
              >
                Edit
              </button>
              <button 
                onClick={() => onNavigate('campaign-launch', campaign._id)} 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 shadow-sm transition-colors flex items-center gap-2"
              >
                <Send size={16} /> Launch
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
              <Activity size={16} className={campaign.status === 'Running' ? 'text-blue-500 animate-pulse' : 'text-gray-400'} />
              {campaign.status === 'Running' ? 'Live Monitoring Active' : 'Simulation Complete'}
            </div>
          )}
        </div>
      </div>

      {campaign.status === 'Draft' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Configuration</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-blue-50 p-2 rounded-lg"><Megaphone size={18} className="text-blue-600" /></div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Objective</p>
                    <p className="font-semibold text-gray-900">{campaign.objective || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-purple-50 p-2 rounded-lg"><Users size={18} className="text-purple-600" /></div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Audience</p>
                    <p className="font-semibold text-gray-900">{campaign.audience || 'All Customers'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-green-50 p-2 rounded-lg"><Smartphone size={18} className="text-green-600" /></div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Channel</p>
                    <p className="font-semibold text-gray-900">{campaign.channel || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center">
              <h3 className="text-lg font-bold text-gray-900 mb-4 w-full">Message Details</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-150 w-full max-w-sm shadow-sm relative">
                {campaign.channel === 'Email' && campaign.message?.subject && (
                  <div className="border-b border-gray-200 pb-3 mb-3">
                    <span className="text-gray-500 text-sm">Subject:</span> <span className="font-medium text-gray-900">{campaign.message.subject}</span>
                  </div>
                )}
                {(campaign.channel === 'WhatsApp' || campaign.channel === 'RCS') && campaign.message?.imageUrl && (
                  <div className="mb-3 rounded-lg overflow-hidden border border-gray-200/50 bg-white">
                    <img src={campaign.message.imageUrl} alt="Campaign Media" className="w-full h-48 object-cover" />
                  </div>
                )}
                <p className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
                  {campaign.message?.body || 'No message body provided.'}
                </p>
                {(campaign.channel === 'WhatsApp' || campaign.channel === 'RCS') && campaign.message?.buttons?.length > 0 && (
                  <div className="mt-4 space-y-2 border-t pt-4">
                    {campaign.message.buttons.map((btn, idx) => (
                      <a 
                        key={idx} 
                        href={btn.url || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-center text-sm font-medium rounded-lg border border-blue-100 transition-colors"
                      >
                        {btn.text || 'Untitled Button'}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock size={18} className="text-gray-500" /> Timeline
              </h3>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                 <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-4 h-4 rounded-full border border-white bg-blue-500 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-white p-3 rounded-lg border border-slate-200 shadow-sm ml-4 md:ml-0 md:group-odd:mr-4 md:group-even:ml-4 text-xs text-slate-500">
                      <span className="font-semibold text-slate-900">Campaign Created</span><br/>
                      {new Date(campaign.createdAt).toLocaleString()}
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
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
      )}

      {/* Collapsible Campaign configuration details at bottom for running/completed campaigns */}
      {campaign.status !== 'Draft' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <button 
            onClick={() => setShowConfig(!showConfig)}
            className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 border-b border-gray-200 hover:bg-gray-100/70 transition-colors"
          >
            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <Megaphone size={16} className="text-gray-500" /> Campaign Configuration & Message Details
            </span>
            <span className="text-xs text-blue-600 font-medium">{showConfig ? 'Hide Details' : 'Show Details'}</span>
          </button>
          {showConfig && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top duration-200">
              {/* Configuration */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Configuration</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-blue-50 p-2 rounded-lg"><Megaphone size={18} className="text-blue-600" /></div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Objective</p>
                      <p className="font-semibold text-gray-900">{campaign.objective || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-purple-50 p-2 rounded-lg"><Users size={18} className="text-purple-600" /></div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Audience</p>
                      <p className="font-semibold text-gray-900">{campaign.audience || 'All Customers'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-green-50 p-2 rounded-lg"><Smartphone size={18} className="text-green-600" /></div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Channel</p>
                      <p className="font-semibold text-gray-900">{campaign.channel || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Message Details */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Message Details</h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-150 w-full max-w-sm shadow-sm relative">
                  {campaign.channel === 'Email' && campaign.message?.subject && (
                    <div className="border-b border-gray-200 pb-3 mb-3">
                      <span className="text-gray-500 text-sm">Subject:</span> <span className="font-medium text-gray-900">{campaign.message.subject}</span>
                    </div>
                  )}
                  {(campaign.channel === 'WhatsApp' || campaign.channel === 'RCS') && campaign.message?.imageUrl && (
                    <div className="mb-3 rounded-lg overflow-hidden border border-gray-200/50 bg-white">
                      <img src={campaign.message.imageUrl} alt="Campaign Media" className="w-full h-48 object-cover" />
                    </div>
                  )}
                  <p className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
                    {campaign.message?.body || 'No message body provided.'}
                  </p>
                  {(campaign.channel === 'WhatsApp' || campaign.channel === 'RCS') && campaign.message?.buttons?.length > 0 && (
                    <div className="mt-4 space-y-2 border-t pt-4">
                      {campaign.message.buttons.map((btn, idx) => (
                        <a 
                          key={idx} 
                          href={btn.url || '#'} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-center text-sm font-medium rounded-lg border border-blue-100 transition-colors"
                        >
                          {btn.text || 'Untitled Button'}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end pt-6 border-t border-gray-200 mt-8">
        <button 
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors border border-red-100"
        >
          <Trash2 size={16} /> Delete Campaign
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
