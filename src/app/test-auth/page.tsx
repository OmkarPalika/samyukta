/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { ClientAuth } from '@/lib/client-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TestAuthPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await ClientAuth.me();
      setUser(userData);
      setMessage(userData ? 'User is authenticated' : 'User is not authenticated');
    } catch (error) {
      setMessage('Error checking authentication');
      console.error(error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = await ClientAuth.login(email, password);
      if (result) {
        setUser(result);
        setMessage('Login successful!');
      }
    } catch (error: any) {
      setMessage(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await ClientAuth.logout();
      setUser(null);
      setMessage('Logged out successfully');
    } catch {
      setMessage('Logout failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-md mx-auto space-y-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Authentication Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {message && (
              <div className={`p-3 rounded ${
                message.includes('successful') || message.includes('authenticated') 
                  ? 'bg-green-900/20 text-green-300 border border-green-800' 
                  : 'bg-red-900/20 text-red-300 border border-red-800'
              }`}>
                {message}
              </div>
            )}

            {user ? (
              <div className="space-y-2">
                <p className="text-green-300">✅ Authenticated as:</p>
                <div className="bg-gray-700 p-3 rounded text-sm">
                  <p className="text-white">ID: {user.id}</p>
                  <p className="text-white">Name: {user.full_name}</p>
                  <p className="text-white">Email: {user.email}</p>
                  <p className="text-white">Role: {user.role}</p>
                </div>
                <Button onClick={handleLogout} className="w-full">
                  Logout
                </Button>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Password/Passkey</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter password or passkey"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            )}

            <div className="pt-4 border-t border-gray-700">
              <Button 
                onClick={checkAuth} 
                variant="outline" 
                className="w-full border-gray-600 text-gray-300"
              >
                Check Auth Status
              </Button>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p>Network URL: http://192.168.29.118:3000/test-auth</p>
              <p>Local URL: http://localhost:3000/test-auth</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}