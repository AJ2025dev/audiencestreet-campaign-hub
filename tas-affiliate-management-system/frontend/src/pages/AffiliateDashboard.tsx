import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const AffiliateDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data for dashboard cards
  const dashboardStats = [
    { name: 'Active Offers', value: '15', change: '+3 from last month' },
    { name: 'Total Earnings', value: '$1,240', change: '+8% from last month' },
    { name: 'This Month Clicks', value: '2,450', change: '+15% from last month' },
    { name: 'Conversion Rate', value: '3.2%', change: '+0.4% from last month' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Affiliate Dashboard
          </h1>
          
          {/* Welcome Section */}
          <div className="mb-8 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Welcome, {user?.firstName} {user?.lastName}!
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                You are logged in as an affiliate. Here you can browse offers, 
                generate tracking links, and track your earnings.
              </p>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {dashboardStats.map((stat) => (
              <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                        </dd>
                        <dd className="text-xs text-gray-500 mt-1">{stat.change}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Offers Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Offers
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Browse and select offers to promote
                </p>
                <div className="mt-4">
                  <Link to="/offers" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Browse Offers
                  </Link>
                </div>
              </div>
            </div>

            {/* Tracking Links Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Tracking Links
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Generate and manage your tracking links
                </p>
                <div className="mt-4">
                  <Link to="/tracking" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Manage Links
                  </Link>
                </div>
              </div>
            </div>

            {/* Earnings Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Earnings
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  View your commissions and payment history
                </p>
                <div className="mt-4">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    View Earnings
                  </button>
                </div>
              </div>
            </div>
            
            {/* AI Creatives Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  AI Creatives
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Generate AI-powered creative assets for your promotions
                </p>
                <div className="mt-4">
                  <Link to="/ai-creatives" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Generate Creatives
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Reports Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Performance Reports
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Analyze your promotional performance
                </p>
                <div className="mt-4">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    View Reports
                  </button>
                </div>
              </div>
            </div>
            
            {/* Settings Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Settings
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configure your account and preferences
                </p>
                <div className="mt-4">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Account Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateDashboard;
