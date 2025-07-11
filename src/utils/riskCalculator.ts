
import { Student, RiskLevel, RiskAssessment } from '@/types/Student';

export const calculateRiskLevel = (student: Student): RiskAssessment => {
  let riskScore = 0;
  const factors: string[] = [];
  const recommendations: string[] = [];

  // GPA Risk Assessment (0-40 points)
  if (student.currentGPA < 1.5) {
    riskScore += 40;
    factors.push('Critically low GPA');
    recommendations.push('Immediate academic intervention required');
  } else if (student.currentGPA < 2.0) {
    riskScore += 30;
    factors.push('Very low GPA');
    recommendations.push('Academic support and tutoring needed');
  } else if (student.currentGPA < 2.5) {
    riskScore += 20;
    factors.push('Below average GPA');
    recommendations.push('Monitor academic progress closely');
  } else if (student.currentGPA < 3.0) {
    riskScore += 10;
    factors.push('Low-average GPA');
    recommendations.push('Encourage study habits improvement');
  }

  // Attendance Risk Assessment (0-40 points)
  if (student.attendanceRate < 60) {
    riskScore += 40;
    factors.push('Critically low attendance');
    recommendations.push('Immediate attendance intervention required');
  } else if (student.attendanceRate < 70) {
    riskScore += 30;
    factors.push('Very low attendance');
    recommendations.push('Attendance counseling needed');
  } else if (student.attendanceRate < 80) {
    riskScore += 20;
    factors.push('Below average attendance');
    recommendations.push('Monitor attendance patterns');
  } else if (student.attendanceRate < 90) {
    riskScore += 10;
    factors.push('Moderate attendance concerns');
    recommendations.push('Encourage better attendance');
  }

  // Absences Risk Assessment (0-20 points)
  if (student.absences > 30) {
    riskScore += 20;
    factors.push('Excessive absences');
    recommendations.push('Review reasons for frequent absences');
  } else if (student.absences > 20) {
    riskScore += 15;
    factors.push('High number of absences');
    recommendations.push('Track absence patterns');
  } else if (student.absences > 15) {
    riskScore += 10;
    factors.push('Moderate absences');
    recommendations.push('Monitor absence trends');
  } else if (student.absences > 10) {
    riskScore += 5;
    factors.push('Some absences noted');
    recommendations.push('Keep attendance on track');
  }

  // Determine risk level based on total score
  let level: RiskLevel;
  if (riskScore >= 70) {
    level = 'critical';
  } else if (riskScore >= 45) {
    level = 'high';
  } else if (riskScore >= 20) {
    level = 'moderate';
  } else {
    level = 'low';
  }

  // Add positive recommendations for low-risk students
  if (level === 'low') {
    factors.push('Good academic standing');
    recommendations.push('Continue current performance');
  }

  return {
    level,
    score: riskScore,
    factors,
    recommendations,
  };
};

export const getRiskColor = (level: RiskLevel): string => {
  switch (level) {
    case 'low':
      return 'green';
    case 'moderate':
      return 'yellow';
    case 'high':
      return 'orange';
    case 'critical':
      return 'red';
    default:
      return 'gray';
  }
};

export const getRiskLabel = (level: RiskLevel): string => {
  switch (level) {
    case 'low':
      return 'Low Risk';
    case 'moderate':
      return 'Moderate Risk';
    case 'high':
      return 'High Risk';
    case 'critical':
      return 'Critical Risk';
    default:
      return 'Unknown';
  }
};
