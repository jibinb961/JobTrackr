export interface ResumeSection {
  id: string;
  title: string;
  content: string;
  order: number;
  type: ResumeSectionType;
}

export enum ResumeSectionType {
  HEADER = 'HEADER',
  SUMMARY = 'SUMMARY',
  EXPERIENCE = 'EXPERIENCE',
  EDUCATION = 'EDUCATION',
  SKILLS = 'SKILLS',
  PROJECTS = 'PROJECTS',
  CERTIFICATIONS = 'CERTIFICATIONS',
  CUSTOM = 'CUSTOM'
}

export interface MasterResume {
  id: string;
  name: string;
  sections: ResumeSection[];
  lastUpdated: string;
}

export interface ResumeCopy extends MasterResume {
  masterResumeId: string;
  purpose: string;
} 