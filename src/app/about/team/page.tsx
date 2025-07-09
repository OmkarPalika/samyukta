import { TEAM_PAGE_DATA } from "@/lib/page-data";
import TeamContent from "./team-content";
import { Suspense } from "react";

// Configure for static generation
export const dynamic = 'force-static';
export const revalidate = false;
export const runtime = 'nodejs'; // Use Node.js runtime instead of Edge

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
      <section className="section-padding">
        <div className="container-responsive">
          {/* Static header content */}
          <div className="text-center mb-16">
            <div className="text-spacing-lg">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                  {TEAM_PAGE_DATA.title}
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
                {TEAM_PAGE_DATA.description}
              </p>
            </div>
          </div>
          
          {/* Client component with animations - wrapped in Suspense */}
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading team data...</div>}>
            <TeamContent teamData={TEAM_PAGE_DATA} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}