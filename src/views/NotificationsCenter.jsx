import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Bell, CheckCheck, Search, Filter, Megaphone, Users, ShoppingCart, Settings,
  ArrowLeft, Inbox, Clock, ChevronDown, Eye, Trash2, RefreshCw
} from 'lucide-react';

const TYPE_CONFIG = {
  campaign: {
    icon: Megaphone,
    label: 'Campaign',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    dot: 'bg-orange-500'
  },
  customer: {
    icon: Users,
    label: 'Customer',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    dot: 'bg-blue-500'
  },
  order: {
    icon: ShoppingCart,
    label: 'Order',
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-100',
    dot: 'bg-green-500'
  },
  system: {
    icon: Settings,
    label: 'System',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    dot: 'bg-purple-500'
  }
};

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'campaign', label: 'Campaigns' },
  { id: 'customer', label: 'Customers' },
  { id: 'order', label: 'Orders' },
  { id: 'system', label: 'System' }
];

function formatTimeAgo(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 60) return 'Just now';
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatFullDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true
  });
}

export default function NotificationsCenter({ onNavigate }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [expandedId, setExpandedId] = useState(null);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to load notifications', err);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => {
    let list = [...notifications];

    // Filter by tab
    if (activeFilter === 'unread') {
      list = list.filter(n => !n.read);
    } else if (activeFilter !== 'all') {
      list = list.filter(n => n.type === activeFilter);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(n => n.text.toLowerCase().includes(q));
    }

    return list;
  }, [notifications, activeFilter, searchQuery]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const typeCounts = useMemo(() => {
    const counts = { campaign: 0, customer: 0, order: 0, system: 0 };
    notifications.forEach(n => { if (counts[n.type] !== undefined) counts[n.type]++; });
    return counts;
  }, [notifications]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/read/${id}`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(n => n._id)));
    }
  };

  const markSelectedAsRead = async () => {
    try {
      await Promise.all([...selectedIds].map(id => axios.put(`/api/notifications/read/${id}`)));
      setNotifications(prev => prev.map(n => selectedIds.has(n._id) ? { ...n, read: true } : n));
      setSelectedIds(new Set());
      toast.success(`Marked ${selectedIds.size} notifications as read`);
    } catch (err) {
      toast.error('Failed to update notifications');
    }
  };

  // Group notifications by date
  const grouped = useMemo(() => {
    const groups = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    filtered.forEach(n => {
      const d = new Date(n.createdAt);
      d.setHours(0, 0, 0, 0);
      let label;
      if (d.getTime() === today.getTime()) label = 'Today';
      else if (d.getTime() === yesterday.getTime()) label = 'Yesterday';
      else label = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

      if (!groups[label]) groups[label] = [];
      groups[label].push(n);
    });

    return Object.entries(groups);
  }, [filtered]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Notifications</h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 animate-pulse">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-gray-500 mt-0.5 text-sm">Stay updated with all your CRM activities</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchNotifications}
            className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-all shadow-sm hover:shadow"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm hover:shadow"
            >
              <CheckCheck size={16} />
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Stats summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(TYPE_CONFIG).map(([type, config]) => {
          const Icon = config.icon;
          return (
            <button
              key={type}
              onClick={() => setActiveFilter(activeFilter === type ? 'all' : type)}
              className={`group relative p-4 rounded-xl border transition-all duration-200 text-left ${
                activeFilter === type
                  ? `${config.bg} ${config.border} shadow-sm`
                  : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg ${config.bg} flex items-center justify-center`}>
                  <Icon size={18} className={config.color} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{typeCounts[type]}</p>
                  <p className="text-xs text-gray-500 font-medium">{config.label}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-1">
            {FILTER_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label}
                {tab.id === 'unread' && unreadCount > 0 && (
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    activeFilter === 'unread' ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'
                  }`}>
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search notifications..."
              className="pl-9 pr-3 py-1.5 w-56 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Bulk actions bar */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-50 border-b border-blue-100 animate-in fade-in slide-in-from-top-2 duration-200">
            <span className="text-sm font-semibold text-blue-700">{selectedIds.size} selected</span>
            <button
              onClick={markSelectedAsRead}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              <Eye size={12} />
              Mark as read
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear selection
            </button>
          </div>
        )}

        {/* Notification list */}
        <div className="max-h-[calc(100vh-380px)] overflow-y-auto">
          {grouped.length > 0 ? (
            grouped.map(([dateLabel, items]) => (
              <div key={dateLabel}>
                <div className="px-5 py-2 bg-gray-50/80 border-b border-gray-100 sticky top-0 z-10">
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-gray-400" />
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{dateLabel}</span>
                    <span className="text-xs text-gray-400">({items.length})</span>
                  </div>
                </div>
                {items.map(n => {
                  const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.system;
                  const Icon = config.icon;
                  const isExpanded = expandedId === n._id;

                  return (
                    <div
                      key={n._id}
                      className={`group flex items-start gap-3 px-5 py-4 border-b border-gray-50 last:border-0 transition-all duration-200 cursor-pointer ${
                        !n.read ? 'bg-blue-50/30 hover:bg-blue-50/50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        if (!n.read) markAsRead(n._id);
                        setExpandedId(isExpanded ? null : n._id);
                      }}
                    >
                      {/* Checkbox */}
                      <div className="pt-0.5" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(n._id)}
                          onChange={() => toggleSelect(n._id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>

                      {/* Type icon */}
                      <div className={`w-9 h-9 rounded-lg ${config.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <Icon size={16} className={config.color} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm leading-relaxed ${!n.read ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                              {n.text}
                            </p>
                            {isExpanded && (
                              <div className="mt-2 text-xs text-gray-500 animate-in fade-in slide-in-from-top-1 duration-200">
                                {formatFullDate(n.createdAt)}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                              {config.label}
                            </span>
                            {!n.read && (
                              <div className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(n.createdAt)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <Inbox size={28} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {searchQuery ? 'No matching notifications' : 'All caught up!'}
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                {searchQuery
                  ? `No notifications match "${searchQuery}". Try a different search term.`
                  : activeFilter === 'unread'
                    ? "You've read all your notifications. Great job!"
                    : 'Notifications will appear here when you create orders, add customers, run campaigns, or update settings.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedIds.size === filtered.length && filtered.length > 0}
                onChange={selectAll}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-xs text-gray-500 font-medium">Select all</span>
            </div>
            <p className="text-xs text-gray-400">
              Showing {filtered.length} of {notifications.length} notifications
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
