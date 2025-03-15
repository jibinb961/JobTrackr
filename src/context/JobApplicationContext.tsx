import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { JobApplication } from '../types/JobApplication';
import db from '../services/db';

interface JobApplicationContextType {
  applications: JobApplication[];
  addApplication: (application: Omit<JobApplication, 'id' | 'lastUpdated'>) => Promise<string>;
  updateApplication: (application: JobApplication) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  getApplicationById: (id: string) => Promise<JobApplication | undefined>;
  loading: boolean;
}

const JobApplicationContext = createContext<JobApplicationContextType | undefined>(undefined);

export const useJobApplications = () => {
  const context = useContext(JobApplicationContext);
  if (!context) {
    throw new Error('useJobApplications must be used within a JobApplicationProvider');
  }
  return context;
};

interface JobApplicationProviderProps {
  children: ReactNode;
}

export const JobApplicationProvider: React.FC<JobApplicationProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  
  // Use Dexie's useLiveQuery hook to get real-time updates
  const liveApplications = useLiveQuery(
    () => db.jobApplications.toArray(),
    [],
    []
  );
  
  // Wrap in useMemo to avoid dependency changes on every render
  const applications = useMemo(() => liveApplications || [], [liveApplications]);
  
  useEffect(() => {
    setLoading(false);
  }, [applications]);
  
  const addApplication = async (applicationData: Omit<JobApplication, 'id' | 'lastUpdated'>) => {
    const newApplication: JobApplication = {
      ...applicationData,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString(),
    };
    
    try {
      const id = await db.jobApplications.add(newApplication);
      return id.toString();
    } catch (error) {
      console.error('Error adding application:', error);
      throw error;
    }
  };
  
  const updateApplication = async (updatedApplication: JobApplication) => {
    try {
      const applicationToUpdate = {
        ...updatedApplication,
        lastUpdated: new Date().toISOString(),
      };
      
      await db.jobApplications.update(updatedApplication.id, applicationToUpdate);
    } catch (error) {
      console.error('Error updating application:', error);
      throw error;
    }
  };
  
  const deleteApplication = async (id: string) => {
    try {
      await db.jobApplications.delete(id);
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  };
  
  const getApplicationById = async (id: string) => {
    try {
      return await db.jobApplications.get(id);
    } catch (error) {
      console.error('Error getting application:', error);
      throw error;
    }
  };
  
  return (
    <JobApplicationContext.Provider
      value={{
        applications,
        addApplication,
        updateApplication,
        deleteApplication,
        getApplicationById,
        loading,
      }}
    >
      {children}
    </JobApplicationContext.Provider>
  );
}; 