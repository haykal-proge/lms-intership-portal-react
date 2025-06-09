import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useInternships } from '../../contexts/InternshipContext';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  MessageSquare, 
  TrendingUp,
  Clock,
  CheckCircle,
  Plus
} from 'lucide-react';

export function MentorDashboard() {
  const { user } = useAuth();
  const { getInternshipsByMentor, getApplicationsByInternship } = useInternships();

  const mentorInternships = getInternshipsByMentor(user?.id || '');
  const totalApplications = mentorInternships.reduce((acc, internship) => 
    acc + getApplicationsByInternship(internship.id).length, 0
  );
  const activeInternships = mentorInternships.filter(i => i.status === 'active');
  const connectedStudents = mentorInternships.reduce((acc, internship) => 
    acc + internship.selectedStudents.length, 0
  );

  const stats = [
    {
      title: 'Active Internships',
      value: activeInternships.length,
      icon: Briefcase,
      color: 'bg-blue-500',
      change: '+2 this month'
    },
    {
      title: 'Connected Students',
      value: connectedStudents,
      icon: Users,
      color: 'bg-green-500',
      change: '+5 this week'
    },
    {
      title: 'Total Applications',
      value: totalApplications,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '+12 pending'
    },
    {
      title: 'This Month Sessions',
      value: 24,
      icon: Calendar,
      color: 'bg-purple-500',
      change: '8 scheduled'
    }
  ];

  const recentApplications = [
    {
      id: 1,
      student: 'Alex Chen',
      internship: 'Frontend Developer Intern',
      appliedDate: '2024-01-16',
      status: 'pending',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      student: 'Emma Wilson',
      internship: 'Data Science Intern',
      appliedDate: '2024-01-15',
      status: 'interview',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      student: 'Michael Davis',
      internship: 'Frontend Developer Intern',
      appliedDate: '2024-01-14',
      status: 'accepted',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const upcomingSessions = [
    {
      id: 1,
      student: 'Alex Chen',
      type: 'Code Review',
      time: '2:00 PM',
      date: 'Today',
      duration: '60 min'
    },
    {
      id: 2,
      student: 'Emma Wilson',
      type: 'Career Guidance',
      time: '10:00 AM',
      date: 'Tomorrow',
      duration: '45 min'
    },
    {
      id: 3,
      student: 'Michael Davis',
      type: 'Project Discussion',
      time: '3:30 PM',
      date: 'Friday',
      duration: '30 min'
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 text-sm sm:text-base">Guide and mentor the next generation of professionals</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base">
            <Plus className="w-4 h-4" />
            <span>Post Internship</span>
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
            Schedule Session
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
        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Applications</h2>
              <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <div key={application.id} className="flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <img
                      src={application.avatar}
                      alt={application.student}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{application.student}</p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{application.internship}</p>
                      <p className="text-xs text-gray-400">Applied on {application.appliedDate}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 flex-shrink-0">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      application.status === 'interview' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {application.status}
                    </span>
                    <button className="text-blue-600 hover:text-blue-500 text-xs sm:text-sm font-medium">
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Upcoming Sessions</h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="p-3 sm:p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">{session.student}</h3>
                      <p className="text-xs text-gray-500 mt-1">{session.type}</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {session.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-600">{session.date}</span>
                    <span className="text-sm font-medium text-blue-600">{session.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Performance Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-xl sm:text-2xl font-bold text-gray-900">4.8</p>
            <p className="text-xs sm:text-sm text-gray-600">Average Rating</p>
          </div>
          <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-2" />
            <p className="text-xl sm:text-2xl font-bold text-gray-900">23</p>
            <p className="text-xs sm:text-sm text-gray-600">Students Mentored</p>
          </div>
          <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-xl sm:text-2xl font-bold text-gray-900">89%</p>
            <p className="text-xs sm:text-sm text-gray-600">Success Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}