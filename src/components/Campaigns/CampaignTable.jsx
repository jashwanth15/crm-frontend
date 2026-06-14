import { Eye, Edit2, Trash2, Send, Search } from 'lucide-react';

export default function CampaignTable({ campaigns, onLaunch, onEdit, onDelete, onView, onCreate, hasFilters }) {
  if (!campaigns || campaigns.length === 0) {
    return hasFilters ? (
      <div className="bg-white rounded-xl border border-gray-200 p-16 text-center text-gray-500">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200/50">
          <Search size={24} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">No Results Found</h3>
        <p className="text-gray-500 max-w-sm mx-auto">We couldn't find any campaigns matching your search query or status filter. Try checking for typos or adjusting your criteria.</p>
      </div>
    ) : (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
        <p className="mb-4">No Campaigns found.</p>
        <button onClick={onCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
          Create Your First Campaign
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Audience</th>
              <th className="px-6 py-4 font-semibold">Channel</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {campaigns.map((c) => (
              <tr key={c._id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onView(c._id)}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{c.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{c.audience || 'All Customers'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{c.channel}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                    c.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 
                    c.status === 'Running' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    c.status === 'Draft' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
