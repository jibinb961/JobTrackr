import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useResumes, createDefaultSections } from '../context/ResumeContext';

const CreateResume: React.FC = () => {
  const navigate = useNavigate();
  const { addMasterResume } = useResumes();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createNewResume = async () => {
      try {
        // Create a new resume with default sections
        const resumeId = await addMasterResume({
          name: 'My Master Resume',
          sections: createDefaultSections()
        });
        
        // Navigate to the edit page
        navigate(`/resumes/edit/${resumeId}`);
      } catch (err) {
        console.error('Error creating resume:', err);
        setError('Failed to create resume. Please try again.');
        setLoading(false);
      }
    };

    createNewResume();
  }, [addMasterResume, navigate]);

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
      <CircularProgress />
      <Typography sx={{ ml: 2 }}>Creating your resume...</Typography>
    </Box>
  );
};

export default CreateResume; 