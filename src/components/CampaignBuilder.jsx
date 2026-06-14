import { useState } from 'react';
import axios from 'axios';
import { Sparkles, ArrowRight, CheckCircle2, Rocket } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function CampaignBuilder({ onComplete }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  
  // Audience
  const [audiencePrompt, setAudiencePrompt] = useState('');
  const [audienceResult, setAudienceResult] = useState(null);

  // Message
  const [messagePrompt, setMessagePrompt] = useState('');
  const [draftedMessage, setDraftedMessage] = useState('');

  const handleSegment = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/audience/segment`, { prompt: audiencePrompt });
      setAudienceResult(res.data);
      setStep(2);
    } catch (err) {
      toast.error('Failed to segment audience. Try changing the prompt.');
    } finally {
      setLoading(false);
    }
  };

  const handleDraft = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/audience/draft`, {
        prompt: messagePrompt,
        audience_description: audiencePrompt
      });
      setDraftedMessage(res.data.message);
      setStep(3);
    } catch (err) {
      toast.error('Failed to draft message.');
    } finally {
      setLoading(false);
    }
  };

  const handleLaunch = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/campaigns`, {
        name: campaignName || 'AI Campaign',
        audience_prompt: audiencePrompt,
        message_template: draftedMessage,
        channel: 'EMAIL' // Or SMS/WhatsApp depending on UI selection
      });
      onComplete(); // Go back to dashboard
    } catch (err) {
      toast.error('Failed to launch campaign.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center mb-8 text-sm font-medium text-gray-500">
        <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-blue-600' : ''}`}>
          <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center border-current">1</div>
          <span>Audience</span>
        </div>
        <div className="flex-1 border-t-2 border-gray-200 mx-4" />
        <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-blue-600' : ''}`}>
          <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center border-current">2</div>
          <span>Message</span>
        </div>
        <div className="flex-1 border-t-2 border-gray-200 mx-4" />
        <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-blue-600' : ''}`}>
          <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center border-current">3</div>
          <span>Launch</span>
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        
        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="text-blue-500"/> Define your Audience
              </h2>
              <p className="text-gray-500 mt-2">Describe who you want to reach in plain English. Our AI will translate it into database queries.</p>
            </div>
            <div className="space-y-4">
              <textarea
                value={audiencePrompt}
                onChange={(e) => setAudiencePrompt(e.target.value)}
                placeholder="e.g. Find customers who have a lifetime value over $100..."
                className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                rows="4"
              />
              <button 
                onClick={handleSegment}
                disabled={loading || !audiencePrompt}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? <span className="animate-spin text-xl">↻</span> : <span>Generate Segment</span>}
                {!loading && <ArrowRight size={18} />}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="text-green-500"/> Audience Found!
              </h2>
              <p className="text-gray-600 mt-2">
                The AI found <span className="font-bold text-blue-600">{audienceResult?.audience_size}</span> customers matching your criteria.
              </p>
              <div className="bg-gray-50 text-xs text-gray-500 p-3 rounded mt-2 overflow-x-auto border border-gray-200">
                <pre>{JSON.stringify(audienceResult?.query_used, null, 2)}</pre>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="text-blue-500"/> Draft a Message
              </h3>
              <p className="text-gray-500 mt-2 mb-4">What do you want to say to them?</p>
              <textarea
                value={messagePrompt}
                onChange={(e) => setMessagePrompt(e.target.value)}
                placeholder="e.g. Offer them a 20% discount on their next coffee purchase"
                className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition mb-4"
                rows="3"
              />
              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button 
                  onClick={handleDraft}
                  disabled={loading || !messagePrompt}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? <span className="animate-spin text-xl">↻</span> : <span>Draft via AI</span>}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
             <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Rocket className="text-orange-500"/> Review & Launch
              </h2>
              <p className="text-gray-500 mt-2">Here is the AI-generated message template.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Summer Promo 2026"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message Template</label>
                <textarea
                  value={draftedMessage}
                  onChange={(e) => setDraftedMessage(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 outline-none h-32"
                />
                <p className="text-xs text-gray-400 mt-1">Variables like {'{{name}}'} will be dynamically replaced.</p>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <button 
                onClick={() => setStep(2)}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition"
              >
                Back
              </button>
              <button 
                onClick={handleLaunch}
                disabled={loading || !draftedMessage}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg shadow-green-500/30"
              >
                {loading ? <span className="animate-spin text-xl">↻</span> : <span>Send Campaign</span>}
                {!loading && <Rocket size={18} />}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
