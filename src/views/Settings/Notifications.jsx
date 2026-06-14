import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const NOTIFICATION_TYPES = [
  { id: 'campaignAlerts', name: 'Campaign Alerts', description: 'Get notified when a campaign starts, completes, or fails.' },
  { id: 'customerAlerts', name: 'Customer Alerts', description: 'Alerts for VIP customer activities or churn risks.' },
  { id: 'orderAlerts', name: 'Order Alerts', description: 'Notifications for significant orders or refunds.' },
  { id: 'aiRecommendations', name: 'AI Recommendations', description: 'Weekly digests and proactive marketing ideas from AI.' },
  { id: 'emailNotifications', name: 'Email Notifications', description: 'Receive alerts via your registered email address.' },
  { id: 'browserNotifications', name: 'Browser Notifications', description: 'Show push notifications in your web browser.' }
];

export default function Notifications({ workspace, onUpdate }) {
  const [notifs, setNotifs] = useState(workspace?.notifications || {});
  const [inboxList, setInboxList] = useState([]);
  const [saving, setSaving] = useState(false);

  const fetchInbox = async () => {
    try {
      const res = await axios.get('/api/notifications');
      setInboxList(res.data);
    } catch (err) {
      console.error('Failed to load notifications in Notifications view', err);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      fetchInbox();
      toast.success('Marked all as read');
    } catch (err) {
      console.error(err);
      toast.error('Failed to mark all as read');
    }
  };

  const toggleNotif = async (id) => {
    const newNotifs = { ...notifs, [id]: !notifs[id] };
    setNotifs(newNotifs);
    setSaving(true);
    try {
      await axios.put('/api/workspace', { notifications: newNotifs });
      await onUpdate();
    } catch (err) {
      toast.error('Failed to update notifications');
      setNotifs(notifs);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl animate-in fade-in space-y-10">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Notifications Inbox</h2>
        <p className="text-gray-500 text-sm mb-6">View all your recent alerts, AI suggestions, and system messages.</p>
        
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {inboxList.length > 0 ? (
            inboxList.map(n => (
              <div key={n._id} className={`p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors flex items-start gap-4 ${!n.read ? 'bg-blue-50/30' : ''}`}>
                <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${!n.read ? 'bg-blue-600' : 'bg-transparent'}`} />
                <div className="flex-1">
                  <p className={`text-sm ${!n.read ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>{n.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(n.createdAt)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 text-sm">
              No notifications yet.
            </div>
          )}
          {inboxList.filter(n => !n.read).length > 0 && (
            <div className="p-3 text-center border-t border-gray-100 bg-gray-50">
              <button 
                onClick={markAllAsRead}
                className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Notification Preferences</h2>
        <p className="text-gray-500 text-sm mb-6">Manage how and when you want to be alerted.</p>
        
        <div className="space-y-4">
        {NOTIFICATION_TYPES.map(type => {
          const isEnabled = notifs[type.id] !== false; // Default true (except browser maybe, handled via DB schema)
          return (
            <div key={type.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
              <div>
                <h3 className="font-semibold text-gray-900">{type.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{type.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={isEnabled}
                  onChange={() => toggleNotif(type.id)}
                  disabled={saving}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
