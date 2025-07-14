import { useState } from 'react';
import { Student } from '@/types/Student';
import { calculateRiskLevel, getRiskLabel } from '@/utils/riskCalculator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';
import { User, GraduationCap, Calendar, AlertTriangle } from 'lucide-react';

interface StudentRiskChartProps {
  students: Student[];
}

export const StudentRiskChart = ({ students }: StudentRiskChartProps) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStudentClick = (studentName: string) => {
    const student = students.find(s => s.name === studentName);
    if (student) {
      setSelectedStudent(student);
      setIsModalOpen(true);
    }
  };

  const handleRiskLevelClick = (riskLevel: string) => {
    const levelMap: { [key: string]: string } = {
      'Low Risk': 'low',
      'Moderate Risk': 'moderate', 
      'High Risk': 'high',
      'Critical Risk': 'critical'
    };
    
    const studentsInLevel = students.filter(s => {
      const risk = calculateRiskLevel(s);
      return risk.level === levelMap[riskLevel];
    });
    
    if (studentsInLevel.length > 0) {
      setSelectedStudent(studentsInLevel[0]);
      setIsModalOpen(true);
    }
  };
  // Risk level distribution data
  const riskDistribution = students.reduce(
    (acc, student) => {
      const risk = calculateRiskLevel(student);
      acc[risk.level]++;
      return acc;
    },
    { low: 0, moderate: 0, high: 0, critical: 0 }
  );

  const pieData = [
    { name: 'Low Risk', value: riskDistribution.low, fill: 'hsl(142, 76%, 36%)' },
    { name: 'Moderate Risk', value: riskDistribution.moderate, fill: 'hsl(48, 96%, 53%)' },
    { name: 'High Risk', value: riskDistribution.high, fill: 'hsl(25, 95%, 53%)' },
    { name: 'Critical Risk', value: riskDistribution.critical, fill: 'hsl(0, 84%, 60%)' },
  ];

  // Student risk scores for bar chart
  const studentRiskData = students.map(student => {
    const risk = calculateRiskLevel(student);
    return {
      name: student.name,
      riskScore: risk.score,
      gpa: student.currentGPA,
      attendance: student.attendanceRate,
      level: risk.level,
      fill: risk.level === 'critical' ? 'hsl(0, 84%, 60%)' :
            risk.level === 'high' ? 'hsl(25, 95%, 53%)' :
            risk.level === 'moderate' ? 'hsl(48, 96%, 53%)' :
            'hsl(142, 76%, 36%)'
    };
  }).sort((a, b) => b.riskScore - a.riskScore);

  // Scatter plot data (GPA vs Attendance)
  const scatterData = students.map(student => {
    const risk = calculateRiskLevel(student);
    return {
      gpa: student.currentGPA,
      attendance: student.attendanceRate,
      name: student.name,
      riskScore: risk.score,
      level: risk.level,
      fill: risk.level === 'critical' ? 'hsl(0, 84%, 60%)' :
            risk.level === 'high' ? 'hsl(25, 95%, 53%)' :
            risk.level === 'moderate' ? 'hsl(48, 96%, 53%)' :
            'hsl(142, 76%, 36%)'
    };
  });

  const chartConfig = {
    riskScore: {
      label: "Risk Score",
    },
    gpa: {
      label: "GPA",
    },
    attendance: {
      label: "Attendance %",
    },
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Risk Overview</TabsTrigger>
          <TabsTrigger value="individual">Individual Scores</TabsTrigger>
          <TabsTrigger value="correlation">GPA vs Attendance</TabsTrigger>
          <TabsTrigger value="distribution">Risk Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Level Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie
                         data={pieData}
                         cx="50%"
                         cy="50%"
                         labelLine={false}
                         label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                         outerRadius={80}
                         fill="#8884d8"
                         dataKey="value"
                         onClick={(data) => handleRiskLevelClick(data.name)}
                         style={{ cursor: 'pointer' }}
                       >
                         {pieData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.fill} />
                         ))}
                       </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-700">{riskDistribution.low}</div>
                    <div className="text-sm text-green-600">Low Risk</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-2xl font-bold text-yellow-700">{riskDistribution.moderate}</div>
                    <div className="text-sm text-yellow-600">Moderate Risk</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-2xl font-bold text-orange-700">{riskDistribution.high}</div>
                    <div className="text-sm text-orange-600">High Risk</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-2xl font-bold text-red-700">{riskDistribution.critical}</div>
                    <div className="text-sm text-red-600">Critical Risk</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="individual">
          <Card>
            <CardHeader>
              <CardTitle>Individual Student Risk Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={studentRiskData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                    />
                    <YAxis 
                      label={{ value: 'Risk Score', angle: -90, position: 'insideLeft' }}
                      domain={[0, 100]}
                    />
                    <Bar 
                      dataKey="riskScore" 
                      radius={[4, 4, 0, 0]} 
                      onClick={(data) => handleStudentClick(data.name)}
                      style={{ cursor: 'pointer' }}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent 
                        formatter={(value, name, props) => [
                          `${value}`,
                          'Risk Score'
                        ]}
                        labelFormatter={(label) => `Student: ${label}`}
                      />} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correlation">
          <Card>
            <CardHeader>
              <CardTitle>GPA vs Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={scatterData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number" 
                      dataKey="gpa" 
                      name="GPA"
                      domain={[0, 4]}
                      label={{ value: 'GPA', position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="attendance" 
                      name="Attendance"
                      domain={[0, 100]}
                      label={{ value: 'Attendance %', angle: -90, position: 'insideLeft' }}
                    />
                    <Scatter 
                      dataKey="attendance" 
                      fill="#8884d8"
                      onClick={(data) => handleStudentClick(data.name)}
                      style={{ cursor: 'pointer' }}
                    >
                      {scatterData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Scatter>
                    <ChartTooltip 
                      content={<ChartTooltipContent 
                        formatter={(value, name) => [
                          name === 'attendance' ? `${value}%` : value,
                          name === 'attendance' ? 'Attendance' : 'GPA'
                        ]}
                        labelFormatter={(label, payload) => {
                          if (payload && payload[0]) {
                            const data = payload[0].payload;
                            return `${data.name} (${data.level} risk)`;
                          }
                          return label;
                        }}
                      />} 
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Risk Level Distribution by Count</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[
                      { level: 'Low', count: riskDistribution.low, fill: 'hsl(142, 76%, 36%)' },
                      { level: 'Moderate', count: riskDistribution.moderate, fill: 'hsl(48, 96%, 53%)' },
                      { level: 'High', count: riskDistribution.high, fill: 'hsl(25, 95%, 53%)' },
                      { level: 'Critical', count: riskDistribution.critical, fill: 'hsl(0, 84%, 60%)' },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="level" />
                    <YAxis label={{ value: 'Number of Students', angle: -90, position: 'insideLeft' }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Student Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Student Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{selectedStudent.name}</h3>
                <Badge 
                  variant={
                    calculateRiskLevel(selectedStudent).level === 'critical' ? 'destructive' :
                    calculateRiskLevel(selectedStudent).level === 'high' ? 'destructive' :
                    calculateRiskLevel(selectedStudent).level === 'moderate' ? 'secondary' :
                    'default'
                  }
                >
                  {getRiskLabel(calculateRiskLevel(selectedStudent).level)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Grade</p>
                    <p className="font-medium">{selectedStudent.grade}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Score</p>
                    <p className="font-medium">{calculateRiskLevel(selectedStudent).score}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">GPA:</span>
                  <span className="font-medium">{selectedStudent.currentGPA}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Attendance Rate:</span>
                  <span className="font-medium">{selectedStudent.attendanceRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Absences:</span>
                  <span className="font-medium">{selectedStudent.absences}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span className="font-medium text-sm">{selectedStudent.email}</span>
                </div>
              </div>

              {calculateRiskLevel(selectedStudent).recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Recommendations:</h4>
                  <ul className="space-y-1">
                    {calculateRiskLevel(selectedStudent).recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};