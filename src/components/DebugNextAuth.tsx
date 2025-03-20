'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function DebugNextAuth() {
  const { data: session, status } = useSession();
  const [expanded, setExpanded] = useState(false);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setExpanded(!expanded)}
        className="bg-gray-800 text-white px-4 py-2 rounded-md text-xs"
      >
        {expanded ? 'Masquer' : 'Déboguer NextAuth'}
      </button>
      
      {expanded && (
        <div className="bg-gray-800 text-white p-4 rounded-md mt-2 max-w-lg max-h-96 overflow-auto">
          <h3 className="text-sm font-bold mb-2">État de session:</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify({ status, session }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}