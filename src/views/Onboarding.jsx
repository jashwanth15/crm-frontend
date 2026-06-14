import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Building2, MessageSquare, Target, CheckCircle2, ArrowRight, ArrowLeft, User } from 'lucide-react';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    userName: '',
    jobTitle: '',
    userPhone: '',
    businessName: '',
    category: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    channels: [],
    goals: []
  });

  const categories = ['Fashion', 'Beauty', 'Electronics', 'Restaurant', 'Coffee Shop', 'Jewellery', 'Sports', 'Healthcare', 'Other'];
  const channelOptions = ['WhatsApp', 'Email', 'SMS', 'RCS'];
  const goalOptions = [
    'Increase Sales', 
    'Customer Retention', 
    'Recover Inactive Customers', 
    'Increase Repeat Purchases', 
    'Build Loyalty', 
    'Seasonal Promotions'
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/api/auth/profile');
        setFormData(prev => ({
          ...prev,
          userName: data.name || '',
          email: data.email || ''
        }));
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    };
    fetchProfile();
  }, []);

  const handleChannelToggle = (channel) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel) 
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  const handleGoalToggle = (goal) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);
    try {
      // First update the user profile
      await axios.put('/api/auth/profile', {
        name: formData.userName,
        jobTitle: formData.jobTitle,
        phone: formData.userPhone
      });
      // Then create the workspace
      await axios.post('/api/workspace', formData);
      onComplete();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create workspace');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl mb-6">
            <span className="text-white font-extrabold text-4xl">X</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome to Xeno AI CRM
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Let's set up your business. This will only take a minute.
          </p>
        </div>

        <div className="bg-white py-10 px-8 shadow-2xl shadow-gray-200/50 sm:rounded-3xl border border-gray-100">
          
          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-12 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full -z-10"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full -z-10 transition-all duration-500"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
            
            {[
              { num: 1, icon: User, label: 'Profile' },
              { num: 2, icon: Building2, label: 'Business' },
              { num: 3, icon: MessageSquare, label: 'Channels' },
              { num: 4, icon: Target, label: 'Goals' }
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center gap-2 bg-white px-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= s.num ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-gray-100 text-gray-400'}`}>
                  {step > s.num ? <CheckCircle2 size={20} /> : <s.icon size={20} />}
                </div>
                <span className={`text-xs font-medium ${step >= s.num ? 'text-gray-900' : 'text-gray-400'}`}>{s.label}</span>
              </div>
            ))}
          </div>

          {error && <div className="mb-6 text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">{error}</div>}

          {/* Step 1: Personal & Professional Profile */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Personal & Professional Details</h3>
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input required type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" value={formData.userName} onChange={e => setFormData({...formData, userName: e.target.value})} placeholder="e.g. John Doe" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title <span className="text-red-500">*</span></label>
                  <input required type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} placeholder="e.g. Marketing Manager" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                  <input required type="tel" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" value={formData.userPhone} onChange={e => setFormData({...formData, userPhone: e.target.value})} placeholder="+1 234 567 890" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Business Details */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Business Information</h3>
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                  <input required type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} placeholder="e.g. ABC Fashion" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-700" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
                  <input type="email" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="contact@abcfashion.com" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+1 234 567 890" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input type="url" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} placeholder="https://abcfashion.com" />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Marketing Preferences */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Marketing Preferences</h3>
              <p className="text-gray-500 mb-6">Which channels do you want to use to reach your customers?</p>
              <div className="grid grid-cols-2 gap-4">
                {channelOptions.map(channel => (
                  <label key={channel} className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${formData.channels.includes(channel) ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input type="checkbox" className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" checked={formData.channels.includes(channel)} onChange={() => handleChannelToggle(channel)} />
                    <span className="ml-3 font-medium text-gray-900">{channel}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Business Goals */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Business Goals</h3>
              <p className="text-gray-500 mb-6">What do you want to achieve with Xeno AI?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {goalOptions.map(goal => (
                  <label key={goal} className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${formData.goals.includes(goal) ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" checked={formData.goals.includes(goal)} onChange={() => handleGoalToggle(goal)} />
                    <span className="ml-3 font-medium text-gray-900">{goal}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ArrowLeft size={18} /> Back
              </button>
            ) : <div></div>}

            {step < 4 ? (
              <button 
                onClick={() => setStep(step + 1)}
                disabled={(step === 1 && (!formData.userName || !formData.jobTitle || !formData.userPhone)) || (step === 2 && !formData.businessName)}
                className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 shadow-sm"
              >
                Continue <ArrowRight size={18} />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={isLoading || formData.goals.length === 0}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-2.5 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {isLoading ? 'Creating Workspace...' : 'Finish Setup'} <CheckCircle2 size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
