import React, { useState } from 'react';
import { useInternships } from '../../contexts/InternshipContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Building, 
  Filter,
  Search,
  Briefcase,
  Clock,
  DollarSign
} from 'lucide-react';

export function InternshipList() {
  const { internships, applyToInternship } = useInternships();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || internship.type === filterType;
    const matchesLocation = filterLocation === 'all' || internship.location.toLowerCase().includes(filterLocation.toLowerCase());
    const isActive = internship.status === 'active';
    
    return matchesSearch && matchesType && matchesLocation && isActive;
  });

  const handleApply = (internship: any) => {
    if (!user) return;
    
    const application = {
      internshipId: internship.id,
      studentId: user.id,
      studentName: user.name,
      status: 'pending' as const,
      coverLetter: `I am interested in applying for the ${internship.title} position at ${internship.company}. I believe my skills and enthusiasm make me a great fit for this opportunity.`
    };
    
    applyToInternship(internship.id, application);
    alert('Application submitted successfully!');
  };

  const hasApplied = (internshipId: string) => {
    return internships.find(i => i.id === internshipId)?.applicants.includes(user?.id || '');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Available Internships</h1>
          <p className="text-gray-600 text-sm sm:text-base">Discover exciting opportunities to grow your career</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search internships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>
          
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="all">All Types</option>
              <option value="remote">Remote</option>
              <option value="onsite">On-site</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          
          <div>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="all">All Locations</option>
              <option value="san francisco">San Francisco</option>
              <option value="new york">New York</option>
              <option value="seattle">Seattle</option>
              <option value="austin">Austin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Internship Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {filteredInternships.map((internship) => (
          <div key={internship.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-3">
                <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{internship.title}</h3>
                    <p className="text-gray-600 flex items-center text-sm sm:text-base">
                      <Building className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{internship.company}</span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col items-start sm:items-end space-x-2 sm:space-x-0 sm:space-y-2 flex-shrink-0">
                  <span className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-full ${
                    internship.type === 'remote' ? 'bg-green-100 text-green-800' :
                    internship.type === 'onsite' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {internship.type}
                  </span>
                  {internship.salary && (
                    <span className="text-xs sm:text-sm font-medium text-green-600 flex items-center">
                      <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {internship.salary}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{internship.description}</p>

              <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                {internship.requirements.slice(0, 4).map((skill) => (
                  <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {skill}
                  </span>
                ))}
                {internship.requirements.length > 4 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                    +{internship.requirements.length - 4} more
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-gray-500 mb-4 gap-2">
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <span className="flex items-center">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {internship.location}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {internship.duration}
                  </span>
                  <span className="flex items-center">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {internship.applicants?.length || 0} applied
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-xs sm:text-sm text-gray-500">
                  <p>Deadline: {new Date(internship.deadline).toLocaleDateString()}</p>
                  <p>Posted by: {internship.mentorName}</p>
                </div>
                
                {user?.role === 'student' && (
                  <button
                    onClick={() => handleApply(internship)}
                    disabled={hasApplied(internship.id)}
                    className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                      hasApplied(internship.id)
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {hasApplied(internship.id) ? 'Applied' : 'Apply Now'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredInternships.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <Briefcase className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No internships found</h3>
          <p className="text-gray-500 text-sm sm:text-base">Try adjusting your search criteria or check back later for new opportunities.</p>
        </div>
      )}
    </div>
  );
}