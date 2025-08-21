import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const AICreatives: React.FC = () => {
  const { user } = useAuth();
  const [creatives, setCreatives] = useState<any[]>([
    {
      id: 1,
      name: 'Summer Sale Banner',
      type: 'image',
      description: 'Eye-catching summer sale banner with discount information',
      prompt: 'Create a vibrant summer sale banner with beach theme, 25% off text, and call-to-action button',
      status: 'generated',
      url: 'https://example.com/creatives/summer-sale-banner.png',
      createdAt: '2023-07-15'
    },
    {
      id: 2,
      name: 'Product Demo Video',
      type: 'video',
      description: '30-second product demonstration video',
      prompt: 'Create a 30-second video showing the key features of our software product with upbeat background music',
      status: 'generating',
      url: '',
      createdAt: '2023-07-16'
    },
    {
      id: 3,
      name: 'Email Header',
      type: 'image',
      description: 'Header image for email newsletter',
      prompt: 'Design an elegant email header with company logo and tagline "Innovating Tomorrow"',
      status: 'generated',
      url: 'https://example.com/creatives/email-header.png',
      createdAt: '2023-07-10'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCreative, setNewCreative] = useState({
    name: '',
    type: 'image',
    prompt: '',
    description: ''
  });

  const handleCreateCreative = (e: React.FormEvent) => {
    e.preventDefault();
    
    const creative = {
      id: creatives.length + 1,
      ...newCreative,
      status: 'generating',
      url: '',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setCreatives([creative, ...creatives]);
    setNewCreative({
      name: '',
      type: 'image',
      prompt: '',
      description: ''
    });
    setShowCreateForm(false);
    
    // Simulate AI generation process
    setTimeout(() => {
      setCreatives(creatives.map(c => 
        c.id === creative.id 
          ? { ...c, status: 'generated', url: `https://example.com/creatives/${c.name.toLowerCase().replace(/\s+/g, '-')}.png` } 
          : c
      ));
    }, 3000);
  };

  const downloadCreative = (url: string, name: string) => {
    // In a real app, this would download the file
    alert(`Downloading ${name} from ${url}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              AI Creative Generator
            </h1>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {showCreateForm ? 'Cancel' : 'Create New Creative'}
            </button>
          </div>

          {/* Create Creative Form */}
          {showCreateForm && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Generate New Creative
                </h2>
                <form onSubmit={handleCreateCreative} className="mt-4">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="creative-name" className="block text-sm font-medium text-gray-700">
                        Creative Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="creative-name"
                          value={newCreative.name}
                          onChange={(e) => setNewCreative({...newCreative, name: e.target.value})}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="creative-type" className="block text-sm font-medium text-gray-700">
                        Creative Type
                      </label>
                      <div className="mt-1">
                        <select
                          id="creative-type"
                          value={newCreative.type}
                          onChange={(e) => setNewCreative({...newCreative, type: e.target.value})}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                          <option value="html">HTML Banner</option>
                        </select>
                      </div>
                    </div>
                    <div className="sm:col-span-6">
                      <label htmlFor="creative-description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="creative-description"
                          rows={2}
                          value={newCreative.description}
                          onChange={(e) => setNewCreative({...newCreative, description: e.target.value})}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Briefly describe what you want in the creative"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-6">
                      <label htmlFor="creative-prompt" className="block text-sm font-medium text-gray-700">
                        AI Prompt
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="creative-prompt"
                          rows={4}
                          value={newCreative.prompt}
                          onChange={(e) => setNewCreative({...newCreative, prompt: e.target.value})}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Describe in detail what you want the AI to generate. Include style, colors, text, and any specific elements."
                          required
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-6">
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Generate Creative
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* AI Creatives Library */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                Your AI Creatives
              </h2>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {creatives.map((creative) => (
                  <li key={creative.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 rounded-md flex items-center justify-center">
                            {creative.type === 'image' && (
                              <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            )}
                            {creative.type === 'video' && (
                              <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                            {creative.type === 'html' && (
                              <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                              </svg>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-indigo-600 truncate">
                              {creative.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {creative.description}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-sm text-gray-500 mr-4">
                            {creative.createdAt}
                          </div>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            creative.status === 'generated' ? 'bg-green-100 text-green-800' :
                            creative.status === 'generating' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {creative.status.charAt(0).toUpperCase() + creative.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">Prompt:</span> {creative.prompt}
                        </div>
                        <div className="flex space-x-2">
                          {creative.status === 'generated' && (
                            <>
                              <button
                                onClick={() => window.open(creative.url, '_blank')}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                              >
                                View
                              </button>
                              <button
                                onClick={() => downloadCreative(creative.url, creative.name)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                              >
                                Download
                              </button>
                            </>
                          )}
                          {creative.status === 'generating' && (
                            <div className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span className="text-sm text-indigo-600">Generating...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Creative Tips */}
          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                Tips for Better AI Creatives
              </h2>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-500">
                  <li>Be specific with your prompts - include colors, styles, and key elements</li>
                  <li>Describe the intended use (social media, email, website, etc.)</li>
                  <li>Include brand guidelines if applicable (colors, fonts, logo placement)</li>
                  <li>Specify dimensions or aspect ratios when needed</li>
                  <li>Request multiple variations to choose from</li>
                  <li>Provide examples or references when possible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICreatives;