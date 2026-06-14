import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AI_FEATURES = [
  { id: 'recommendations', name: 'AI Recommendations', description: 'Get proactive tips on how to improve your marketing strategy.' },
  { id: 'messageGeneration', name: 'AI Message Generation', description: 'Automatically generate high-converting message copy.' },
  { id: 'audienceSuggestions', name: 'AI Audience Suggestions', description: 'Let AI build segments based on natural language.' },
  { id: 'campaignSuggestions', name: 'AI Campaign Suggestions', description: 'Receive ideas for new campaigns based on customer behavior.' },
  { id: 'analytics', name: 'AI Analytics', description: 'Get AI-powered insights and summaries on your data.' }
];

export default function AIPreferences({ workspace, onUpdate }) {
  const [prefs, setPrefs] = useState(workspace?.aiPreferences || {});
  const [saving, setSaving] = useState(false);

  const togglePref = async (id) => {
    const newPrefs = { ...prefs, [id]: !prefs[id] };
    setPrefs(newPrefs);
    setSaving(true);
    try {
      await axios.put('/api/workspace', { aiPreferences: newPrefs });
      await onUpdate();
    } catch (err) {
      toast.error('Failed to update AI preferences');
      setPrefs(prefs);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl animate-in fade-in">
      <h2 className="text-xl font-bold text-gray-900 mb-2">AI Preferences</h2>
      <p className="text-gray-500 text-sm mb-6">Customize how Xeno AI Copilot assists you across the platform.</p>
      
      <div className="space-y-4">
        {AI_FEATURES.map(feature => {
          const isEnabled = prefs[feature.id] !== false; // default true
          return (
            <div key={feature.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
              <div>
                <h3 className="font-semibold text-gray-900">{feature.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={isEnabled}
                  onChange={() => togglePref(feature.id)}
                  disabled={saving}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
