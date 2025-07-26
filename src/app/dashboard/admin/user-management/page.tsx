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
  Save, 
  X, 
  Filter,
  Users,
  UserCheck
} from 'lucide-react';

export default function UserManagementPage() {
  const router = useRouter();
  const [, setCurrentUser] = useState<UserType | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  // Edit user modal
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [editForm, setEditForm] = useState<Partial<UserType>>({});
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Define functions before useEffect
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

  const loadAllUsers = useCallback(async () => {
    try {
      const usersData = await User.getAll();
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  const filterUsers = useCallback(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.college?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.dept?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  useEffect(() => {
    loadUserData();
    loadAllUsers();
  }, [loadUserData, loadAllUsers]);

  useEffect(() => {
    filterUsers();
  }, [filterUsers]);

  const handleEditUser = (user: UserType) => {
    setEditingUser(user);
    setEditForm({
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      college: user.college,
      dept: user.dept,
      year: user.year,
      track: user.track,
      linkedin: user.linkedin,
      instagram: user.instagram,
      portfolio: user.portfolio
    });
    setShowEditDialog(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    
    setUpdating(true);
    try {
      await User.updateProfile(editingUser.id, editForm);
      toast.success('User updated successfully');
      setShowEditDialog(false);
      loadAllUsers(); // Reload users
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error('Failed to update user');
    } finally {
      setUpdating(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'coordinator': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'participant': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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
      onRefresh={loadAllUsers}
      refreshing={loading}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-400" />
              User Management
            </h1>
            <p className="text-gray-400 mt-2">
              Manage all registered users and their details
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
                  placeholder="Search users by name, email, college, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40 bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="coordinator">Coordinator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 overflow-hidden">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-xl text-white">
              Users ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-700/50">
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    User
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Role
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    College & Department
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Year & Track
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-700">
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-700/30 transition-colors">
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {user.full_name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{user.college}</div>
                      <div className="text-sm text-gray-400">{user.dept}</div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{user.year}</div>
                      <div className="text-sm text-gray-400">{user.track}</div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditUser(user)}
                          className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>

                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No users found matching your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit User Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit User: {editingUser?.full_name}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={editForm.full_name || ''}
                    onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={editForm.role} onValueChange={(value) => setEditForm({...editForm, role: value as 'admin' | 'coordinator'})}>
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="coordinator">Coordinator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="college">College</Label>
                  <Input
                    id="college"
                    value={editForm.college || ''}
                    onChange={(e) => setEditForm({...editForm, college: e.target.value})}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dept">Department</Label>
                  <Input
                    id="dept"
                    value={editForm.dept || ''}
                    onChange={(e) => setEditForm({...editForm, dept: e.target.value})}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    value={editForm.year || ''}
                    onChange={(e) => setEditForm({...editForm, year: e.target.value})}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="track">Track</Label>
                <Input
                  id="track"
                  value={editForm.track || ''}
                  onChange={(e) => setEditForm({...editForm, track: e.target.value})}
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={editForm.linkedin || ''}
                    onChange={(e) => setEditForm({...editForm, linkedin: e.target.value})}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={editForm.instagram || ''}
                    onChange={(e) => setEditForm({...editForm, instagram: e.target.value})}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <Label htmlFor="portfolio">Portfolio</Label>
                  <Input
                    id="portfolio"
                    value={editForm.portfolio || ''}
                    onChange={(e) => setEditForm({...editForm, portfolio: e.target.value})}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>
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
                onClick={handleSaveUser}
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