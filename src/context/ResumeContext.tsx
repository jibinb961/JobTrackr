import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { MasterResume, ResumeCopy, ResumeSection, ResumeSectionType } from '../types/Resume';
import db from '../services/db';

interface ResumeContextType {
  masterResumes: MasterResume[];
  resumeCopies: ResumeCopy[];
  addMasterResume: (resume: Omit<MasterResume, 'id' | 'lastUpdated'>) => Promise<string>;
  updateMasterResume: (resume: MasterResume) => Promise<void>;
  deleteMasterResume: (id: string) => Promise<void>;
  getMasterResumeById: (id: string) => Promise<MasterResume | undefined>;
  createResumeCopy: (masterResumeId: string, purpose: string, name: string) => Promise<string>;
  updateResumeCopy: (resumeCopy: ResumeCopy) => Promise<void>;
  deleteResumeCopy: (id: string) => Promise<void>;
  getResumeCopyById: (id: string) => Promise<ResumeCopy | undefined>;
  loading: boolean;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const useResumes = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResumes must be used within a ResumeProvider');
  }
  return context;
};

interface ResumeProviderProps {
  children: ReactNode;
}

export const createDefaultSections = (): ResumeSection[] => {
  return [
    {
      id: Date.now().toString() + '-1',
      title: 'Contact Information',
      content: 'Your Name\nEmail: your.email@example.com\nPhone: (123) 456-7890\nLocation: City, State\nLinkedIn: linkedin.com/in/yourprofile',
      order: 1,
      type: ResumeSectionType.HEADER
    },
    {
      id: Date.now().toString() + '-2',
      title: 'Professional Summary',
      content: 'Experienced professional with expertise in...',
      order: 2,
      type: ResumeSectionType.SUMMARY
    },
    {
      id: Date.now().toString() + '-3',
      title: 'Work Experience',
      content: 'Company Name | Position | Date - Date\n• Accomplishment 1\n• Accomplishment 2\n• Accomplishment 3',
      order: 3,
      type: ResumeSectionType.EXPERIENCE
    },
    {
      id: Date.now().toString() + '-4',
      title: 'Education',
      content: 'University Name | Degree | Graduation Date\nRelevant Coursework: Course 1, Course 2',
      order: 4,
      type: ResumeSectionType.EDUCATION
    },
    {
      id: Date.now().toString() + '-5',
      title: 'Skills',
      content: 'Technical Skills: Skill 1, Skill 2, Skill 3\nSoft Skills: Skill 1, Skill 2, Skill 3',
      order: 5,
      type: ResumeSectionType.SKILLS
    }
  ];
};

export const ResumeProvider: React.FC<ResumeProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  
  // Use Dexie's useLiveQuery hook to get real-time updates
  const liveMasterResumes = useLiveQuery(
    () => db.masterResumes.toArray(),
    [],
    []
  );
  
  const liveResumeCopies = useLiveQuery(
    () => db.resumeCopies.toArray(),
    [],
    []
  );
  
  // Wrap in useMemo to avoid dependency changes on every render
  const masterResumes = useMemo(() => liveMasterResumes || [], [liveMasterResumes]);
  const resumeCopies = useMemo(() => liveResumeCopies || [], [liveResumeCopies]);
  
  useEffect(() => {
    if (liveMasterResumes !== undefined && liveResumeCopies !== undefined) {
      setLoading(false);
    }
  }, [liveMasterResumes, liveResumeCopies]);
  
  const addMasterResume = async (resumeData: Omit<MasterResume, 'id' | 'lastUpdated'>) => {
    const newResume: MasterResume = {
      ...resumeData,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString(),
    };
    
    try {
      const id = await db.masterResumes.add(newResume);
      return id.toString();
    } catch (error) {
      console.error('Error adding master resume:', error);
      throw error;
    }
  };
  
  const updateMasterResume = async (updatedResume: MasterResume) => {
    try {
      const resumeToUpdate = {
        ...updatedResume,
        lastUpdated: new Date().toISOString(),
      };
      
      await db.masterResumes.update(updatedResume.id, resumeToUpdate);
    } catch (error) {
      console.error('Error updating master resume:', error);
      throw error;
    }
  };
  
  const deleteMasterResume = async (id: string) => {
    try {
      // Delete all associated resume copies first
      await db.resumeCopies.where('masterResumeId').equals(id).delete();
      // Then delete the master resume
      await db.masterResumes.delete(id);
    } catch (error) {
      console.error('Error deleting master resume:', error);
      throw error;
    }
  };
  
  const getMasterResumeById = async (id: string) => {
    try {
      return await db.masterResumes.get(id);
    } catch (error) {
      console.error('Error getting master resume:', error);
      throw error;
    }
  };
  
  const createResumeCopy = async (masterResumeId: string, purpose: string, name: string) => {
    try {
      const masterResume = await getMasterResumeById(masterResumeId);
      if (!masterResume) {
        throw new Error('Master resume not found');
      }
      
      // Create a deep copy of the sections
      const sectionsCopy = masterResume.sections.map(section => ({
        ...section,
        id: Date.now().toString() + '-' + section.id
      }));
      
      const resumeCopy: ResumeCopy = {
        id: Date.now().toString(),
        masterResumeId,
        name,
        purpose,
        sections: sectionsCopy,
        lastUpdated: new Date().toISOString()
      };
      
      const id = await db.resumeCopies.add(resumeCopy);
      return id.toString();
    } catch (error) {
      console.error('Error creating resume copy:', error);
      throw error;
    }
  };
  
  const updateResumeCopy = async (updatedCopy: ResumeCopy) => {
    try {
      const copyToUpdate = {
        ...updatedCopy,
        lastUpdated: new Date().toISOString(),
      };
      
      await db.resumeCopies.update(updatedCopy.id, copyToUpdate);
    } catch (error) {
      console.error('Error updating resume copy:', error);
      throw error;
    }
  };
  
  const deleteResumeCopy = async (id: string) => {
    try {
      await db.resumeCopies.delete(id);
    } catch (error) {
      console.error('Error deleting resume copy:', error);
      throw error;
    }
  };
  
  const getResumeCopyById = async (id: string) => {
    try {
      return await db.resumeCopies.get(id);
    } catch (error) {
      console.error('Error getting resume copy:', error);
      throw error;
    }
  };
  
  return (
    <ResumeContext.Provider
      value={{
        masterResumes,
        resumeCopies,
        addMasterResume,
        updateMasterResume,
        deleteMasterResume,
        getMasterResumeById,
        createResumeCopy,
        updateResumeCopy,
        deleteResumeCopy,
        getResumeCopyById,
        loading,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}; 