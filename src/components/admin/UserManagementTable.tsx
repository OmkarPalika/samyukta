'use client';

import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  PaginationState,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  UserPlus,
  Save,
  X,
  Key
} from 'lucide-react';
import { User as UserType } from '@/lib/types';
import { toast } from 'sonner';

interface UserManagementTableProps {
  users: UserType[];
  loading: boolean;
  onDeleteUser: (userId: string) => void;
  onCreateUser: () => void;
  onRefresh: () => void;
}

export function UserManagementTable({
  users,
  loading,
  onDeleteUser,
  onCreateUser,
  onRefresh
}: UserManagementTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Edit dialog state
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [editForm, setEditForm] = useState<Partial<UserType>>({});
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [updating, setUpdating] = useState(false);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'coordinator':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'volunteer':
        return 'bg-green-600 hover:bg-green-700 text-white';
      default:
        return 'bg-gray-600 hover:bg-gray-700 text-white';
    }
  };

  const handleEditClick = (user: UserType) => {
    setEditingUser(user);
    setEditForm({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone || user.mobile_number,
      role: user.role,
      academic: user.academic || { year: user.year || '', department: user.dept || '' },
      position: user.position,
      designation: user.designation,
      committee: user.committee
    });
    setShowEditDialog(true);
  };

  const handleResetPassword = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to reset password for ${userEmail}?`)) return;

    try {
      const response = await fetch(`/api/users/${userId}/reset-password`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      const data = await response.json();
      toast.success(`Password reset successfully. New password: ${data.newPassword}`);
    } catch (error) {
      console.error('Failed to reset password:', error);
      toast.error('Failed to reset password');
    }
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    
    setUpdating(true);
    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      toast.success('User updated successfully');
      setShowEditDialog(false);
      onRefresh();
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error('Failed to update user');
    } finally {
      setUpdating(false);
    }
  };

  const columns: ColumnDef<UserType>[] = [
    {
      accessorKey: 'full_name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-gray-700 text-gray-300 -ml-4"
        >
          Name
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-white">{row.original.full_name}</div>
          <div className="text-sm text-gray-400 break-all">{row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-gray-700 text-gray-300 -ml-4"
        >
          Role
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ getValue }) => (
        <Badge className={getRoleBadgeColor(getValue() as string)}>
          {getValue() as string}
        </Badge>
      ),
      filterFn: 'equals',
    },
    {
      accessorKey: 'contact',
      header: 'Contact',
      cell: ({ row }) => (
        <div className="text-sm">
          <div className="text-white">{row.original.phone || row.original.mobile_number || 'N/A'}</div>
        </div>
      ),
    },
    {
      accessorKey: 'academic',
      header: 'Academic',
      cell: ({ row }) => (
        <div className="text-sm">
          <div className="text-white">{row.original.academic?.year || row.original.year || 'N/A'}</div>
          <div className="text-gray-400">{row.original.academic?.department || row.original.dept || 'N/A'}</div>
        </div>
      ),
    },
    {
      accessorKey: 'position',
      header: 'Position',
      cell: ({ row }) => (
        <div className="text-sm">
          <div className="text-white">{row.original.position || row.original.designation || 'N/A'}</div>
          <div className="text-gray-400">{row.original.committee || 'N/A'}</div>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEditClick(row.original)}
            className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white h-8 w-8 p-0"
            title="Edit User"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleResetPassword(row.original.id, row.original.email)}
            className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-white h-8 w-8 p-0"
            title="Reset Password"
          >
            <Key className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDeleteUser(row.original.id)}
            className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white h-8 w-8 p-0"
            title="Delete User"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: 'includesString',
  });

  return (
    <>
      <Card className="bg-gray-800/40 border-gray-700">
        <CardContent className="p-6">
          {/* Header with Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <Select
              value={(table.getColumn('role')?.getFilterValue() as string) ?? 'all'}
              onValueChange={(value) =>
                table.getColumn('role')?.setFilterValue(value === 'all' ? '' : value)
              }
            >
              <SelectTrigger className="w-full sm:w-[180px] bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="coordinator">Coordinator</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
                <SelectItem value="participant">Participant</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={onCreateUser}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          {/* Data Table */}
          <div className="rounded-md border border-gray-700 overflow-hidden">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-gray-700 hover:bg-gray-700/50">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-gray-300">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-gray-400">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="border-gray-700 hover:bg-gray-700/30"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-4">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-gray-400">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-gray-400">
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{' '}
              of {table.getFilteredRowModel().rows.length} users
            </div>
            <div className="flex items-center space-x-2">
              <Select
                value={table.getState().pagination.pageSize.toString()}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger className="w-20 bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-400">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User: {editingUser?.full_name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Name and Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={editForm.full_name || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={editForm.role || 'participant'}
                  onValueChange={(value: 'admin' | 'coordinator' | 'participant' | 'volunteer') => setEditForm(prev => ({ ...prev, role: value }))}
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

            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <Label htmlFor="phone">Contact</Label>
                <Input
                  id="phone"
                  value={editForm.phone || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">Academic</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="academic_year">Year</Label>
                  <Select
                    value={editForm.academic?.year || ''}
                    onValueChange={(value) => setEditForm(prev => ({ 
                      ...prev, 
                      academic: { 
                        ...prev.academic, 
                        year: value,
                        department: prev.academic?.department || ''
                      }
                    }))}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select academic year" />
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
                <div>
                  <Label htmlFor="academic_department">Department</Label>
                  <Input
                    id="academic_department"
                    value={editForm.academic?.department || ''}
                    onChange={(e) => setEditForm(prev => ({ 
                      ...prev, 
                      academic: { 
                        ...prev.academic, 
                        year: prev.academic?.year || '',
                        department: e.target.value
                      }
                    }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter department"
                  />
                </div>
              </div>
            </div>

            {/* Position Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">Position</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="position">Designation</Label>
                  <Input
                    id="position"
                    value={editForm.position || editForm.designation || ''}
                    onChange={(e) => setEditForm(prev => ({ 
                      ...prev, 
                      position: e.target.value,
                      designation: e.target.value // Keep for backward compatibility
                    }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter designation"
                  />
                </div>
                <div>
                  <Label htmlFor="committee">Committee</Label>
                  <Input
                    id="committee"
                    value={editForm.committee || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, committee: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter committee"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSaveUser}
                disabled={updating}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {updating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}