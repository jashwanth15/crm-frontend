import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AVAILABLE_CHANNELS = [
  { id: 'Email', name: 'Email', description: 'Send campaigns via email' },
  { id: 'SMS', name: 'SMS', description: 'Send text messages to customers' },
  { id: 'WhatsApp', name: 'WhatsApp', description: 'Rich messaging via WhatsApp Business' },
  { id: 'RCS', name: 'RCS', description: 'Rich Communication Services' }
];

export default function Channels({ workspace, onUpdate }) {
  const [channels, setChannels] = useState(workspace?.channels || []);
  const [saving, setSaving] = useState(false);

  const toggleChannel = async (channelId) => {
    const isEnabled = channels.includes(channelId);
    let newChannels = [];
    if (isEnabled) {
      newChannels = channels.filter(id => id !== channelId);
    } else {
      newChannels = [...channels, channelId];
    }
    
    setChannels(newChannels);
    setSaving(true);
    try {
      await axios.put('/api/workspace', { channels: newChannels });
      await onUpdate();
    } catch (err) {
      toast.error('Failed to update channels');
      setChannels(channels); // revert
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl animate-in fade-in">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Communication Channels</h2>
      <p className="text-gray-500 text-sm mb-6">Enable or disable channels for your marketing campaigns.</p>
      
      <div className="space-y-4">
        {AVAILABLE_CHANNELS.map(channel => {
          const isEnabled = channels.includes(channel.id);
          return (
            <div key={channel.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{channel.name}</h3>
                  <span className={`px-2 py-0.5 text-xs font-bold rounded uppercase ${isEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {isEnabled ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{channel.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={isEnabled}
                  onChange={() => toggleChannel(channel.id)}
                  disabled={saving}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
