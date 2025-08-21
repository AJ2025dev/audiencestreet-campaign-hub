import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Offers: React.FC = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState<any[]>([
    {
      id: 1,
      name: 'Premium Subscription',
      description: 'Get access to all premium features for $9.99/month',
      advertiser: 'TechCorp Inc.',
      payoutType: 'CPA',
      payoutAmount: 25.00,
      status: 'active',
      conversionRate: '2.5%',
      clicks: 1240,
      conversions: 31
    },
    {
      id: 2,
      name: 'Free Trial Sign-up',
      description: 'Sign up for our 30-day free trial',
      advertiser: 'Software Solutions Ltd.',
      payoutType: 'CPL',
      payoutAmount: 5.00,
      status: 'active',
      conversionRate: '8.2%',
      clicks: 2100,
      conversions: 172
    },
    {
      id: 3,
      name: 'E-commerce Purchase',
      description: 'Complete a purchase of $50 or more',
      advertiser: 'Online Retail Co.',
      payoutType: 'CPS',
      payoutAmount: 15.00,
      status: 'paused',
      conversionRate: '1.8%',
      clicks: 850,
      conversions: 15
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newOffer, setNewOffer] = useState({
    name: '',
    description: '',
    payoutType: 'CPA',
    payoutAmount: 0,
    status: 'draft'
  });

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    
    const offer = {
      id: offers.length + 1,
      ...newOffer,
      advertiser: user?.role === 'advertiser' ? `${user.firstName} ${user.lastName}` : 'Your Company',
      conversionRate: '0%',
      clicks: 0,
      conversions: 0
    };
    
    setOffers([offer, ...offers]);
    setNewOffer({
      name: '',
      description: '',
      payoutType: 'CPA',
      payoutAmount: 0,
      status: 'draft'
    });
    setShowCreateForm(false);
  };

  const toggleOfferStatus = (id: number) => {
    setOffers(offers.map(offer => 
      offer.id === id 
        ? { ...offer, status: offer.status === 'active' ? 'paused' : 'active' } 
        : offer
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.role === 'advertiser' ? 'My Offers' : 'Available Offers'}
            </h1>
            {user?.role === 'advertiser' && (
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {showCreateForm ? 'Cancel' : 'Create Offer'}
              </button>
            )}
          </div>

          {/* Create Offer Form */}
          {showCreateForm && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Create New Offer
                </h2>
                <form onSubmit={handleCreateOffer} className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="offer-name" className="block text-sm font-medium text-gray-700">
                      Offer Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="offer-name"
                        value={newOffer.name}
                        onChange={(e) => setNewOffer({...newOffer, name: e.target.value})}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="payout-type" className="block text-sm font-medium text-gray-700">
                      Payout Type
                    </label>
                    <div className="mt-1">
                      <select
                        id="payout-type"
                        value={newOffer.payoutType}
                        onChange={(e) => setNewOffer({...newOffer, payoutType: e.target.value})}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="CPA">CPA (Cost Per Action)</option>
                        <option value="CPL">CPL (Cost Per Lead)</option>
                        <option value="CPS">CPS (Cost Per Sale)</option>
                        <option value="CPC">CPC (Cost Per Click)</option>
                      </select>
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="payout-amount" className="block text-sm font-medium text-gray-700">
                      Payout Amount ($)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        id="payout-amount"
                        step="0.01"
                        min="0"
                        value={newOffer.payoutAmount}
                        onChange={(e) => setNewOffer({...newOffer, payoutAmount: parseFloat(e.target.value) || 0})}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-6">
                    <label htmlFor="offer-description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="offer-description"
                        rows={3}
                        value={newOffer.description}
                        onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-6">
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Create Offer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Offers Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                {user?.role === 'advertiser' ? 'Your Offers' : 'Available Offers'}
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
                      Payout
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
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
                  {offers.map((offer) => (
                    <tr key={offer.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{offer.name}</div>
                        <div className="text-sm text-gray-500">{offer.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {offer.advertiser}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {offer.payoutType}: ${offer.payoutAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>Clicks: {offer.clicks}</div>
                        <div>Conversions: {offer.conversions}</div>
                        <div>Rate: {offer.conversionRate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          offer.status === 'active' ? 'bg-green-100 text-green-800' :
                          offer.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {user?.role === 'advertiser' ? (
                          <>
                            <button
                              onClick={() => toggleOfferStatus(offer.id)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              {offer.status === 'active' ? 'Pause' : 'Activate'}
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Delete
                            </button>
                          </>
                        ) : (
                          <button className="text-indigo-600 hover:text-indigo-900">
                            Get Tracking Link
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offers;