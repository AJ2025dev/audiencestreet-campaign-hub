import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface Creative {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  createdAt: string;
}

const AICreatives: React.FC = () => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [creatives, setCreatives] = useState<Creative[]>([
    {
      id: '1',
      name: 'Summer Sale Banner',
      type: 'image',
      url: 'https://placehold.co/600x400/000000/FFFFFF?text=Summer+Sale',
      createdAt: '2023-08-15'
    },
    {
      id: '2',
      name: 'Product Demo Video',
      type: 'video',
      url: 'https://placehold.co/600x400/000000/FFFFFF?text=Product+Demo',
      createdAt: '2023-08-10'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const generateCreative = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const newCreative: Creative = {
        id: `${creatives.length + 1}`,
        name: `AI Generated Creative ${creatives.length + 1}`,
        type: 'image',
        url: 'https://placehold.co/600x400/000000/FFFFFF?text=AI+Creative',
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setCreatives([newCreative, ...creatives]);
      setPrompt('');
      setLoading(false);
    }, 1500);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            AI Creative Generation
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Generate creative assets for your campaigns using AI
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Generate New Creative</h2>
              <p className="mt-1 text-sm text-gray-500">
                Describe what you want to create and our AI will generate it for you
              </p>
            </div>
            <div className="border-t border-gray-200">
              <div className="p-6">
                <div className="flex">
                  <div className="flex-1 min-w-0">
                    <textarea
                      rows={3}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Describe the creative you want to generate (e.g., 'A summer sale banner with beach background and 50% off text')"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={generateCreative}
                    disabled={loading || !prompt.trim()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading ? 'Generating...' : 'Generate Creative'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Generated Creatives</h2>
              <p className="mt-1 text-sm text-gray-500">
                Your recently generated creative assets
              </p>
            </div>
            <div className="border-t border-gray-200">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
                {creatives.map((creative) => (
                  <div key={creative.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="aspect-w-16 aspect-h-9">
                      <img 
                        src={creative.url} 
                        alt={creative.name} 
                        className="object-cover w-full h-48"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900">{creative.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Created: {creative.createdAt}
                      </p>
                      <div className="mt-4 flex space-x-2">
                        <button className="flex-1 inline-flex items-center justify-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Use
                        </button>
                        <button className="flex-1 inline-flex items-center justify-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICreatives;