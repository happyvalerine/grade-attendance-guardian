
export interface Student {
  id: string;
  name: string;
  grade: string;
  currentGPA: number;
  attendanceRate: number;
  absences: number;
  email: string;
  lastUpdated: string;
}

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface RiskAssessment {
  level: RiskLevel;
  score: number;
  factors: string[];
  recommendations: string[];
}
