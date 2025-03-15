import React, { useState } from 'react';
import { Container, Typography, Box, useTheme, Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import JobForm from '../components/JobForm';
import { useJobApplications } from '../context/JobApplicationContext';
import { JobApplication } from '../types/JobApplication';

const AddApplication: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { addApplication } = useJobApplications();
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (data: Omit<JobApplication, 'id' | 'lastUpdated'>) => {
    try {
      await addApplication(data);
      navigate('/applications');
    } catch (err) {
      console.error('Error adding application:', err);
      setError('Failed to add application. Please try again.');
    }
  };
  
  const handleCloseError = () => {
    setError(null);
  };
  
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
            Add New Job Application
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            Track a new job opportunity by filling out the details below
          </Typography>
        </Box>
        
        <JobForm onSubmit={handleSubmit} />
        
        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </motion.div>
    </Container>
  );
};

export default AddApplication; 