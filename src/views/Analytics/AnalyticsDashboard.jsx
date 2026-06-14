import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, Users, MonitorSmartphone, IndianRupee, Download, Filter, Sparkles, X } from 'lucide-react';
import Papa from 'papaparse';

import DashboardOverview from './DashboardOverview';
import CampaignAnalytics from './CampaignAnalytics';
import CustomerAnalytics from './CustomerAnalytics';
import ChannelAnalytics from './ChannelAnalytics';
import RevenueAnalytics from './RevenueAnalytics';
import AIInsightsPanel from './AIInsightsPanel';

export default function AnalyticsDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filterType, setFilterType] = useState('All Campaigns');
  const [filterChannel, setFilterChannel] = useState('All Channels');
  const [appliedFilters, setAppliedFilters] = useState({ type: 'All Campaigns', channel: 'All Channels' });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('/api/analytics');
        setData(res.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleApplyFilters = () => {
    setIsFiltersOpen(false);
    setLoading(true);
    // Simulate network delay for fetching filtered data
    setTimeout(() => {
      setAppliedFilters({ type: filterType, channel: filterChannel });
      setLoading(false);
    }, 600);
  };

  const filteredData = React.useMemo(() => {
    if (!data) return null;
    let campaigns = [...data.campaignAnalytics];
    let channels = [...data.channelAnalytics];

    if (appliedFilters.type !== 'All Campaigns') {
      if (appliedFilters.type === 'Promotional') {
        campaigns = campaigns.filter(c => (c.name || '').toLowerCase().includes('sale') || (c.name || '').toLowerCase().includes('promo'));
      } else if (appliedFilters.type === 'Transactional') {
        campaigns = campaigns.filter(c => !(c.name || '').toLowerCase().includes('sale') && !(c.name || '').toLowerCase().includes('promo'));
      }
    }

    if (appliedFilters.channel !== 'All Channels') {
      const targetChannel = appliedFilters.channel.toUpperCase();
      campaigns = campaigns.filter(c => (c.channel || '').toUpperCase() === targetChannel);
      channels = channels.filter(c => (c.channel || '').toUpperCase() === targetChannel);
    }

    if (dateRange !== 'All Time') {
      const now = new Date();
      let cutoffDate = new Date();

      if (dateRange === 'Today') {
        cutoffDate.setHours(0, 0, 0, 0);
      } else if (dateRange === 'Last 7 Days') {
        cutoffDate.setDate(now.getDate() - 7);
      } else if (dateRange === 'This Month') {
        cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (dateRange === 'Last 30 Days') {
        cutoffDate.setDate(now.getDate() - 30);
      }
      
      campaigns = campaigns.filter(c => {
        if (!c.createdAt) return true;
        const createdDate = new Date(c.createdAt);
        return createdDate >= cutoffDate;
      });
    }

    let overview = { ...data.overview };
    if (appliedFilters.type !== 'All Campaigns' || appliedFilters.channel !== 'All Channels' || dateRange !== 'All Time') {
      const parseNum = (val) => Number(String(val || 0).replace(/,/g, '')) || 0;
      
      overview.totalCampaigns = campaigns.length;
      overview.totalMessagesSent = campaigns.reduce((acc, c) => acc + parseNum(c.sent), 0);
      
      const originalCampaignRevenue = data.campaignAnalytics.reduce((acc, c) => acc + parseNum(c.revenue), 0);
      const newCampaignRevenue = campaigns.reduce((acc, c) => acc + parseNum(c.revenue), 0);
      overview.totalRevenue = parseNum(data.overview.totalRevenue) - originalCampaignRevenue + newCampaignRevenue;
      
      const originalCampaignConversions = data.campaignAnalytics.reduce((acc, c) => acc + parseNum(c.conversions), 0);
      const newCampaignConversions = campaigns.reduce((acc, c) => acc + parseNum(c.conversions), 0);
      overview.totalConversions = parseNum(data.overview.totalConversions) - originalCampaignConversions + newCampaignConversions;
      
      const totalOpened = campaigns.reduce((acc, c) => acc + parseNum(c.opened), 0);
      const totalClicked = campaigns.reduce((acc, c) => acc + parseNum(c.clicked), 0);
      
      overview.averageOpenRate = overview.totalMessagesSent ? (totalOpened / overview.totalMessagesSent) * 100 : 0;
      overview.averageClickRate = overview.totalMessagesSent ? (totalClicked / overview.totalMessagesSent) * 100 : 0;
    }

    return {
      ...data,
      overview,
      campaignAnalytics: campaigns,
      channelAnalytics: channels
    };
  }, [data, appliedFilters, dateRange]);

  const exportCSV = () => {
    if (!filteredData) return;
    
    // Create CSV based on active tab
    let csvData = [];
    let filename = '';

    if (activeTab === 'campaigns') {
      csvData = filteredData.campaignAnalytics.map(c => ({
        'Campaign Name': c.name,
        'Audience': c.audience,
        'Channel': c.channel,
        'Status': c.status,
        'Sent': c.sent,
        'Delivered': c.delivered,
        'Opened': c.opened,
        'Clicked': c.clicked,
        'Revenue': `₹${c.revenue}`
      }));
      filename = 'campaign_analytics.csv';
    } else if (activeTab === 'channels') {
      csvData = filteredData.channelAnalytics.map(c => ({
        'Channel': c.channel,
        'Total Sent': c.sent,
        'Delivery Rate (%)': c.deliveredRate.toFixed(2),
        'Open Rate (%)': c.openRate.toFixed(2),
        'Click Rate (%)': c.clickRate.toFixed(2),
        'Conversion Rate (%)': c.conversionRate.toFixed(2)
      }));
      filename = 'channel_analytics.csv';
    } else {
      // Default to overview
      csvData = [{
        'Total Campaigns': filteredData.overview.totalCampaigns,
        'Total Messages Sent': filteredData.overview.totalMessagesSent,
        'Total Revenue': `₹${filteredData.overview.totalRevenue}`,
        'Total Conversions': filteredData.overview.totalConversions,
        'Avg Open Rate (%)': filteredData.overview.averageOpenRate.toFixed(2),
        'Avg Click Rate (%)': filteredData.overview.averageClickRate.toFixed(2),
        'Total Customers': filteredData.customerAnalytics.totalCustomers,
        'Active Customers': filteredData.customerAnalytics.activeCustomers,
      }];
      filename = 'analytics_overview.csv';
    }

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] animate-pulse">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Crunching your numbers...</p>
      </div>
    );
  }

  if (!data) {
    return <div className="p-8 text-center text-red-500">Failed to load analytics data.</div>;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'campaigns', label: 'Campaign Analysis', icon: Sparkles },
    { id: 'customers', label: 'Customer Analysis', icon: Users },
    { id: 'channels', label: 'Channel Analysis', icon: MonitorSmartphone },
    { id: 'revenue', label: 'Revenue Analysis', icon: IndianRupee },
  ];

  return (
    <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto flex gap-6">
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Analytics Dashboard</h1>
            <p className="text-gray-500 mt-1">Track performance, measure impact, and uncover AI insights.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Today</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Month</option>
              <option>All Time</option>
            </select>
            
            <div className="relative">
              <button 
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Filter size={16} /> Filters
              </button>

              {isFiltersOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-lg z-20 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Apply Filters</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Campaign Type</label>
                      <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-1.5 border"
                      >
                        <option>All Campaigns</option>
                        <option>Promotional</option>
                        <option>Transactional</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Channel</label>
                      <select 
                        value={filterChannel}
                        onChange={(e) => setFilterChannel(e.target.value)}
                        className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-1.5 border"
                      >
                        <option>All Channels</option>
                        <option>Email</option>
                        <option>SMS</option>
                        <option>WhatsApp</option>
                        <option>RCS</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => setIsFiltersOpen(false)} className="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">Cancel</button>
                    <button onClick={handleApplyFilters} className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">Apply</button>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={exportCSV}
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-white px-4 pt-2 rounded-t-xl">
          <nav className="flex space-x-6 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="bg-white p-6 rounded-b-xl border border-t-0 border-gray-200 shadow-sm min-h-[500px]">
          {activeTab === 'overview' && <DashboardOverview data={filteredData.overview} />}
          {activeTab === 'campaigns' && <CampaignAnalytics data={filteredData.campaignAnalytics} />}
          {activeTab === 'customers' && <CustomerAnalytics data={filteredData.customerAnalytics} />}
          {activeTab === 'channels' && <ChannelAnalytics data={filteredData.channelAnalytics} />}
          {activeTab === 'revenue' && <RevenueAnalytics data={filteredData.revenueAnalytics} overview={filteredData.overview} />}
        </div>
      </div>

      {/* Right Sidebar - AI Insights */}
      <div className="w-80 hidden lg:block shrink-0">
        <AIInsightsPanel data={filteredData} onNavigate={onNavigate} />
      </div>
    </div>
  );
}
