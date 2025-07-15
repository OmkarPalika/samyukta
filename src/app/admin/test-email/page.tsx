'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestEmailPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const sendEmailTest = async (type: string) => {
    setLoading(true);
    setResult('');

    const configs = {
      'entry-workshop-cloud': { ticketType: "Entry + Workshop", amount: 800, workshopTrack: "Cloud Computing (AWS)", teamMembers: undefined },
      'entry-workshop-ai': { ticketType: "Entry + Workshop", amount: 800, workshopTrack: "AI/ML (Google)", teamMembers: undefined },
      'entry-workshop-hackathon': { ticketType: "Entry + Workshop + Hackathon", amount: 950, workshopTrack: "Cloud Computing (AWS)", teamMembers: ["Test User", "Dev Partner", "Designer", "PM"] },
      'entry-workshop-pitch': { ticketType: "Entry + Workshop + Pitch", amount: 900, workshopTrack: "AI/ML (Google)", teamMembers: ["Test User", "Co-founder"] },
      'combo-hackathon': { ticketType: "Combo (Hackathon)", amount: 950, workshopTrack: "Cloud Computing (AWS)", teamMembers: ["Test User", "Frontend Dev", "Backend Dev", "UI/UX Designer"] },
      'combo-pitch': { ticketType: "Combo (Startup Pitch)", amount: 900, workshopTrack: "AI/ML (Google)", teamMembers: ["Test User", "Business Partner"] }
    };

    const config = configs[type as keyof typeof configs];
    const testData = {
      name: "Test User",
      email: email,
      college: "ANITS",
      phone: "+91 9876543210",
      registrationId: `SAM2025${type.toUpperCase().replace(/-/g, '')}`,
      passkey: Math.random().toString(36).substring(2, 8).toUpperCase(),
      eventDates: "August 6-9, 2025",
      venue: "ANITS Campus, Visakhapatnam",
      ...config
    };

    try {
      const response = await fetch('/api/email/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      const data = await response.json();
      setResult(data.success ? `✅ ${config.ticketType} email sent!` : `❌ Failed: ${data.error}`);
    } catch (error) {
      setResult('❌ Error: ' + error);
    }

    setLoading(false);
  };

  const sendSimpleTest = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      setResult(data.success ? '✅ Simple test sent!' : '❌ Failed: ' + data.error);
    } catch (error) {
      setResult('❌ Error: ' + error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F23] to-[#1A1B3A] p-8">
      <div className="max-w-md mx-auto">
        <Card className="bg-[#1A1B3A] border-[#00D4FF]/20">
          <CardHeader>
            <CardTitle className="text-center text-white">
              📧 Test Email System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="email"
              placeholder="Enter test email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#0F0F23] border-[#00D4FF]/30 text-white"
            />
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => sendEmailTest('entry-workshop-cloud')}
                disabled={!email || loading}
                className="bg-gradient-to-r from-[#00D4FF] to-[#0EA5E9] text-xs"
              >
                ☁️ Entry+Workshop (Cloud)
              </Button>
              
              <Button
                onClick={() => sendEmailTest('entry-workshop-ai')}
                disabled={!email || loading}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-xs"
              >
                🤖 Entry+Workshop (AI)
              </Button>
              
              <Button
                onClick={() => sendEmailTest('entry-workshop-hackathon')}
                disabled={!email || loading}
                className="bg-gradient-to-r from-[#10B981] to-[#059669] text-xs"
              >
                💻 Entry+Workshop+Hackathon
              </Button>
              
              <Button
                onClick={() => sendEmailTest('entry-workshop-pitch')}
                disabled={!email || loading}
                className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-xs"
              >
                🚀 Entry+Workshop+Pitch
              </Button>
              
              <Button
                onClick={() => sendEmailTest('combo-hackathon')}
                disabled={!email || loading}
                className="bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-xs"
              >
                🎫 Combo (Hackathon)
              </Button>
              
              <Button
                onClick={() => sendEmailTest('combo-pitch')}
                disabled={!email || loading}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-xs"
              >
                🎫 Combo (Pitch)
              </Button>
              
              <Button
                onClick={() => sendSimpleTest()}
                disabled={!email || loading}
                variant="outline"
                className="border-[#00D4FF] text-[#00D4FF] text-xs col-span-2"
              >
                🧪 Simple SMTP Test
              </Button>
            </div>

            {result && (
              <div className={`p-3 rounded text-center ${
                result.includes('✅') ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
              }`}>
                {result}
              </div>
            )}

            <div className="text-xs text-gray-400 text-center space-y-1">
              <div>Test actual Samyukta 2025 ticket types from registration system</div>
              <div className="text-[10px] opacity-75">Based on real pricing: Entry+Workshop (₹800), Combo (₹900-₹950)</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}