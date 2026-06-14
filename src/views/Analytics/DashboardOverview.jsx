import React from 'react';
import { Send, CheckCircle2, Eye, MousePointerClick, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardOverview({ data }) {
  // Simple mock data for the funnel since we don't have time-series funnel out of the box
  const funnelData = [
    { name: 'Sent', value: data.totalMessagesSent },
    { name: 'Delivered', value: Math.round(data.totalMessagesSent * 0.9) },
    { name: 'Opened', value: Math.round(data.totalMessagesSent * 0.6) },
    { name: 'Clicked', value: Math.round(data.totalMessagesSent * 0.2) },
    { name: 'Purchased', value: data.totalConversions }
  ];

  return (
    <div className="space-y-8">
      {/* Top Level KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Campaigns</p>
          <p className="text-2xl font-bold text-gray-900">{data.totalCampaigns}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Messages Sent</p>
          <p className="text-2xl font-bold text-gray-900">{data.totalMessagesSent.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">₹{data.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Conversions</p>
          <p className="text-2xl font-bold text-gray-900">{data.totalConversions}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Avg Open Rate</p>
          <p className="text-2xl font-bold text-purple-600">{data.averageOpenRate.toFixed(1)}%</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Avg Click Rate</p>
          <p className="text-2xl font-bold text-blue-600">{data.averageClickRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Visual Funnel Representation */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Marketing Funnel</h3>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={funnelData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="value" stroke="#2563eb" fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Funnel Steps below chart */}
        <div className="grid grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-100 text-center">
          <div>
            <div className="mx-auto bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center text-blue-600 mb-2"><Send size={16}/></div>
            <p className="text-xs font-semibold text-gray-500">SENT</p>
            <p className="font-bold text-gray-900">{funnelData[0].value}</p>
          </div>
          <div>
            <div className="mx-auto bg-indigo-100 w-8 h-8 rounded-full flex items-center justify-center text-indigo-600 mb-2"><CheckCircle2 size={16}/></div>
            <p className="text-xs font-semibold text-gray-500">DELIVERED</p>
            <p className="font-bold text-gray-900">{funnelData[1].value}</p>
          </div>
          <div>
            <div className="mx-auto bg-purple-100 w-8 h-8 rounded-full flex items-center justify-center text-purple-600 mb-2"><Eye size={16}/></div>
            <p className="text-xs font-semibold text-gray-500">OPENED</p>
            <p className="font-bold text-gray-900">{funnelData[2].value}</p>
          </div>
          <div>
            <div className="mx-auto bg-green-100 w-8 h-8 rounded-full flex items-center justify-center text-green-600 mb-2"><MousePointerClick size={16}/></div>
            <p className="text-xs font-semibold text-gray-500">CLICKED</p>
            <p className="font-bold text-gray-900">{funnelData[3].value}</p>
          </div>
          <div>
            <div className="mx-auto bg-emerald-100 w-8 h-8 rounded-full flex items-center justify-center text-emerald-600 mb-2"><DollarSign size={16}/></div>
            <p className="text-xs font-semibold text-gray-500">PURCHASED</p>
            <p className="font-bold text-gray-900">{funnelData[4].value}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
