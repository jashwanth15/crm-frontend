import React, { useState } from 'react';
import axios from 'axios';

export default function Security() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      return setError('New passwords do not match.');
    }

    setSaving(true);
    try {
      await axios.put('/api/auth/password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      setSuccess('Password updated successfully!');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div className="max-w-2xl animate-in fade-in">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Security</h2>
      
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Change Password</h3>
        
        {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm mb-4">{error}</div>}
        {success && <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input 
              type="password" required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.currentPassword}
              onChange={e => setFormData({...formData, currentPassword: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input 
              type="password" required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.newPassword}
              onChange={e => setFormData({...formData, newPassword: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input 
              type="password" required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.confirmPassword}
              onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="mt-2 bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-black transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Password'}
          </button>
        </form>
      </div>

      <div className="border-t border-gray-200 pt-8">
        <h3 className="font-semibold text-gray-900 mb-2">Logout of all sessions</h3>
        <p className="text-sm text-gray-500 mb-4">You will be required to log back in on all devices.</p>
        <button 
          onClick={handleLogout}
          className="bg-red-50 text-red-600 px-6 py-2 rounded-lg font-medium hover:bg-red-100 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
