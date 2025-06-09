import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useInternships } from '../../contexts/InternshipContext';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Building
} from 'lucide-react';

export function AdminDashboard() {
  const { users } = useAuth();
  const { internships, applications } = useInternships();

  const totalUsers = users.length;
  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalMentors = users.filter(u => u.role === 'mentor').length;
  const totalInternships = internships.length;
  const activeInternships = internships.filter(i => i.status === 'active').length;
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(a => a.status === 'pending').length;

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12% from last month',
      details: `${totalStudents} Students, ${totalMentors} Mentors`
    },
    {
      title: 'Active Internships',
      value: activeInternships,
      icon: Briefcase,
      color: 'bg-green-500',
      change: '+8% from last month',
      details: `${totalInternships} Total Posted`
    },
    {
      title: 'Applications',
      value: totalApplications,
      icon: Activity,
      color: 'bg-yellow-500',
      change: '+24% from last month',
      details: `${pendingApplications} Pending Review`
    },
    {
      title: 'Success Rate',
      value: '76%',
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+3% from last month',
      details: 'Student-Internship Matches'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'user_registration',
      message: 'New student registered: Emma Wilson',
      time: '2 hours ago',
      status: 'info'
    },
    {
      id: 2,
      type: 'internship_posted',
      message: 'New internship posted: UX Designer Intern',
      time: '4 hours ago',
      status: 'success'
    },
    {
      id: 3,
      type: 'application_submitted',
      message: '5 new applications received',
      time: '6 hours ago',
      status: 'info'
    },
    {
      id: 4,
      type: 'mentor_joined',
      message: 'New mentor verified: David Smith',
      time: '1 day ago',
      status: 'success'
    },
    {
      id: 5,
      type: 'system_alert',
      message: 'Server maintenance scheduled for tonight',
      time: '2 days ago',
      status: 'warning'
    }
  ];

  const topCompanies = [
    { name: 'Tech Solutions Inc.', internships: 8, applications: 45 },
    { name: 'Analytics Corp', internships: 5, applications: 32 },
    { name: 'Design Studio', internships: 3, applications: 18 },
    { name: 'Innovation Labs', internships: 4, applications: 25 },
    { name: 'StartupXYZ', internships: 2, applications: 12 }
  ];

  const departmentStats = [
    { department: 'Computer Science', students: 45, mentors: 12, internships: 23 },
    { department: 'Engineering', students: 38, mentors: 10, internships: 18 },
    { department: 'Business', students: 32, mentors: 8, internships: 15 },
    { department: 'Design', students: 28, mentors: 6, internships: 12 },
    { department: 'Marketing', students: 22, mentors: 5, internships: 8 }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 text-sm sm:text-base">Comprehensive overview of the LMS platform</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base">
            Generate Report
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
            System Settings
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-2 sm:p-3 rounded-lg`}>
                  <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-xs text-green-600 font-medium">{stat.change}</span>
              </div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</h3>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.details}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 sm:space-x-4">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-400' :
                    activity.status === 'warning' ? 'bg-yellow-400' :
                    'bg-blue-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                  <div className={`p-1 rounded-full ${
                    activity.status === 'success' ? 'bg-green-100' :
                    activity.status === 'warning' ? 'bg-yellow-100' :
                    'bg-blue-100'
                  }`}>
                    {activity.status === 'success' ? 
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" /> :
                      activity.status === 'warning' ?
                      <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" /> :
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Companies */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Top Companies</h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {topCompanies.map((company, index) => (
                <div key={company.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Building className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{company.name}</p>
                      <p className="text-xs text-gray-500">{company.internships} internships</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-blue-600">
                    {company.applications}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Department Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Department Statistics</h2>
        </div>
        <div className="p-4 sm:p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="text-xs sm:text-sm font-medium text-gray-600 pb-3">Department</th>
                  <th className="text-xs sm:text-sm font-medium text-gray-600 pb-3">Students</th>
                  <th className="text-xs sm:text-sm font-medium text-gray-600 pb-3">Mentors</th>
                  <th className="text-xs sm:text-sm font-medium text-gray-600 pb-3">Internships</th>
                  <th className="text-xs sm:text-sm font-medium text-gray-600 pb-3">Ratio</th>
                </tr>
              </thead>
              <tbody>
                {departmentStats.map((dept) => (
                  <tr key={dept.department} className="border-t border-gray-200">
                    <td className="py-3">
                      <span className="font-medium text-gray-900 text-sm">{dept.department}</span>
                    </td>
                    <td className="py-3 text-gray-600 text-sm">{dept.students}</td>
                    <td className="py-3 text-gray-600 text-sm">{dept.mentors}</td>
                    <td className="py-3 text-gray-600 text-sm">{dept.internships}</td>
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(dept.internships / dept.students) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">
                          {Math.round((dept.internships / dept.students) * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}