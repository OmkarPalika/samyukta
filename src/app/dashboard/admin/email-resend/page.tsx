'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Registration } from '@/entities/Registration';


export default function EmailResendPage() {
  const [teamId, setTeamId] = useState('');
  const [memberEmails, setMemberEmails] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    results: {
      total: number;
      successful: number;
      failed: number;
      failed_emails: string[];
    };
  } | null>(null);
  const [error, setError] = useState('');

  const handleResendEmails = async () => {
    if (!teamId.trim()) {
      setError('Team ID is required');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const emails = memberEmails.trim() 
        ? memberEmails.split(',').map(email => email.trim()).filter(Boolean)
        : undefined;

      const response = await Registration.resendConfirmationEmails(teamId.trim(), emails);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend emails');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout 
      title="Email Tools"
      subtitle="Send bulk emails and notifications"
    >
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
        <Card className="bg-gray-800/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Resend Registration Emails</CardTitle>
            <p className="text-gray-300">
              Use this tool to resend confirmation emails to team members
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-300">Team ID</Label>
              <Input
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                placeholder="Enter team ID (e.g., TEAM1234567890)"
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Member Emails (Optional)</Label>
              <Input
                value={memberEmails}
                onChange={(e) => setMemberEmails(e.target.value)}
                placeholder="email1@example.com, email2@example.com (leave empty for all members)"
                className="bg-gray-700/50 border-gray-600 text-white"
              />
              <p className="text-sm text-gray-400">
                Leave empty to send to all team members, or specify comma-separated emails
              </p>
            </div>

            <Button
              onClick={handleResendEmails}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Sending...' : 'Resend Emails'}
            </Button>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {result && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <h3 className="text-green-400 font-semibold mb-2">Email Resend Results</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300">
                    <strong>Message:</strong> {result.message}
                  </p>
                  <p className="text-gray-300">
                    <strong>Total:</strong> {result.results.total}
                  </p>
                  <p className="text-green-400">
                    <strong>Successful:</strong> {result.results.successful}
                  </p>
                  {result.results.failed > 0 && (
                    <>
                      <p className="text-red-400">
                        <strong>Failed:</strong> {result.results.failed}
                      </p>
                      <p className="text-red-400">
                        <strong>Failed Emails:</strong> {result.results.failed_emails.join(', ')}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h3 className="text-blue-400 font-semibold mb-2">How it works</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Each team member receives their own individual email</li>
                <li>• Each email contains unique login credentials (email + passkey)</li>
                <li>• Team information is shown for context, but credentials are personal</li>
                <li>• Check server logs for detailed email sending status</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </AdminLayout>
  );
}