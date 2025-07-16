'use client';

import { motion } from 'framer-motion';
import { Check, Download, Share2, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CompletedRegistrationData } from '@/lib/types';
import { useNavigation } from '@/hooks/useClientSide';

interface RegistrationSuccessProps {
  registration: CompletedRegistrationData;
  onDashboard: () => void;
}

export default function RegistrationSuccess({ registration, onDashboard }: RegistrationSuccessProps) {
  const { getCurrentURL, copyToClipboard, createObjectURL, revokeObjectURL } = useNavigation();
  const handleShare = async () => {
    if (navigator.share) {
      try {
        const currentOrigin = getCurrentURL();
        await navigator.share({
          title: 'Samyukta 2025 Registration Complete!',
          text: `I just registered for Samyukta 2025! Team ID: ${registration.team_id}`,
          url: currentOrigin
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    } else {
      // Fallback to clipboard
      const currentOrigin = getCurrentURL();
      copyToClipboard(
        `I just registered for Samyukta 2025! Team ID: ${registration.team_id}\n${currentOrigin}`
      );
    }
  };

  const handleDownloadReceipt = () => {
    const receiptData = {
      teamId: registration.team_id,
      college: registration.college,
      ticketType: registration.ticket_type,
      amount: registration.total_amount,
      transactionId: registration.transaction_id,
      members: registration.members.map(m => m.full_name),
      date: new Date().toLocaleDateString()
    };

    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `samyukta-2025-receipt-${registration.team_id}.json`;
    link.click();
    revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Success Header */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="text-center"
      >
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Registration Complete!</h2>
        <p className="text-gray-300 text-lg">
          Welcome to Samyukta 2025! Your journey begins now.
        </p>
      </motion.div>

      {/* Registration Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-800/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Team Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Team ID:</span>
                <span className="text-blue-400 font-mono">{registration.team_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">College:</span>
                <span className="text-white">{registration.college}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Team Size:</span>
                <span className="text-white">{registration.members.length} members</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ticket Type:</span>
                <Badge className="bg-blue-500/20 text-blue-300">
                  {registration.ticket_type}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Event Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Workshop:</span>
                <span className="text-purple-400">{registration.workshop_track}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Competition:</span>
                <span className="text-green-400">{registration.competition_track}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount Paid:</span>
                <span className="text-green-400 font-bold">₹{registration.total_amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Transaction ID:</span>
                <span className="text-white font-mono text-sm">{registration.transaction_id}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members */}
      <Card className="bg-gray-800/40 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {registration.members.map((member, index) => (
              <div
                key={member.participant_id}
                className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-white font-medium">{member.full_name}</div>
                    <div className="text-gray-400 text-sm">{member.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-blue-400 font-mono text-sm">{member.participant_id}</div>
                  <div className="text-green-400 font-mono text-xs">Key: {member.passkey}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-blue-400">What&apos;s Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <div>
                <div className="text-white font-medium">Payment Verification</div>
                <div className="text-gray-400 text-sm">Your payment will be verified within 24 hours</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <div>
                <div className="text-white font-medium">Email Confirmation</div>
                <div className="text-gray-400 text-sm">Check your email for detailed confirmation and credentials</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <div>
                <div className="text-white font-medium">Dashboard Access</div>
                <div className="text-gray-400 text-sm">Access your personalized dashboard for updates and QR codes</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <div>
                <div className="text-white font-medium">Event Day</div>
                <div className="text-gray-400 text-sm">Bring your QR code and valid ID for entry</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onDashboard}
          className="bg-gradient-to-r from-blue-500 to-violet-500 flex items-center"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Go to Dashboard
        </Button>
        
        <Button
          onClick={handleDownloadReceipt}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700 flex items-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Receipt
        </Button>
        
        <Button
          onClick={handleShare}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700 flex items-center"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Success
        </Button>
      </div>

      {/* Contact Information */}
      <Card className="bg-yellow-500/10 border-yellow-500/20">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-yellow-400 font-medium mb-2">Need Help?</div>
            <div className="text-gray-300 text-sm">
              Contact us at{' '}
              <a href="mailto:support@samyukta.anits.edu.in" className="text-yellow-400 hover:underline">
                support@samyukta.anits.edu.in
              </a>
              {' '}or join our{' '}
              <a href="https://wa.me/919876543210" className="text-green-400 hover:underline">
                WhatsApp group
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}