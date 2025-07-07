'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GalleryData } from '@/entities/Gallery';
import { Camera, Heart, Share2, Download, Filter, Grid, Calendar, User, MessageCircle, Hash, Eye, Copy, Facebook, Twitter, Instagram, Linkedin, ExternalLink, Send } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import Image from "next/image";

export default function Gallery() {
  const [photos, setPhotos] = useState<GalleryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryData | null>(null);
  const [comments, setComments] = useState<{[key: string]: Array<{id: string, user: string, text: string, time: string}>}>({});
  const [newComment, setNewComment] = useState('');

  // Sample gallery data - Replace with API call
  const samplePhotos: GalleryData[] = useMemo(() => [
    {
      id: '1',
      file_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
      caption: 'Opening ceremony with 500+ enthusiastic participants',
      uploaded_by: 'event_team',
      status: 'approved',
      category: 'ceremony',

      likes: 45,
      views: 234,
      comments: 12,
      tags: ['opening', 'ceremony', 'samyukta2025'],
      created_at: '2024-08-06T09:00:00Z'
    },
    {
      id: '2',
      file_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop',
      caption: 'AWS workshop in progress - Cloud computing mastery',
      uploaded_by: 'coordinator_1',
      status: 'approved',
      category: 'workshop',
      likes: 32,
      views: 156,
      comments: 8,
      tags: ['aws', 'workshop', 'cloud'],
      created_at: '2024-08-06T11:30:00Z'
    },
    {
      id: '3',
      file_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
      caption: 'Team collaboration during hackathon',
      uploaded_by: 'participant_23',
      status: 'approved',
      category: 'hackathon',
      likes: 67,
      views: 289,
      comments: 15,
      tags: ['hackathon', 'teamwork', 'coding'],
      created_at: '2024-08-08T14:00:00Z'
    },
    {
      id: '4',
      file_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop',
      caption: 'Cultural night performances and celebrations',
      uploaded_by: 'cultural_team',
      status: 'approved',
      category: 'cultural',
      likes: 89,
      views: 345,
      comments: 23,
      tags: ['cultural', 'dance', 'music'],
      created_at: '2024-08-06T19:00:00Z'
    },
    {
      id: '5',
      file_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop',
      caption: 'Networking session with industry experts',
      uploaded_by: 'networking_team',
      status: 'approved',
      category: 'networking',
      likes: 28,
      views: 123,
      comments: 5,
      tags: ['networking', 'industry', 'experts'],
      created_at: '2024-08-07T16:00:00Z'
    },
    {
      id: '6',
      file_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop',
      caption: 'AI/ML workshop with Google Cloud experts',
      uploaded_by: 'tech_team',
      status: 'approved',
      category: 'workshop',
      likes: 43,
      views: 187,
      comments: 9,
      tags: ['ai', 'ml', 'google'],
      created_at: '2024-08-07T10:00:00Z'
    },
    {
      id: '7',
      file_url: 'https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=800&h=600&fit=crop',
      caption: 'Prize distribution ceremony',
      uploaded_by: 'admin_team',
      status: 'approved',
      category: 'ceremony',
      likes: 76,
      views: 267,
      comments: 18,
      tags: ['awards', 'winners', 'celebration'],
      created_at: '2024-08-08T18:00:00Z'
    },
    {
      id: '8',
      file_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop',
      caption: 'Group photo with all participants',
      uploaded_by: 'photo_team',
      status: 'approved',
      category: 'group',
      likes: 120,
      views: 456,
      comments: 34,
      tags: ['group', 'memories', 'finale'],
      created_at: '2024-08-08T17:00:00Z'
    }
  ], []);

  const categories = [
    { id: 'all', name: 'All Photos', color: 'from-gray-500 to-gray-600' },
    { id: 'ceremony', name: 'Ceremonies', color: 'from-yellow-500 to-orange-500' },
    { id: 'workshop', name: 'Workshops', color: 'from-blue-500 to-cyan-500' },
    { id: 'hackathon', name: 'Hackathon', color: 'from-red-500 to-pink-500' },
    { id: 'cultural', name: 'Cultural', color: 'from-purple-500 to-violet-500' },
    { id: 'networking', name: 'Networking', color: 'from-green-500 to-emerald-500' },
    { id: 'group', name: 'Group Photos', color: 'from-indigo-500 to-blue-500' }
  ];

  const loadPhotos = useCallback(async () => {
    try {
      // For now, use sample data
      // In production, replace with: const data = await GalleryEntity.getApproved();
      setPhotos(samplePhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  }, [samplePhotos]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const filteredPhotos = selectedCategory === 'all'
    ? photos
    : photos.filter(photo => photo.category === selectedCategory);

  const handleLike = async (photoId: string) => {
    try {
      // Update local state immediately for better UX
      setPhotos(photos.map(photo =>
        photo.id === photoId
          ? { ...photo, likes: (photo.likes || 0) + 1 }
          : photo
      ));
      // In production, call API: await GalleryEntity.like(photoId);
    } catch (error) {
      console.error('Error liking photo:', error);
    }
  };

  const handleDownload = async (photo: GalleryData) => {
    try {
      const response = await fetch(photo.file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `samyukta-${photo.id}.jpg`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading photo:', error);
    }
  };

  const handleShare = async (photo: GalleryData, platform?: string) => {
    const url = window.location.origin + '/gallery/' + photo.id;
    const text = `Check out this amazing moment from Samyukta 2025! ${photo.caption}`;
    
    if (platform) {
      const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        instagram: url, // Instagram doesn't support direct sharing
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
      };
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
    } else if (navigator.share) {
      await navigator.share({ url, title: photo.caption, text });
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleComment = (photoId: string) => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now().toString(),
      user: 'Current User',
      text: newComment,
      time: new Date().toISOString()
    };
    
    setComments(prev => ({
      ...prev,
      [photoId]: [...(prev[photoId] || []), comment]
    }));
    
    setNewComment('');
  };

  const incrementViews = (photoId: string) => {
    setPhotos(photos.map(photo =>
      photo.id === photoId
        ? { ...photo, views: (photo.views || 0) + 1 }
        : photo
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-responsive">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8 sm:mb-12"
            >
              <div className="text-spacing-lg">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                  <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                    Event Gallery
                  </span>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
                  Relive the magic of Samyukta 2025 through these amazing moments
                </p>

                <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 sm:px-4 py-2 text-sm sm:text-base">
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    {photos.length} Photos
                  </Badge>
                  <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20 px-3 sm:px-4 py-2 text-sm sm:text-base">
                    <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    {photos.reduce((sum, photo) => sum + (photo.likes || 0), 0)} Likes
                  </Badge>
                  <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/20 px-3 sm:px-4 py-2 text-sm sm:text-base">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Aug 6-9, 2025
                  </Badge>
                </div>
              </div>
            </motion.div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`
                      ${selectedCategory === category.id
                        ? `bg-gradient-to-r ${category.color} text-white border-0`
                        : 'bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700'
                      }
                    `}
                  >
                    <Filter className="w-4 h-4 mr-1" />
                    {category.name}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-blue-500 hover:bg-blue-600' : 'border-gray-600 text-gray-300'}
                >
                  <Grid className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Photo Gallery */}
            <div className={`grid ${viewMode === 'grid' ? 'md:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-3 xl:grid-cols-4'} gap-6`}>
              {filteredPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 hover:border-gray-600 transition-all duration-300 overflow-hidden">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={photo.file_url}
                        alt={photo.caption || 'Gallery image'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleLike(photo.id)}
                            className="bg-white/20 hover:bg-white/30 text-white border-0"
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleDownload(photo)}
                            className="bg-white/20 hover:bg-white/30 text-white border-0"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleShare(photo)}
                            className="bg-white/20 hover:bg-white/30 text-white border-0"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setSelectedPhoto(photo);
                              incrementViews(photo.id);
                            }}
                            className="bg-white/20 hover:bg-white/30 text-white border-0"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <p className="text-white text-sm font-medium line-clamp-2">
                          {photo.caption}
                        </p>

                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>by {photo.uploaded_by}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(photo.created_at || '')}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-xs">
                            <div className="flex items-center space-x-1 text-pink-400">
                              <Heart className="w-3 h-3" />
                              <span>{photo.likes || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-blue-400">
                              <Eye className="w-3 h-3" />
                              <span>{photo.views || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-green-400">
                              <MessageCircle className="w-3 h-3" />
                              <span>{photo.comments || 0}</span>
                            </div>
                          </div>

                          {photo.category && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-gray-700/50 text-gray-300 border-gray-600"
                            >
                              {categories.find(c => c.id === photo.category)?.name}
                            </Badge>
                          )}
                        </div>

                        {photo.tags && photo.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {photo.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span key={tagIndex} className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
                                #{tag}
                              </span>
                            ))}
                            {photo.tags.length > 3 && (
                              <span className="text-xs text-gray-400">+{photo.tags.length - 3} more</span>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredPhotos.length === 0 && (
              <div className="text-center py-12">
                <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No photos found</h3>
                <p className="text-gray-500">Try selecting a different category or check back later for more photos!</p>
              </div>
            )}
          </div>
        </section>

        {/* Upload CTA */}
        <section className="section-padding bg-gray-800/20">
          <div className="container-responsive">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-spacing-lg">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                  Share Your <span className="text-blue-400">Moments</span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                  Have amazing photos from Samyukta 2025? Upload them to share with the community!
                </p>

                <div className="mt-8">
                  <Button
                    onClick={() => window.open('/dashboard', '_blank')}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white font-semibold rounded-xl transition-all duration-300 neon-glow"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Upload Photos
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Photo Modal */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex">
                <div className="flex-1">
                  <div className="relative aspect-square">
                    <Image
                      src={selectedPhoto.file_url}
                      alt={selectedPhoto.caption || 'Gallery image'}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                
                <div className="w-80 p-6 border-l border-gray-700 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Photo Details</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPhoto(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      ×
                    </Button>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    <div>
                      <p className="text-white font-medium">{selectedPhoto.caption}</p>
                      <p className="text-sm text-gray-400 mt-1">by {selectedPhoto.uploaded_by}</p>
                      <p className="text-xs text-gray-500">{formatDate(selectedPhoto.created_at || '')}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1 text-pink-400">
                        <Heart className="w-4 h-4" />
                        <span>{selectedPhoto.likes || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-blue-400">
                        <Eye className="w-4 h-4" />
                        <span>{selectedPhoto.views || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-green-400">
                        <MessageCircle className="w-4 h-4" />
                        <span>{comments[selectedPhoto.id]?.length || 0}</span>
                      </div>
                    </div>
                    
                    {selectedPhoto.tags && (
                      <div className="flex flex-wrap gap-1">
                        {selectedPhoto.tags.map((tag, index) => (
                          <span key={index} className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="border-t border-gray-700 pt-4">
                      <h4 className="text-sm font-medium text-white mb-2">Share</h4>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleShare(selectedPhoto, 'facebook')} className="p-2">
                          <Facebook className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleShare(selectedPhoto, 'twitter')} className="p-2">
                          <Twitter className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleShare(selectedPhoto, 'linkedin')} className="p-2">
                          <Linkedin className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleShare(selectedPhoto)} className="p-2">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-4 flex-1">
                      <h4 className="text-sm font-medium text-white mb-2">Comments</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto mb-3">
                        {comments[selectedPhoto.id]?.map((comment) => (
                          <div key={comment.id} className="text-xs">
                            <span className="text-blue-400 font-medium">{comment.user}</span>
                            <p className="text-gray-300">{comment.text}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="flex-1 bg-gray-700 border-gray-600 text-white text-sm"
                          onKeyPress={(e) => e.key === 'Enter' && handleComment(selectedPhoto.id)}
                        />
                        <Button size="sm" onClick={() => handleComment(selectedPhoto.id)}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}