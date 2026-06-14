import React, { useState, useEffect } from 'react';
import { Radio, RefreshCw, Activity } from 'lucide-react';
import axios from 'axios';

export default function ChannelService() {
  const [events, setEvents] = useState([]);
  const [isSimulating, setIsSimulating] = useState(true);

  useEffect(() => {
    fetchLogs();
    let interval;
    if (isSimulating) {
      interval = setInterval(() => {
        fetchLogs();
      }, 3000); // Poll real API every 3s
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  const fetchLogs = async () => {
    try {
      const response = await axios.get('/api/communications');
      setEvents(response.data.slice(0, 50)); // keep last 50
    } catch (error) {
      console.error('Error fetching logs', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Purchased': return 'bg-green-100 text-green-700 border-green-200';
      case 'Clicked':
      case 'Opened': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Failed': return 'bg-red-100 text-red-700 border-red-200';
      case 'Delayed':
      case 'Retry': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Radio className="text-blue-600" />
            Channel Service Simulator
          </h1>
          <p className="text-gray-500 mt-1">Real-time simulation of message delivery across channels.</p>
        </div>
        <button 
          onClick={() => setIsSimulating(!isSimulating)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ${
            isSimulating 
              ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {isSimulating ? (
            <>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              Stop Simulation
            </>
          ) : (
            <>
              <Activity size={16} />
              Start Simulator
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Messages Sent</p>
          <p className="text-2xl font-bold text-gray-900">4,250</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Delivery Rate</p>
          <p className="text-2xl font-bold text-green-600">98.2%</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Failures</p>
          <p className="text-2xl font-bold text-red-600">1.8%</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Avg Latency</p>
          <p className="text-2xl font-bold text-gray-900">120ms</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
        {isSimulating && (
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-100 overflow-hidden">
            <div className="w-1/3 h-full bg-blue-500 animate-[pulse_1s_ease-in-out_infinite]"></div>
          </div>
        )}
        
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <RefreshCw size={16} className={isSimulating ? "animate-spin text-blue-500" : "text-gray-400"} />
            Live Event Stream
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-4 font-semibold">Time</th>
                <th className="px-6 py-4 font-semibold">Campaign</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Channel</th>
                <th className="px-6 py-4 font-semibold">Lifecycle Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono text-sm">
              {events.map((e) => (
                <tr key={e._id} className="hover:bg-gray-50 transition-colors animate-in fade-in slide-in-from-top-2">
                  <td className="px-6 py-3 whitespace-nowrap text-gray-500">{new Date(e.createdAt).toLocaleTimeString()}</td>
                  <td className="px-6 py-3 whitespace-nowrap font-medium text-gray-900">{e.campaign_id?.name || 'Unknown'}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-gray-600">{e.customer_id?.name || 'Unknown'}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-gray-600">{e.channel}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-md border ${getStatusColor(e.status)}`}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
