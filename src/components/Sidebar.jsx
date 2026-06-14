import React from 'react';
import { 
  Home, 
  Users, 
  ShoppingCart, 
  Target, 
  Megaphone, 
  BarChart2, 
  Settings, 
  Sparkles,
  Filter
} from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'audience', label: 'Audience', icon: Target },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm z-10">
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon 
                size={20} 
                className={`${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} transition-colors`} 
              />
              <span>{item.label}</span>
              {(item.id === 'audience' || item.id === 'copilot') && (
                <span className="ml-auto text-[10px] uppercase font-bold tracking-wider bg-gradient-to-r from-purple-500 to-pink-500 text-white px-1.5 py-0.5 rounded">AI</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-100/50">
          <p className="text-xs font-semibold text-indigo-900 mb-1">Xeno AI Copilot</p>
          <p className="text-xs text-indigo-700 mb-3">Your marketing assistant is ready.</p>
          <button 
            onClick={() => {
              setCurrentView('copilot');
              window.dispatchEvent(new CustomEvent('open-copilot'));
            }}
            className="w-full bg-white text-indigo-600 text-sm font-medium py-1.5 rounded-lg shadow-sm border border-indigo-100 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
          >
            <span>✨ Ask AI</span>
          </button>
        </div>
      </div>
    </div>
  );
}
