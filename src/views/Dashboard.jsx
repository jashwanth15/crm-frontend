import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, ShoppingCart, IndianRupee, Megaphone, Sparkles, Target, MessageSquare, TrendingUp, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard({ onNavigate }) {
  const [workspace, setWorkspace] = useState(null);
  const [statsData, setStatsData] = useState({ customerCount: 0, orderCount: 0, revenue: 0, campaignCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (timeRange === 'custom' && (!customStart || !customEnd)) {
        return; // Wait for both dates
      }
      try {
        const [wsRes, statsRes] = await Promise.all([
          axios.get('/api/workspace'),
          axios.get(`/api/workspace/stats?range=${timeRange}${timeRange === 'custom' ? `&start=${customStart}&end=${customEnd}` : ''}`)
        ]);
        setWorkspace(wsRes.data);
        setStatsData(statsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [timeRange, customStart, customEnd]);

  const stats = [
    { label: 'Total Customers', value: statsData.customerCount.toLocaleString(), icon: Users },
    { label: 'Total Orders', value: statsData.orderCount.toLocaleString(), icon: ShoppingCart },
    { label: 'Revenue', value: `₹${statsData.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: IndianRupee },
    { label: 'Active Campaigns', value: (statsData.campaignCount || 0).toLocaleString(), icon: Megaphone },
  ];

  // Fallback to a flatline if backend hasn't updated or returns no data
  const defaultChartData = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { name: d.toLocaleDateString('en-US', { weekday: 'short' }), revenue: 0 };
  });

  const chartData = (statsData.trendData && statsData.trendData.length > 0) 
    ? statsData.trendData 
    : defaultChartData;

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{workspace?.businessName || 'Your Workspace'}</h1>
          <p className="text-gray-500 mt-1">Let's get your CRM set up and running.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="group relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <Icon size={26} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium tracking-wide uppercase mb-1">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700">{stat.value}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="font-extrabold text-gray-900 text-xl tracking-tight">Revenue Overview</h3>
                <p className="text-sm text-gray-500 mt-1">Your store's performance over time</p>
              </div>
              <div className="flex items-center gap-3">
                {timeRange === 'custom' && (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                    <input 
                      type="date" 
                      value={customStart} 
                      onChange={e => setCustomStart(e.target.value)} 
                      className="bg-white border border-gray-200 text-gray-700 px-2 py-1.5 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                    <span className="text-gray-400 font-medium">to</span>
                    <input 
                      type="date" 
                      value={customEnd} 
                      onChange={e => setCustomEnd(e.target.value)} 
                      className="bg-white border border-gray-200 text-gray-700 px-2 py-1.5 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                )}
                <select 
                  value={timeRange} 
                  onChange={e => setTimeRange(e.target.value)}
                  className="bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="12m">Last 12 Months</option>
                  <option value="5y">Last 5 Years</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
            </div>
            
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
            <h3 className="font-extrabold text-gray-900 mb-6 text-xl tracking-tight">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => onNavigate('customers')} className="group p-4 border border-gray-100 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-blue-50 hover:border-blue-100 transition-all duration-300 shadow-sm hover:shadow">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <Users size={20} className="text-blue-500 group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-bold text-gray-700 group-hover:text-blue-700 transition-colors">Add Customer</span>
              </button>
              
              <button onClick={() => onNavigate('orders')} className="group p-4 border border-gray-100 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-green-50 hover:border-green-100 transition-all duration-300 shadow-sm hover:shadow">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-600 transition-colors">
                  <ShoppingCart size={20} className="text-green-500 group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-bold text-gray-700 group-hover:text-green-700 transition-colors">Add Order</span>
              </button>
              
              <button onClick={() => onNavigate('audience')} className="group p-4 border border-gray-100 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-purple-50 hover:border-purple-100 transition-all duration-300 shadow-sm hover:shadow">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                  <Target size={20} className="text-purple-500 group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-bold text-gray-700 group-hover:text-purple-700 transition-colors">Create Audience</span>
              </button>
              
              <button onClick={() => onNavigate('campaigns')} className="group p-4 border border-gray-100 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-orange-50 hover:border-orange-100 transition-all duration-300 shadow-sm hover:shadow">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                  <Megaphone size={20} className="text-orange-500 group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-bold text-gray-700 group-hover:text-orange-700 transition-colors">Create Campaign</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
