import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Users, UserCheck, UserMinus, Star } from 'lucide-react';

export default function CustomerAnalytics({ data }) {
  const pieData = [
    { name: 'Active Customers', value: data.activeCustomers },
    { name: 'Inactive Customers', value: data.inactiveCustomers }
  ];

  const COLORS = ['#3b82f6', '#94a3b8']; // Blue for active, Slate for inactive

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 shadow-sm">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Customers</p>
            <p className="text-2xl font-bold text-gray-900">{data.totalCustomers}</p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-lg border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-600">Active (30 Days)</p>
            <p className="text-2xl font-bold text-blue-900">{data.activeCustomers}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm">
            <UserMinus size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Inactive Customers</p>
            <p className="text-2xl font-bold text-gray-700">{data.inactiveCustomers}</p>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-lg border border-yellow-200 flex items-center justify-center text-yellow-500 shadow-sm">
            <Star size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-yellow-600">VIP Customers</p>
            <p className="text-2xl font-bold text-yellow-900">{data.vipCustomers}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-100 rounded-xl p-6 h-80">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Customer Activity</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Retention Overview</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Repeat Purchase Rate</span>
                <span className="font-bold text-blue-600">42%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[42%]"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Churn Risk (Unopened &gt; 3 msgs)</span>
                <span className="font-bold text-red-500">18%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full w-[18%]"></div>
              </div>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mt-6">
              <h4 className="font-semibold text-indigo-900 mb-1">AI Recommendation</h4>
              <p className="text-sm text-indigo-800">Your VIP segment hasn't been targeted in 14 days. Creating a 'VIP Exclusive' campaign could boost your revenue by an estimated 15% this week.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
