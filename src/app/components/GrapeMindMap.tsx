import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { PBI, UserStory, Task } from '@/app/data/mockData';
import clsx from 'clsx';
import { ChevronDown, ChevronUp, User, Clock, CheckCircle, AlertCircle, PlayCircle, PauseCircle } from 'lucide-react';

interface GrapeMindMapProps {
  pbis: PBI[];
  stories: UserStory[];
  tasks: Task[];
  onSelectPbi: (id: string) => void;
  onSelectStory: (id: string) => void;
  onSelectTask: (id: string) => void;
  selectedPbiId: string | null;
  selectedStoryId: string | null;
  selectedTaskId: string | null;
}

// --- Constants ---
const PBI_Y = 60;
const STORY_Y = 220;
const GRAPE_START_Y = 320;
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 800;

const COLORS = {
  high: '#F87171',
  medium: '#FBBF24',
  low: '#9CA3AF',
  dev: '#60A5FA',
  test: '#34D399',
  design: '#A78BFA',
};

// --- Helper Components ---

const TaskNode = ({ task, x, y, isSelected, onClick }: { task: Task, x: number, y: number, isSelected: boolean, onClick: () => void }) => {
  const color = task.type === 'Development' ? COLORS.dev : task.type === 'Testing' ? COLORS.test : COLORS.design;
  
  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2 }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="cursor-pointer"
      whileHover={{ scale: 1.1 }}
    >
      <title>{`任务ID: ${task.id}\n负责人: ${task.owner}\n类型: ${task.type}\n状态: ${task.status}\n预估: ${task.estimate}h`}</title>
      
      {/* Main Node Circle */}
      <circle
        cx={x}
        cy={y}
        r={20}
        fill={isSelected ? '#fff' : color}
        stroke={color}
        strokeWidth={2}
        className="transition-colors duration-200"
      />
      {isSelected && <circle cx={x} cy={y} r={24} stroke={color} strokeWidth={1} strokeDasharray="2 2" fill="none" />}
      
      {/* Task Info (Hours) */}
      <text x={x} y={y + 1} textAnchor="middle" fontSize="9" fill={isSelected ? color : '#fff'} fontWeight="bold">
        {task.estimate}h
      </text>

      {/* Owner Avatar Badge */}
      <circle cx={x + 14} cy={y + 14} r={8} fill="white" stroke={color} strokeWidth={1} />
      <text x={x + 14} y={y + 16} textAnchor="middle" fontSize="6" fill={color} fontWeight="bold">
        {task.owner}
      </text>
    </motion.g>
  );
};

export const GrapeMindMap: React.FC<GrapeMindMapProps> = ({
  pbis, stories, tasks,
  onSelectPbi, onSelectStory, onSelectTask,
  selectedPbiId, selectedStoryId, selectedTaskId
}) => {
  const [expandedPbiIds, setExpandedPbiIds] = useState<Set<string>>(new Set(pbis.map(p => p.id)));
  
  // Viewport State
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey || true) { // Always zoom on wheel for this specific request
      e.preventDefault();
      const zoomSensitivity = 0.001;
      const newScale = Math.min(Math.max(0.5, transform.k - e.deltaY * zoomSensitivity), 3);
      setTransform(t => ({ ...t, k: newScale }));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;
    setTransform(t => ({ ...t, x: t.x + dx, y: t.y + dy }));
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const togglePbi = (id: string) => {
    onSelectPbi(id);
    const newSet = new Set(expandedPbiIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedPbiIds(newSet);
  };

  // Layout Calculation
  const layout = useMemo(() => {
    // 1. Position PBIs horizontally
    const pbiGap = CANVAS_WIDTH / (pbis.length + 1);
    
    return pbis.map((pbi, pbiIndex) => {
      const pbiX = pbiGap * (pbiIndex + 1);
      const isExpanded = expandedPbiIds.has(pbi.id);
      
      // Filter stories for this PBI
      const myStories = stories.filter(s => s.pbiId === pbi.id);
      
      // Calculate Story positions
      // We center them under the PBI
      const storyGap = 180; // Minimum width per story
      const totalWidth = myStories.length * storyGap;
      const startX = pbiX - totalWidth / 2 + storyGap / 2;

      const storyNodes = myStories.map((story, sIndex) => {
        const storyX = startX + sIndex * storyGap;
        
        // Filter tasks for this Story
        const myTasks = tasks.filter(t => t.storyId === story.id);
        
        // Calculate Task positions (Grape Cluster)
        // Simple algorithm: fill rows 1, 2, 3...
        // Row 1: 1 item
        // Row 2: 2 items
        // Row 3: 3 items
        const taskNodes = myTasks.map((task, tIndex) => {
          let row = 0;
          let countInRow = 1;
          let currentCount = 0;
          
          // Find which row this task belongs to
          // 0 -> row 0 (0 items before)
          // 1,2 -> row 1 (1 item before)
          // 3,4,5 -> row 2 (3 items before)
          let itemsUsed = 0;
          while (tIndex >= itemsUsed + countInRow) {
            itemsUsed += countInRow;
            countInRow++;
            row++;
          }
          
          const posInRow = tIndex - itemsUsed;
          // Calculate X offset based on row width
          // Row 0: x=0
          // Row 1: x=-15, x=15
          // Row 2: x=-30, 0, 30
          const spacing = 36;
          const rowWidth = (countInRow - 1) * spacing;
          const xOffset = -rowWidth / 2 + posInRow * spacing;
          
          return {
            ...task,
            x: storyX + xOffset,
            y: GRAPE_START_Y + row * 34
          };
        });

        return {
          ...story,
          x: storyX,
          y: STORY_Y,
          tasks: taskNodes
        };
      });

      return {
        ...pbi,
        x: pbiX,
        y: PBI_Y,
        stories: storyNodes,
        isExpanded
      };
    });
  }, [pbis, stories, tasks, expandedPbiIds]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full bg-slate-50 overflow-hidden relative rounded-xl border border-slate-200 shadow-inner cursor-move"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
         <button className="bg-white p-2 rounded shadow border border-gray-200 hover:bg-gray-50" onClick={() => setTransform(t => ({ ...t, k: Math.min(t.k + 0.2, 3) }))}>
           <ChevronUp size={16} />
         </button>
         <button className="bg-white p-2 rounded shadow border border-gray-200 hover:bg-gray-50" onClick={() => setTransform(t => ({ ...t, k: Math.max(t.k - 0.2, 0.5) }))}>
           <ChevronDown size={16} />
         </button>
         <button className="bg-white p-2 rounded shadow border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-600" onClick={() => setTransform({ x: 0, y: 0, k: 1 })}>
           1:1
         </button>
      </div>

      <svg width="100%" height="100%" className="mx-auto block touch-none">
        <g transform={`translate(${transform.x + (containerRef.current?.clientWidth || 800)/2 - CANVAS_WIDTH/2 * transform.k}, ${transform.y + 50}) scale(${transform.k})`}>
        {layout.map(pbi => (
          <g key={pbi.id}>
            {/* Connection PBI -> Stories */}
            {pbi.isExpanded && pbi.stories.map(story => (
              <React.Fragment key={`link-${pbi.id}-${story.id}`}>
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  d={`M${pbi.x},${pbi.y + 40} C${pbi.x},${(pbi.y + story.y) / 2} ${story.x},${(pbi.y + story.y) / 2} ${story.x},${story.y - 25}`}
                  fill="none"
                  stroke="#CBD5E1"
                  strokeWidth="2"
                />
                
                {/* Connection Story -> Tasks (Grape Stem) */}
                {story.tasks.length > 0 && (
                   <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    d={`M${story.x},${story.y + 25} L${story.x},${GRAPE_START_Y - 20}`}
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                )}
              </React.Fragment>
            ))}

            {/* PBI Node */}
            <g
              onClick={() => togglePbi(pbi.id)}
              className="cursor-pointer"
            >
              <title>{`预估工作量: ${pbi.effort} pts\n依赖 PBIs: ${pbi.dependencies}`}</title>
              <circle
                cx={pbi.x}
                cy={pbi.y}
                r={40}
                fill="#3B82F6"
                className={clsx("transition-all duration-300 hover:shadow-lg", selectedPbiId === pbi.id ? "stroke-blue-800 stroke-4" : "")}
              />
              <text x={pbi.x} y={pbi.y - 10} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                {pbi.id}
              </text>
               <foreignObject x={pbi.x - 35} y={pbi.y + 5} width="70" height="40">
                <div className="text-[10px] text-white text-center leading-tight line-clamp-2 px-1">
                  {pbi.title}
                </div>
              </foreignObject>
              {/* Expansion Indicator */}
               <circle cx={pbi.x} cy={pbi.y + 40} r={10} fill="white" stroke="#3B82F6" />
               {pbi.isExpanded ? 
                 <ChevronUp size={12} className="text-blue-500" x={pbi.x - 6} y={pbi.y + 34} /> : 
                 <ChevronDown size={12} className="text-blue-500" x={pbi.x - 6} y={pbi.y + 34} />
               }
            </g>

            {/* Story Nodes */}
            {pbi.isExpanded && pbi.stories.map(story => {
              const priorityColor = story.priority === 'High' ? COLORS.high : story.priority === 'Medium' ? COLORS.medium : COLORS.low;
              const isSelected = selectedStoryId === story.id;
              
              return (
                <g key={story.id}>
                  <motion.g
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={(e) => { e.stopPropagation(); onSelectStory(story.id); }}
                    className="cursor-pointer"
                  >
                    <title>{`标题: ${story.title}\n关联 PBI: ${story.pbiId}\n验收标准数: ${story.criteriaCount}`}</title>
                    <circle
                      cx={story.x}
                      cy={story.y}
                      r={25}
                      fill="#93C5FD"
                      stroke={priorityColor}
                      strokeWidth={3}
                      className={clsx("transition-all", isSelected ? "filter drop-shadow-md brightness-110" : "")}
                    />
                     <text x={story.x} y={story.y - 5} textAnchor="middle" fill="#1E3A8A" fontSize="10" fontWeight="bold">
                      {story.id.split('-')[1]}-{story.id.split('-')[2]}
                    </text>
                    <text x={story.x} y={story.y + 10} textAnchor="middle" fill="#1E40AF" fontSize="8">
                      {story.criteriaCount} ACs
                    </text>
                  </motion.g>

                  {/* Tasks (Grapes) */}
                  {story.tasks.map(task => (
                    <TaskNode
                      key={task.id}
                      task={task}
                      x={task.x}
                      y={task.y}
                      isSelected={selectedTaskId === task.id}
                      onClick={() => onSelectTask(task.id)}
                    />
                  ))}
                </g>
              );
            })}
          </g>
        ))}
        </g>
      </svg>
      
      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white/90 p-3 rounded-lg shadow-sm border border-gray-100 text-xs z-10">
        <div className="font-semibold mb-2">图例说明</div>
        <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-full bg-blue-400"></span> 开发</div>
        <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-full bg-green-400"></span> 测试</div>
        <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-full bg-purple-400"></span> 设计</div>
        <div className="h-px bg-gray-200 my-2"></div>
         <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full border border-red-400"></span> P1 高优先级</div>
      </div>
    </div>
  );
};
