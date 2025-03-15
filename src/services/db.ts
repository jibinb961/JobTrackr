import Dexie from 'dexie';
import { JobApplication, Document } from '../types/JobApplication';

class JobTrackerDatabase extends Dexie {
  jobApplications: Dexie.Table<JobApplication, string>;
  documents: Dexie.Table<Document, string>;

  constructor() {
    super('JobTrackerDB');
    
    // Define tables and their primary keys and indexes
    this.version(1).stores({
      jobApplications: 'id, companyName, jobTitle, applicationDate, status, source, lastUpdated',
      documents: 'id, name, type, lastUpdated'
    });
    
    // Define typed tables
    this.jobApplications = this.table('jobApplications');
    this.documents = this.table('documents');
  }
}

const db = new JobTrackerDatabase();

export default db; 