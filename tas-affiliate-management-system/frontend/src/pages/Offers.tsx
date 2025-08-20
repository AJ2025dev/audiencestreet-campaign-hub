import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface Offer {
  id: string;
  name: string;
  description: string;
  payoutType: 'cpc' | 'cpa' | 'cpl' | 'cps';
  payoutAmount: number;
  status: 'active' | 'paused' | 'archived';
  advertiser: string;
}

const Offers: React.FC = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([
    {
      id: '1',
      name: 'Summer Sale 2023',
      description: 'Promote our summer sale with up to 50% off',
      payoutType: 'cpa',
      payoutAmount: 25.00,
      status: 'active',
      advertiser: 'Fashion Retailer Inc.'
    },
    {
      id: '2',
      name: 'New Product Launch',
      description: 'Promote our new line of eco-friendly products',
      payoutType: 'cpa',
      payoutAmount: 30.00,
      status: 'active',
      advertiser: 'Eco Products Ltd.'
    },
    {
      id: '3',
      name: 'Back to School',
      description: 'Promote our back to school collection',
      payoutType: 'cpc',
      payoutAmount: 0.50,
      status: 'paused',
      advertiser: 'Office Supplies Co.'
    }
  ]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {user.role === 'advertiser' ? 'My Offers' : 'Available Offers'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {user.role === 'advertiser' 
              ? 'Manage your advertising offers' 
              : 'Browse and select offers to promote'}
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {user.role === 'advertiser' ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Your Offers</h2>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Create New Offer
                  </button>
                </div>
              </div>
              <div className="border-t border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Offer Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payout
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {offer.payoutType.toUpperCase()} ${offer.payoutAmount.toFixed(2)}
                            </div>
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
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Available Offers</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Browse offers from advertisers and select those you want to promote
                </p>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {offers.map((offer) => (
                    <li key={offer.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {offer.name}
                            </p>
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {offer.payoutType.toUpperCase()} ${offer.payoutAmount.toFixed(2)}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-500 truncate">
                            {offer.description}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            Advertiser: {offer.advertiser}
                          </p>
                        </div>
                        <div className="inline-flex rounded-md shadow-sm">
                          <button
                            type="button"
                            className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            Preview
                          </button>
                          <button
                            type="button"
                            className="relative -ml-px inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Offers;