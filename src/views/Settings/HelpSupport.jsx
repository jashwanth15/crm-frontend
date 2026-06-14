import React, { useState } from 'react';
import { ExternalLink, Mail, FileText, Shield, X as CloseIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HelpSupport() {
  const [activeModal, setActiveModal] = useState(null);

  const contentMap = {
    faq: {
      title: 'Frequently Asked Questions',
      body: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800">How does Xeno AI generate campaigns?</h4>
            <p className="text-gray-600 text-sm mt-1">Xeno AI analyzes your historical customer data, purchase patterns, and active catalog to suggest high-converting segments and craft personalized messaging.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Can I export my data?</h4>
            <p className="text-gray-600 text-sm mt-1">Yes, you can export your Customers, Orders, and Campaigns data as JSON files from the Data Management tab in Settings.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">How do I change my billing plan?</h4>
            <p className="text-gray-600 text-sm mt-1">Billing and subscription management will be available in the upcoming v2.0 release. For now, you are on the Enterprise Beta plan.</p>
          </div>
        </div>
      )
    },
    privacy: {
      title: 'Privacy Policy',
      body: (
        <div className="text-sm text-gray-600 space-y-3">
          <p><strong>1. Data Collection:</strong> We collect information you provide directly to us when you create an account, update your profile, or use our services.</p>
          <p><strong>2. AI Processing:</strong> Your customer data is processed securely to provide AI insights. We do not sell your customer data to third parties.</p>
          <p><strong>3. Security:</strong> We implement robust security measures, including bcrypt password hashing and JWT authentication, to protect your data from unauthorized access.</p>
        </div>
      )
    },
    terms: {
      title: 'Terms of Service',
      body: (
        <div className="text-sm text-gray-600 space-y-3">
          <p>Welcome to Xeno CRM. By using our platform, you agree to these terms.</p>
          <p><strong>License:</strong> We grant you a limited, non-exclusive license to access and use the CRM for your internal business purposes.</p>
          <p><strong>Acceptable Use:</strong> You agree not to use the platform to send spam, malicious content, or violate any communication regulations (like TCPA or GDPR).</p>
        </div>
      )
    },
    contact: {
      title: 'Contact Support',
      body: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="How can we help?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none" placeholder="Describe your issue..."></textarea>
          </div>
          <button onClick={() => { toast.success('Message sent to support!'); setActiveModal(null); }} className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">Send Message</button>
        </div>
      )
    }
  };

  const links = [
    { id: 'faq', name: 'FAQ', description: 'Find answers to common questions', icon: ExternalLink },
    { id: 'contact', name: 'Contact Support', description: 'Reach out to our customer success team', icon: Mail },
    { id: 'privacy', name: 'Privacy Policy', description: 'Read our data handling practices', icon: Shield },
    { id: 'terms', name: 'Terms of Service', description: 'Review our terms and conditions', icon: FileText },
  ];

  return (
    <div className="max-w-2xl animate-in fade-in relative">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Help & Support</h2>
      <p className="text-gray-500 text-sm mb-6">Need assistance? We're here to help you get the most out of Xeno CRM.</p>
      
      <div className="grid grid-cols-2 gap-4">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <button 
              key={link.id}
              onClick={() => setActiveModal(link.id)}
              className="flex flex-col text-left p-5 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md hover:border-blue-300 transition group"
            >
              <div className="w-10 h-10 bg-gray-50 group-hover:bg-blue-50 rounded-lg flex items-center justify-center text-gray-600 group-hover:text-blue-600 mb-4 transition-colors">
                <Icon size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{link.name}</h3>
              <p className="text-sm text-gray-500">{link.description}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
        <div>
          <h3 className="font-bold text-blue-900 mb-1">About Xeno CRM</h3>
          <p className="text-sm text-blue-700">Version 1.0.0 • © 2026 Xeno Inc.</p>
        </div>
        <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">
          X
        </div>
      </div>

      {activeModal && contentMap[activeModal] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-900">{contentMap[activeModal].title}</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
                <CloseIcon size={20} />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {contentMap[activeModal].body}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
