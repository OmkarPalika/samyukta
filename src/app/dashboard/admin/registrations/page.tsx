'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Download, Search, Filter } from 'lucide-react';
import Loading from '@/components/shared/Loading';

interface Registration {
  _id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  year: string;
  branch: string;
  ticketType: string;
  workshopTrack?: string;
  competitionTrack?: string;
  teamSize: number;
  totalAmount: number;
  paymentStatus: string;
  registrationDate: string;
}

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('/api/admin/registrations');
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data);
      }
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.college.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || reg.paymentStatus === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const exportData = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'College', 'Year', 'Branch', 'Ticket Type', 'Workshop Track', 'Competition Track', 'Team Size', 'Amount', 'Payment Status', 'Registration Date'],
      ...filteredRegistrations.map(reg => [
        reg.name,
        reg.email,
        reg.phone,
        reg.college,
        reg.year,
        reg.branch,
        reg.ticketType,
        reg.workshopTrack || '',
        reg.competitionTrack || '',
        reg.teamSize.toString(),
        reg.totalAmount.toString(),
        reg.paymentStatus,
        new Date(reg.registrationDate).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <Loading size="lg" text="Loading registrations..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Registration Management</h1>
          <p className="text-gray-400">Manage and view all event registrations</p>
        </div>
        <Button onClick={exportData} className="bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Registrations</p>
                <p className="text-2xl font-bold text-white">{registrations.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Confirmed</p>
                <p className="text-2xl font-bold text-green-400">
                  {registrations.filter(r => r.paymentStatus === 'confirmed').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {registrations.filter(r => r.paymentStatus === 'pending').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-white">
                  ₹{registrations.filter(r => r.paymentStatus === 'confirmed').reduce((sum, r) => sum + r.totalAmount, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, email, or college..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registrations Table */}
      <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            Registrations ({filteredRegistrations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-2 text-gray-300 font-medium">Name</th>
                  <th className="text-left py-3 px-2 text-gray-300 font-medium">Email</th>
                  <th className="text-left py-3 px-2 text-gray-300 font-medium">College</th>
                  <th className="text-left py-3 px-2 text-gray-300 font-medium">Ticket Type</th>
                  <th className="text-left py-3 px-2 text-gray-300 font-medium">Amount</th>
                  <th className="text-left py-3 px-2 text-gray-300 font-medium">Status</th>
                  <th className="text-left py-3 px-2 text-gray-300 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((registration) => (
                  <tr key={registration._id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                    <td className="py-3 px-2 text-white">{registration.name}</td>
                    <td className="py-3 px-2 text-gray-300">{registration.email}</td>
                    <td className="py-3 px-2 text-gray-300">{registration.college}</td>
                    <td className="py-3 px-2 text-gray-300">{registration.ticketType}</td>
                    <td className="py-3 px-2 text-white">₹{registration.totalAmount}</td>
                    <td className="py-3 px-2">
                      <Badge 
                        className={
                          registration.paymentStatus === 'confirmed' 
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : registration.paymentStatus === 'pending'
                            ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }
                      >
                        {registration.paymentStatus}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-gray-300">
                      {new Date(registration.registrationDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredRegistrations.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No registrations found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}