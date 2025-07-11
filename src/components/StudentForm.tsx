
import { useState } from 'react';
import { Student } from '@/types/Student';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StudentFormProps {
  onSubmit: (student: Omit<Student, 'id' | 'lastUpdated'>) => void;
  onCancel: () => void;
  initialData?: Student;
}

export const StudentForm = ({ onSubmit, onCancel, initialData }: StudentFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    grade: initialData?.grade || '',
    currentGPA: initialData?.currentGPA?.toString() || '',
    attendanceRate: initialData?.attendanceRate?.toString() || '',
    absences: initialData?.absences?.toString() || '',
    email: initialData?.email || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.grade || !formData.currentGPA || !formData.attendanceRate || !formData.absences || !formData.email) {
      alert('Please fill in all fields');
      return;
    }

    const gpa = parseFloat(formData.currentGPA);
    const attendance = parseInt(formData.attendanceRate);
    const absences = parseInt(formData.absences);

    if (gpa < 0 || gpa > 4) {
      alert('GPA must be between 0.0 and 4.0');
      return;
    }

    if (attendance < 0 || attendance > 100) {
      alert('Attendance rate must be between 0 and 100');
      return;
    }

    if (absences < 0) {
      alert('Absences cannot be negative');
      return;
    }

    onSubmit({
      name: formData.name,
      grade: formData.grade,
      currentGPA: gpa,
      attendanceRate: attendance,
      absences: absences,
      email: formData.email,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Student Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter student name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="student@school.edu"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="grade">Grade Level</Label>
          <Select value={formData.grade} onValueChange={(value) => handleInputChange('grade', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select grade level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Grade 9">Grade 9</SelectItem>
              <SelectItem value="Grade 10">Grade 10</SelectItem>
              <SelectItem value="Grade 11">Grade 11</SelectItem>
              <SelectItem value="Grade 12">Grade 12</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gpa">Current GPA</Label>
          <Input
            id="gpa"
            type="number"
            step="0.1"
            min="0"
            max="4"
            value={formData.currentGPA}
            onChange={(e) => handleInputChange('currentGPA', e.target.value)}
            placeholder="0.0 - 4.0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="attendance">Attendance Rate (%)</Label>
          <Input
            id="attendance"
            type="number"
            min="0"
            max="100"
            value={formData.attendanceRate}
            onChange={(e) => handleInputChange('attendanceRate', e.target.value)}
            placeholder="0 - 100"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="absences">Total Absences</Label>
          <Input
            id="absences"
            type="number"
            min="0"
            value={formData.absences}
            onChange={(e) => handleInputChange('absences', e.target.value)}
            placeholder="Number of absences"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {initialData ? 'Update Student' : 'Add Student'}
        </Button>
      </div>
    </form>
  );
};
