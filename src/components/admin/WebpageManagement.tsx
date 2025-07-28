'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Globe,
  Plus,
  Edit,
  Trash2,

  Users,
  Award,
  Calendar,
  Mic,
  RefreshCw,
  Save,
  X
} from 'lucide-react';
import { WebpageContent, SpeakerContent, SponsorContent, TeamMemberContent, EventContent } from '@/lib/types';

interface WebpageManagementProps {
  onRefresh?: () => void;
}

export function WebpageManagement({ }: WebpageManagementProps) {
  const [contents, setContents] = useState<WebpageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedContent, setSelectedContent] = useState<WebpageContent | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  // Form state
  const [formData, setFormData] = useState<Partial<WebpageContent>>({
    type: 'speaker',
    title: '',
    content: {},
    status: 'draft'
  });

  const loadContents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/webpage-content', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to load webpage contents');
      }
      
      const data = await response.json();
      setContents(data.contents || []);
    } catch (error) {
      console.error('Failed to load contents:', error);
      toast.error('Failed to load webpage contents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContents();
  }, []);

  const handleCreate = () => {
    setFormData({
      type: 'speaker',
      title: '',
      content: {},
      status: 'draft'
    });
    setShowCreateDialog(true);
  };

  const handleEdit = (content: WebpageContent) => {
    setSelectedContent(content);
    setFormData(content);
    setShowEditDialog(true);
  };

  const handleSave = async () => {
    try {
      const url = selectedContent 
        ? `/api/webpage-content/${selectedContent.id}`
        : '/api/webpage-content';
      
      const method = selectedContent ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to ${selectedContent ? 'update' : 'create'} content`);
      }

      toast.success(`Content ${selectedContent ? 'updated' : 'created'} successfully`);
      setShowCreateDialog(false);
      setShowEditDialog(false);
      loadContents();
    } catch (error) {
      console.error('Failed to save content:', error);
      toast.error(`Failed to ${selectedContent ? 'update' : 'create'} content`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const response = await fetch(`/api/webpage-content/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete content');
      }

      toast.success('Content deleted successfully');
      loadContents();
    } catch (error) {
      console.error('Failed to delete content:', error);
      toast.error('Failed to delete content');
    }
  };

  const renderContentForm = () => {
    const content = formData.content || {};
    switch (formData.type) {
      case 'speaker':
        return <SpeakerForm content={content} onChange={(content) => setFormData(prev => ({ ...prev, content: content as unknown as Record<string, unknown> }))} />;
      case 'sponsor':
        return <SponsorForm content={content} onChange={(content) => setFormData(prev => ({ ...prev, content: content as unknown as Record<string, unknown> }))} />;
      case 'team':
        return <TeamMemberForm content={content} onChange={(content) => setFormData(prev => ({ ...prev, content: content as unknown as Record<string, unknown> }))} />;
      case 'event':
        return <EventForm content={content} onChange={(content) => setFormData(prev => ({ ...prev, content: content as unknown as Record<string, unknown> }))} />;
      default:
        return <GeneralForm content={content} onChange={(content) => setFormData(prev => ({ ...prev, content: content as unknown as Record<string, unknown> }))} />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'speaker': return <Mic className="h-4 w-4" />;
      case 'sponsor': return <Award className="h-4 w-4" />;
      case 'team': return <Users className="h-4 w-4" />;
      case 'event': return <Calendar className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-600';
      case 'draft': return 'bg-yellow-600';
      case 'archived': return 'bg-gray-600';
      default: return 'bg-blue-600';
    }
  };

  const filteredContents = contents.filter(content => {
    if (activeTab === 'all') return true;
    return content.type === activeTab;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading webpage contents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Globe className="h-6 w-6 text-blue-400" />
            Webpage Management
          </h2>
          <p className="text-gray-400 mt-2">
            Manage speakers, sponsors, team members, events, and other webpage content
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={loadContents}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-gray-800 border-gray-700">
          <TabsTrigger value="all" className="data-[state=active]:bg-blue-600">All</TabsTrigger>
          <TabsTrigger value="speaker" className="data-[state=active]:bg-blue-600">Speakers</TabsTrigger>
          <TabsTrigger value="sponsor" className="data-[state=active]:bg-blue-600">Sponsors</TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-blue-600">Team</TabsTrigger>
          <TabsTrigger value="event" className="data-[state=active]:bg-blue-600">Events</TabsTrigger>
          <TabsTrigger value="general" className="data-[state=active]:bg-blue-600">General</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContents.map((content) => (
              <Card key={content.id} className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(content.type)}
                      <CardTitle className="text-white text-lg">{content.title}</CardTitle>
                    </div>
                    <Badge className={`${getStatusColor(content.status)} text-white`}>
                      {content.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-400">
                    {content.type.charAt(0).toUpperCase() + content.type.slice(1)} Content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Updated: {new Date(content.updated_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(content)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(content.id)}
                        className="border-red-600 text-red-400 hover:bg-red-900"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredContents.length === 0 && (
            <div className="text-center py-12">
              <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No content found</h3>
              <p className="text-gray-400 mb-4">
                {activeTab === 'all' 
                  ? 'No webpage content has been created yet.' 
                  : `No ${activeTab} content has been created yet.`
                }
              </p>
              <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create First Content
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog || showEditDialog} onOpenChange={(open) => {
        if (!open) {
          setShowCreateDialog(false);
          setShowEditDialog(false);
          setSelectedContent(null);
        }
      }}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedContent ? 'Edit Content' : 'Create New Content'}
            </DialogTitle>
            <DialogDescription>
              {selectedContent ? 'Modify webpage content details and settings.' : 'Create new content for speakers, sponsors, team members, events, or general information.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="content_type">Content Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'speaker' | 'sponsor' | 'team' | 'event' | 'general') => 
                    setFormData(prev => ({ ...prev, type: value, content: {} }))
                  }
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="speaker">Speaker</SelectItem>
                    <SelectItem value="sponsor">Sponsor</SelectItem>
                    <SelectItem value="team">Team Member</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="content_status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'draft' | 'published' | 'archived') => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="content_title">Title</Label>
              <Input
                id="content_title"
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter content title"
              />
            </div>

            {/* Dynamic Content Form */}
            {renderContentForm()}

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-700">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false);
                  setShowEditDialog(false);
                }}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {selectedContent ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Form components for different content types
function SpeakerForm({ content, onChange }: { content: Record<string, unknown>; onChange: (content: SpeakerContent) => void }) {
  const speakerContent: SpeakerContent = {
    name: '',
    designation: '',
    company: '',
    bio: '',
    track: '',
    session: '',
    day: '',
    time: '',
    expertise: [],
    social: {},
    ...content
  };

  const updateContent = (updates: Partial<SpeakerContent>) => {
    onChange({ ...speakerContent, ...updates });
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">Speaker Information</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Name</Label>
          <Input
            value={speakerContent.name}
            onChange={(e) => updateContent({ name: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Speaker name"
          />
        </div>
        <div>
          <Label>Designation</Label>
          <Input
            value={speakerContent.designation}
            onChange={(e) => updateContent({ designation: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Job title"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Company</Label>
          <Input
            value={speakerContent.company}
            onChange={(e) => updateContent({ company: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Company name"
          />
        </div>
        <div>
          <Label>Image URL</Label>
          <Input
            value={speakerContent.image_url || ''}
            onChange={(e) => updateContent({ image_url: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Profile image URL"
          />
        </div>
      </div>

      <div>
        <Label>Bio</Label>
        <Textarea
          value={speakerContent.bio}
          onChange={(e) => updateContent({ bio: e.target.value })}
          className="bg-gray-700 border-gray-600 text-white"
          placeholder="Speaker biography"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Track</Label>
          <Input
            value={speakerContent.track}
            onChange={(e) => updateContent({ track: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="e.g., AI/ML, Cloud Computing"
          />
        </div>
        <div>
          <Label>Session</Label>
          <Input
            value={speakerContent.session}
            onChange={(e) => updateContent({ session: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Session title"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Day</Label>
          <Input
            value={speakerContent.day}
            onChange={(e) => updateContent({ day: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Day 1, Day 2, etc."
          />
        </div>
        <div>
          <Label>Time</Label>
          <Input
            value={speakerContent.time}
            onChange={(e) => updateContent({ time: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="10:00 AM - 11:00 AM"
          />
        </div>
        <div>
          <Label>Expertise (comma-separated)</Label>
          <Input
            value={speakerContent.expertise.join(', ')}
            onChange={(e) => updateContent({ expertise: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="AI, Machine Learning, Cloud"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>LinkedIn</Label>
          <Input
            value={speakerContent.social.linkedin || ''}
            onChange={(e) => updateContent({ social: { ...speakerContent.social, linkedin: e.target.value } })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="LinkedIn profile URL"
          />
        </div>
        <div>
          <Label>Twitter</Label>
          <Input
            value={speakerContent.social.twitter || ''}
            onChange={(e) => updateContent({ social: { ...speakerContent.social, twitter: e.target.value } })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Twitter profile URL"
          />
        </div>
        <div>
          <Label>Website</Label>
          <Input
            value={speakerContent.social.website || ''}
            onChange={(e) => updateContent({ social: { ...speakerContent.social, website: e.target.value } })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Personal website URL"
          />
        </div>
      </div>
    </div>
  );
}

function SponsorForm({ content, onChange }: { content: Record<string, unknown>; onChange: (content: SponsorContent) => void }) {
  const sponsorContent: SponsorContent = {
    name: '',
    logo_url: '',
    tier: 'bronze',
    ...content
  };

  const updateContent = (updates: Partial<SponsorContent>) => {
    onChange({ ...sponsorContent, ...updates });
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">Sponsor Information</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Name</Label>
          <Input
            value={sponsorContent.name}
            onChange={(e) => updateContent({ name: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Sponsor name"
          />
        </div>
        <div>
          <Label>Tier</Label>
          <Select
            value={sponsorContent.tier}
            onValueChange={(value: 'title' | 'platinum' | 'gold' | 'silver' | 'bronze' | 'partner') => 
              updateContent({ tier: value })
            }
          >
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="title">Title Sponsor</SelectItem>
              <SelectItem value="platinum">Platinum</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
              <SelectItem value="silver">Silver</SelectItem>
              <SelectItem value="bronze">Bronze</SelectItem>
              <SelectItem value="partner">Partner</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Logo URL</Label>
          <Input
            value={sponsorContent.logo_url}
            onChange={(e) => updateContent({ logo_url: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Logo image URL"
          />
        </div>
        <div>
          <Label>Website</Label>
          <Input
            value={sponsorContent.website || ''}
            onChange={(e) => updateContent({ website: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Company website URL"
          />
        </div>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={sponsorContent.description || ''}
          onChange={(e) => updateContent({ description: e.target.value })}
          className="bg-gray-700 border-gray-600 text-white"
          placeholder="Sponsor description"
          rows={3}
        />
      </div>

      <div>
        <Label>Benefits (one per line)</Label>
        <Textarea
          value={sponsorContent.benefits?.join('\n') || ''}
          onChange={(e) => updateContent({ benefits: e.target.value.split('\n').filter(Boolean) })}
          className="bg-gray-700 border-gray-600 text-white"
          placeholder="List of sponsor benefits"
          rows={4}
        />
      </div>
    </div>
  );
}

function TeamMemberForm({ content, onChange }: { content: Record<string, unknown>; onChange: (content: TeamMemberContent) => void }) {
  const teamContent: TeamMemberContent = {
    name: '',
    role: '',
    ...content
  };

  const updateContent = (updates: Partial<TeamMemberContent>) => {
    onChange({ ...teamContent, ...updates });
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">Team Member Information</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Name</Label>
          <Input
            value={teamContent.name}
            onChange={(e) => updateContent({ name: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Team member name"
          />
        </div>
        <div>
          <Label>Role</Label>
          <Input
            value={teamContent.role}
            onChange={(e) => updateContent({ role: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Role/Position"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Department</Label>
          <Input
            value={teamContent.department || ''}
            onChange={(e) => updateContent({ department: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Department"
          />
        </div>
        <div>
          <Label>Image URL</Label>
          <Input
            value={teamContent.image_url || ''}
            onChange={(e) => updateContent({ image_url: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Profile image URL"
          />
        </div>
      </div>

      <div>
        <Label>Bio</Label>
        <Textarea
          value={teamContent.bio || ''}
          onChange={(e) => updateContent({ bio: e.target.value })}
          className="bg-gray-700 border-gray-600 text-white"
          placeholder="Team member bio"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>LinkedIn</Label>
          <Input
            value={teamContent.social?.linkedin || ''}
            onChange={(e) => updateContent({ 
              social: { ...teamContent.social, linkedin: e.target.value } 
            })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="LinkedIn profile URL"
          />
        </div>
        <div>
          <Label>Instagram</Label>
          <Input
            value={teamContent.social?.instagram || ''}
            onChange={(e) => updateContent({ 
              social: { ...teamContent.social, instagram: e.target.value } 
            })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Instagram profile URL"
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            value={teamContent.social?.email || ''}
            onChange={(e) => updateContent({ 
              social: { ...teamContent.social, email: e.target.value } 
            })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Email address"
          />
        </div>
      </div>
    </div>
  );
}

function EventForm({ content, onChange }: { content: Record<string, unknown>; onChange: (content: EventContent) => void }) {
  const eventContent: EventContent = {
    name: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    category: '',
    registration_required: false,
    ...content
  };

  const updateContent = (updates: Partial<EventContent>) => {
    onChange({ ...eventContent, ...updates });
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">Event Information</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Event Name</Label>
          <Input
            value={eventContent.name}
            onChange={(e) => updateContent({ name: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Event name"
          />
        </div>
        <div>
          <Label>Category</Label>
          <Input
            value={eventContent.category}
            onChange={(e) => updateContent({ category: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Event category"
          />
        </div>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={eventContent.description}
          onChange={(e) => updateContent({ description: e.target.value })}
          className="bg-gray-700 border-gray-600 text-white"
          placeholder="Event description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Date</Label>
          <Input
            type="date"
            value={eventContent.date}
            onChange={(e) => updateContent({ date: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div>
          <Label>Time</Label>
          <Input
            value={eventContent.time}
            onChange={(e) => updateContent({ time: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="10:00 AM - 12:00 PM"
          />
        </div>
        <div>
          <Label>Venue</Label>
          <Input
            value={eventContent.venue}
            onChange={(e) => updateContent({ venue: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Event venue"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Image URL</Label>
          <Input
            value={eventContent.image_url || ''}
            onChange={(e) => updateContent({ image_url: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Event image URL"
          />
        </div>
        <div className="flex items-center space-x-2 pt-6">
          <input
            type="checkbox"
            id="registration_required"
            checked={eventContent.registration_required}
            onChange={(e) => updateContent({ registration_required: e.target.checked })}
            className="rounded border-gray-600 bg-gray-700"
          />
          <Label htmlFor="registration_required">Registration Required</Label>
        </div>
      </div>

      {eventContent.registration_required && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Max Participants</Label>
            <Input
              type="number"
              value={eventContent.max_participants || ''}
              onChange={(e) => updateContent({ max_participants: parseInt(e.target.value) || undefined })}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Maximum participants"
            />
          </div>
          <div>
            <Label>Current Participants</Label>
            <Input
              type="number"
              value={eventContent.current_participants || ''}
              onChange={(e) => updateContent({ current_participants: parseInt(e.target.value) || undefined })}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Current participants"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function GeneralForm({ content, onChange }: { content: Record<string, unknown>; onChange: (content: Record<string, unknown>) => void }) {
  const generalContent = content || {};

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">General Content</h4>
      
      <div>
        <Label>Content (JSON)</Label>
        <Textarea
          value={JSON.stringify(generalContent, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              onChange(parsed);
            } catch {
              // Invalid JSON, don't update
            }
          }}
          className="bg-gray-700 border-gray-600 text-white font-mono"
          placeholder="Enter JSON content"
          rows={10}
        />
      </div>
    </div>
  );
}