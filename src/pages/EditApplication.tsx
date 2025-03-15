import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, useTheme, Alert, Snackbar, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import JobForm from '../components/JobForm';
import { useJobApplications } from '../context/JobApplicationContext';
import { JobApplication } from '../types/JobApplication';

const EditApplication: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { applications, updateApplication, loading } = useJobApplications();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  
  useEffect(() => {
    if (!loading && applications && id) {
      const app = applications.find(app => app.id === id);
      if (app) {
        setApplication(app);
      } else {
        setNotFound(true);
      }
    }
  }, [id, applications, loading]);
  
  const handleSubmit = async (data: Omit<JobApplication, 'id' | 'lastUpdated'>) => {
    if (!id) return;
    
    try {
      await updateApplication({
        ...data,
        id,
        lastUpdated: new Date().toISOString()
      });
      navigate('/applications');
    } catch (err) {
      console.error('Error updating application:', err);
      setError('Failed to update application. Please try again.');
    }
  };
  
  const handleCloseError = () => {
    setError(null);
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  if (notFound) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          Job application not found. The application may have been deleted.
        </Alert>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h5" sx={{ mb: 2 }}>
              Application Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              The job application you're trying to edit doesn't exist or has been removed.
            </Typography>
          </motion.div>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            Edit Job Application
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            Update the details for this job application
          </Typography>
        </Box>
        
        {application && (
          <JobForm 
            initialData={application} 
            onSubmit={handleSubmit} 
            isEditing={true} 
          />
        )}
        
        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </motion.div>
    </Container>
  );
};

export default EditApplication; 