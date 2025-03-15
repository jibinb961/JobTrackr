export enum ApplicationStatus {
  APPLIED = "Applied",
  INTERVIEW = "Interview",
  OFFER = "Offer",
  REJECTED = "Rejected",
  PENDING = "Pending",
  WITHDRAWN = "Withdrawn"
}

export enum ApplicationSource {
  LINKEDIN = "LinkedIn",
  INDEED = "Indeed",
  NUWORKS = "NUWorks",
  COMPANY_WEBSITE = "Company Website",
  REFERRAL = "Referral",
  FRIEND = "Friend",
  OTHER = "Other"
}

export interface Document {
  id: string;
  name: string;
  type: string; // 'pdf' or 'docx'
  data: string; // base64 encoded data
  lastUpdated: string;
}

export interface JobApplication {
  id: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  applicationPortal: string;
  applicationDate: string;
  status: ApplicationStatus;
  source: ApplicationSource;
  notes: string;
  resume?: Document; // Optional resume document
  coverLetter?: Document; // Optional cover letter document
  lastUpdated: string;
} 