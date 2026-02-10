import { addDays, format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

export type TaskStatus = 'done' | 'in-progress' | 'blocked';

export interface DailyStats {
  date: Date;
  progress: number; // 0-100
  tasks: {
    done: number;
    inProgress: number;
    blocked: number;
  };
  blockingCount: number;
  meetingDuration: number; // minutes
  hasMeeting: boolean;
}

export interface TimelineEvent {
  id: string;
  time: string;
  type: 'start' | 'update' | 'blocker' | 'discussion' | 'assignment' | 'end';
  title: string;
  description?: string;
  speaker?: {
    name: string;
    avatar: string;
  };
  progress?: number;
  decision?: string;
  tags?: string[];
}

export const generateMonthData = (currentDate: Date): DailyStats[] => {
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start, end });

  return days.map(day => {
    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
    const hasMeeting = !isWeekend && Math.random() > 0.2;
    
    return {
      date: day,
      hasMeeting,
      progress: hasMeeting ? Math.floor(Math.random() * 60) + 40 : 0,
      tasks: {
        done: hasMeeting ? Math.floor(Math.random() * 5) : 0,
        inProgress: hasMeeting ? Math.floor(Math.random() * 5) : 0,
        blocked: hasMeeting ? Math.floor(Math.random() * 2) : 0,
      },
      blockingCount: hasMeeting ? (Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0) : 0,
      meetingDuration: hasMeeting ? Math.floor(Math.random() * 20) + 10 : 0,
    };
  });
};

export const generateTimelineData = (date: Date): TimelineEvent[] => {
  return [
    {
      id: '1',
      time: '09:00',
      type: 'start',
      title: 'Daily Standup Started',
    },
    {
      id: '2',
      time: '09:02',
      type: 'update',
      title: 'Login Module Progress',
      speaker: { name: 'Alex', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop' },
      progress: 80,
      description: 'Completed the OAuth integration, working on error handling.',
    },
    {
      id: '3',
      time: '09:05',
      type: 'blocker',
      title: 'Payment Gateway Issue',
      speaker: { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=sarah' },
      description: 'API credentials are not working in the staging environment.',
      tags: ['DevOps', 'API'],
    },
    {
      id: '4',
      time: '09:10',
      type: 'discussion',
      title: 'Solution Brainstorming',
      decision: 'Contact provider support and use mock data for now.',
    },
    {
      id: '5',
      time: '09:15',
      type: 'assignment',
      title: 'New Tasks Assigned',
      description: 'Review PR #456, Update documentation.',
    },
    {
      id: '6',
      time: '09:18',
      type: 'end',
      title: 'Meeting Ended',
      description: 'Duration: 18min',
    },
  ];
};

export const radarData = [
  { subject: 'Progress', A: 120, B: 110, fullMark: 150 },
  { subject: 'Quality', A: 98, B: 130, fullMark: 150 },
  { subject: 'Collab', A: 86, B: 130, fullMark: 150 },
  { subject: 'Comms', A: 99, B: 100, fullMark: 150 },
  { subject: 'Risk', A: 85, B: 90, fullMark: 150 },
  { subject: 'Innovation', A: 65, B: 85, fullMark: 150 },
];

export const trendData = Array.from({ length: 7 }).map((_, i) => ({
  name: format(subDays(new Date(), 6 - i), 'MM/dd'),
  value: Math.floor(Math.random() * 40) + 60,
}));
