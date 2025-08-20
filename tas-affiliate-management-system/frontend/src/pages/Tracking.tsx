import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface Conversion {
  id: string;
  offerName: string;
  date: string;
  payoutType: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
}

const Tracking: React.FC = () => {
  const { user } = useAuth();
  const [conversions, setConversions] = useState<Conversion[]>([
    {
      id: '1',
      offerName: 'Summer Sale 2023',
      date: '2023-08-15',
      payoutType: 'CPA',
      amount: 25.00,
      status: 'approved'
    },
    {
      id: '2',
      offerName: 'New Product Launch',
      date: '2023-08-10',
      payoutType: 'CPA',
      amount: 25.00,
      status: 'pending'
    },
    {
      id: '3',
      offerName: 'Back to School',
      date: '2023-08-05',
      payoutType: 'CPA',
      amount: 25.00,
      status: 'approved'
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
            {user.role === 'advertiser' ? 'Conversion Tracking' : 'Earnings Tracking'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {user.role === 'advertiser' 
              ? 'Track conversions and performance for your campaigns' 
              : 'Track your earnings and commission payments'}
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">
                {user.role === 'advertiser' ? 'Recent Conversions' : 'Recent Earnings'}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {user.role === 'advertiser' 
                  ? 'View conversion data for your offers' 
                  : 'View your recent earnings from promoted offers'}
              </p>
            </div>
            <div className="border-t border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {user.role === 'advertiser' ? 'Offer' : 'Offer'}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payout Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {conversions.map((conversion) => (
                      <tr key={conversion.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{conversion.offerName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{conversion.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{conversion.payoutType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${conversion.amount.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            conversion.status === 'approved' ? 'bg-green-100 text-green-800' :
                            conversion.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {conversion.status.charAt(0).toUpperCase() + conversion.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {user.role === 'affiliate' && (
            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Tracking Links</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Generate and manage your tracking links for offers
                </p>
              </div>
              <div className="border-t border-gray-200">
                <div className="p-6">
                  <div className="flex">
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter offer URL"
                      />
                    </div>
                    <button className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Generate Link
                    </button>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center">
                      <input
                        type="text"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value="https://track.tas-affiliate.com/click?offer_id=123&aff_id=456&source=summer_sale"
                        readOnly
                      />
                      <button className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tracking;