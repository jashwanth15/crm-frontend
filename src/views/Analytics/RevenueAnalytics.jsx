import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { IndianRupee, TrendingUp, ShoppingBag } from 'lucide-react';

export default function RevenueAnalytics({ data, overview }) {
  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-6 rounded-xl border border-green-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-lg border border-green-200 flex items-center justify-center text-green-600 shadow-sm">
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-green-700">Total Revenue</p>
            <p className="text-3xl font-bold text-green-900">₹{data.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 shadow-sm">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Average Order Value</p>
            <p className="text-3xl font-bold text-gray-900">₹{data.averageOrderValue.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 shadow-sm">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Conversions</p>
            <p className="text-3xl font-bold text-gray-900">{overview.totalConversions}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-6 h-96">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Trend (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.trend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
            <YAxis tick={{fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(tick) => `₹${tick}`} />
            <RechartsTooltip 
              formatter={(value) => `₹${value}`}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: '#22c55e' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
