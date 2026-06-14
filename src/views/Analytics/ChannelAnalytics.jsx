import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ChannelAnalytics({ data }) {
  // Format data for Recharts
  const chartData = data.map(ch => ({
    name: ch.channel,
    Delivery: ch.deliveredRate,
    Open: ch.openRate,
    Click: ch.clickRate,
    Conversion: ch.conversionRate
  }));

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Channel Performance</h3>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-6 h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
            <YAxis tick={{fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(tick) => `${tick}%`} />
            <Tooltip 
              formatter={(value) => `${value.toFixed(1)}%`}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend iconType="circle" />
            <Bar dataKey="Delivery" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Open" fill="#a855f7" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Click" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Conversion" fill="#eab308" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {data.map(ch => (
          <div key={ch.channel} className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
            <div className="font-bold text-gray-900 mb-2 pb-2 border-b border-gray-200">{ch.channel}</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Sent</span>
                <span className="font-medium">{ch.sent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery</span>
                <span className="font-medium text-indigo-600">{ch.deliveredRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Open</span>
                <span className="font-medium text-purple-600">{ch.openRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Click</span>
                <span className="font-medium text-green-600">{ch.clickRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
