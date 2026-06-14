import React from 'react';
import { Sparkles, ArrowRight, Target, Zap, BarChart3 } from 'lucide-react';

export default function Landing({ onNavigate }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">X</span>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-gray-900">XENO</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('login')}
            className="text-gray-600 font-medium hover:text-gray-900 transition-colors"
          >
            Login
          </button>
          <button 
            onClick={() => onNavigate('signup')}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Create Account
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-8 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-medium text-sm mb-8">
          <Sparkles size={16} />
          <span>The world's first AI-Native CRM</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
          Marketing, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Orchestrated by AI
          </span>
        </h1>
        
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop struggling with complex segments and manual campaigns. 
          Just tell Xeno what you want to achieve, and watch the magic happen.
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <button 
            onClick={() => onNavigate('login')}
            className="flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-800 transition-all hover:scale-105"
          >
            Login <ArrowRight size={20} />
          </button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-32 text-left">
          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI Audience Builder</h3>
            <p className="text-gray-600">Describe your ideal customer in plain English, and let our AI build the perfect segment instantly.</p>
          </div>
          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Auto Campaigns</h3>
            <p className="text-gray-600">From message generation to channel selection, our AI agent orchestrates end-to-end campaigns.</p>
          </div>
          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Analytics</h3>
            <p className="text-gray-600">Don't just look at charts. Get actionable AI insights on what to do next to maximize revenue.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
