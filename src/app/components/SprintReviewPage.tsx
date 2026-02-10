'use client';

import React from 'react';
import { SprintBacklog } from './SprintBacklog';
import { SprintProgress } from './SprintProgress';
import { TeamWorkload } from './TeamWorkload';
import { Retrospective } from './Retrospective';
import { DashboardTools } from './DashboardTools';
import { InfoBar } from './InfoBar';

export default function SprintReviewPage() {
  const [isBacklogCollapsed, setIsBacklogCollapsed] = React.useState(false);

  return (
    <div className="h-screen bg-gray-100 flex flex-col font-sans text-gray-900 overflow-hidden">
      {/* Top Header / Tools Section */}
      <DashboardTools />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Iteration Backlog (Collapsible) */}
        <SprintBacklog 
          isCollapsed={isBacklogCollapsed} 
          onToggle={() => setIsBacklogCollapsed(!isBacklogCollapsed)} 
        />

        {/* Right Side: Visualizations and Review/Retro panels */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50/50 custom-scrollbar">
          
          {/* Top Panel: Progress Visualization */}
          <div className="min-h-[380px] shrink-0 border-b border-slate-100">
            <SprintProgress />
          </div>

          {/* Middle Panel: Team Workload Analysis */}
          <div className="min-h-[380px] shrink-0 border-b border-slate-100">
            <TeamWorkload />
          </div>

          {/* Bottom Panel: Iteration Retrospective Highlights */}
          <div className="min-h-[420px] shrink-0">
            <Retrospective />
          </div>
        </div>
      </div>

      {/* Footer Info Bar */}
      <InfoBar />
    </div>
  );
}
