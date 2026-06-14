import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function CampaignAnalytics({ data }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Campaign Performance</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search campaigns..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Campaign Name</th>
              <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Audience</th>
              <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Channel</th>
              <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Sent</th>
              <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Delivered</th>
              <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Opened</th>
              <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Clicked</th>
              <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-8 text-center text-gray-500">No campaigns found.</td>
              </tr>
            ) : (
              filteredData.map((camp) => (
                <tr key={camp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{camp.name}</div>
                    <div className="text-xs text-gray-500">{camp.status}</div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{camp.audience || 'All Customers'}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">{camp.channel}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">{camp.sent.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">{camp.delivered.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">{camp.opened.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">{camp.clicked.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-green-600 text-right">₹{camp.revenue.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
