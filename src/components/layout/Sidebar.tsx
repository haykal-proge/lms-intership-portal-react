import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Briefcase, 
  Users, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  BarChart3,
  FileText,
  Calendar,
  Award,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isMobileMenuOpen?: boolean;
  onMobileMenuClose?: () => void;
}

export function Sidebar({ activeTab, onTabChange, isMobileMenuOpen, onMobileMenuClose }: SidebarProps) {
  const { user } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
    ];

    switch (user?.role) {
      case 'student':
        return [
          ...baseItems,
          { id: 'internships', label: 'Find Internships', icon: Briefcase },
          { id: 'applications', label: 'My Applications', icon: FileText },
          { id: 'mentors', label: 'Connect with Mentors', icon: Users },
          { id: 'progress', label: 'My Progress', icon: BarChart3 },
          { id: 'messages', label: 'Messages', icon: MessageSquare },
          { id: 'profile', label: 'Profile', icon: Settings },
        ];
      case 'mentor':
        return [
          ...baseItems,
          { id: 'internships', label: 'Manage Internships', icon: Briefcase },
          { id: 'students', label: 'My Students', icon: Users },
          { id: 'applications', label: 'Applications', icon: FileText },
          { id: 'schedule', label: 'Schedule', icon: Calendar },
          { id: 'messages', label: 'Messages', icon: MessageSquare },
          { id: 'profile', label: 'Profile', icon: Settings },
        ];
      case 'admin':
        return [
          ...baseItems,
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'internships', label: 'All Internships', icon: Briefcase },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'courses', label: 'Course Management', icon: BookOpen },
          { id: 'reports', label: 'Reports', icon: FileText },
          { id: 'settings', label: 'System Settings', icon: Settings },
        ];
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId);
    if (onMobileMenuClose) {
      onMobileMenuClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileMenuClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-sm border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile close button */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={onMobileMenuClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 pt-2 lg:pt-6">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}