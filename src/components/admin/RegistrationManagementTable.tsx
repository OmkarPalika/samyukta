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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Edit, 
  Eye,
  Mail,
  ChevronLeft, 
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  Clock,
  AlertCircle,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface TeamMember {
  _id: string;
  participant_id?: string;
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

interface RegistrationManagementTableProps {
  registrations: Registration[];
  loading: boolean;
  onRefresh: () => void;
}

export function RegistrationManagementTable({
  registrations,
  loading,
  onRefresh
}: RegistrationManagementTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // View registration modal
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);

  // Edit member modal
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [editForm, setEditForm] = useState<Partial<TeamMember>>({});
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Edit registration modal
  const [editingRegistration, setEditingRegistration] = useState<Registration | null>(null);
  const [registrationForm, setRegistrationForm] = useState<Partial<Registration>>({});
  const [showEditRegistrationDialog, setShowEditRegistrationDialog] = useState(false);

  const [updating, setUpdating] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  // Custom global filter function for comprehensive search
  const customGlobalFilter = (row: { original: Registration }, columnId: string, value: string) => {
    if (!value || value.trim() === '') return true;
    
    const searchValue = value.toLowerCase().trim();
    const registration = row.original as Registration;
    
    // Search in registration fields
    const registrationFields = [
      registration.team_id,
      registration.college,
      registration.ticket_type,
      registration.workshop_track,
      registration.competition_track,
      registration.transaction_id,
      registration.status,
      registration.registration_code,
      registration.total_amount?.toString(),
      registration.team_size?.toString(),
    ];
    
    // Search in member fields
    const memberFields = registration.members?.flatMap(member => [
      member.full_name,
      member.email,
      member.phone,
      member.whatsapp,
      member.year,
      member.department,
      member.college,
      member.gender,
      member.food_preference,
      member.club_name,
    ]) || [];
    
    // Combine all searchable fields and filter out null/undefined values
    const allFields = [...registrationFields, ...memberFields]
      .filter(field => field != null && field !== '');
    
    // Check if any field contains the search value
    return allFields.some(field => 
      field && field.toString().toLowerCase().includes(searchValue)
    );
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
      console.log('Updating member with data:', editForm);
      console.log('Editing member object:', editingMember);
      console.log('Member ID being used:', editingMember._id);
      console.log('Participant ID available:', editingMember.participant_id);
      
      // Use participant_id if available, otherwise use _id
      const memberId = editingMember.participant_id || editingMember._id;
      console.log('Using member identifier:', memberId);
      console.log('Available identifiers:', {
        _id: editingMember._id,
        participant_id: editingMember.participant_id,
        chosen: memberId
      });
      
      const response = await fetch(`/api/team-members/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Update failed with status:', response.status, 'Error:', errorData);
        throw new Error(errorData.error || `Failed to update member (${response.status})`);
      }

      toast.success('Member updated successfully');
      setShowEditDialog(false);
      onRefresh();
    } catch (error) {
      console.error('Failed to update member:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update member');
    } finally {
      setUpdating(false);
    }
  };

  const handleEditRegistration = (registration: Registration) => {
    setEditingRegistration(registration);
    setRegistrationForm({
      college: registration.college,
      ticket_type: registration.ticket_type,
      workshop_track: registration.workshop_track,
      competition_track: registration.competition_track,
      total_amount: registration.total_amount,
      transaction_id: registration.transaction_id,
      status: registration.status
    });
    setShowEditRegistrationDialog(true);
  };

  const handleSaveRegistration = async () => {
    if (!editingRegistration) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/registrations/${editingRegistration._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationForm),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update registration');
      }

      toast.success('Registration updated successfully');
      setShowEditRegistrationDialog(false);
      onRefresh();
    } catch (error) {
      console.error('Failed to update registration:', error);
      toast.error('Failed to update registration');
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
      onRefresh();
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

  const columns: ColumnDef<Registration>[] = [
    {
      accessorKey: 'team_id',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-gray-700 text-gray-300 -ml-4"
        >
          Team Details
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
          <div className="font-medium text-white">{row.original.team_id}</div>
          <div className="text-sm text-gray-400">{row.original.college}</div>
          <div className="text-sm text-gray-400">{row.original.team_size} members</div>
        </div>
      ),
    },
    {
      accessorKey: 'ticket_type',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-gray-700 text-gray-300 -ml-4"
        >
          Registration Info
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
          <div className="text-sm text-white">{row.original.ticket_type}</div>
          <div className="text-sm text-gray-400">Workshop: {row.original.workshop_track}</div>
          <div className="text-sm text-gray-400">Competition: {row.original.competition_track}</div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-gray-700 text-gray-300 -ml-4"
        >
          Status
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
        <Badge className={getStatusBadgeColor(getValue() as string)}>
          <span className="flex items-center gap-1">
            {getStatusIcon(getValue() as string)}
            {(getValue() as string).replace('_', ' ')}
          </span>
        </Badge>
      ),
      filterFn: 'equals',
    },
    {
      accessorKey: 'total_amount',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-gray-700 text-gray-300 -ml-4"
        >
          Amount
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
          <div className="text-sm text-white">₹{row.original.total_amount}</div>
          {row.original.transaction_id && (
            <div className="text-sm text-gray-400">TXN: {row.original.transaction_id}</div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-gray-700 text-gray-300 -ml-4"
        >
          Created
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
        <div className="text-sm text-gray-400">
          {new Date(getValue() as string).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewRegistration(row.original)}
            className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Select
            value={row.original.status}
            onValueChange={(value) => handleUpdateStatus(row.original._id, value)}
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
            onClick={() => handleResendConfirmation(row.original)}
            disabled={sendingEmail}
            className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white disabled:opacity-50"
          >
            <Mail className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: registrations,
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
    globalFilterFn: customGlobalFilter,
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
                placeholder="Search by name, mobile, college, team ID, transaction ID, etc..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <Select
              value={(table.getColumn('status')?.getFilterValue() as string) ?? 'all'}
              onValueChange={(value) =>
                table.getColumn('status')?.setFilterValue(value === 'all' ? '' : value)
              }
            >
              <SelectTrigger className="w-full sm:w-[180px] bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Filter by status" />
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
                      Loading registrations...
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
                      No registrations found.
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
              of {table.getFilteredRowModel().rows.length} registrations
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

      {/* View Registration Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registration Details: {selectedRegistration?.team_id}</DialogTitle>
            <DialogDescription>
              View and manage registration information, team members, and payment details.
            </DialogDescription>
          </DialogHeader>

          {selectedRegistration && (
            <div className="space-y-6">
              {/* Registration Info */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Registration Information</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditRegistration(selectedRegistration)}
                    className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-gray-300">Team ID</Label>
                    <p className="text-white font-medium">{selectedRegistration.team_id}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-300">College</Label>
                    <p className="text-white">{selectedRegistration.college}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-300">Ticket Type</Label>
                    <p className="text-white">{selectedRegistration.ticket_type}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-300">Total Amount</Label>
                    <p className="text-white">₹{selectedRegistration.total_amount}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-300">Workshop Track</Label>
                    <p className="text-white">{selectedRegistration.workshop_track}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-300">Competition Track</Label>
                    <p className="text-white">{selectedRegistration.competition_track}</p>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Team Members</h3>
                <div className="space-y-4">
                  {selectedRegistration.members.map((member, index) => (
                    <div key={member._id} className="bg-gray-600/30 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-medium">Member {index + 1}</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditMember(member)}
                          className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-gray-300">Name</Label>
                          <p className="text-white">{member.full_name}</p>
                        </div>
                        <div>
                          <Label className="text-gray-300">Email</Label>
                          <p className="text-white break-all">{member.email}</p>
                        </div>
                        <div>
                          <Label className="text-gray-300">WhatsApp</Label>
                          <p className="text-white">{member.whatsapp}</p>
                        </div>
                        <div>
                          <Label className="text-gray-300">Year & Department</Label>
                          <p className="text-white">{member.year} - {member.department}</p>
                        </div>
                        <div>
                          <Label className="text-gray-300">Accommodation</Label>
                          <p className="text-white">{member.accommodation ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-300">Food Preference</Label>
                          <p className="text-white">{member.food_preference}</p>
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
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>
              Update team member information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Full Name</Label>
                <Input
                  value={editForm.full_name || ''}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Email</Label>
                <Input
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">WhatsApp</Label>
                <Input
                  value={editForm.whatsapp || ''}
                  onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Year</Label>
                <Input
                  value={editForm.year || ''}
                  onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Department</Label>
                <Input
                  value={editForm.department || ''}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Food Preference</Label>
                <Select
                  value={editForm.food_preference || 'veg'}
                  onValueChange={(value: 'veg' | 'non-veg') => setEditForm({ ...editForm, food_preference: value })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="veg">Vegetarian</SelectItem>
                    <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSaveMember}
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

      {/* Edit Registration Dialog */}
      <Dialog open={showEditRegistrationDialog} onOpenChange={setShowEditRegistrationDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Registration</DialogTitle>
            <DialogDescription>
              Update registration information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">College</Label>
                <Input
                  value={registrationForm.college || ''}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, college: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Total Amount</Label>
                <Input
                  type="number"
                  value={registrationForm.total_amount || ''}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, total_amount: Number(e.target.value) })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Ticket Type</Label>
                <Select
                  value={registrationForm.ticket_type || 'Combo'}
                  onValueChange={(value: 'Combo' | 'Custom') => setRegistrationForm({ ...registrationForm, ticket_type: value })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Combo">Combo</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">Status</Label>
                <Select
                  value={registrationForm.status || 'pending'}
                  onValueChange={(value: 'completed' | 'pending_review' | 'confirmed' | 'pending') => 
                    setRegistrationForm({ ...registrationForm, status: value })
                  }
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="pending_review">Pending Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">Workshop Track</Label>
                <Select
                  value={registrationForm.workshop_track || 'None'}
                  onValueChange={(value: 'Cloud' | 'AI' | 'None') => setRegistrationForm({ ...registrationForm, workshop_track: value })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Cloud">Cloud</SelectItem>
                    <SelectItem value="AI">AI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">Competition Track</Label>
                <Select
                  value={registrationForm.competition_track || 'None'}
                  onValueChange={(value: 'Hackathon' | 'Pitch' | 'None') => setRegistrationForm({ ...registrationForm, competition_track: value })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Hackathon">Hackathon</SelectItem>
                    <SelectItem value="Pitch">Pitch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Transaction ID</Label>
              <Input
                value={registrationForm.transaction_id || ''}
                onChange={(e) => setRegistrationForm({ ...registrationForm, transaction_id: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowEditRegistrationDialog(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSaveRegistration}
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