export type RiskLevel = 'low' | 'medium' | 'high';
export type RiskTier = 1 | 2 | 3;

export interface Task {
  id: string;
  name: string;
  sprintId: string;
  sprintName: string;
  riskLevel: RiskLevel;
  tier: RiskTier;
  position: { x: number; y: number };
  completion: number;
  complexity: number;
  assignee: string;
  blockers: string[];
  codeQuality: number;
  collaboration: number;
  requirementClarity: number;
  testCoverage: number;
  riskTrend: number[];
  progressTrend: number[];
}

export const TIER_CONFIG = {
  1: {
    label: 'Tier 1: 低风险区',
    color: '#10B981',
    radius: 180,
  },
  2: {
    label: 'Tier 2: 中风险区',
    color: '#F59E0B',
    radius: 260,
  },
  3: {
    label: 'Tier 3: 高风险区',
    color: '#EF4444',
    radius: 340,
  },
};
