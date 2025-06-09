import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'mentor' | 'admin';
  avatar?: string;
  department?: string;
  skills?: string[];
  bio?: string;
  company?: string;
  experience?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (userData: Omit<User, 'id'> & { password: string }) => boolean;
  users: User[];
  updateProfile: (userId: string, updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@lms.com',
    name: 'System Admin',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    email: 'mentor@company.com',
    name: 'Sarah Johnson',
    role: 'mentor',
    company: 'Tech Solutions Inc.',
    department: 'Software Engineering',
    experience: 8,
    skills: ['React', 'Node.js', 'Python', 'Machine Learning'],
    bio: 'Senior Software Engineer with 8+ years of experience in full-stack development.',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    email: 'student@university.edu',
    name: 'Alex Chen',
    role: 'student',
    department: 'Computer Science',
    skills: ['JavaScript', 'React', 'Python'],
    bio: 'Computer Science student passionate about web development and AI.',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);

  useEffect(() => {
    const savedUser = localStorage.getItem('lms_user');
    const savedUsers = localStorage.getItem('lms_users');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('lms_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lms_user');
  };

  const register = (userData: Omit<User, 'id'> & { password: string }): boolean => {
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) return false;

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('lms_users', JSON.stringify(updatedUsers));
    return true;
  };

  const updateProfile = (userId: string, updates: Partial<User>) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, ...updates } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('lms_users', JSON.stringify(updatedUsers));
    
    if (user && user.id === userId) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('lms_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      users,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}