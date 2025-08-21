import React from 'react';
import { useAuth } from '../hooks/useAuth';
import AdvertiserDashboard from './AdvertiserDashboard';
import AffiliateDashboard from './AffiliateDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Render different dashboards based on user role
  const renderDashboard = () => {
    switch (user?.role) {
      case 'advertiser':
        return <AdvertiserDashboard />;
      case 'affiliate':
        return <AffiliateDashboard />;
      case 'admin':
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <div className="px-4 py-6 sm:px-0">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  Admin Dashboard
                </h1>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      System Administration
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      As an administrator, you can manage users, system settings, 
                      and view overall platform analytics.
                    </p>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium text-gray-900">User Management</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Manage advertisers, affiliates, and admin users
                        </p>
                        <button className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Manage Users
                        </button>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium text-gray-900">System Settings</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Configure platform-wide settings and preferences
                        </p>
                        <button className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Configure Settings
                        </button>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium text-gray-900">Analytics</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          View platform-wide performance metrics
                        </p>
                        <button className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          View Analytics
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <div className="px-4 py-6 sm:px-0">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  Welcome to TAS Affiliate Management System
                </h1>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Account Setup Required
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Please contact support to set up your account role.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return <div>{renderDashboard()}</div>;
};

export default Dashboard;