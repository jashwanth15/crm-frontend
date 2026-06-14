import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Sparkles, User, Settings, LogOut, CheckCheck, Megaphone, Users, ShoppingCart } from 'lucide-react';
import axios from 'axios';

export default function TopNav({ openCopilot, onLogout, onNavigate }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return;

      if (query.includes('order') || query.includes('oreder')) {
        onNavigate('orders');
      } else if (query.includes('customer')) {
        onNavigate('customers');
      } else if (query.includes('campaign')) {
        onNavigate('campaigns');
      } else if (query.includes('audience')) {
        onNavigate('audience');
      } else if (query.includes('setting')) {
        onNavigate('settings');
      } else if (query.includes('notification')) {
        onNavigate('notifications');
      } else if (query.includes('dashboard') || query.includes('home')) {
        onNavigate('dashboard');
      } else {
        openCopilot();
      }
      
      setSearchQuery('');
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/auth/profile');
      setUser(res.data);
    } catch (err) {
      console.error('Failed to load user profile in TopNav', err);
    }
  };

  useEffect(() => {
    // Attempt to load the user profile for the avatar
    fetchUser();
    window.addEventListener('profile-updated', fetchUser);

    // Close dropdowns on click outside
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('profile-updated', fetchUser);
    };
  }, []);

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'JD';

  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to load notifications in TopNav', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.put(`/api/notifications/read/${id}`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const markAllAsRead = async (e) => {
    e.stopPropagation();
    try {
      await axios.put('/api/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm relative">
      <div className="flex items-center">
        <div className="flex items-center gap-3 mr-12 w-48">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-xl">X</span>
          </div>
          <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">XENO</span>
        </div>
        
        <div className="relative w-96 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all"
            placeholder="Search customers, campaigns, or ask AI..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4 relative">


        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false); }}
            className={`relative p-2 transition-colors rounded-full hover:bg-gray-100 ${isNotificationsOpen ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'}`}
            title="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 block h-4 w-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-155">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                <span className="text-sm font-bold text-gray-900">Recent Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                  >
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
              </div>
              
              <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map(n => {
                    let Icon = Bell;
                    let iconColor = 'text-purple-600';
                    let iconBg = 'bg-purple-50';
                    if (n.type === 'campaign') { Icon = Megaphone; iconColor = 'text-orange-600'; iconBg = 'bg-orange-50'; }
                    else if (n.type === 'customer') { Icon = Users; iconColor = 'text-blue-600'; iconBg = 'bg-blue-50'; }
                    else if (n.type === 'order') { Icon = ShoppingCart; iconColor = 'text-green-600'; iconBg = 'bg-green-50'; }

                    return (
                      <div 
                        key={n._id} 
                        className={`flex items-start gap-3 p-3 transition-colors hover:bg-gray-50/80 relative cursor-pointer ${!n.read ? 'bg-blue-50/10' : ''}`}
                        onClick={() => {
                          if (!n.read) axios.put(`/api/notifications/read/${n._id}`).then(() => fetchNotifications());
                          onNavigate('notifications');
                          setIsNotificationsOpen(false);
                        }}
                      >
                        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                          <Icon size={14} className={iconColor} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-relaxed ${!n.read ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>
                            {n.text}
                          </p>
                          <span className="text-[10px] text-gray-400 mt-1 block">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {!n.read && (
                          <button 
                            onClick={(e) => markAsRead(n._id, e)}
                            className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0 hover:scale-150 transition-transform"
                            title="Mark as read"
                          />
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-gray-400 text-xs">
                    No notifications yet.
                  </div>
                )}
              </div>

              <button 
                onClick={() => { onNavigate('notifications'); setIsNotificationsOpen(false); }}
                className="w-full text-center py-2.5 border-t border-gray-50 text-xs font-bold text-blue-600 hover:bg-gray-50/50 hover:text-blue-700 transition-colors block"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => { setIsProfileOpen(!isProfileOpen); }}
            className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-sm cursor-pointer border-2 border-white ring-1 ring-gray-100 overflow-hidden"
          >
            {user?.profilePhoto ? (
              <img src={user.profilePhoto} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden z-50">
              <button 
                onClick={() => { onNavigate('settings', 'profile'); setIsProfileOpen(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <User size={16} /> My Profile
              </button>
              <button 
                onClick={() => { onNavigate('settings'); setIsProfileOpen(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Settings size={16} /> Settings
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button 
                onClick={() => { onLogout(); setIsProfileOpen(false); }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
