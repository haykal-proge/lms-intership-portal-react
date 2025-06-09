import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Internship {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  duration: string;
  location: string;
  type: 'remote' | 'onsite' | 'hybrid';
  mentorId: string;
  mentorName: string;
  postedDate: string;
  deadline: string;
  status: 'active' | 'closed' | 'draft';
  applicants: string[]; // student IDs
  selectedStudents: string[];
  maxStudents: number;
  tags: string[];
  salary?: string;
}

export interface Application {
  id: string;
  internshipId: string;
  studentId: string;
  studentName: string;
  appliedDate: string;
  status: 'pending' | 'accepted' | 'rejected' | 'interview';
  coverLetter: string;
  resume?: string;
}

interface InternshipContextType {
  internships: Internship[];
  applications: Application[];
  addInternship: (internship: Omit<Internship, 'id' | 'postedDate' | 'applicants' | 'selectedStudents'>) => void;
  updateInternship: (id: string, updates: Partial<Internship>) => void;
  deleteInternship: (id: string) => void;
  applyToInternship: (internshipId: string, application: Omit<Application, 'id' | 'appliedDate'>) => void;
  updateApplicationStatus: (applicationId: string, status: Application['status']) => void;
  getInternshipsByMentor: (mentorId: string) => Internship[];
  getApplicationsByStudent: (studentId: string) => Application[];
  getApplicationsByInternship: (internshipId: string) => Application[];
}

const InternshipContext = createContext<InternshipContextType | undefined>(undefined);

const mockInternships: Internship[] = [
  {
    id: '1',
    title: 'Frontend Developer Intern',
    company: 'Tech Solutions Inc.',
    description: 'Join our dynamic team to work on cutting-edge web applications using React, TypeScript, and modern CSS frameworks.',
    requirements: ['React', 'TypeScript', 'HTML/CSS', 'Git'],
    duration: '3 months',
    location: 'San Francisco, CA',
    type: 'hybrid',
    mentorId: '2',
    mentorName: 'Sarah Johnson',
    postedDate: '2024-01-15',
    deadline: '2024-02-15',
    status: 'active',
    applicants: ['3'],
    selectedStudents: [],
    maxStudents: 2,
    tags: ['Frontend', 'React', 'JavaScript'],
    salary: '$2000/month'
  },
  {
    id: '2',
    title: 'Data Science Intern',
    company: 'Analytics Corp',
    description: 'Work with our data science team on machine learning projects and data analysis using Python and modern ML frameworks.',
    requirements: ['Python', 'Machine Learning', 'Statistics', 'SQL'],
    duration: '4 months',
    location: 'New York, NY',
    type: 'onsite',
    mentorId: '2',
    mentorName: 'Sarah Johnson',
    postedDate: '2024-01-10',
    deadline: '2024-02-20',
    status: 'active',
    applicants: [],
    selectedStudents: [],
    maxStudents: 1,
    tags: ['Data Science', 'Python', 'ML'],
    salary: '$2500/month'
  }
];

const mockApplications: Application[] = [
  {
    id: '1',
    internshipId: '1',
    studentId: '3',
    studentName: 'Alex Chen',
    appliedDate: '2024-01-16',
    status: 'pending',
    coverLetter: 'I am very interested in this frontend developer internship opportunity. I have experience with React and TypeScript through my coursework and personal projects.'
  }
];

export function InternshipProvider({ children }: { children: React.ReactNode }) {
  const [internships, setInternships] = useState<Internship[]>(mockInternships);
  const [applications, setApplications] = useState<Application[]>(mockApplications);

  useEffect(() => {
    const savedInternships = localStorage.getItem('lms_internships');
    const savedApplications = localStorage.getItem('lms_applications');
    
    if (savedInternships) {
      setInternships(JSON.parse(savedInternships));
    }
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications));
    }
  }, []);

  const saveToStorage = (internshipsData: Internship[], applicationsData: Application[]) => {
    localStorage.setItem('lms_internships', JSON.stringify(internshipsData));
    localStorage.setItem('lms_applications', JSON.stringify(applicationsData));
  };

  const addInternship = (internshipData: Omit<Internship, 'id' | 'postedDate' | 'applicants' | 'selectedStudents'>) => {
    const newInternship: Internship = {
      ...internshipData,
      id: Date.now().toString(),
      postedDate: new Date().toISOString().split('T')[0],
      applicants: [],
      selectedStudents: []
    };
    
    const updatedInternships = [...internships, newInternship];
    setInternships(updatedInternships);
    saveToStorage(updatedInternships, applications);
  };

  const updateInternship = (id: string, updates: Partial<Internship>) => {
    const updatedInternships = internships.map(i => 
      i.id === id ? { ...i, ...updates } : i
    );
    setInternships(updatedInternships);
    saveToStorage(updatedInternships, applications);
  };

  const deleteInternship = (id: string) => {
    const updatedInternships = internships.filter(i => i.id !== id);
    const updatedApplications = applications.filter(a => a.internshipId !== id);
    setInternships(updatedInternships);
    setApplications(updatedApplications);
    saveToStorage(updatedInternships, updatedApplications);
  };

  const applyToInternship = (internshipId: string, applicationData: Omit<Application, 'id' | 'appliedDate'>) => {
    const newApplication: Application = {
      ...applicationData,
      id: Date.now().toString(),
      appliedDate: new Date().toISOString().split('T')[0]
    };
    
    const updatedApplications = [...applications, newApplication];
    const updatedInternships = internships.map(i => 
      i.id === internshipId 
        ? { ...i, applicants: [...i.applicants, applicationData.studentId] }
        : i
    );
    
    setApplications(updatedApplications);
    setInternships(updatedInternships);
    saveToStorage(updatedInternships, updatedApplications);
  };

  const updateApplicationStatus = (applicationId: string, status: Application['status']) => {
    const updatedApplications = applications.map(a => 
      a.id === applicationId ? { ...a, status } : a
    );
    setApplications(updatedApplications);
    saveToStorage(internships, updatedApplications);
  };

  const getInternshipsByMentor = (mentorId: string) => {
    return internships.filter(i => i.mentorId === mentorId);
  };

  const getApplicationsByStudent = (studentId: string) => {
    return applications.filter(a => a.studentId === studentId);
  };

  const getApplicationsByInternship = (internshipId: string) => {
    return applications.filter(a => a.internshipId === internshipId);
  };

  return (
    <InternshipContext.Provider value={{
      internships,
      applications,
      addInternship,
      updateInternship,
      deleteInternship,
      applyToInternship,
      updateApplicationStatus,
      getInternshipsByMentor,
      getApplicationsByStudent,
      getApplicationsByInternship
    }}>
      {children}
    </InternshipContext.Provider>
  );
}

export function useInternships() {
  const context = useContext(InternshipContext);
  if (context === undefined) {
    throw new Error('useInternships must be used within an InternshipProvider');
  }
  return context;
}