
import { Student } from '@/types/Student';
import { StudentCard } from '@/components/StudentCard';
import { Users } from 'lucide-react';

interface StudentDashboardProps {
  students: Student[];
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
}

export const StudentDashboard = ({ students, onEditStudent, onDeleteStudent }: StudentDashboardProps) => {
  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Students Added Yet</h3>
        <p className="text-gray-500">Click "Add Student" to start assessing student risk levels.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Overview</h2>
        <p className="text-gray-600">Monitoring {students.length} student{students.length !== 1 ? 's' : ''}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            onEdit={() => onEditStudent(student)}
            onDelete={() => onDeleteStudent(student.id)}
          />
        ))}
      </div>
    </div>
  );
};
