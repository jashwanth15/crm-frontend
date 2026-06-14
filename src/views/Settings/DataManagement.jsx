import React, { useState } from 'react';
import axios from 'axios';
import { Download, Users, ShoppingCart, Megaphone, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DataManagement() {
  const [downloading, setDownloading] = useState(null);

  const handleExport = async (type) => {
    setDownloading(type);
    try {
      const response = await axios.get(`/api/export/${type}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_export.json`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      toast.error(`Failed to export ${type}`);
    } finally {
      setDownloading(null);
    }
  };

  const exportTypes = [
    { id: 'customers', name: 'Export Customers', description: 'Download your entire customer list', icon: Users },
    { id: 'orders', name: 'Export Orders', description: 'Download complete order history', icon: ShoppingCart },
    { id: 'campaigns', name: 'Export Campaigns', description: 'Download campaign metadata and performance', icon: Megaphone },
    { id: 'analytics', name: 'Export Analytics', description: 'Download aggregated performance reports', icon: BarChart2 }
  ];

  return (
    <div className="max-w-2xl animate-in fade-in">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Data Management</h2>
      <p className="text-gray-500 text-sm mb-6">Download your raw data for local backup or analysis in other tools.</p>
      
      <div className="space-y-4">
        {exportTypes.map(item => {
          const Icon = item.icon;
          const isDownloading = downloading === item.id;
          
          return (
            <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
                </div>
              </div>
              
              <button 
                onClick={() => handleExport(item.id)}
                disabled={isDownloading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-sm font-medium transition disabled:opacity-50"
              >
                {isDownloading ? (
                  <span className="w-4 h-4 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin"></span>
                ) : (
                  <Download size={16} />
                )}
                {isDownloading ? 'Downloading...' : 'Download'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
