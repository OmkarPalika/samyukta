'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User as UserType } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Bell,
  Search,
  RefreshCw,
  Settings,
  Trophy,
  LogOut,
  User as UserIcon,
  BarChart3,
  Users,
  FileText,
  Mail,
  Home,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PageLoading } from '@/components/shared/Loading';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showRefresh?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
}

const navigationItems = [
  {
    title: 'Dashboard',
    icon: Home,
    route: '/dashboard/admin',
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    route: '/dashboard/admin/analytics',
  },
  {
    title: 'Users',
    icon: Users,
    route: '/dashboard/admin/user-management',
  },
  {
    title: 'Registrations',
    icon: FileText,
    route: '/dashboard/admin/registration-management',
  },
  {
    title: 'Email Tools',
    icon: Mail,
    route: '/dashboard/admin/email-resend',
  },
];

function AdminSidebar({ user, onLogout }: { user: UserType | null; onLogout: () => void }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="sidebar" className="dark bg-gray-900 border-gray-700">
      <SidebarHeader className="border-b border-gray-700 bg-gray-900">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <Trophy className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-semibold text-white">Samyukta</span>
            <span className="text-xs text-gray-400">Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-gray-900">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.route}>
                  <SidebarMenuButton
                    onClick={() => router.push(item.route)}
                    isActive={pathname === item.route}
                    className="w-full text-gray-300 hover:text-white hover:bg-gray-800 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-700 bg-gray-900">
        {user && (
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="w-full text-gray-300 hover:text-white hover:bg-gray-800 data-[state=open]:bg-gray-800 data-[state=open]:text-white">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-xs font-bold text-white">
                        {user.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-left group-data-[collapsible=icon]:hidden">
                      <span className="truncate text-sm font-medium text-white">{user.full_name}</span>
                      <span className="truncate text-xs text-gray-400">{user.email}</span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start" className="w-56 bg-gray-800 border-gray-700">
                  <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                    <UserIcon className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem onClick={onLogout} className="text-red-400 hover:text-red-300 hover:bg-gray-700">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

export default function AdminLayout({
  children,
  title,
  subtitle,
  showRefresh = false,
  onRefresh,
  refreshing = false
}: AdminLayoutProps) {
  const router = useRouter();
  const { user: authUser, loading: authLoading, logout: authLogout } = useAuth();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = useCallback(async () => {
    try {
      // First check auth context
      if (authLoading) return;
      
      if (!authUser) {
        router.push('/login');
        return;
      }

      // Verify admin role
      if (authUser.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      setUser(authUser as UserType);
    } catch (error) {
      console.error('Failed to load user data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router, authUser, authLoading]);

  const handleLogout = async () => {
    try {
      await authLogout();
      router.push('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  useEffect(() => {
    if (!authLoading) {
      loadUserData();
    }
  }, [loadUserData, authLoading]);

  const handleRefresh = async () => {
    if (onRefresh) {
      onRefresh();
      toast.success('Page refreshed');
    }
  };

  if (loading || authLoading) {
    return <PageLoading />;
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400">Administrator access required.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        :root {
          --neon-blue: #00D4FF;
          --electric-violet: #8B5CF6;
          --dark-bg: #0F0F23;
          --card-bg: #1A1B3A;
          --text-primary: #FFFFFF;
          --text-secondary: #B8BCC8;
        }
        
        .neon-glow {
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
        }
        
        .violet-glow {
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
        }

        /* Fix any unwanted left spacing from shadcn sidebar */
        [data-sidebar="inset"] {
          margin-left: 0 !important;
          padding-left: 0 !important;
        }
        
        /* Ensure main content takes full width */
        main {
          width: 100% !important;
          margin-left: 0 !important;
          padding-left: 0 !important;
        }
      `}</style>
      
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark">
          <AdminSidebar user={user} onLogout={handleLogout} />
          
          <SidebarInset className="flex flex-1 flex-col overflow-hidden">
            {/* Header */}
            <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-gray-700 bg-gray-900/80 backdrop-blur-xl px-4">
              <SidebarTrigger className="-ml-1 text-gray-300 hover:text-white hover:bg-gray-800" />
              
              <div className="flex flex-1 items-center justify-between">
                {/* Page Title - Hidden on mobile, shown on larger screens */}
                {title && (
                  <div className="hidden sm:block">
                    <h1 className="text-lg font-semibold text-white">{title}</h1>
                    {subtitle && (
                      <p className="text-sm text-gray-400">{subtitle}</p>
                    )}
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex items-center gap-2 ml-auto">
                  {/* Search - Hidden on mobile */}
                  <Button variant="ghost" size="sm" className="hidden sm:flex h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-800">
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Search</span>
                  </Button>

                  {/* Notifications */}
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-800">
                    <Bell className="h-4 w-4" />
                    <span className="sr-only">Notifications</span>
                  </Button>

                  {/* Refresh */}
                  {showRefresh && (
                    <Button
                      onClick={handleRefresh}
                      disabled={refreshing}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-800 disabled:opacity-50"
                    >
                      <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                      <span className="sr-only">Refresh</span>
                    </Button>
                  )}

                  {/* User Menu - Mobile */}
                  <div className="sm:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-800">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-xs font-bold text-white">
                              {user.full_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-700">
                        <DropdownMenuLabel>
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none text-white">{user.full_name}</p>
                            <p className="text-xs leading-none text-gray-400">{user.email}</p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                          <UserIcon className="h-4 w-4 mr-2" />
                          Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-gray-700">
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full"
              >
                {children}
              </motion.div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
}