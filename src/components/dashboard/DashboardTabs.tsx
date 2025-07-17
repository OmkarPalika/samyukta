'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DashboardTabs() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Map paths to tab values
  const getTabValue = () => {
    if (!pathname) return 'dashboard';
    if (pathname === '/dashboard' || pathname === '/dashboard/participant') return 'dashboard';
    if (pathname.includes('/dashboard/participant/games')) return 'games';
    if (pathname.includes('/dashboard/participant/competitions')) return 'competitions';
    if (pathname.includes('/dashboard/participant/team')) return 'team';
    if (pathname.includes('/dashboard/participant/social')) return 'social';
    if (pathname.includes('/dashboard/participant/schedule')) return 'schedule';
    if (pathname.includes('/dashboard/participant/help')) return 'help';
    return 'dashboard';
  };

  const handleTabChange = (value: string) => {
    switch (value) {
      case 'games':
        router.push('/dashboard/participant/games');
        break;
      case 'competitions':
        router.push('/dashboard/participant/competitions');
        break;
      case 'team':
        router.push('/dashboard/participant/team');
        break;
      case 'social':
        router.push('/dashboard/participant/social');
        break;
      case 'schedule':
        router.push('/dashboard/participant/schedule');
        break;
      case 'help':
        router.push('/dashboard/participant/help');
        break;
      default:
        router.push('/dashboard');
    }
  };

  return (
    <div className="w-full max-w-full mb-6">
      <Tabs value={getTabValue()} onValueChange={handleTabChange} className="w-full max-w-full">
        <TabsList className="hidden lg:grid w-full grid-cols-7 bg-gray-800/40 h-16">
          <TabsTrigger value="dashboard" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white h-full">
            <div className="text-center">
              <div className="font-semibold">Dashboard</div>
              <div className="text-xs opacity-70">Home</div>
            </div>
          </TabsTrigger>
          <TabsTrigger value="games" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white h-full">
            <div className="text-center">
              <div className="font-semibold">Games</div>
              <div className="text-xs opacity-70">Interactive</div>
            </div>
          </TabsTrigger>
          <TabsTrigger value="competitions" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white h-full">
            <div className="text-center">
              <div className="font-semibold">Competitions</div>
              <div className="text-xs opacity-70">Join & Track</div>
            </div>
          </TabsTrigger>
          <TabsTrigger value="team" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white h-full">
            <div className="text-center">
              <div className="font-semibold">Team</div>
              <div className="text-xs opacity-70">Information</div>
            </div>
          </TabsTrigger>
          <TabsTrigger value="social" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white h-full">
            <div className="text-center">
              <div className="font-semibold">Social</div>
              <div className="text-xs opacity-70">Photos</div>
            </div>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-amber-500 data-[state=active]:text-white h-full">
            <div className="text-center">
              <div className="font-semibold">Schedule</div>
              <div className="text-xs opacity-70">Events</div>
            </div>
          </TabsTrigger>
          <TabsTrigger value="help" className="text-gray-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white h-full">
            <div className="text-center">
              <div className="font-semibold">Help</div>
              <div className="text-xs opacity-70">Support</div>
            </div>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}