'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Download, FileText, Table, BarChart3, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface ExportFilters {
  dateRange: string;
  includeFields: Record<string, boolean>;
}

interface ExportToolsProps {
  onExport?: (type: string, format: string, filters: ExportFilters) => void;
}

export function ExportTools({ onExport }: ExportToolsProps) {
  const [exportType, setExportType] = useState<'users' | 'registrations' | 'analytics' | 'revenue'>('users');
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [includeFields, setIncludeFields] = useState({
    personal: true,
    contact: true,
    academic: true,
    registration: true,
    payment: false,
    timestamps: false
  });
  const [exporting, setExporting] = useState(false);

  const exportOptions = {
    users: {
      title: 'User Data Export',
      icon: <FileText className="h-5 w-5 text-blue-400" />,
      description: 'Export user profiles and registration data',
      fields: [
        { key: 'personal', label: 'Personal Info (Name, Email)', default: true },
        { key: 'contact', label: 'Contact Details (Phone, WhatsApp)', default: true },
        { key: 'academic', label: 'Academic Info (College, Department, Year)', default: true },
        { key: 'registration', label: 'Registration Status', default: true },
        { key: 'payment', label: 'Payment Information', default: false },
        { key: 'timestamps', label: 'Created/Updated Dates', default: false }
      ]
    },
    registrations: {
      title: 'Registration Data Export',
      icon: <Table className="h-5 w-5 text-green-400" />,
      description: 'Export team registrations and member details',
      fields: [
        { key: 'team', label: 'Team Information', default: true },
        { key: 'members', label: 'Team Member Details', default: true },
        { key: 'payment', label: 'Payment & Transaction Details', default: true },
        { key: 'preferences', label: 'Food & Accommodation Preferences', default: true },
        { key: 'tracks', label: 'Workshop & Competition Tracks', default: true },
        { key: 'timestamps', label: 'Registration Timeline', default: false }
      ]
    },
    analytics: {
      title: 'Analytics Report Export',
      icon: <BarChart3 className="h-5 w-5 text-purple-400" />,
      description: 'Export charts and statistical analysis',
      fields: [
        { key: 'registration_trends', label: 'Registration Trends', default: true },
        { key: 'demographics', label: 'User Demographics', default: true },
        { key: 'participation', label: 'Event Participation Stats', default: true },
        { key: 'revenue', label: 'Revenue Analytics', default: true },
        { key: 'summary', label: 'Executive Summary', default: true },
        { key: 'charts', label: 'Chart Images (PDF only)', default: false }
      ]
    },
    revenue: {
      title: 'Financial Report Export',
      icon: <Calendar className="h-5 w-5 text-yellow-400" />,
      description: 'Export payment and revenue data',
      fields: [
        { key: 'transactions', label: 'Transaction Details', default: true },
        { key: 'revenue_summary', label: 'Revenue Summary', default: true },
        { key: 'payment_status', label: 'Payment Status Breakdown', default: true },
        { key: 'refunds', label: 'Refunds & Cancellations', default: false },
        { key: 'tax_info', label: 'Tax Information', default: false },
        { key: 'reconciliation', label: 'Bank Reconciliation Data', default: false }
      ]
    }
  };

  const handleExport = async () => {
    setExporting(true);
    
    try {
      const filters = {
        dateRange,
        includeFields,
        exportType,
        exportFormat
      };

      if (onExport) {
        await onExport(exportType, exportFormat, filters);
      } else {
        // Default export logic
        const response = await fetch('/api/admin/export', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(filters),
        });

        if (!response.ok) {
          throw new Error('Export failed');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `samyukta_${exportType}_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }

      toast.success(`${exportOptions[exportType].title} exported successfully!`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const currentOption = exportOptions[exportType];

  return (
    <Card className="bg-gray-800/40 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Download className="h-5 w-5 text-blue-400" />
          Data Export Tools
        </CardTitle>
        <p className="text-gray-400 text-sm">
          Export data in various formats for analysis and reporting
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Export Type Selection */}
        <div className="space-y-3">
          <Label className="text-gray-300">Export Type</Label>
          <Select value={exportType} onValueChange={(value: 'users' | 'registrations' | 'analytics' | 'revenue') => setExportType(value)}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="users">User Data</SelectItem>
              <SelectItem value="registrations">Registration Data</SelectItem>
              <SelectItem value="analytics">Analytics Report</SelectItem>
              <SelectItem value="revenue">Financial Report</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              {currentOption.icon}
              <span className="text-white font-medium">{currentOption.title}</span>
            </div>
            <p className="text-gray-400 text-sm">{currentOption.description}</p>
          </div>
        </div>

        {/* Format and Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Format</Label>
            <Select value={exportFormat} onValueChange={(value: 'csv' | 'excel' | 'pdf') => setExportFormat(value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                <SelectItem value="pdf">PDF Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-300">Date Range</Label>
            <Select value={dateRange} onValueChange={(value: '7d' | '30d' | '90d' | 'all') => setDateRange(value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Field Selection */}
        <div className="space-y-3">
          <Label className="text-gray-300">Include Fields</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentOption.fields.map((field) => (
              <div key={field.key} className="flex items-center space-x-2">
                <Checkbox
                  id={field.key}
                  checked={includeFields[field.key as keyof typeof includeFields]}
                  onCheckedChange={(checked) => 
                    setIncludeFields(prev => ({ ...prev, [field.key]: checked }))
                  }
                  className="border-gray-600 data-[state=checked]:bg-blue-600"
                />
                <Label 
                  htmlFor={field.key} 
                  className="text-sm text-gray-300 cursor-pointer"
                >
                  {field.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Export Button */}
        <div className="pt-4 border-t border-gray-700">
          <Button
            onClick={handleExport}
            disabled={exporting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {exporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export {currentOption.title}
              </>
            )}
          </Button>
          
          <div className="mt-2 text-xs text-gray-400 text-center">
            Export will include data from the selected date range with chosen fields
          </div>
        </div>

        {/* Export History */}
        <div className="bg-gray-700/30 rounded-lg p-3">
          <h4 className="text-white font-medium mb-2">Recent Exports</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center text-gray-400">
              <span>User Data (CSV)</span>
              <span>2 hours ago</span>
            </div>
            <div className="flex justify-between items-center text-gray-400">
              <span>Analytics Report (PDF)</span>
              <span>Yesterday</span>
            </div>
            <div className="flex justify-between items-center text-gray-400">
              <span>Registration Data (Excel)</span>
              <span>3 days ago</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}