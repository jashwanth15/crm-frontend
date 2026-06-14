import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import AICopilot from './AICopilot';

// Placeholder for views until they are created
import Dashboard from '../views/Dashboard';
import Settings from '../views/Settings';
import Customers from '../views/Customers';
import Orders from '../views/Orders';
import Audiences from '../views/Audiences/Audiences';
import CreateAudience from '../views/Audiences/CreateAudience';
import AudienceDetails from '../views/Audiences/AudienceDetails';

import Campaigns from '../views/Campaigns/Campaigns';
import CreateCampaign from '../views/Campaigns/CreateCampaign';
import CampaignDetails from '../views/Campaigns/CampaignDetails';
import EditCampaign from '../views/Campaigns/EditCampaign';
import CampaignLaunch from '../views/Campaigns/CampaignLaunch';

import AnalyticsDashboard from '../views/Analytics/AnalyticsDashboard';
import NotificationsCenter from '../views/NotificationsCenter';

const ComingSoon = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-96 text-center animate-in fade-in">
    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 text-gray-400">
      <span className="text-2xl font-bold">🚧</span>
    </div>
    <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
    <p className="text-gray-500 max-w-md">This module is currently under development. Check back soon for updates!</p>
  </div>
);

export default function AppLayout({ onLogout }) {
  const [currentView, setCurrentView] = useState('dashboard');
  const [viewId, setViewId] = useState(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check theme globally
    const checkTheme = async () => {
      try {
        const res = await axios.get('/api/workspace');
        if (res.data?.appearance?.theme === 'Dark') {
          document.documentElement.classList.add('dark-theme');
        } else {
          document.documentElement.classList.remove('dark-theme');
        }
      } catch (err) {
        console.error('Failed to load workspace for theme', err);
      }
    };
    checkTheme();

    const handleOpenCopilot = () => setIsCopilotOpen(true);
    window.addEventListener('open-copilot', handleOpenCopilot);
    return () => window.removeEventListener('open-copilot', handleOpenCopilot);
  }, []);

  const handleNavigate = (view, id = null) => {
    setCurrentView(view);
    setViewId(id);
    setIsMobileMenuOpen(false);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard onNavigate={handleNavigate} />;
      case 'customers': return <Customers onNavigate={handleNavigate} />;
      case 'orders': return <Orders onNavigate={handleNavigate} />;
      case 'audience': return <Audiences onNavigate={handleNavigate} />;
      case 'create-audience': return <CreateAudience onNavigate={handleNavigate} initialTab="manual" />;
      case 'create-audience-ai': return <CreateAudience onNavigate={handleNavigate} initialTab="ai" />;
      case 'audience-details': return <AudienceDetails audienceId={viewId} onNavigate={handleNavigate} />;
      case 'edit-audience': return <CreateAudience audienceId={viewId} onNavigate={handleNavigate} />;
      case 'campaigns': return <Campaigns onNavigate={handleNavigate} />;
      case 'create-campaign': return <CreateCampaign onNavigate={handleNavigate} />;
      case 'campaign-details': return <CampaignDetails campaignId={viewId} onNavigate={handleNavigate} />;
      case 'edit-campaign': return <EditCampaign campaignId={viewId} onNavigate={handleNavigate} />;
      case 'campaign-launch': return <CampaignLaunch campaignId={viewId} onNavigate={handleNavigate} />;
      case 'analytics': return <AnalyticsDashboard onNavigate={handleNavigate} />;
      case 'notifications': return <NotificationsCenter onNavigate={handleNavigate} />;
      case 'settings': return <Settings initialTab={viewId || 'profile'} />;
      default: return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] font-sans overflow-hidden">
      <TopNav 
        openCopilot={() => setIsCopilotOpen(true)} 
        onLogout={onLogout}
        onNavigate={handleNavigate}
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      <div className="flex-1 flex relative overflow-hidden">
        <Sidebar 
          currentView={currentView} 
          setCurrentView={(view) => {
            setCurrentView(view);
            setIsMobileMenuOpen(false);
          }} 
          isOpen={isMobileMenuOpen}
          closeMenu={() => setIsMobileMenuOpen(false)}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto pb-12 h-full">
            {renderView()}
          </div>
        </main>
        
        {/* Overlay for Copilot */}
        {isCopilotOpen && (
          <div 
            className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setIsCopilotOpen(false)}
          />
        )}
      </div>

      <AICopilot 
        isOpen={isCopilotOpen} 
        onClose={() => setIsCopilotOpen(false)} 
        onNavigate={handleNavigate}
      />
    </div>
  );
}
