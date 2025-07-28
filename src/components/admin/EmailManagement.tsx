'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { 
  Plus,
  Edit,
  Trash2,
  Send,
  RefreshCw,
  Save,
  X,
  FileText
} from 'lucide-react';
import { EmailTemplate, EmailCampaign } from '@/lib/types';

interface EmailManagementProps {
  onRefresh?: () => void;
}

export function EmailManagement({ }: EmailManagementProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('templates');

  // Template dialog state
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [templateForm, setTemplateForm] = useState<Partial<EmailTemplate>>({
    name: '',
    type: 'announcement',
    subject: '',
    html_content: '',
    text_content: '',
    variables: [],
    is_active: true
  });

  // Campaign dialog state
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);
  const [campaignForm, setCampaignForm] = useState<Partial<EmailCampaign>>({
    name: '',
    template_id: '',
    recipients: {
      type: 'role',
      filters: {
        roles: []
      }
    },
    status: 'draft'
  });

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/email-templates', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to load email templates');
      }
      
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Failed to load templates:', error);
      toast.error('Failed to load templates');
    }
  };

  const loadCampaigns = async () => {
    try {
      const response = await fetch('/api/email-campaigns', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to load email campaigns');
      }
      
      const data = await response.json();
      setCampaigns(data.campaigns || []);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
      toast.error('Failed to load campaigns');
    }
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadTemplates(),
        loadCampaigns()
      ]);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setTemplateForm({
      name: '',
      type: 'announcement',
      subject: '',
      html_content: '',
      text_content: '',
      variables: [],
      is_active: true
    });
    setShowTemplateDialog(true);
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setTemplateForm(template);
    setShowTemplateDialog(true);
  };

  const handleSaveTemplate = async () => {
    try {
      const url = selectedTemplate 
        ? `/api/email-templates/${selectedTemplate.id}`
        : '/api/email-templates';
      const method = selectedTemplate ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateForm),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to ${selectedTemplate ? 'update' : 'create'} template`);
      }

      toast.success(`Template ${selectedTemplate ? 'updated' : 'created'} successfully`);
      setShowTemplateDialog(false);
      loadTemplates();
    } catch (error) {
      console.error('Failed to save template:', error);
      toast.error(`Failed to ${selectedTemplate ? 'update' : 'create'} template`);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const response = await fetch(`/api/email-templates/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete template');
      }

      toast.success('Template deleted successfully');
      loadTemplates();
    } catch (error) {
      console.error('Failed to delete template:', error);
      toast.error('Failed to delete template');
    }
  };

  const handleCreateCampaign = () => {
    setSelectedCampaign(null);
    setCampaignForm({
      name: '',
      template_id: '',
      recipients: {
        type: 'role',
        filters: {
          roles: []
        }
      },
      status: 'draft'
    });
    setShowCampaignDialog(true);
  };

  const handleEditCampaign = (campaign: EmailCampaign) => {
    setSelectedCampaign(campaign);
    setCampaignForm(campaign);
    setShowCampaignDialog(true);
  };

  const handleSaveCampaign = async () => {
    try {
      const url = selectedCampaign 
        ? `/api/email-campaigns/${selectedCampaign.id}`
        : '/api/email-campaigns';
      const method = selectedCampaign ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignForm),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to ${selectedCampaign ? 'update' : 'create'} campaign`);
      }

      toast.success(`Campaign ${selectedCampaign ? 'updated' : 'created'} successfully`);
      setShowCampaignDialog(false);
      loadCampaigns();
    } catch (error) {
      console.error('Failed to save campaign:', error);
      toast.error(`Failed to ${selectedCampaign ? 'update' : 'create'} campaign`);
    }
  };

  const handleSendCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to send this campaign?')) return;

    try {
      const response = await fetch(`/api/email-campaigns/${id}/send`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to send campaign');
      }

      toast.success('Campaign sent successfully');
      loadCampaigns();
    } catch (error) {
      console.error('Failed to send campaign:', error);
      toast.error('Failed to send campaign');
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      const response = await fetch(`/api/email-campaigns/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete campaign');
      }

      toast.success('Campaign deleted successfully');
      loadCampaigns();
    } catch (error) {
      console.error('Failed to delete campaign:', error);
      toast.error('Failed to delete campaign');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-600';
      case 'scheduled': return 'bg-yellow-600';
      case 'sending': return 'bg-blue-600';
      case 'sent': return 'bg-green-600';
      case 'failed': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Email Management</h2>
        <Button
          onClick={loadData}
          disabled={loading}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
          <TabsTrigger value="templates" className="data-[state=active]:bg-gray-700 text-gray-300">
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-gray-700 text-gray-300">
            <Send className="h-4 w-4 mr-2" />
            Campaigns
          </TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Email Templates</h3>
            <Button
              onClick={handleCreateTemplate}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                    <Badge className={template.is_active ? 'bg-green-600' : 'bg-gray-600'}>
                      {template.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-400">
                    Type: {template.type}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-300">
                      <div className="font-medium">{template.subject}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Created: {new Date(template.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditTemplate(template)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="border-red-600 text-red-400 hover:bg-red-900"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Email Campaigns</h3>
            <Button
              onClick={handleCreateCampaign}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">{campaign.name}</CardTitle>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-400">
                    Recipients: {campaign.recipients.type}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {campaign.stats && (
                      <div className="text-sm text-gray-300">
                        <div>Sent: {campaign.stats.sent}/{campaign.stats.total_recipients}</div>
                        <div>Delivered: {campaign.stats.delivered}</div>
                        <div>Opened: {campaign.stats.opened}</div>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        {campaign.sent_at 
                          ? `Sent: ${new Date(campaign.sent_at).toLocaleDateString()}`
                          : `Created: ${new Date(campaign.created_at).toLocaleDateString()}`
                        }
                      </div>
                      <div className="flex items-center gap-2">
                        {campaign.status === 'draft' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditCampaign(campaign)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        )}
                        {campaign.status === 'draft' && (
                          <Button
                            size="sm"
                            onClick={() => handleSendCampaign(campaign.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Send className="h-3 w-3 mr-1" />
                            Send
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteCampaign(campaign.id)}
                          className="border-red-600 text-red-400 hover:bg-red-900"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Template Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate ? 'Edit Template' : 'Create Template'}
            </DialogTitle>
            <DialogDescription>
              {selectedTemplate ? 'Modify the email template details below.' : 'Create a new email template for campaigns.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={templateForm.name || ''}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter template name"
                />
              </div>
              <div>
                <Label htmlFor="template-type">Type</Label>
                <Select
                  value={templateForm.type || 'announcement'}
                  onValueChange={(value) => setTemplateForm(prev => ({ ...prev, type: value as EmailTemplate['type'] }))}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600 text-white z-50">
                    <SelectItem value="announcement" className="text-white hover:bg-gray-700">Announcement</SelectItem>
                    <SelectItem value="alert" className="text-white hover:bg-gray-700">Alert</SelectItem>
                    <SelectItem value="reminder" className="text-white hover:bg-gray-700">Reminder</SelectItem>
                    <SelectItem value="confirmation" className="text-white hover:bg-gray-700">Confirmation</SelectItem>
                    <SelectItem value="welcome" className="text-white hover:bg-gray-700">Welcome</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="template-subject">Subject</Label>
              <Input
                id="template-subject"
                value={templateForm.subject || ''}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, subject: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter email subject"
              />
            </div>

            <div>
              <Label htmlFor="template-html">HTML Content</Label>
              <Textarea
                id="template-html"
                value={templateForm.html_content || ''}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, html_content: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white min-h-[200px]"
                placeholder="Enter HTML content"
              />
            </div>

            <div>
              <Label htmlFor="template-text">Text Content (Optional)</Label>
              <Textarea
                id="template-text"
                value={templateForm.text_content || ''}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, text_content: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter plain text content"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="template-active"
                checked={templateForm.is_active || false}
                onCheckedChange={(checked) => setTemplateForm(prev => ({ ...prev, is_active: checked as boolean }))}
              />
              <Label htmlFor="template-active">Active</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowTemplateDialog(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSaveTemplate}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {selectedTemplate ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Campaign Dialog */}
      <Dialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl z-50">
          <DialogHeader>
            <DialogTitle>
              {selectedCampaign ? 'Edit Campaign' : 'Create Campaign'}
            </DialogTitle>
            <DialogDescription>
              {selectedCampaign ? 'Modify the email campaign settings below.' : 'Create a new email campaign to send to users.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input
                  id="campaign-name"
                  value={campaignForm.name || ''}
                  onChange={(e) => setCampaignForm(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter campaign name"
                />
              </div>
              <div>
                <Label htmlFor="campaign-template">Template</Label>
                <Select
                  value={campaignForm.template_id || ''}
                  onValueChange={(value) => setCampaignForm(prev => ({ ...prev, template_id: value }))}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600 text-white z-50">
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id} className="text-white hover:bg-gray-700">
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Recipients</Label>
              <div className="space-y-4 p-4 border border-gray-600 rounded-lg">
                <div>
                  <Label htmlFor="recipient-type">Recipient Type</Label>
                  <Select
                    value={campaignForm.recipients?.type || 'role'}
                    onValueChange={(value: 'role' | 'custom' | 'all') => setCampaignForm(prev => ({
                      ...prev,
                      recipients: {
                        type: value,
                        ...prev.recipients,
                        filters: value === 'all' ? {} : prev.recipients?.filters || {}
                      }
                    }))}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600 text-white z-50">
                      <SelectItem value="role" className="text-white hover:bg-gray-700">By Role</SelectItem>
                      <SelectItem value="custom" className="text-white hover:bg-gray-700">Custom Emails</SelectItem>
                      <SelectItem value="all" className="text-white hover:bg-gray-700">All Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {campaignForm.recipients?.type === 'role' && (
                  <div>
                    <Label>Select Roles</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {['admin', 'coordinator', 'participant'].map((role) => (
                        <div key={role} className="flex items-center space-x-2">
                          <Checkbox
                            id={`role-${role}`}
                            checked={campaignForm.recipients?.filters?.roles?.includes(role) || false}
                            onCheckedChange={(checked) => {
                              const currentRoles = campaignForm.recipients?.filters?.roles || [];
                              const newRoles = checked 
                                ? [...currentRoles, role]
                                : currentRoles.filter(r => r !== role);
                              
                              setCampaignForm(prev => ({
                                ...prev,
                                recipients: {
                                  type: prev.recipients?.type || 'role',
                                  ...prev.recipients,
                                  filters: {
                                    ...prev.recipients?.filters,
                                    roles: newRoles
                                  }
                                }
                              }));
                            }}
                          />
                          <Label htmlFor={`role-${role}`} className="capitalize">{role}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {campaignForm.recipients?.type === 'custom' && (
                  <div>
                    <Label>Email Addresses (one per line)</Label>
                    <Textarea
                      value={campaignForm.recipients?.filters?.custom_emails?.join('\n') || ''}
                      onChange={(e) => setCampaignForm(prev => ({
                        ...prev,
                        recipients: {
                          type: prev.recipients?.type || 'custom',
                          ...prev.recipients,
                          filters: {
                            ...prev.recipients?.filters,
                            custom_emails: e.target.value.split('\n').filter(Boolean)
                          }
                        }
                      }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="email1@example.com&#10;email2@example.com"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowCampaignDialog(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSaveCampaign}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {selectedCampaign ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}