'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import { UserManagementTable } from '@/components/admin/UserManagementTable';
import { User } from '@/entities/User';
import { User as UserType } from '@/lib/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Users,
  UserPlus,
  Save,
  X,
  RefreshCw
} from 'lucide-react';

export default function UserManagementPage() {
  const router = useRouter();

  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Create user modal
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createForm, setCreateForm] = useState<Partial<UserType & { password: string }>>({});
  const [creating, setCreating] = useState(false);

  const loadUserData = useCallback(async () => {
    try {
      const user = await User.me();
      if (!user || user.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

    } catch (error) {
      console.error('Failed to load user data:', error);
      router.push('/login');
    }
  }, [router]);

  const loadAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      const usersData = await User.getAll();
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllUsers();
    setRefreshing(false);
    toast.success('Users data refreshed');
  };

  useEffect(() => {
    loadUserData();
    loadAllUsers();
  }, [loadUserData, loadAllUsers]);

  const handleCreateUser = () => {
    setCreateForm({
      full_name: '',
      email: '',
      password: '',
      phone: '',
      whatsapp: '',
      role: 'participant',
      dept: '',
      year: '',
      designation: '',
      committee: '',
      track: '',
      linkedin: '',
      instagram: '',
      portfolio: ''
    });
    setShowCreateDialog(true);
  };

  const handleSaveNewUser = async () => {
    setCreating(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createForm),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      toast.success('User created successfully');
      setShowCreateDialog(false);
      loadAllUsers(); // Reload users
    } catch (error) {
      console.error('Failed to create user:', error);
      toast.error('Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      toast.success('User deleted successfully');
      loadAllUsers(); // Reload users
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user');
    }
  };

  if (loading) {
    return (
      <AdminLayout 
        title="User Management"
        subtitle="Manage users, roles, and permissions"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="User Management"
      subtitle="Manage users, roles, and permissions"
      showRefresh={true}
      onRefresh={handleRefresh}
      refreshing={refreshing}
    >
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
              User Management
            </h1>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">
              Manage all registered users with advanced table features
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={handleCreateUser}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* User Management Table */}
        <UserManagementTable
          users={users}
          loading={loading}
          onDeleteUser={handleDeleteUser}
          onCreateUser={handleCreateUser}
          onRefresh={loadAllUsers}
        />

        {/* Create User Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="create_full_name">Full Name *</Label>
                  <Input
                    id="create_full_name"
                    value={createForm.full_name || ''}
                    onChange={(e) => setCreateForm(prev => ({...prev, full_name: e.target.value}))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="create_email">Email *</Label>
                  <Input
                    id="create_email"
                    type="email"
                    value={createForm.email || ''}
                    onChange={(e) => setCreateForm(prev => ({...prev, email: e.target.value}))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="create_password">Password *</Label>
                  <Input
                    id="create_password"
                    type="password"
                    value={createForm.password || ''}
                    onChange={(e) => setCreateForm(prev => ({...prev, password: e.target.value}))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter password"
                  />
                </div>
                <div>
                  <Label htmlFor="create_role">Role</Label>
                  <Select
                    value={createForm.role || 'participant'}
                    onValueChange={(value: 'admin' | 'coordinator' | 'participant') => setCreateForm(prev => ({...prev, role: value}))}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="coordinator">Coordinator</SelectItem>
                      <SelectItem value="volunteer">Volunteer</SelectItem>
                      <SelectItem value="participant">Participant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="create_phone">Phone</Label>
                  <Input
                    id="create_phone"
                    value={createForm.phone || ''}
                    onChange={(e) => setCreateForm(prev => ({...prev, phone: e.target.value}))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="create_whatsapp">WhatsApp</Label>
                  <Input
                    id="create_whatsapp"
                    value={createForm.whatsapp || ''}
                    onChange={(e) => setCreateForm(prev => ({...prev, whatsapp: e.target.value}))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter WhatsApp number"
                  />
                </div>
              </div>

              {/* Academic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="create_dept">Department</Label>
                  <Input
                    id="create_dept"
                    value={createForm.dept || ''}
                    onChange={(e) => setCreateForm(prev => ({...prev, dept: e.target.value}))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter department"
                  />
                </div>
                <div>
                  <Label htmlFor="create_year">Year</Label>
                  <Select
                    value={createForm.year || ''}
                    onValueChange={(value) => setCreateForm(prev => ({...prev, year: value}))}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="1st">1st Year</SelectItem>
                      <SelectItem value="2nd">2nd Year</SelectItem>
                      <SelectItem value="3rd">3rd Year</SelectItem>
                      <SelectItem value="4th">4th Year</SelectItem>
                      <SelectItem value="postgraduate">Postgraduate</SelectItem>
                      <SelectItem value="faculty">Faculty</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Professional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="create_designation">Designation</Label>
                  <Input
                    id="create_designation"
                    value={createForm.designation || ''}
                    onChange={(e) => setCreateForm(prev => ({...prev, designation: e.target.value}))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter designation"
                  />
                </div>
                <div>
                  <Label htmlFor="create_committee">Committee</Label>
                  <Input
                    id="create_committee"
                    value={createForm.committee || ''}
                    onChange={(e) => setCreateForm(prev => ({...prev, committee: e.target.value}))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter committee"
                  />
                </div>
              </div>

              {/* Track Selection */}
              <div>
                <Label htmlFor="create_track">Track</Label>
                <Select
                  value={createForm.track || ''}
                  onValueChange={(value) => setCreateForm(prev => ({...prev, track: value}))}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select track" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="cloud">Cloud Computing</SelectItem>
                    <SelectItem value="ai">Artificial Intelligence</SelectItem>
                    <SelectItem value="both">Both Tracks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="create_linkedin">LinkedIn</Label>
                  <Input
                    id="create_linkedin"
                    value={createForm.linkedin || ''}
                    onChange={(e) => setCreateForm(prev => ({...prev, linkedin: e.target.value}))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="LinkedIn URL"
                  />
                </div>
                <div>
                  <Label htmlFor="create_instagram">Instagram</Label>
                  <Input
                    id="create_instagram"
                    value={createForm.instagram || ''}
                    onChange={(e) => setCreateForm(prev => ({...prev, instagram: e.target.value}))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Instagram handle"
                  />
                </div>
                <div>
                  <Label htmlFor="create_portfolio">Portfolio</Label>
                  <Input
                    id="create_portfolio"
                    value={createForm.portfolio || ''}
                    onChange={(e) => setCreateForm(prev => ({...prev, portfolio: e.target.value}))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Portfolio URL"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveNewUser}
                  disabled={creating || !createForm.full_name || !createForm.email || !createForm.password}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {creating ? 'Creating...' : 'Create User'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}