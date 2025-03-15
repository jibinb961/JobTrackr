import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  Paper,
  Typography,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Divider
} from '@mui/material';
import { 
  Save as SaveIcon, 
  Cancel as CancelIcon,
  BusinessCenter as BusinessIcon,
  Description as DescriptionIcon,
  Link as LinkIcon,
  CalendarToday as CalendarIcon,
  Source as SourceIcon,
  Notes as NotesIcon,
  FileCopy as ResumeIcon,
  Mail as CoverLetterIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { JobApplication, ApplicationStatus, ApplicationSource, Document } from '../types/JobApplication';
import FileUpload from './FileUpload';

interface JobFormProps {
  initialData?: JobApplication;
  onSubmit: (data: Omit<JobApplication, 'id' | 'lastUpdated'>) => void;
  isEditing?: boolean;
}

const JobForm: React.FC<JobFormProps> = ({ initialData, onSubmit, isEditing = false }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Omit<JobApplication, 'id' | 'lastUpdated'>>({
    companyName: '',
    jobTitle: '',
    jobDescription: '',
    applicationPortal: '',
    applicationDate: new Date().toISOString().split('T')[0],
    status: ApplicationStatus.APPLIED,
    source: ApplicationSource.LINKEDIN,
    notes: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (initialData) {
      const { id, lastUpdated, ...rest } = initialData;
      setFormData(rest);
    }
  }, [initialData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleResumeChange = (document: Document | undefined) => {
    setFormData({
      ...formData,
      resume: document,
    });
  };

  const handleCoverLetterChange = (document: Document | undefined) => {
    setFormData({
      ...formData,
      coverLetter: document,
    });
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }
    
    if (!formData.applicationDate) {
      newErrors.applicationDate = 'Application date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  const handleCancel = () => {
    navigate(-1);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 3,
          background: `linear-gradient(to bottom right, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: theme.palette.primary.main }}>
          {isEditing ? 'Edit Job Application' : 'Add New Job Application'}
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
                <BusinessIcon sx={{ color: theme.palette.primary.main, mr: 1, mb: 0.5 }} />
                <Typography variant="subtitle2">Company Details</Typography>
              </Box>
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                error={!!errors.companyName}
                helperText={errors.companyName}
                margin="normal"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Job Title"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                error={!!errors.jobTitle}
                helperText={errors.jobTitle}
                margin="normal"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              
              <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1, mt: 3 }}>
                <LinkIcon sx={{ color: theme.palette.primary.main, mr: 1, mb: 0.5 }} />
                <Typography variant="subtitle2">Application Portal</Typography>
              </Box>
              <TextField
                fullWidth
                label="Application Portal URL"
                name="applicationPortal"
                value={formData.applicationPortal}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                placeholder="https://company.com/careers"
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
                <CalendarIcon sx={{ color: theme.palette.primary.main, mr: 1, mb: 0.5 }} />
                <Typography variant="subtitle2">Application Details</Typography>
              </Box>
              <TextField
                fullWidth
                label="Application Date"
                name="applicationDate"
                type="date"
                value={formData.applicationDate}
                onChange={handleChange}
                error={!!errors.applicationDate}
                helperText={errors.applicationDate}
                margin="normal"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              
              <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={formData.status}
                  onChange={handleSelectChange}
                  label="Status"
                >
                  {Object.values(ApplicationStatus).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1, mt: 3 }}>
                <SourceIcon sx={{ color: theme.palette.primary.main, mr: 1, mb: 0.5 }} />
                <Typography variant="subtitle2">Source</Typography>
              </Box>
              <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
                <InputLabel id="source-label">Source</InputLabel>
                <Select
                  labelId="source-label"
                  name="source"
                  value={formData.source}
                  onChange={handleSelectChange}
                  label="Source"
                >
                  {Object.values(ApplicationSource).map((source) => (
                    <MenuItem key={source} value={source}>
                      {source}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Where did you find this job?</FormHelperText>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
                <DescriptionIcon sx={{ color: theme.palette.primary.main, mr: 1, mb: 0.5 }} />
                <Typography variant="subtitle2">Job Description</Typography>
              </Box>
              <TextField
                fullWidth
                label="Job Description"
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                multiline
                rows={4}
                sx={{ mb: 3 }}
              />
              
              <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
                <NotesIcon sx={{ color: theme.palette.primary.main, mr: 1, mb: 0.5 }} />
                <Typography variant="subtitle2">Notes</Typography>
              </Box>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                multiline
                rows={3}
                placeholder="Add any personal notes about this application..."
                sx={{ mb: 3 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
                <ResumeIcon sx={{ color: theme.palette.primary.main, mr: 1, mb: 0.5 }} />
                <Typography variant="subtitle2">Resume</Typography>
              </Box>
              <FileUpload
                label="Resume"
                accept=".pdf,.docx"
                value={formData.resume}
                onChange={handleResumeChange}
                maxSize={10}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
                <CoverLetterIcon sx={{ color: theme.palette.primary.main, mr: 1, mb: 0.5 }} />
                <Typography variant="subtitle2">Cover Letter (Optional)</Typography>
              </Box>
              <FileUpload
                label="Cover Letter"
                accept=".pdf,.docx"
                value={formData.coverLetter}
                onChange={handleCoverLetterChange}
                maxSize={10}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              sx={{ px: 3 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              sx={{ px: 4 }}
            >
              {isEditing ? 'Update' : 'Save'}
            </Button>
          </Box>
        </form>
      </Paper>
    </motion.div>
  );
};

export default JobForm; 