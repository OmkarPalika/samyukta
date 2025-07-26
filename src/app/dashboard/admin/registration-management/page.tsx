'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import { User } from '@/entities/User';
import { User as UserType } from '@/lib/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Search,
  Edit,
  Mail,
  Save,
  X,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText
} from 'lucide-react';

interface TeamMember {
  _id: string;
  full_name: string;
  email: string;
  phone?: string;
  whatsapp: string;
  year: string;
  department: string;
  college?: string;
  gender?: string;
  accommodation: boolean;
  food_preference: 'veg' | 'non-veg';
  is_club_lead?: boolean;
  club_name?: string;
}

interface Registration {
  _id: string;
  team_id: string;
  college: string;
  team_size: number;
  ticket_type: 'Combo' | 'Custom';
  workshop_track: 'Cloud' | 'AI' | 'None';
  competition_track: 'Hackathon' | 'Pitch' | 'None';
  total_amount: number;
  transaction_id?: string;
  payment_screenshot_url?: string;
  status: 'completed' | 'pending_review' | 'confirmed' | 'pending';
  registration_code?: string;
  qr_code_url?: string;
  created_at: string;
  updated_at: string;
  members: TeamMember[];
}

export default function RegistrationManagementPage() {
  const router = useRouter();
  const [, setCurrentUser] = useState<UserType | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // View registration modal
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);

  // Edit member modal
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [editForm, setEditForm] = useState<Partial<TeamMember>>({});
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Status update
  const [updating, setUpdating] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  const loadUserData = useCallback(async () => {
    try {
      const user = await User.me();
      if (!user || user.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      setCurrentUser(user);
    } catch (error) {
      console.error('Failed to load user data:', error);
      router.push('/login');
    }
  }, [router]);

  const loadRegistrations = useCallback(async () => {
    try {
      const response = await fetch('/api/registrations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch registrations');
      }

      const data = await response.json();
      setRegistrations(data.registrations || []);
    } catch (error) {
      console.error('Failed to load registrations:', error);
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  }, []);

  const filterRegistrations = useCallback(() => {
    let filtered = registrations;

    if (searchTerm) {
      filtered = filtered.filter(reg =>
        reg.team_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.members.some(member =>
          member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(reg => reg.status === statusFilter);
    }

    setFilteredRegistrations(filtered);
  }, [registrations, searchTerm, statusFilter]);

  useEffect(() => {
    loadUserData();
    loadRegistrations();
  }, [loadUserData, loadRegistrations]);

  useEffect(() => {
    filterRegistrations();
  }, [filterRegistrations]);

  const handleViewRegistration = (registration: Registration) => {
    setSelectedRegistration(registration);
    setShowViewDialog(true);
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setEditForm({
      full_name: member.full_name,
      email: member.email,
      phone: member.phone,
      whatsapp: member.whatsapp,
      year: member.year,
      department: member.department,
      college: member.college,
      gender: member.gender,
      accommodation: member.accommodation,
      food_preference: member.food_preference,
      is_club_lead: member.is_club_lead,
      club_name: member.club_name
    });
    setShowEditDialog(true);
  };

  const handleSaveMember = async () => {
    if (!editingMember) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/team-members/${editingMember._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update member');
      }

      toast.success('Member updated successfully');
      setShowEditDialog(false);
      loadRegistrations(); // Reload registrations
    } catch (error) {
      console.error('Failed to update member:', error);
      toast.error('Failed to update member');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateStatus = async (registrationId: string, newStatus: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/registrations/${registrationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      toast.success('Registration status updated successfully');
      loadRegistrations(); // Reload registrations
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleResendConfirmation = async (registration: Registration) => {
    setSendingEmail(true);
    try {
      const response = await fetch('/api/email/resend-registration-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ registrationId: registration._id }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to resend confirmation');
      }

      toast.success(`Confirmation email sent for team ${registration.team_id}`);
    } catch (error) {
      console.error('Failed to resend confirmation:', error);
      toast.error('Failed to resend confirmation email');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleResendMemberEmail = async (member: TeamMember) => {
    setSendingEmail(true);
    try {
      const response = await fetch('/api/email/resend-member-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberId: member._id,
          memberEmail: member.email,
          teamId: selectedRegistration?.team_id
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to resend member confirmation');
      }

      toast.success(`Confirmation email sent to ${member.full_name} (${member.email})`);
    } catch (error) {
      console.error('Failed to resend member confirmation:', error);
      toast.error('Failed to resend confirmation email to member');
    } finally {
      setSendingEmail(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending_review': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'pending': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending_review': return <Clock className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <AdminLayout 
        title="Registration Management"
        subtitle="Manage event registrations and team details"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading registrations...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Registration Management"
      subtitle="Manage event registrations and team details"
      showRefresh={true}
      onRefresh={loadRegistrations}
      refreshing={loading}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-400" />
              Registration Management
            </h1>
            <p className="text-gray-400 mt-2">
              Manage event registrations and team details
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by team ID, college, or member name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="pending_review">Pending Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Registrations Table */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 overflow-hidden">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-xl text-white">
              Registrations ({filteredRegistrations.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">

            <Table>
              <TableHeader className="bg-gray-700/50">
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Team Details
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Registration Info
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Amount
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-700">
                {filteredRegistrations.map((registration) => (
                  <TableRow key={registration._id} className="hover:bg-gray-700/30 transition-colors">
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {registration.team_id}
                        </div>
                        <div className="text-sm text-gray-400">
                          {registration.college}
                        </div>
                        <div className="text-sm text-gray-400">
                          {registration.team_size} members
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{registration.ticket_type}</div>
                      <div className="text-sm text-gray-400">
                        Workshop: {registration.workshop_track}
                      </div>
                      <div className="text-sm text-gray-400">
                        Competition: {registration.competition_track}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusBadgeColor(registration.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(registration.status)}
                          {registration.status.replace('_', ' ')}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">₹{registration.total_amount}</div>
                      {registration.transaction_id && (
                        <div className="text-sm text-gray-400">
                          TXN: {registration.transaction_id}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewRegistration(registration)}
                          className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Select
                          value={registration.status}
                          onValueChange={(value) => handleUpdateStatus(registration._id, value)}
                        >
                          <SelectTrigger className="w-32 h-8 bg-gray-700 border-gray-600 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="pending_review">Pending Review</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResendConfirmation(registration)}
                          disabled={sendingEmail}
                          className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          {sendingEmail ? 'Sending...' : 'Resend'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredRegistrations.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No registrations found matching your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Registration Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent aria-describedby='registration-details' className="bg-gray-800 border-gray-700 text-white max-w-6xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registration Details: {selectedRegistration?.team_id}</DialogTitle>
            </DialogHeader>

            {selectedRegistration && (
              <div className="space-y-6">
                {/* Registration Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-700/30 rounded-lg">
                  <div className='space-y-1'>
                    <Label className="text-gray-300">Team ID</Label>
                    <p className="text-white font-medium">{selectedRegistration.team_id}</p>
                  </div>
                  <div className='space-y-1'>
                    <Label className="text-gray-300">College</Label>
                    <p className="text-white">{selectedRegistration.college}</p>
                  </div>
                  <div className='space-y-1'>
                    <Label className="text-gray-300">Ticket Type</Label>
                    <p className="text-white">{selectedRegistration.ticket_type}</p>
                  </div>
                  <div className='space-y-1'>
                    <Label className="text-gray-300">Total Amount</Label>
                    <p className="text-white">₹{selectedRegistration.total_amount}</p>
                  </div>
                  <div className='space-y-1'>
                    <Label className="text-gray-300">Workshop Track</Label>
                    <p className="text-white">{selectedRegistration.workshop_track}</p>
                  </div>
                  <div className='space-y-1'>
                    <Label className="text-gray-300">Competition Track</Label>
                    <p className="text-white">{selectedRegistration.competition_track}</p>
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Team Members ({selectedRegistration.members.length})</h3>
                  <div className="space-y-3">
                    {selectedRegistration.members.map((member) => (
                      <div key={member._id} className="p-4 bg-gray-700/30 rounded-lg">
                        <div className="flex flex-col space-y-4 justify-between items-start">
                          <div className="flex-1 space-y-4">
                            {/* First Row - Name and Email (Email gets more space) */}
                            <div className="grid grid-cols-5 gap-4">
                              <div className="col-span-2">
                                <Label className="text-gray-300 mb-1">Name</Label>
                                <p className="text-white font-medium">{member.full_name}</p>
                                {member.is_club_lead && (
                                  <Badge className="mt-1 bg-purple-500/20 text-purple-400 border-purple-500/30">
                                    Club Lead
                                  </Badge>
                                )}
                              </div>
                              <div className="col-span-3">
                                <Label className="text-gray-300 mb-1">Email</Label>
                                <p className="text-white break-all text-sm leading-relaxed bg-gray-800/30 p-2 rounded border border-gray-600/30">{member.email}</p>
                              </div>
                            </div>

                            {/* Second Row - Contact and Academic */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-gray-300 mb-1">Contact</Label>
                                <p className="text-white">{member.whatsapp}</p>
                                {member.phone && <p className="text-gray-400 text-sm">{member.phone}</p>}
                              </div>
                              <div>
                                <Label className="text-gray-300 mb-1">Academic</Label>
                                <p className="text-white">{member.year} - {member.department}</p>
                              </div>
                            </div>

                            {/* Third Row - Preferences and Gender */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-gray-300 mb-1">Preferences</Label>
                                <p className="text-gray-400 text-sm">
                                  Food: {member.food_preference}
                                </p>
                                <p className="text-gray-400 text-sm">
                                  Accommodation: {member.accommodation ? 'Yes' : 'No'}
                                </p>
                              </div>
                              <div>
                                <Label className="text-gray-300 mb-1">Gender</Label>
                                <p className="text-white">{member.gender || 'Not specified'}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 w-full">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditMember(member)}
                              className="w-1/2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResendMemberEmail(member)}
                              disabled={sendingEmail}
                              className="w-1/2 border-green-500 text-green-400 hover:bg-green-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Mail className="h-3 w-3 mr-1" />
                              {sendingEmail ? 'Sending...' : 'Resend'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Member Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit Member: {editingMember?.full_name}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={editForm.full_name || ''}
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-sm"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={editForm.whatsapp || ''}
                    onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    value={editForm.year || ''}
                    onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={editForm.department || ''}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="college">College</Label>
                <Input
                  id="college"
                  value={editForm.college || ''}
                  onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={editForm.gender} onValueChange={(value) => setEditForm({ ...editForm, gender: value })}>
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="food_preference">Food Preference</Label>
                  <Select value={editForm.food_preference} onValueChange={(value) => setEditForm({ ...editForm, food_preference: value as 'veg' | 'non-veg' })}>
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="veg">Vegetarian</SelectItem>
                      <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accommodation">Accommodation Required</Label>
                  <Select value={editForm.accommodation?.toString()} onValueChange={(value) => setEditForm({ ...editForm, accommodation: value === 'true' })}>
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="is_club_lead">Club Lead</Label>
                  <Select value={editForm.is_club_lead?.toString()} onValueChange={(value) => setEditForm({ ...editForm, is_club_lead: value === 'true' })}>
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {editForm.is_club_lead && (
                <div>
                  <Label htmlFor="club_name">Club Name</Label>
                  <Input
                    id="club_name"
                    value={editForm.club_name || ''}
                    onChange={(e) => setEditForm({ ...editForm, club_name: e.target.value })}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSaveMember}
                disabled={updating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {updating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}