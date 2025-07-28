/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Wifi, Smartphone, Server } from 'lucide-react';

export default function MobileTestPage() {
  const [tests, setTests] = useState({
    connection: false,
    api: false,
    auth: false,
    assets: false
  });
  const [loading, setLoading] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<any>({});

  useEffect(() => {
    // Get device info
    setDeviceInfo({
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    });

    // Auto-run basic tests
    runAllTests();
  }, []);

  const runAllTests = async () => {
    setLoading(true);
    const results = { connection: false, api: false, auth: false, assets: false };

    try {
      // Test 1: Basic connection (you're here, so this works)
      results.connection = true;

      // Test 2: API endpoint
      try {
        const apiResponse = await fetch('/api/competitions');
        results.api = apiResponse.ok;
      } catch (error) {
        console.error('API test failed:', error);
      }

      // Test 3: Auth endpoint
      try {
        const authResponse = await fetch('/api/auth/me');
        results.auth = authResponse.status === 401 || authResponse.ok; // 401 is expected when not logged in
      } catch (error) {
        console.error('Auth test failed:', error);
      }

      // Test 4: Static assets
      try {
        const assetResponse = await fetch('/_next/static/css/app/layout.css');
        results.assets = assetResponse.ok || assetResponse.status === 404; // 404 is fine, means server responded
      } catch (error) {
        console.error('Assets test failed:', error);
      }

    } catch (error) {
      console.error('Test error:', error);
    }

    setTests(results);
    setLoading(false);
  };

  const TestResult = ({ test, label, icon: Icon }: { test: boolean; label: string; icon: any }) => (
    <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5 text-blue-400" />
        <span className="text-white">{label}</span>
      </div>
      <div className={`flex items-center space-x-2 ${test ? 'text-green-400' : 'text-red-400'}`}>
        <CheckCircle className="w-5 h-5" />
        <span className="font-semibold">{test ? 'PASS' : 'FAIL'}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Smartphone className="w-6 h-6 text-blue-400" />
              <span>Mobile Access Test</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-green-400 mb-2">SUCCESS!</h2>
              <p className="text-gray-300">Your mobile device is successfully connected to the Samyukta server!</p>
            </div>

            <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
              <p className="text-green-300 text-center">
                ✅ The cross-origin warning you saw is normal and doesn&apos;t affect functionality.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>System Tests</span>
              <Button 
                onClick={runAllTests} 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                {loading ? 'Testing...' : 'Retest'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <TestResult test={tests.connection} label="Network Connection" icon={Wifi} />
            <TestResult test={tests.api} label="API Endpoints" icon={Server} />
            <TestResult test={tests.auth} label="Authentication System" icon={CheckCircle} />
            <TestResult test={tests.assets} label="Static Assets" icon={CheckCircle} />
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Device Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Platform:</span>
                <span className="text-white">{deviceInfo.platform}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Screen Size:</span>
                <span className="text-white">{deviceInfo.screenWidth}x{deviceInfo.screenHeight}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Window Size:</span>
                <span className="text-white">{deviceInfo.windowWidth}x{deviceInfo.windowHeight}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Online:</span>
                <span className="text-white">{deviceInfo.onLine ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cookies:</span>
                <span className="text-white">{deviceInfo.cookieEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full bg-gradient-to-r from-blue-500 to-violet-500"
            >
              🏠 Go to Home Page
            </Button>
            <Button 
              onClick={() => window.location.href = '/login'}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500"
            >
              🔐 Go to Login Page
            </Button>
            <Button 
              onClick={() => window.location.href = '/test-auth'}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
            >
              🧪 Test Authentication
            </Button>
          </CardContent>
        </Card>

        <div className="text-center text-gray-400 text-sm">
          <p>Server: http://192.168.29.118:3000</p>
          <p>Time: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}