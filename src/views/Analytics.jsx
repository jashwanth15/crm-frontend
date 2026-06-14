import React from 'react';
import { BarChart3, TrendingUp, Filter, Sparkles, PieChart, Activity } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Analytics</h1>
          <p className="text-gray-500 mt-1">Campaign performance, revenue, and AI insights.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Last 30 Days</option>
            <option>This Month</option>
            <option>All Time</option>
          </select>
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Activity size={18} className="text-blue-500" />
              Campaign Funnel
            </h3>
            <div className="flex justify-between items-end h-64 px-8 pb-4">
              <div className="flex flex-col items-center gap-2 w-1/5">
                <div className="w-full bg-blue-100 rounded-t-lg relative group h-[100%]">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold text-gray-700">10k</div>
                </div>
                <span className="text-sm font-medium text-gray-600">Sent</span>
              </div>
              <div className="flex flex-col items-center gap-2 w-1/5">
                <div className="w-full bg-blue-200 rounded-t-lg relative group h-[85%]">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold text-gray-700">8.5k</div>
                </div>
                <span className="text-sm font-medium text-gray-600">Delivered</span>
              </div>
              <div className="flex flex-col items-center gap-2 w-1/5">
                <div className="w-full bg-blue-300 rounded-t-lg relative group h-[60%]">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold text-gray-700">6k</div>
                </div>
                <span className="text-sm font-medium text-gray-600">Opened</span>
              </div>
              <div className="flex flex-col items-center gap-2 w-1/5">
                <div className="w-full bg-blue-400 rounded-t-lg relative group h-[35%]">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold text-gray-700">3.5k</div>
                </div>
                <span className="text-sm font-medium text-gray-600">Clicked</span>
              </div>
              <div className="flex flex-col items-center gap-2 w-1/5">
                <div className="w-full bg-blue-500 rounded-t-lg relative group h-[15%]">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold text-gray-700">1.5k</div>
                </div>
                <span className="text-sm font-medium text-gray-600">Purchased</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm">
              <span className="text-gray-500">Overall Conversion Rate</span>
              <span className="font-bold text-green-600">15.0%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center min-h-[250px]">
               <h3 className="font-bold text-gray-900 mb-6 self-start w-full flex items-center gap-2">
                 <PieChart size={18} className="text-indigo-500" />
                 Channel Revenue
               </h3>
               <div className="w-32 h-32 rounded-full border-[16px] border-blue-500 border-r-indigo-500 border-b-purple-500 relative flex items-center justify-center">
                 <span className="text-lg font-bold text-gray-700">100%</span>
               </div>
               <div className="flex gap-4 mt-6 text-sm">
                 <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-blue-500 rounded-full"></div>Email (40%)</div>
                 <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-indigo-500 rounded-full"></div>WA (35%)</div>
                 <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-purple-500 rounded-full"></div>SMS (25%)</div>
               </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[250px]">
              <h3 className="font-bold text-gray-900 mb-4">Top Performing Campaigns</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Diwali VIP Offer</span>
                    <span className="text-gray-500">$12,450</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Win-back Flow</span>
                    <span className="text-gray-500">$8,200</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Welcome Series</span>
                    <span className="text-gray-500">$4,100</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-b from-indigo-50 to-white p-6 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-50">
              <Sparkles size={48} className="text-indigo-300" />
            </div>
            <h3 className="font-bold text-indigo-900 mb-6 flex items-center gap-2 relative z-10">
              <Sparkles size={18} className="text-indigo-600" />
              AI Insights
            </h3>
            
            <div className="space-y-4 relative z-10">
              <div className="bg-white p-4 rounded-xl border border-indigo-50 shadow-sm">
                <p className="text-sm font-medium text-gray-900 mb-2">📉 Open rates dropping on Email</p>
                <p className="text-xs text-gray-600 mb-3">Email open rates have dropped by 12% over the last week. Consider switching your primary channel.</p>
                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800">Switch to WhatsApp →</button>
              </div>

              <div className="bg-white p-4 rounded-xl border border-indigo-50 shadow-sm">
                <p className="text-sm font-medium text-gray-900 mb-2">📈 Inactive users growing</p>
                <p className="text-xs text-gray-600 mb-3">We've identified 320 users who haven't purchased in 60 days. They are highly responsive to discounts.</p>
                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800">Launch Retention Campaign →</button>
              </div>

              <div className="bg-white p-4 rounded-xl border border-indigo-50 shadow-sm">
                <p className="text-sm font-medium text-gray-900 mb-2">💡 Best time to send</p>
                <p className="text-xs text-gray-600 mb-3">Your campaigns perform 24% better when sent between 6 PM - 8 PM on weekdays.</p>
                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800">Update Schedules →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
