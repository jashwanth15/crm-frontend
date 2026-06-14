import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Appearance({ workspace, onUpdate }) {
  const [appearance, setAppearance] = useState(workspace?.appearance || { theme: 'Light', language: 'English' });
  const [saving, setSaving] = useState(false);

  const handleChange = async (field, value) => {
    const newAppearance = { ...appearance, [field]: value };
    setAppearance(newAppearance);
    
    // Apply theme immediately to UI
    if (field === 'theme') {
      if (value === 'Dark') {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
      }
    }

    setSaving(true);
    try {
      await axios.put('/api/workspace', { appearance: newAppearance });
      await onUpdate();
    } catch (err) {
      toast.error('Failed to update appearance');
      setAppearance(appearance);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl animate-in fade-in">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Appearance</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Theme</h3>
          <div className="flex gap-4">
            {['Light', 'Dark', 'System'].map(theme => (
              <button
                key={theme}
                onClick={() => handleChange('theme', theme)}
                className={`flex-1 py-3 px-4 border rounded-xl font-medium transition ${
                  appearance.theme === theme 
                    ? 'border-blue-600 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
