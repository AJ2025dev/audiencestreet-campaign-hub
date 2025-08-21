import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Tracking: React.FC = () => {
  const { user } = useAuth();
  const [trackingLinks, setTrackingLinks] = useState<any[]>([
    {
      id: 1,
      offerName: 'Premium Subscription',
      advertiser: 'TechCorp Inc.',
      url: 'https://tracking.example.com/click?offer=1&aff=123&tid=abc123',
      clicks: 124,
      conversions: 3,
      conversionRate: '2.4%',
      earnings: '$75.00',
      status: 'active'
    },
    {
      id: 2,
      offerName: 'Free Trial Sign-up',
      advertiser: 'Software Solutions Ltd.',
      url: 'https://tracking.example.com/click?offer=2&aff=123&tid=def456',
      clicks: 86,
      conversions: 7,
      conversionRate: '8.1%',
      earnings: '$35.00',
      status: 'active'
    },
    {
      id: 3,
      offerName: 'E-commerce Purchase',
      advertiser: 'Online Retail Co.',
      url: 'https://tracking.example.com/click?offer=3&aff=123&tid=ghi789',
      clicks: 42,
      conversions: 1,
      conversionRate: '2.4%',
      earnings: '$15.00',
      status: 'paused'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState('');

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOffer) return;
    
    const offer = trackingLinks.find(link => link.offerName === selectedOffer);
    if (!offer) return;
    
    const newLink = {
      id: trackingLinks.length + 1,
      offerName: offer.offerName,
      advertiser: offer.advertiser,
      url: `https://tracking.example.com/click?offer=${offer.id}&aff=123&tid=new${Date.now()}`,
      clicks: 0,
      conversions: 0,
      conversionRate: '0%',
      earnings: '$0.00',
      status: 'active'
    };
    
    setTrackingLinks([newLink, ...trackingLinks]);
    setSelectedOffer('');
    setShowCreateForm(false);
  };

  const toggleLinkStatus = (id: number) => {
    setTrackingLinks(trackingLinks.map(link => 
      link.id === id 
        ? { ...link, status: link.status === 'active' ? 'paused' : 'active' } 
        : link
    ));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Tracking link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Tracking Links
            </h1>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {showCreateForm ? 'Cancel' : 'Create New Link'}
            </button>
          </div>

          {/* Create Tracking Link Form */}
          {showCreateForm && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Create New Tracking Link
                </h2>
                <form onSubmit={handleCreateLink} className="mt-4">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label htmlFor="offer" className="block text-sm font-medium text-gray-700">
                        Select Offer
                      </label>
                      <div className="mt-1">
                        <select
                          id="offer"
                          value={selectedOffer}
                          onChange={(e) => setSelectedOffer(e.target.value)}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          required
                        >
                          <option value="">Choose an offer</option>
                          {trackingLinks.map((link) => (
                            <option key={link.id} value={link.offerName}>
                              {link.offerName} - {link.advertiser}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="sm:col-span-6">
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Generate Tracking Link
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tracking Links Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                Your Tracking Links
              </h2>
            </div>
            <div className="border-t border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Offer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Advertiser
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tracking Link
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Earnings
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trackingLinks.map((link) => (
                    <tr key={link.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{link.offerName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {link.advertiser}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className="truncate max-w-xs">{link.url}</span>
                          <button
                            onClick={() => copyToClipboard(link.url)}
                            className="ml-2 text-indigo-600 hover:text-indigo-900"
                          >
                            Copy
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>Clicks: {link.clicks}</div>
                        <div>Conversions: {link.conversions}</div>
                        <div>Rate: {link.conversionRate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {link.earnings}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          link.status === 'active' ? 'bg-green-100 text-green-800' :
                          link.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {link.status.charAt(0).toUpperCase() + link.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => toggleLinkStatus(link.id)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          {link.status === 'active' ? 'Pause' : 'Activate'}
                        </button>
                        <button
                          onClick={() => copyToClipboard(link.url)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Copy Link
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Postback Configuration */}
          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                Postback Configuration
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Configure server-to-server postbacks for conversion tracking
              </p>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label htmlFor="postback-url" className="block text-sm font-medium text-gray-700">
                      Global Postback URL
                    </label>
                    <div className="mt-1 flex">
                      <input
                        type="text"
                        id="postback-url"
                        value="https://yourwebsite.com/postback?aff={aff_id}&offer={offer_id}&payout={payout}"
                        readOnly
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 text-sm border-gray-300"
                      />
                      <button
                        onClick={() => copyToClipboard('https://yourwebsite.com/postback?aff={aff_id}&offer={offer_id}&payout={payout}')}
                        className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Use this URL in your advertiser's platform to set up postbacks
                    </p>
                  </div>
                  <div className="sm:col-span-6">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Save Postback Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracking;