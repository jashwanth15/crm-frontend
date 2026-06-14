import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, Building, MessageSquare, Sparkles, 
  Bell, Shield, Database, Palette, HelpCircle 
} from 'lucide-react';

import Profile from './Profile';
import WorkspaceSettings from './WorkspaceSettings';
import Channels from './Channels';
import AIPreferences from './AIPreferences';
import Notifications from './Notifications';
import Security from './Security';
import DataManagement from './DataManagement';
import Appearance from './Appearance';
import HelpSupport from './HelpSupport';

export default function Settings({ initialTab = 'profile' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [user, setUser] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, workspaceRes] = await Promise.all([
        axios.get('/api/auth/profile'),
        axios.get('/api/workspace')
      ]);
      setUser(userRes.data);
      setWorkspace(workspaceRes.data);
    } catch (err) {
      console.error('Failed to load settings data', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'workspace', label: 'Workspace', icon: Building },
    { id: 'channels', label: 'Communication Channels', icon: MessageSquare },
    { id: 'ai', label: 'AI Preferences', icon: Sparkles },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data Management', icon: Database },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account, workspace, and preferences.</p>
      </div>

      <div className="flex-1 flex bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px]">
        {/* Settings Sidebar */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'profile' && <Profile user={user} onUpdate={fetchData} />}
          {activeTab === 'workspace' && <WorkspaceSettings workspace={workspace} onUpdate={fetchData} />}
          {activeTab === 'channels' && <Channels workspace={workspace} onUpdate={fetchData} />}
          {activeTab === 'ai' && <AIPreferences workspace={workspace} onUpdate={fetchData} />}
          {activeTab === 'notifications' && <Notifications workspace={workspace} onUpdate={fetchData} />}
          {activeTab === 'security' && <Security />}
          {activeTab === 'data' && <DataManagement />}
          {activeTab === 'appearance' && <Appearance workspace={workspace} onUpdate={fetchData} />}
          {activeTab === 'help' && <HelpSupport />}
        </div>
      </div>
    </div>
  );
}
