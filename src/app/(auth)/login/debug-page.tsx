'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

export default function DebugLoginPage() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [status, setStatus] = useState('idle');
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const handleLogin = async () => {
    try {
      setStatus('loading');
      setError(null);
      setResponse(null);
      
      console.log('Attempting login with:', { email });
      
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      
      console.log('Login result:', result);
      setResponse(result);
      
      if (result?.error) {
        setStatus('error');
        setError(result.error);
      } else {
        setStatus('success');
      }
    } catch (err) {
      console.error('Login error:', err);
      setStatus('error');
      setError(err);
    }
  };
  
  const handleRedirectLogin = () => {
    signIn('credentials', {
      email, 
      password,
      callbackUrl: '/'
    });
  };

  return (
    <div className="p-6 max-w-lg mx-auto mt-10 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Page de test d'authentification</h1>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      
      <div className="flex space-x-4 mb-6">
        <Button onClick={handleLogin} disabled={status === 'loading'}>
          Connexion sans redirection
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleRedirectLogin} 
          disabled={status === 'loading'}
        >
          Connexion avec redirection
        </Button>
      </div>
      
      {status === 'loading' && <p className="text-blue-500">Connexion en cours...</p>}
      
      {status === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded mb-4">
          <h3 className="text-red-700 font-medium">Erreur</h3>
          <pre className="mt-2 text-sm overflow-auto bg-white p-2 rounded">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}
      
      {status === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded mb-4">
          <h3 className="text-green-700 font-medium">Succès</h3>
          <p>Connexion réussie! Vérifiez la session dans le débogueur.</p>
        </div>
      )}
      
      {response && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Réponse de NextAuth:</h3>
          <pre className="bg-gray-50 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}