
import { Student } from '@/types/Student';
import { calculateRiskLevel } from '@/utils/riskCalculator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Users, TrendingUp, TrendingDown } from 'lucide-react';

interface RiskSummaryProps {
  students: Student[];
}

export const RiskSummary = ({ students }: RiskSummaryProps) => {
  const riskCounts = students.reduce(
    (counts, student) => {
      const risk = calculateRiskLevel(student);
      counts[risk.level]++;
      return counts;
    },
    { low: 0, moderate: 0, high: 0, critical: 0 }
  );

  const totalStudents = students.length;
  const atRiskStudents = riskCounts.moderate + riskCounts.high + riskCounts.critical;
  const criticalStudents = riskCounts.critical;

  const summaryCards = [
    {
      title: 'Total Students',
      value: totalStudents,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'At Risk',
      value: atRiskStudents,
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      subtitle: `${totalStudents > 0 ? Math.round((atRiskStudents / totalStudents) * 100) : 0}% of students`,
    },
    {
      title: 'Critical Risk',
      value: criticalStudents,
      icon: TrendingDown,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      subtitle: 'Immediate attention needed',
    },
    {
      title: 'Low Risk',
      value: riskCounts.low,
      icon: TrendingUp,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      subtitle: 'Performing well',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryCards.map((card, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-5 w-5 ${card.textColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {card.value}
            </div>
            {card.subtitle && (
              <p className="text-sm text-gray-600">
                {card.subtitle}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
