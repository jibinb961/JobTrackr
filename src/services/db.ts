import Dexie from 'dexie';
import { JobApplication, Document } from '../types/JobApplication';
import { MasterResume, ResumeCopy } from '../types/Resume';

class JobTrackerDatabase extends Dexie {
  jobApplications: Dexie.Table<JobApplication, string>;
  documents: Dexie.Table<Document, string>;
  masterResumes: Dexie.Table<MasterResume, string>;
  resumeCopies: Dexie.Table<ResumeCopy, string>;

  constructor() {
    super('JobTrackerDB');
    
    // Define tables and their primary keys and indexes
    this.version(2).stores({
      jobApplications: 'id, companyName, jobTitle, applicationDate, status, source, lastUpdated',
      documents: 'id, name, type, lastUpdated',
      masterResumes: 'id, name, lastUpdated',
      resumeCopies: 'id, masterResumeId, name, purpose, lastUpdated'
    });
    
    // Define typed tables
    this.jobApplications = this.table('jobApplications');
    this.documents = this.table('documents');
    this.masterResumes = this.table('masterResumes');
    this.resumeCopies = this.table('resumeCopies');
  }
}

const db = new JobTrackerDatabase();

export default db; 