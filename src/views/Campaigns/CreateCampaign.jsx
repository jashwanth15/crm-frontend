import React, { useState } from 'react';
import axios from 'axios';
import { ArrowRight, ArrowLeft, CheckCircle2, Megaphone, Users, Smartphone, MessageSquare, Eye, Send, Plus, Trash, Image as ImageIcon, Mail, MessageCircle, Sparkles, Wand2 } from 'lucide-react';
import toast from 'react-hot-toast';

const objectives = ['Retention', 'Festival', 'VIP', 'Loyalty', 'Custom'];
const audiences = ['All Customers', 'VIP', 'Premium', 'Inactive', 'Regular', 'Custom Audience'];
const channels = ['WhatsApp', 'SMS', 'Email', 'RCS'];

const CHANNELS_DATA = [
  { id: 'WhatsApp', icon: MessageCircle, title: 'WhatsApp', bestFor: ['Offers', 'Coupons', 'Reminders', 'Flash Sales'], rules: 'Rich Text, Emoji, Links' },
  { id: 'Email', icon: Mail, title: 'Email', bestFor: ['Newsletters', 'Long Promotions', 'VIP Rewards'], rules: 'Unlimited length, Rich HTML Content' },
  { id: 'SMS', icon: Smartphone, title: 'SMS', bestFor: ['OTP', 'Short Alerts', 'Quick Offers'], rules: '160 Characters, Text Only' },
  { id: 'RCS', icon: MessageSquare, title: 'RCS', bestFor: ['Rich Media', 'Images', 'Interactive Messages'], rules: 'Rich Media, Interactive Buttons' }
];

const messageTypes = ['Promotion', 'Announcement', 'Discount', 'Festival', 'Loyalty', 'Reminder', 'Custom'];
const messageVariables = ['{name}', '{city}', '{customer_type}', '{last_purchase}', '{discount}', '{coupon}'];

export default function CreateCampaign({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  
  const [campaign, setCampaign] = useState({
    name: '',
    objective: 'Retention',
    audience: 'All Customers',
    channel: 'WhatsApp',
    message: { messageType: 'Promotion', subject: '', body: '', imageUrl: '', buttons: [] }
  });

  const handleGenerateAI = async () => {
    if (!aiPrompt) return;
    setIsGeneratingAI(true);
    try {
      const res = await axios.post('/api/campaigns/ai/message', {
        prompt: aiPrompt,
        audience: campaign.audience
      });
      setCampaign({ ...campaign, message: { ...campaign.message, body: res.data.message } });
      setAiPrompt('');
    } catch (err) {
      toast.error('Failed to generate message from AI. Please try again.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const insertVariable = (variable) => {
    setCampaign({ ...campaign, message: { ...campaign.message, body: campaign.message.body + variable } });
  };

  const handleAddButton = () => {
    if (campaign.message.buttons.length < 3) {
      setCampaign(prev => ({
        ...prev,
        message: {
          ...prev.message,
          buttons: [...prev.message.buttons, { text: '', url: '' }]
        }
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCampaign({ ...campaign, message: { ...campaign.message, imageUrl: reader.result } });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveButton = (index) => {
    const newButtons = [...campaign.message.buttons];
    newButtons.splice(index, 1);
    setCampaign({ ...campaign, message: { ...campaign.message, buttons: newButtons } });
  };

  const handleButtonChange = (index, field, value) => {
    const newButtons = [...campaign.message.buttons];
    newButtons[index][field] = value;
    setCampaign({ ...campaign, message: { ...campaign.message, buttons: newButtons } });
  };

  const handleNext = () => setStep(s => Math.min(5, s + 1));
  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const handleLaunch = async (status = 'Draft') => {
    setIsSubmitting(true);
    try {
      const res = await axios.post('/api/campaigns', { ...campaign, status });
      if (status === 'Running') {
        onNavigate('campaign-launch', res.data._id);
      } else {
        onNavigate('campaigns');
      }
    } catch (error) {
      console.error('Failed to create campaign', error);
      toast.error('Failed to create campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: 'Details', icon: <Megaphone size={18} /> },
    { id: 2, title: 'Audience', icon: <Users size={18} /> },
    { id: 3, title: 'Channel', icon: <Smartphone size={18} /> },
    { id: 4, title: 'Message', icon: <MessageSquare size={18} /> },
    { id: 5, title: 'Preview', icon: <Eye size={18} /> },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex justify-between items-end">
        <div>
          <button onClick={() => onNavigate('campaigns')} className="text-gray-500 hover:text-gray-900 text-sm mb-2 flex items-center gap-1 transition-colors">
            <ArrowLeft size={14} /> Back to Campaigns
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Create Campaign</h1>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-200 -z-10"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-blue-600 -z-10 transition-all duration-300" style={{ width: `${((step - 1) / 4) * 100}%` }}></div>
        
        {steps.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
              step >= s.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-400'
            }`}>
              {step > s.id ? <CheckCircle2 size={20} /> : s.icon}
            </div>
            <span className={`text-xs font-medium ${step >= s.id ? 'text-gray-900' : 'text-gray-400'}`}>{s.title}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 min-h-[400px]">
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h2 className="text-xl font-bold text-gray-900">Campaign Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. Summer Mega Sale"
                value={campaign.name}
                onChange={e => setCampaign({ ...campaign, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Objective</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {objectives.map(obj => {
                  const isCustomBtn = obj === 'Custom';
                  const isSelected = isCustomBtn 
                    ? !['Retention', 'Festival', 'VIP', 'Loyalty'].includes(campaign.objective)
                    : campaign.objective === obj;
                  
                  return (
                    <button 
                      key={obj}
                      onClick={() => setCampaign({ ...campaign, objective: isCustomBtn ? (campaign.objective === 'Custom' || !['Retention', 'Festival', 'VIP', 'Loyalty'].includes(campaign.objective) ? campaign.objective : 'Custom') : obj })}
                      className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                        isSelected ? 'bg-blue-50 border-blue-600 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {obj}
                    </button>
                  );
                })}
              </div>
              {!['Retention', 'Festival', 'VIP', 'Loyalty'].includes(campaign.objective) && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Specify Custom Objective</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. New Product Launch"
                    value={campaign.objective === 'Custom' ? '' : campaign.objective}
                    onChange={e => setCampaign({ ...campaign, objective: e.target.value })}
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Select Audience</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {audiences.map(aud => {
                const isCustomBtn = aud === 'Custom Audience';
                const isSelected = isCustomBtn
                  ? !['All Customers', 'VIP', 'Premium', 'Inactive', 'Regular'].includes(campaign.audience)
                  : campaign.audience === aud;

                return (
                  <button 
                    key={aud}
                    onClick={() => setCampaign({ ...campaign, audience: isCustomBtn ? (campaign.audience === 'Custom Audience' || !['All Customers', 'VIP', 'Premium', 'Inactive', 'Regular'].includes(campaign.audience) ? campaign.audience : 'Custom Audience') : aud })}
                    className={`p-6 rounded-xl border text-left transition-all ${
                      isSelected ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-600' : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    <div className={`mb-3 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}>
                      <Users size={24} />
                    </div>
                    <h3 className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>{aud}</h3>
                  </button>
                );
              })}
            </div>
            {!['All Customers', 'VIP', 'Premium', 'Inactive', 'Regular'].includes(campaign.audience) && (
              <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Describe Custom Audience</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Customers who bought shoes last month but didn't buy socks"
                  value={campaign.audience === 'Custom Audience' ? '' : campaign.audience}
                  onChange={e => setCampaign({ ...campaign, audience: e.target.value })}
                  autoFocus
                />
                <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                  <span className="font-semibold text-purple-600">✨ AI Copilot</span> 
                  will automatically build this segment for you before launch!
                </p>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Choose Channel</h2>
            </div>
            
            {/* AI Recommendation Banner */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-4 flex gap-4 items-start shadow-sm">
              <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-purple-900 flex items-center gap-2">
                  AI Suggests: {
                    campaign.objective === 'Retention' ? 'WhatsApp' : 
                    campaign.objective === 'Awareness' || campaign.objective === 'Newsletter' ? 'Email' : 
                    campaign.objective === 'Festival' || campaign.objective === 'Flash Sales' ? 'RCS' : 'SMS'
                  }
                </h4>
                <p className="text-sm text-purple-700 mt-1">
                  {campaign.objective === 'Retention' ? 'Highest engagement for retention campaigns.' :
                   campaign.objective === 'Awareness' || campaign.objective === 'Newsletter' ? 'Best for broad newsletters and long-form promotions.' :
                   campaign.objective === 'Festival' || campaign.objective === 'Flash Sales' ? 'High conversion via rich interactive media.' :
                   'Reliable and quick delivery.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CHANNELS_DATA.map(ch => {
                const Icon = ch.icon;
                const isSelected = campaign.channel === ch.id;
                return (
                  <div 
                    key={ch.id}
                    onClick={() => setCampaign({ ...campaign, channel: ch.id })}
                    className={`cursor-pointer p-5 rounded-xl border-2 transition-all relative ${
                      isSelected ? 'border-blue-600 bg-blue-50/30 shadow-md' : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-4 right-4 text-blue-600">
                        <CheckCircle2 size={20} className="fill-current text-white bg-blue-600 rounded-full" />
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                        <Icon size={24} />
                      </div>
                      <h3 className={`text-lg font-bold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>{ch.title}</h3>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Best For</p>
                      <div className="flex flex-wrap gap-1.5">
                        {ch.bestFor.map((tag, i) => (
                          <span key={i} className={`text-xs px-2 py-1 rounded-md font-medium ${isSelected ? 'bg-blue-100/70 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className={`pt-3 border-t text-sm font-medium ${isSelected ? 'border-blue-200 text-blue-700' : 'border-gray-100 text-gray-500'}`}>
                      {ch.rules}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            
            {/* Top Section - Campaign Summary */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between bg-blue-50 border border-blue-100 rounded-xl p-4">
              <div>
                <p className="text-xs text-blue-500 font-bold uppercase tracking-wider">Campaign</p>
                <p className="font-semibold text-blue-900">{campaign.name || 'Untitled Campaign'}</p>
              </div>
              <div>
                <p className="text-xs text-blue-500 font-bold uppercase tracking-wider">Audience</p>
                <p className="font-semibold text-blue-900">{campaign.audience}</p>
              </div>
              <div>
                <p className="text-xs text-blue-500 font-bold uppercase tracking-wider">Channel</p>
                <div className="flex items-center gap-1.5 font-semibold text-blue-900">
                  {campaign.channel === 'WhatsApp' ? <MessageCircle size={16}/> : 
                   campaign.channel === 'Email' ? <Mail size={16}/> : 
                   campaign.channel === 'SMS' ? <Smartphone size={16}/> : <MessageSquare size={16}/>}
                  {campaign.channel}
                </div>
              </div>
            </div>

            {/* Message Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message Type</label>
              <div className="flex flex-wrap gap-2">
                {messageTypes.map(type => (
                  <button 
                    type="button"
                    key={type}
                    onClick={() => {
                      setCampaign({ ...campaign, message: { ...campaign.message, messageType: type } });
                      setAiPrompt(`Create a ${type.toLowerCase()} message for this campaign`);
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      campaign.message.messageType === type ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Channel Rules Hints */}
            <div className="flex flex-wrap gap-2 items-center bg-gray-50 px-4 py-3 rounded-lg text-sm text-gray-600 border border-gray-100">
              <span className="font-semibold text-gray-800 mr-2">Channel Capabilities:</span>
              {campaign.channel === 'SMS' && <><CheckCircle2 size={14} className="text-green-500"/> Text Only <CheckCircle2 size={14} className="text-green-500 ml-2"/> 160 Characters</>}
              {campaign.channel === 'WhatsApp' && <><CheckCircle2 size={14} className="text-green-500"/> Emoji <CheckCircle2 size={14} className="text-green-500 ml-2"/> Links <CheckCircle2 size={14} className="text-green-500 ml-2"/> Rich Text</>}
              {campaign.channel === 'Email' && <><CheckCircle2 size={14} className="text-green-500"/> Subject Line <CheckCircle2 size={14} className="text-green-500 ml-2"/> Rich Content</>}
              {campaign.channel === 'RCS' && <><CheckCircle2 size={14} className="text-green-500"/> Rich Media <CheckCircle2 size={14} className="text-green-500 ml-2"/> Interactive Buttons <CheckCircle2 size={14} className="text-green-500 ml-2"/> Images</>}
            </div>

            {/* Subject (Email Only) */}
            {campaign.channel === 'Email' && (
              <div className="animate-in fade-in">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Summer Mega Sale - 20% OFF"
                  value={campaign.message.subject}
                  onChange={e => setCampaign({ ...campaign, message: { ...campaign.message, subject: e.target.value } })}
                />
              </div>
            )}

            {/* AI Message Generator */}
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
              <label className="block text-sm font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <Sparkles size={16} className="text-purple-600"/> AI Message Generator
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="e.g. Create a retention offer with 15% OFF code BACK15" 
                  className="flex-1 border border-purple-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleGenerateAI()}
                />
                <button 
                  onClick={handleGenerateAI}
                  disabled={isGeneratingAI || !aiPrompt}
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  {isGeneratingAI ? 'Generating...' : <><Wand2 size={16} /> Generate</>}
                </button>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-medium text-gray-700">Message Body</label>
                {campaign.channel === 'SMS' && (
                  <span className={`text-xs font-semibold ${campaign.message.body.length > 160 ? 'text-red-500' : 'text-gray-500'}`}>
                    {campaign.message.body.length} / 160
                  </span>
                )}
              </div>
              <textarea 
                rows="6"
                className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${campaign.channel === 'SMS' && campaign.message.body.length > 160 ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                placeholder="Type your message here..."
                value={campaign.message.body}
                onChange={e => setCampaign({ ...campaign, message: { ...campaign.message, body: e.target.value } })}
              ></textarea>
            </div>

            {/* Personalization */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Personalization Variables</label>
              <div className="flex flex-wrap gap-2">
                {messageVariables.map(v => (
                  <button 
                    type="button"
                    key={v}
                    onClick={() => insertVariable(v)}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded border border-gray-200 transition-colors"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Rich Media for WhatsApp / RCS */}
            {(campaign.channel === 'WhatsApp' || campaign.channel === 'RCS') && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <ImageIcon size={18} className="text-blue-500" /> Rich Media 
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Image (Optional)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Paste Image URL or upload a file"
                      value={campaign.message.imageUrl || ''}
                      onChange={e => setCampaign({ ...campaign, message: { ...campaign.message, imageUrl: e.target.value } })}
                    />
                    <label className="cursor-pointer bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2.5 rounded-lg font-medium border border-blue-200 transition-colors flex items-center justify-center shrink-0">
                      <span>Upload</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-sm text-gray-800">Interactive Buttons</h4>
                    <button 
                      onClick={handleAddButton} 
                      disabled={campaign.message.buttons.length >= 3}
                      className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                    >
                      <Plus size={14} /> Add Button
                    </button>
                  </div>
                  {campaign.message.buttons.map((btn, idx) => (
                    <div key={idx} className="flex gap-3 items-center bg-white p-3 rounded-lg border border-gray-200 mb-3 shadow-sm group hover:border-blue-200 transition-colors">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Button Text</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Shop Now" 
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            value={btn.text}
                            onChange={e => handleButtonChange(idx, 'text', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Destination URL</label>
                          <input 
                            type="text" 
                            placeholder="https://..." 
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            value={btn.url}
                            onChange={e => handleButtonChange(idx, 'url', e.target.value)}
                          />
                        </div>
                      </div>
                      <button type="button" onClick={() => handleRemoveButton(idx)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-4">
                        <Trash size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-8 animate-in slide-in-from-right-4">
            <h2 className="text-xl font-bold text-gray-900">Review & Launch</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Campaign</p>
                <p className="font-semibold text-gray-900">{campaign.name || 'Untitled Campaign'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Objective</p>
                <p className="font-semibold text-gray-900">{campaign.objective}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Audience</p>
                <p className="font-semibold text-gray-900">{campaign.audience}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Channel</p>
                <p className="font-semibold text-gray-900">{campaign.channel}</p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2 w-full">Message Preview</p>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 w-full max-w-sm shadow-sm relative">
                {campaign.channel === 'Email' && (
                  <div className="border-b pb-3 mb-3">
                    <p className="text-sm font-medium text-gray-900">Subject: {campaign.message.subject}</p>
                  </div>
                )}
                {(campaign.channel === 'WhatsApp' || campaign.channel === 'RCS') && campaign.message.imageUrl && (
                  <div className="mb-3 rounded-lg overflow-hidden border border-gray-200/50 bg-white">
                    <img src={campaign.message.imageUrl} alt="Campaign Media" className="w-full h-48 object-cover" />
                  </div>
                )}
                <div className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                  {campaign.message.body || <span className="text-gray-400 italic">No message body written yet...</span>}
                </div>
                {(campaign.channel === 'WhatsApp' || campaign.channel === 'RCS') && campaign.message.buttons?.length > 0 && (
                  <div className="mt-4 space-y-2 border-t pt-4">
                    {campaign.message.buttons.map((btn, idx) => (
                      <a 
                        key={idx} 
                        href={btn.url || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-center text-sm font-medium rounded-lg border border-blue-100 transition-colors"
                      >
                        {btn.text || 'Untitled Button'}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <button 
          onClick={handlePrev} 
          disabled={step === 1}
          className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Previous
        </button>

        {step < 5 ? (
          <button 
            onClick={handleNext}
            disabled={
              (step === 1 && !campaign.name) ||
              (step === 2 && !campaign.audience) ||
              (step === 3 && !campaign.channel) ||
              (step === 4 && !campaign.message.body)
            }
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Next <ArrowRight size={16} />
          </button>
        ) : (
          <div className="flex gap-3">
            <button 
              onClick={() => handleLaunch('Draft')}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Save Draft
            </button>
            <button 
              onClick={() => handleLaunch('Running')}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
            >
              Launch Campaign <Send size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
