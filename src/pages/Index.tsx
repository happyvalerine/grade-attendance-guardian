
import { useState } from 'react';
import { StudentForm } from '@/components/StudentForm';
import { StudentDashboard } from '@/components/StudentDashboard';
import { RiskSummary } from '@/components/RiskSummary';
import { Student } from '@/types/Student';
import { GraduationCap, Users, AlertTriangle } from 'lucide-react';

const Index = () => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'Emma Johnson',
      grade: 'Grade 10',
      currentGPA: 2.1,
      attendanceRate: 75,
      absences: 15,
      email: 'emma.johnson@school.edu',
      lastUpdated: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Marcus Chen',
      grade: 'Grade 11',
      currentGPA: 3.8,
      attendanceRate: 95,
      absences: 3,
      email: 'marcus.chen@school.edu',
      lastUpdated: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Sofia Rodriguez',
      grade: 'Grade 9',
      currentGPA: 2.5,
      attendanceRate: 68,
      absences: 22,
      email: 'sofia.rodriguez@school.edu',
      lastUpdated: new Date().toISOString(),
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const handleAddStudent = (studentData: Omit<Student, 'id' | 'lastUpdated'>) => {
    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString(),
    };
    setStudents([...students, newStudent]);
    setShowForm(false);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleUpdateStudent = (studentData: Omit<Student, 'id' | 'lastUpdated'>) => {
    if (!editingStudent) return;
    
    const updatedStudent: Student = {
      ...studentData,
      id: editingStudent.id,
      lastUpdated: new Date().toISOString(),
    };
    
    setStudents(students.map(s => s.id === editingStudent.id ? updatedStudent : s));
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(students.filter(s => s.id !== studentId));
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Student Risk Assessment</h1>
                <p className="text-gray-600 mt-1">Early intervention through data-driven insights</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Add Student
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Risk Summary */}
        <RiskSummary students={students} />

        {/* Main Content */}
        <div className="mt-8">
          {showForm ? (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingStudent ? 'Edit Student' : 'Add New Student'}
                </h2>
                <button
                  onClick={handleFormClose}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              <StudentForm
                onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}
                onCancel={handleFormClose}
                initialData={editingStudent || undefined}
              />
            </div>
          ) : (
            <StudentDashboard
              students={students}
              onEditStudent={handleEditStudent}
              onDeleteStudent={handleDeleteStudent}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
