'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import { ClientAuth } from '@/lib/client-auth';
import { HelpTicket } from '@/entities/HelpTicket';
import { User as UserType } from '@/lib/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle, Mail, Phone, MapPin } from 'lucide-react';
import { PageLoading } from '@/components/shared/Loading';

export default function HelpPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await ClientAuth.me();
        if (!currentUser) {
          router.push('/login');
          return;
        }
        setUser(currentUser);
      } catch {
        setUser(null);
      }
      setLoading(false);
    };
    
    loadUserData();
  }, [router]);

  const handleHelpTicket = async (title: string, description: string, file?: File) => {
    if (!user) return;
    try {
      const ticketData = {
        submitted_by: user.id,
        title: title,
        description,
        priority: 'medium' as const,
        attachment_url: file ? URL.createObjectURL(file) : undefined
      };
      await HelpTicket.create(ticketData);
      alert('Support ticket submitted successfully!');
    } catch (error) {
      console.error('Help ticket error:', error);
      alert('Failed to submit support ticket. Please try again.');
    }
  };

  if (loading) {
    return <PageLoading text="Loading help..." />;
  }

  if (!user) {
    return router.push('/login');
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
        <div className="w-full max-w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
          <DashboardTabs />
          <div className="flex items-center mb-4 sm:mb-6 lg:hidden">
            <HelpCircle className="w-5 h-5 mr-2 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Help & Support</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Submit Support Ticket</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const title = formData.get('title') as string;
                  const description = formData.get('description') as string;
                  const file = formData.get('file') as File;
                  handleHelpTicket(title, description, file);
                }} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm sm:text-base">Issue Title</Label>
                    <Input name="title" className="bg-gray-700 border-gray-600 text-white text-sm sm:text-base" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm sm:text-base">Description</Label>
                    <Textarea name="description" className="bg-gray-700 border-gray-600 text-white text-sm sm:text-base" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm sm:text-base">Attachment (optional)</Label>
                    <Input type="file" name="file" className="bg-gray-700 border-gray-600 text-white text-sm sm:text-base" />
                  </div>
                  <Button type="submit" className="w-full text-sm sm:text-base">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Submit Ticket
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <h4 className="text-white font-medium mb-1">How do I register for competitions?</h4>
                  <p className="text-gray-400 text-sm">Go to the Competitions tab and click on &quot;Join Competition&quot; to register for available events.</p>
                </div>
                
                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <h4 className="text-white font-medium mb-1">Where can I find my QR code?</h4>
                  <p className="text-gray-400 text-sm">Your personal QR code is displayed on the main dashboard card. Team QR codes are available in the Team tab.</p>
                </div>
                
                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <h4 className="text-white font-medium mb-1">How do I contact the organizers?</h4>
                  <p className="text-gray-400 text-sm">Submit a help ticket through this tab or email us at support@samyukta2025.com</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 mt-6">
            <CardHeader>
              <CardTitle className="text-white">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-0.5">
                    <Mail className="w-3 h-3 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Email Support</h4>
                    <p className="text-gray-400 text-sm">support@samyukta2025.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mr-3 mt-0.5">
                    <Phone className="w-3 h-3 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Helpline</h4>
                    <p className="text-gray-400 text-sm">+91 9876543210 (10 AM - 6 PM)</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 mt-0.5">
                    <MapPin className="w-3 h-3 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Help Desk</h4>
                    <p className="text-gray-400 text-sm">Main Entrance, ANITS Campus</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}