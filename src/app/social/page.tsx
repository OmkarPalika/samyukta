'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SocialItem } from '@/lib/types';
import { Heart, MessageCircle, Share2, Search, Download, Bookmark, X, Send, Sparkles, Zap, Eye } from "lucide-react";
import Image from "next/image";
import Loading from "@/components/shared/Loading";

export default function Social() {
  const [posts, setPosts] = useState<SocialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());

  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<{ [key: string]: Array<{ id: string, user: string, text: string, time: string }> }>({});
  const [selectedHashtag, setSelectedHashtag] = useState<string>('');

  const samplePosts: SocialItem[] = useMemo(() => [
    {
      id: '1',
      file_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
      caption: 'Opening ceremony with 500+ enthusiastic participants',
      uploaded_by: 'event_team',
      status: 'approved',
      category: 'ceremony',

      likes: 45,
      comments: 12,
      shares: 8,

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
      comments: 8,
      shares: 5,

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
      comments: 15,
      shares: 12,

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
      comments: 23,
      shares: 18,

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
      comments: 5,
      shares: 3,

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
      comments: 9,
      shares: 6,

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
      comments: 18,
      shares: 14,

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
      comments: 34,
      shares: 28,

      tags: ['group', 'memories', 'finale'],
      created_at: '2024-08-08T17:00:00Z'
    }
  ], []);

  useEffect(() => {
    setPosts(samplePosts);
    setLoading(false);
  }, [samplePosts]);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.uploaded_by.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesHashtag = !selectedHashtag ||
      post.tags?.some(tag => tag.toLowerCase() === selectedHashtag.toLowerCase());

    return matchesSearch && matchesHashtag;
  });

  const trendingHashtags = ['samyukta2025', 'anits', 'techfest', 'hackathon', 'aws', 'workshop', 'cultural', 'networking'];

  const handleLike = (postId: string) => {
    const isLiked = likedPosts.has(postId);
    const newLikedPosts = new Set(likedPosts);

    if (isLiked) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }

    setLikedPosts(newLikedPosts);
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, likes: (post.likes || 0) + (isLiked ? -1 : 1) }
        : post
    ));
  };



  const handleBookmark = (postId: string) => {
    const newBookmarkedPosts = new Set(bookmarkedPosts);
    if (bookmarkedPosts.has(postId)) {
      newBookmarkedPosts.delete(postId);
    } else {
      newBookmarkedPosts.add(postId);
    }
    setBookmarkedPosts(newBookmarkedPosts);
  };

  const handleDownload = async (post: SocialItem) => {
    try {
      const response = await fetch(post.file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `samyukta-${post.id}.jpg`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleShare = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, shares: (post.shares || 0) + 1 }
        : post
    ));
    if (navigator.share) {
      navigator.share({
        title: 'Samyukta 2025 Social',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleAddComment = (postId: string) => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      user: 'You',
      text: newComment,
      time: 'now'
    };

    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), comment]
    }));

    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, comments: (post.comments || 0) + 1 }
        : post
    ));

    setNewComment('');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'now';
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <Loading size="md" text="Loading social feed..." />
        </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 text-white overflow-hidden">
        {/* Floating orbs background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10">
          {/* Immersive Header */}
          <div className="sticky z-40">
            <div className="bg-black/20 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Social Pulse</h1>
                      <p className="text-xs sm:text-sm text-gray-400">Discover the energy of Samyukta 2025</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-white/20 text-gray-300 hover:text-blue-400 bg-white/5 backdrop-blur-xl text-xs sm:text-sm px-2 sm:px-4"
                  >
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">My Media</span>
                    <span className="sm:hidden">Media</span>
                  </Button>
                </div>

                {/* Advanced Search */}
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-75"></div>
                  <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-1">
                    <div className="flex items-center">
                      <Search className="ml-4 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Search the pulse..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent border-0 text-white placeholder-gray-400 focus:ring-0 text-lg"
                      />
                      {searchQuery && (
                        <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')} className="mr-2">
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Floating Hashtag Pills */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <Button
                    variant={selectedHashtag === '' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedHashtag('')}
                    className={`rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-300 ${selectedHashtag === ''
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                      }`}
                  >
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    All Pulse
                  </Button>
                  {trendingHashtags.slice(0, 6).map((tag) => (
                    <Button
                      key={tag}
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedHashtag(selectedHashtag === tag ? '' : tag)}
                      className={`rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-300 ${selectedHashtag === tag
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 hover:border-blue-400/50 hover:text-blue-400'
                        }`}
                    >
                      #{tag}
                    </Button>
                  ))}
                  {trendingHashtags.length > 6 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Show remaining hashtags or toggle view
                        const remaining = trendingHashtags.slice(6);
                        setSelectedHashtag(remaining[0]); // Select first remaining hashtag
                      }}
                      className="rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 hover:text-blue-400"
                    >
                      +{trendingHashtags.length - 6}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Masonry-style Posts Feed */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-6">
              {filteredPosts.map((post) => (
                <div key={post.id} className="break-inside-avoid mb-4 md:mb-6">
                  <div className="group relative">
                    {/* Floating Card */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105"></div>

                    <div className="relative bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-500 group-hover:transform group-hover:-translate-y-2">


                      {/* Post Header */}
                      <div className="p-4 sm:p-6 pb-3 sm:pb-4">
                        <div className="flex items-start space-x-3">
                          <div className="relative flex-shrink-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-sm font-bold shadow-lg">
                              {post.uploaded_by.charAt(0).toUpperCase()}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-black"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 flex-wrap">
                              <span className="font-bold text-white text-sm sm:text-base">{post.uploaded_by}</span>
                              <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                              <span className="text-gray-400 text-xs sm:text-sm">{formatTime(post.created_at || '')}</span>
                            </div>
                            <p className="text-gray-300 mt-2 leading-relaxed text-sm sm:text-base">{post.caption}</p>
                          </div>
                        </div>
                      </div>

                      {/* Immersive Image */}
                      <div className="relative group/image">
                        <div
                          className="cursor-pointer overflow-hidden"
                          onClick={() => setFullscreenImage(post.file_url)}
                        >
                          <Image
                            src={post.file_url}
                            alt={post.caption || 'Post image'}
                            width={600}
                            height={400}
                            className="w-full h-auto object-cover transition-transform duration-700 group-hover/image:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/20 backdrop-blur-xl rounded-full p-4">
                              <Eye className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="px-4 sm:px-6 pt-3 sm:pt-4">
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {post.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="bg-blue-500/20 text-blue-300 px-2 sm:px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-500/30 cursor-pointer transition-colors"
                                onClick={() => setSelectedHashtag(tag)}
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Floating Action Bar */}
                      <div className="p-4 sm:p-6 pt-3 sm:pt-4">
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-2 sm:p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-0.5 sm:space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLike(post.id)}
                                className={`group relative rounded-xl p-2 sm:p-3 transition-all duration-300 ${likedPosts.has(post.id)
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'hover:bg-red-500/10 text-gray-400 hover:text-red-400'
                                  }`}
                              >
                                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                                {(post.likes || 0) > 0 && (
                                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-[20px] flex items-center justify-center font-bold border-2 border-black shadow-lg z-10">
                                    {post.likes || 0}
                                  </span>
                                )}
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newExpanded = new Set(expandedComments);
                                  if (expandedComments.has(post.id)) {
                                    newExpanded.delete(post.id);
                                  } else {
                                    newExpanded.add(post.id);
                                  }
                                  setExpandedComments(newExpanded);
                                }}
                                className="group relative rounded-xl p-2 sm:p-3 hover:bg-blue-500/10 text-gray-400 hover:text-blue-400 transition-all duration-300"
                              >
                                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
                                {(post.comments || 0) > 0 && (
                                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-[20px] flex items-center justify-center font-bold border-2 border-black shadow-lg z-10">
                                    {post.comments || 0}
                                  </span>
                                )}
                              </Button>



                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleShare(post.id)}
                                className="group relative rounded-xl p-2 sm:p-3 hover:bg-purple-500/10 text-gray-400 hover:text-purple-400 transition-all duration-300"
                              >
                                <Share2 className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
                                {(post.shares || 0) > 0 && (
                                  <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-[20px] flex items-center justify-center font-bold border-2 border-black shadow-lg z-10">
                                    {post.shares || 0}
                                  </span>
                                )}
                              </Button>
                            </div>

                            <div className="flex items-center space-x-0.5 sm:space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownload(post)}
                                className="group rounded-xl p-2 sm:p-3 hover:bg-blue-500/10 text-gray-400 hover:text-blue-400 transition-all duration-300"
                              >
                                <Download className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:scale-110" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleBookmark(post.id)}
                                className={`group rounded-xl p-2 sm:p-3 transition-all duration-300 ${bookmarkedPosts.has(post.id)
                                    ? 'bg-yellow-500/20 text-yellow-400'
                                    : 'hover:bg-yellow-500/10 text-gray-400 hover:text-yellow-400'
                                  }`}
                              >
                                <Bookmark className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:scale-110 ${bookmarkedPosts.has(post.id) ? 'fill-current' : ''}`} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Immersive Comments */}
                      {expandedComments.has(post.id) && (
                        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-3 sm:p-4">
                            <div className="space-y-3 sm:space-y-4 mb-3 sm:mb-4 max-h-48 overflow-y-auto social-scroll">
                              {/* Sample comments */}
                              <div className="flex space-x-2 sm:space-x-3">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-xs font-bold shadow-lg flex-shrink-0">
                                  U
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="bg-white/10 rounded-2xl p-2 sm:p-3">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <span className="font-bold text-white text-xs sm:text-sm">user_1</span>
                                      <span className="text-gray-400 text-xs">2h</span>
                                    </div>
                                    <p className="text-gray-200 text-xs sm:text-sm">Amazing shot! Love the energy 🔥</p>
                                  </div>
                                </div>
                              </div>
                              {/* User comments */}
                              {comments[post.id]?.map((comment) => (
                                <div key={comment.id} className="flex space-x-2 sm:space-x-3">
                                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-xs font-bold shadow-lg flex-shrink-0">
                                    Y
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="bg-white/10 rounded-2xl p-2 sm:p-3">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <span className="font-bold text-white text-xs sm:text-sm">{comment.user}</span>
                                        <span className="text-gray-400 text-xs">{comment.time}</span>
                                      </div>
                                      <p className="text-gray-200 text-xs sm:text-sm">{comment.text}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="flex space-x-2 sm:space-x-3">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-xs font-bold shadow-lg flex-shrink-0">
                                Y
                              </div>
                              <div className="flex-1 flex space-x-2">
                                <Input
                                  placeholder="Share your thoughts..."
                                  value={newComment}
                                  onChange={(e) => setNewComment(e.target.value)}
                                  className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl text-sm"
                                />
                                <Button
                                  variant="ghost"
                                  size="lg"
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg rounded-xl px-3 sm:px-4 flex-shrink-0"
                                  onClick={() => handleAddComment(post.id)}
                                >
                                  <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {filteredPosts.length === 0 && (
            <div className="max-w-4xl mx-auto text-center py-12 px-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {selectedHashtag
                      ? `No pulse found for #${selectedHashtag}`
                      : searchQuery
                        ? `No pulse found for "${searchQuery}"`
                        : 'No pulse detected'
                    }
                  </h3>
                  <p className="text-gray-400 mb-4 text-sm">Try adjusting your search or explore different hashtags</p>
                  {(selectedHashtag || searchQuery) && (
                    <Button
                      onClick={() => {
                        setSelectedHashtag('');
                        setSearchQuery('');
                      }}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg rounded-2xl px-6 py-2 text-sm"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Reset Pulse
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Immersive Fullscreen Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="relative max-w-full max-h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl sm:rounded-3xl blur-3xl"></div>
            <div className="relative bg-black/40 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/10 overflow-hidden">
              <Image
                src={fullscreenImage}
                alt="Fullscreen image"
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFullscreenImage(null)}
              className="absolute top-3 right-3 sm:top-6 sm:right-6 bg-black/50 backdrop-blur-xl text-white hover:text-red-400 rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-white/10"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};