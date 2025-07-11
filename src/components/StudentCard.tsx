
import { Student } from '@/types/Student';
import { calculateRiskLevel, getRiskColor, getRiskLabel } from '@/utils/riskCalculator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Mail, GraduationCap, Calendar, TrendingDown } from 'lucide-react';

interface StudentCardProps {
  student: Student;
  onEdit: () => void;
  onDelete: () => void;
}

export const StudentCard = ({ student, onEdit, onDelete }: StudentCardProps) => {
  const riskAssessment = calculateRiskLevel(student);
  const riskColor = getRiskColor(riskAssessment.level);
  const riskLabel = getRiskLabel(riskAssessment.level);

  const getRiskBadgeColor = () => {
    switch (riskAssessment.level) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
      onDelete();
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
              {student.name}
            </CardTitle>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <GraduationCap className="h-4 w-4 mr-1" />
              {student.grade}
            </div>
          </div>
          <Badge className={`${getRiskBadgeColor()} font-medium`}>
            {riskLabel}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{student.currentGPA}</div>
            <div className="text-xs text-blue-600 font-medium">Current GPA</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{student.attendanceRate}%</div>
            <div className="text-xs text-purple-600 font-medium">Attendance</div>
          </div>
        </div>

        {/* Absences */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            Absences
          </div>
          <span className="font-semibold text-gray-900">{student.absences} days</span>
        </div>

        {/* Risk Factors */}
        {riskAssessment.factors.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700 flex items-center">
              <TrendingDown className="h-4 w-4 mr-1" />
              Risk Factors
            </div>
            <div className="space-y-1">
              {riskAssessment.factors.slice(0, 2).map((factor, index) => (
                <div key={index} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                  {factor}
                </div>
              ))}
              {riskAssessment.factors.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{riskAssessment.factors.length - 2} more factors
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact */}
        <div className="flex items-center text-sm text-gray-600 pt-2 border-t">
          <Mail className="h-4 w-4 mr-2" />
          <span className="truncate">{student.email}</span>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex items-center"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
