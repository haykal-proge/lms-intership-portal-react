import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useInternships } from '../../contexts/InternshipContext';
import { 
  Briefcase, 
  Users, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Calendar,
  MessageSquare,
  Award
} from 'lucide-react';

export function StudentDashboard() {
  const { user } = useAuth();
  const { internships, getApplicationsByStudent } = useInternships();

  const applications = getApplicationsByStudent(user?.id || '');
  const activeInternships = internships.filter(i => i.status === 'active');
  const acceptedApplications = applications.filter(a => a.status === 'accepted');

  const stats = [
    {
      title: 'Available Internships',
      value: activeInternships.length,
      icon: Briefcase,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'My Applications',
      value: applications.length,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '+3 this week'
    },
    {
      title: 'Accepted',
      value: acceptedApplications.length,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: 'Great job!'
    },
    {
      title: 'Connected Mentors',
      value: 2,
      icon: Users,
      color: 'bg-purple-500',
      change: '+1 this month'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'application',
      title: 'Applied to Frontend Developer Intern',
      company: 'Tech Solutions Inc.',
      time: '2 hours ago',
      status: 'pending'
    },
    {
      id: 2,
      type: 'message',
      title: 'New message from Sarah Johnson',
      company: 'Mentor',
      time: '1 day ago',
      status: 'unread'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Completed React Fundamentals Course',
      company: 'Learning Progress',
      time: '3 days ago',
      status: 'completed'
    }
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      internship: 'Frontend Developer Intern',
      company: 'Tech Solutions Inc.',
      deadline: '2024-02-15',
      daysLeft: 5
    },
    {
      id: 2,
      internship: 'Data Science Intern',
      company: 'Analytics Corp',
      deadline: '2024-02-20',
      daysLeft: 10
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 text-sm sm:text-base">Track your internship journey and connect with mentors</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base">
            Find Internships
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
            Update Profile
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="mb-2 sm:mb-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-2 sm:p-3 rounded-lg self-end sm:self-auto`}>
                  <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
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
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'pending' ? 'bg-yellow-400' :
                    activity.status === 'unread' ? 'bg-blue-400' :
                    'bg-green-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.company}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                  <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                    activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    activity.status === 'unread' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {activity.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="p-3 sm:p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 text-sm">{deadline.internship}</h3>
                  <p className="text-xs text-gray-500 mt-1">{deadline.company}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-600">{deadline.deadline}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      deadline.daysLeft <= 5 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {deadline.daysLeft} days left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {[
            { label: 'Browse Internships', icon: Briefcase, color: 'bg-blue-50 text-blue-600' },
            { label: 'Find Mentors', icon: Users, color: 'bg-green-50 text-green-600' },
            { label: 'Schedule Meeting', icon: Calendar, color: 'bg-purple-50 text-purple-600' },
            { label: 'Messages', icon: MessageSquare, color: 'bg-yellow-50 text-yellow-600' },
            { label: 'View Progress', icon: TrendingUp, color: 'bg-indigo-50 text-indigo-600' },
            { label: 'Achievements', icon: Award, color: 'bg-pink-50 text-pink-600' }
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                className={`${action.color} p-3 sm:p-4 rounded-lg hover:opacity-80 transition-opacity text-center`}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2" />
                <span className="text-xs sm:text-sm font-medium block">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}