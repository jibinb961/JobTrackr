import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  IconButton,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as BackIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useResumes } from '../context/ResumeContext';
import { ResumeCopy, ResumeSection } from '../types/Resume';

const EditResumeCopy: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { getResumeCopyById, updateResumeCopy } = useResumes();
  
  const [resumeCopy, setResumeCopy] = useState<ResumeCopy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [sections, setSections] = useState<ResumeSection[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  
  useEffect(() => {
    const fetchResumeCopy = async () => {
      if (!id) {
        setError('Resume copy ID is missing');
        setLoading(false);
        return;
      }
      
      try {
        const resumeCopyData = await getResumeCopyById(id);
        if (!resumeCopyData) {
          setError('Resume copy not found');
          setLoading(false);
          return;
        }
        
        setResumeCopy(resumeCopyData);
        setResumeName(resumeCopyData.name);
        setPurpose(resumeCopyData.purpose);
        
        // Sort sections by order
        const sortedSections = [...resumeCopyData.sections].sort((a, b) => a.order - b.order);
        setSections(sortedSections);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching resume copy:', err);
        setError('Failed to load resume copy');
        setLoading(false);
      }
    };
    
    fetchResumeCopy();
  }, [id, getResumeCopyById]);
  
  const handleSave = async () => {
    if (!resumeCopy) return;
    
    try {
      // Update the resume copy with the new name, purpose, and sections
      const updatedResumeCopy: ResumeCopy = {
        ...resumeCopy,
        name: resumeName,
        purpose: purpose,
        sections: sections
      };
      
      await updateResumeCopy(updatedResumeCopy);
      setSaveSuccess(true);
    } catch (err) {
      console.error('Error saving resume copy:', err);
      setError('Failed to save resume copy');
    }
  };
  
  const handleSectionContentChange = (sectionId: string, content: string) => {
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          content
        };
      }
      return section;
    });
    
    setSections(updatedSections);
  };
  
  const handleDownload = () => {
    if (!resumeCopy) return;
    
    // Create a text representation of the resume
    let resumeText = `# ${resumeCopy.name}\n`;
    resumeText += `## Purpose: ${resumeCopy.purpose}\n\n`;
    
    // Sort sections by order
    const sortedSections = [...sections].sort((a, b) => a.order - b.order);
    
    // Add each section to the text
    sortedSections.forEach(section => {
      resumeText += `## ${section.title}\n${section.content}\n\n`;
    });
    
    // Create a blob and download it
    const blob = new Blob([resumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resumeCopy.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setDownloadDialogOpen(false);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate('/resumes')} sx={{ mr: 2 }}>
          <BackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
          Edit Resume Copy
        </Typography>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Resume Name"
          variant="outlined"
          fullWidth
          value={resumeName}
          onChange={(e) => setResumeName(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <TextField
          label="Purpose (e.g., Company Name or Job Title)"
          variant="outlined"
          fullWidth
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => setDownloadDialogOpen(true)}
          >
            Download Resume
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Save Resume
          </Button>
        </Box>
      </Box>
      
      <Typography variant="h6" sx={{ mb: 2 }}>
        Resume Sections
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Edit the content of each section to tailor this resume for {purpose || 'this specific purpose'}.
      </Typography>
      
      {sections.map((section) => (
        <Card key={section.id} sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {section.title}
            </Typography>
            
            <TextField
              label="Content"
              multiline
              rows={6}
              variant="outlined"
              fullWidth
              value={section.content}
              onChange={(e) => handleSectionContentChange(section.id, e.target.value)}
            />
          </CardContent>
        </Card>
      ))}
      
      {/* Download Confirmation Dialog */}
      <Dialog open={downloadDialogOpen} onClose={() => setDownloadDialogOpen(false)}>
        <DialogTitle>Download Resume</DialogTitle>
        <DialogContent>
          <Typography>
            Download this resume as a text file? You can then format it in your preferred word processor.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDownloadDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDownload} variant="contained">Download</Button>
        </DialogActions>
      </Dialog>
      
      {/* Success Snackbar */}
      <Snackbar
        open={saveSuccess}
        autoHideDuration={3000}
        onClose={() => setSaveSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSaveSuccess(false)} severity="success">
          Resume copy saved successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditResumeCopy; 