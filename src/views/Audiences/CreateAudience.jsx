import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, Settings2, Plus, Trash2, ArrowLeft, Loader2, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateAudience({ audienceId, onNavigate, initialTab = 'manual' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'ai' or 'manual'
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [audienceName, setAudienceName] = useState('');
  const [rules, setRules] = useState([
    { field: 'lifetime_value', operator: '>', value: 0 }
  ]);

  const [previewData, setPreviewData] = useState(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (audienceId) {
      fetchAudience();
    }
  }, [audienceId]);

  const fetchAudience = async () => {
    try {
      const res = await axios.get(`/api/audience/${audienceId}`);
      setAudienceName(res.data.audience.name);
      setRules(res.data.audience.rules || []);
      setPreviewData({
        customerCount: res.data.audience.customerCount,
        estimatedRevenue: res.data.audience.estimatedRevenue,
        customers: res.data.previewCustomers
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setRules([]);
    setPreviewData(null);
    try {
      const res = await axios.post('/api/audience/ai', { prompt: aiPrompt });
      if (res.data.rules && res.data.rules.length > 0) {
        setRules(res.data.rules);
        handlePreview(res.data.rules); // Auto preview
      } else {
        toast.error("Couldn't generate rules from that prompt. Try being more specific.");
      }
    } catch (err) {
      console.error(err);
      toast.error('AI Generation failed. Check backend logs or API keys.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = async (rulesToPreview = rules) => {
    setIsPreviewing(true);
    try {
      const res = await axios.post('/api/audience/preview', { rules: rulesToPreview });
      setPreviewData(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to preview audience');
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleSave = async () => {
    if (!audienceName.trim()) {
      toast.error("Please enter an Audience Name to save.");
      return;
    }
    setIsSaving(true);
    try {
      if (audienceId) {
        await axios.put(`/api/audience/${audienceId}`, { name: audienceName, rules });
      } else {
        await axios.post('/api/audience', { name: audienceName, rules });
      }
      onNavigate('audience');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save audience');
    } finally {
      setIsSaving(false);
    }
  };

  const addRule = () => {
    setRules([...rules, { field: 'city', operator: '=', value: '' }]);
  };

  const updateRule = (index, key, val) => {
    const newRules = [...rules];
    newRules[index][key] = val;
    setRules(newRules);
  };

  const removeRule = (index) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onNavigate('audience')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {audienceId ? 'Edit Audience' : 'Create Audience'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Define rules to segment your customer base.</p>
        </div>
      </div>

      {/* Tabs */}
      {!audienceId && (
        <div className="flex border-b border-gray-200">
          <button 
            className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'ai' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('ai')}
          >
            <Sparkles size={18} />
            AI Builder
          </button>
          <button 
            className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'manual' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('manual')}
          >
            <Settings2 size={18} />
            Manual Builder
          </button>
        </div>
      )}

      {activeTab === 'ai' && !audienceId ? (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-blue-100 p-8">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto text-blue-600">
              <Sparkles size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Describe your ideal audience</h2>
              <p className="text-gray-500 mt-2">Type what you want in plain English, and our AI will instantly build the segmentation rules for you.</p>
            </div>
            
            <textarea
              className="w-full h-32 p-4 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700"
              placeholder="e.g. Find customers who live in Hyderabad, have spent more than 500, and haven't purchased anything in the last 60 days."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />

            <button
              onClick={handleGenerateAI}
              disabled={isGenerating || !aiPrompt.trim()}
              className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              {isGenerating ? 'Generating Rules...' : 'Generate Audience'}
            </button>
            
            {rules.length > 0 && !isGenerating && previewData && (
              <div className="mt-8 pt-8 border-t border-blue-200/50 text-left w-full">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 text-center">AI Generated Rules</h3>
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {rules.map((r, i) => (
                    <div key={i} className="px-3 py-1.5 bg-white border border-blue-100 rounded-lg text-sm text-blue-800 shadow-sm flex items-center gap-2">
                      <span className="font-semibold">{r.field.replace(/_/g, ' ')}</span>
                      <span className="text-blue-400">{r.operator}</span>
                      <span className="font-bold">{r.value}</span>
                    </div>
                  ))}
                </div>
                <div className="max-w-md mx-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-center">Name your audience to save</label>
                  <input 
                    type="text" 
                    value={audienceName}
                    onChange={(e) => setAudienceName(e.target.value)}
                    placeholder="e.g. VIP Customers"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Audience Name *</label>
              <input 
                type="text" 
                value={audienceName}
                onChange={(e) => setAudienceName(e.target.value)}
                placeholder="e.g. High Value Inactive Customers"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">Segmentation Rules</label>
                <button 
                  onClick={addRule}
                  className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1"
                >
                  <Plus size={16} /> Add Rule
                </button>
              </div>

              <div className="space-y-3">
                {rules.map((rule, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <select 
                      value={rule.field}
                      onChange={(e) => updateRule(idx, 'field', e.target.value)}
                      className="w-full sm:w-1/3 px-3 py-2 border border-gray-300 rounded bg-white text-sm"
                    >
                      <option value="city">City</option>
                      <option value="state">State</option>
                      <option value="country">Country</option>
                      <option value="tags">Tags</option>
                      <option value="product_category">Product Category</option>
                      <option value="lifetime_value">Total Spend (₹)</option>
                      <option value="purchase_frequency">Total Orders</option>
                      <option value="last_purchase_days_ago">Last Purchase (Days Ago)</option>
                    </select>

                    <select 
                      value={rule.operator}
                      onChange={(e) => updateRule(idx, 'operator', e.target.value)}
                      className="w-full sm:w-1/4 px-3 py-2 border border-gray-300 rounded bg-white text-sm"
                    >
                      <option value="=">Equals (=)</option>
                      <option value="!=">Not Equals (!=)</option>
                      <option value=">">Greater Than (&gt;)</option>
                      <option value="<">Less Than (&lt;)</option>
                      <option value=">=">Greater or Equal (&gt;=)</option>
                      <option value="<=">Less or Equal (&lt;=)</option>
                      <option value="contains">Contains</option>
                    </select>

                    <div className="flex gap-2 w-full sm:w-auto flex-1">
                      <input 
                        type="text" 
                        value={rule.value}
                        onChange={(e) => updateRule(idx, 'value', e.target.value)}
                        placeholder="Value..."
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm"
                      />
                      <button 
                        onClick={() => removeRule(idx)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors shrink-0"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                {rules.length === 0 && (
                  <div className="text-center p-6 border border-dashed border-gray-300 rounded-lg text-gray-500 text-sm">
                    No rules defined. All customers will be included.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button 
                onClick={() => handlePreview()}
                disabled={isPreviewing}
                className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center gap-2"
              >
                {isPreviewing ? <Loader2 className="animate-spin" size={16} /> : <Users size={16} />}
                Preview Audience
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Section */}
      {previewData && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-900">Audience Preview</h3>
              <p className="text-sm text-gray-500 mt-1">Based on current rules</p>
            </div>
            <button 
              onClick={handleSave}
              disabled={isSaving || !audienceName.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isSaving && <Loader2 className="animate-spin" size={16} />}
              Save Audience
            </button>
          </div>
          
          <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">
            <div className="p-6 text-center">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Customers</p>
              <p className="text-3xl font-bold text-gray-900">{previewData.customerCount.toLocaleString()}</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Est. Revenue</p>
              <p className="text-3xl font-bold text-green-600">₹{previewData.estimatedRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>

          <div className="p-0">
            {previewData.customers.length > 0 ? (
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3">Sample Customers</th>
                    <th className="px-6 py-3">Location</th>
                    <th className="px-6 py-3">Spend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {previewData.customers.map(c => (
                    <tr key={c._id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-900">
                        {c.name}
                        <div className="text-xs text-gray-500 font-normal">{c.email}</div>
                      </td>
                      <td className="px-6 py-3">{c.city || '-'}</td>
                      <td className="px-6 py-3">₹{(c.lifetime_value || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500 text-sm">
                No customers match these rules.
              </div>
            )}
            {previewData.customerCount > 10 && (
              <div className="p-3 text-center border-t border-gray-100 text-xs text-gray-500 bg-gray-50">
                Showing top 10 results
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
