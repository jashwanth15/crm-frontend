import React, { useState } from 'react';
import { Sparkles, Save, Megaphone, Users, IndianRupee } from 'lucide-react';
import axios from 'axios';

export default function AIAudience({ onNavigate }) {
  const [prompt, setPrompt] = useState('Customers who spent above 5000');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post('/api/audience/segment', { prompt });
      const { query_used, audience_size, customers } = response.data;
      
      // Calculate expected revenue based on matched customers' lifetime value
      const expectedRev = customers.reduce((acc, c) => acc + (c.lifetime_value || 0), 0);

      setResult({
        rules: Object.entries(query_used).map(([key, val]) => ({
          field: key,
          operator: ':',
          value: JSON.stringify(val)
        })),
        matched: audience_size,
        expectedRevenue: `₹${expectedRev}`
      });
    } catch (error) {
      console.error('Error generating audience:', error);
      setResult({
        rules: [{ field: 'Error', operator: '=', value: 'Failed to generate audience' }],
        matched: 0,
        expectedRevenue: '₹0'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Sparkles className="text-blue-600" />
          AI Audience Builder
        </h1>
        <p className="text-gray-500 mt-1">Describe your ideal segment in plain English, let AI do the rest.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            <h3 className="font-bold text-gray-900 mb-4">Describe Audience</h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-4 text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors resize-none h-32"
              placeholder="Example: Customers who spent above 5000, haven't ordered in 60 days, and live in Hyderabad"
            ></textarea>
            <div className="mt-4 flex justify-end">
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generate Audience
                  </>
                )}
              </button>
            </div>
          </div>

          {result && (
            <div className="bg-white p-6 rounded-xl border border-green-200 shadow-sm animate-in slide-in-from-bottom-4 bg-gradient-to-br from-white to-green-50/30">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <Sparkles size={16} />
                  </div>
                  AI Output
                </h3>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white shadow-sm">
                    <Save size={16} /> Save Audience
                  </button>
                  <button 
                    onClick={() => onNavigate('campaigns')}
                    className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 shadow-sm"
                  >
                    <Megaphone size={16} /> Launch Campaign
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Extracted Rules</h4>
                  <div className="space-y-2">
                    {result.rules.map((rule, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white border border-gray-100 p-2.5 rounded-lg shadow-sm">
                        <span className="font-medium text-gray-900">{rule.field}</span>
                        <span className="text-gray-400 font-mono">{rule.operator}</span>
                        <span className="text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded">{rule.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                      <Users size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Matched Customers</p>
                      <p className="text-2xl font-bold text-gray-900">{result.matched}</p>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center shrink-0">
                      <IndianRupee size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Expected Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">{result.expectedRevenue}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Saved Audiences</h3>
            <div className="space-y-3">
              {['VIP Customers', 'Inactive (>60 days)', 'Frequent Buyers', 'Festival Customers'].map((aud, i) => (
                <div key={i} className="group p-3 border border-gray-100 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors flex justify-between items-center">
                  <span className="font-medium text-gray-700 group-hover:text-blue-700">{aud}</span>
                  <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center group-hover:bg-blue-200 group-hover:text-blue-700 text-gray-400 text-xs font-bold">
                    →
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
