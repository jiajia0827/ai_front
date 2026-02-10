import { addDays, subDays } from 'date-fns';

export type Priority = 'High' | 'Medium' | 'Low';
export type TaskType = 'Development' | 'Testing' | 'Design';
export type TaskStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Blocked';

export interface PBI {
  id: string;
  title: string;
  priority: Priority;
  effort: number; // Story points
  dependencies: number;
}

export interface UserStory {
  id: string;
  pbiId: string;
  title: string;
  priority: Priority;
  criteriaCount: number;
  acceptanceCriteria: {
    functional: number;
    performance: number;
    compatibility: number;
    ux: number;
    documentation: number;
  };
}

export interface Task {
  id: string;
  storyId: string;
  owner: string; // Initials e.g., "ZK"
  estimate: number; // Hours
  type: TaskType;
  status: TaskStatus;
  startDate: Date;
  endDate: Date;
  dependencies: string[];
}

// Mock Data
export const pbis: PBI[] = [
  { id: 'PBI-101', title: 'User Authentication Module', priority: 'High', effort: 13, dependencies: 0 },
  { id: 'PBI-102', title: 'Product Search & Filtering', priority: 'Medium', effort: 8, dependencies: 1 },
];

export const userStories: UserStory[] = [
  // PBI-101 Stories
  { 
    id: 'US-101-A', 
    pbiId: 'PBI-101', 
    title: 'Login via Email/Password', 
    priority: 'High', 
    criteriaCount: 5,
    acceptanceCriteria: { functional: 10, performance: 8, compatibility: 9, ux: 7, documentation: 6 }
  },
  { 
    id: 'US-101-B', 
    pbiId: 'PBI-101', 
    title: 'Forgot Password Flow', 
    priority: 'Medium', 
    criteriaCount: 3,
    acceptanceCriteria: { functional: 9, performance: 9, compatibility: 8, ux: 8, documentation: 8 }
  },
  { 
    id: 'US-101-C', 
    pbiId: 'PBI-101', 
    title: 'SSO Integration (Google)', 
    priority: 'Low', 
    criteriaCount: 4,
    acceptanceCriteria: { functional: 7, performance: 6, compatibility: 9, ux: 9, documentation: 5 }
  },
  // PBI-102 Stories (Simplified for visual balance)
  { 
    id: 'US-102-A', 
    pbiId: 'PBI-102', 
    title: 'Search Bar Implementation', 
    priority: 'High', 
    criteriaCount: 4,
    acceptanceCriteria: { functional: 8, performance: 7, compatibility: 9, ux: 8, documentation: 7 }
  },
];

const today = new Date();

export const tasks: Task[] = [
  // US-101-A Tasks
  { id: 'T-101', storyId: 'US-101-A', owner: 'JD', estimate: 4, type: 'Design', status: 'Completed', startDate: subDays(today, 5), endDate: subDays(today, 4), dependencies: [] },
  { id: 'T-102', storyId: 'US-101-A', owner: 'AL', estimate: 6, type: 'Development', status: 'Completed', startDate: subDays(today, 3), endDate: subDays(today, 1), dependencies: ['T-101'] },
  { id: 'T-103', storyId: 'US-101-A', owner: 'MK', estimate: 3, type: 'Testing', status: 'In Progress', startDate: today, endDate: addDays(today, 1), dependencies: ['T-102'] },
  { id: 'T-104', storyId: 'US-101-A', owner: 'AL', estimate: 2, type: 'Development', status: 'Not Started', startDate: addDays(today, 1), endDate: addDays(today, 1), dependencies: ['T-102'] },
  
  // US-101-B Tasks
  { id: 'T-201', storyId: 'US-101-B', owner: 'JD', estimate: 2, type: 'Design', status: 'Completed', startDate: subDays(today, 2), endDate: subDays(today, 2), dependencies: [] },
  { id: 'T-202', storyId: 'US-101-B', owner: 'RK', estimate: 5, type: 'Development', status: 'In Progress', startDate: subDays(today, 1), endDate: addDays(today, 1), dependencies: ['T-201'] },
  { id: 'T-203', storyId: 'US-101-B', owner: 'MK', estimate: 2, type: 'Testing', status: 'Not Started', startDate: addDays(today, 2), endDate: addDays(today, 2), dependencies: ['T-202'] },
  
  // US-101-C Tasks
  { id: 'T-301', storyId: 'US-101-C', owner: 'RK', estimate: 8, type: 'Development', status: 'Blocked', startDate: subDays(today, 3), endDate: today, dependencies: [] },
  { id: 'T-302', storyId: 'US-101-C', owner: 'MK', estimate: 4, type: 'Testing', status: 'Not Started', startDate: addDays(today, 3), endDate: addDays(today, 4), dependencies: ['T-301'] },

   // US-102-A Tasks
  { id: 'T-401', storyId: 'US-102-A', owner: 'JD', estimate: 3, type: 'Design', status: 'Completed', startDate: subDays(today, 6), endDate: subDays(today, 5), dependencies: [] },
  { id: 'T-402', storyId: 'US-102-A', owner: 'AL', estimate: 8, type: 'Development', status: 'In Progress', startDate: subDays(today, 4), endDate: today, dependencies: ['T-401'] },
  { id: 'T-403', storyId: 'US-102-A', owner: 'MK', estimate: 4, type: 'Testing', status: 'Not Started', startDate: addDays(today, 1), endDate: addDays(today, 2), dependencies: ['T-402'] },
];
