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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Save as SaveIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { useResumes } from '../context/ResumeContext';
import { MasterResume, ResumeSection, ResumeSectionType } from '../types/Resume';

const EditResume: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { getMasterResumeById, updateMasterResume } = useResumes();
  
  const [resume, setResume] = useState<MasterResume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState('');
  const [sections, setSections] = useState<ResumeSection[]>([]);
  const [addSectionDialogOpen, setAddSectionDialogOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionType, setNewSectionType] = useState<ResumeSectionType>(ResumeSectionType.CUSTOM);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  useEffect(() => {
    const fetchResume = async () => {
      if (!id) {
        setError('Resume ID is missing');
        setLoading(false);
        return;
      }
      
      try {
        const resumeData = await getMasterResumeById(id);
        if (!resumeData) {
          setError('Resume not found');
          setLoading(false);
          return;
        }
        
        setResume(resumeData);
        setResumeName(resumeData.name);
        
        // Sort sections by order
        const sortedSections = [...resumeData.sections].sort((a, b) => a.order - b.order);
        setSections(sortedSections);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching resume:', err);
        setError('Failed to load resume');
        setLoading(false);
      }
    };
    
    fetchResume();
  }, [id, getMasterResumeById]);
  
  const handleSave = async () => {
    if (!resume) return;
    
    try {
      // Update the resume with the new name and sections
      const updatedResume: MasterResume = {
        ...resume,
        name: resumeName,
        sections: sections
      };
      
      await updateMasterResume(updatedResume);
      setSaveSuccess(true);
    } catch (err) {
      console.error('Error saving resume:', err);
      setError('Failed to save resume');
    }
  };
  
  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    
    const newSection: ResumeSection = {
      id: Date.now().toString(),
      title: newSectionTitle.trim(),
      content: '',
      order: sections.length + 1,
      type: newSectionType
    };
    
    setSections([...sections, newSection]);
    setAddSectionDialogOpen(false);
    setNewSectionTitle('');
    setNewSectionType(ResumeSectionType.CUSTOM);
  };
  
  const handleDeleteSection = (sectionId: string) => {
    const updatedSections = sections.filter(section => section.id !== sectionId);
    
    // Reorder the remaining sections
    const reorderedSections = updatedSections.map((section, index) => ({
      ...section,
      order: index + 1
    }));
    
    setSections(reorderedSections);
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
  
  const handleSectionTitleChange = (sectionId: string, title: string) => {
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          title
        };
      }
      return section;
    });
    
    setSections(updatedSections);
  };
  
  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    const sectionIndex = sections.findIndex(section => section.id === sectionId);
    if (sectionIndex === -1) return;
    
    const newSections = [...sections];
    
    if (direction === 'up' && sectionIndex > 0) {
      // Swap with the section above
      const temp = newSections[sectionIndex];
      newSections[sectionIndex] = newSections[sectionIndex - 1];
      newSections[sectionIndex - 1] = temp;
    } else if (direction === 'down' && sectionIndex < sections.length - 1) {
      // Swap with the section below
      const temp = newSections[sectionIndex];
      newSections[sectionIndex] = newSections[sectionIndex + 1];
      newSections[sectionIndex + 1] = temp;
    }
    
    // Update the order property
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index + 1
    }));
    
    setSections(updatedSections);
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
          Edit Resume
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
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setAddSectionDialogOpen(true)}
          >
            Add Section
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
      
      <Box>
        {sections.map((section, index) => (
          <Card
            key={section.id}
            sx={{ mb: 3, borderRadius: 2 }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <TextField
                  label="Section Title"
                  variant="outlined"
                  size="small"
                  value={section.title}
                  onChange={(e) => handleSectionTitleChange(section.id, e.target.value)}
                  sx={{ width: '70%' }}
                />
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => handleMoveSection(section.id, 'up')}
                    disabled={index === 0}
                  >
                    <ArrowUpIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleMoveSection(section.id, 'down')}
                    disabled={index === sections.length - 1}
                  >
                    <ArrowDownIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteSection(section.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              
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
      </Box>
      
      <Dialog open={addSectionDialogOpen} onClose={() => setAddSectionDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Section</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Section Title"
            fullWidth
            variant="outlined"
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth variant="outlined">
            <InputLabel>Section Type</InputLabel>
            <Select
              value={newSectionType}
              onChange={(e) => setNewSectionType(e.target.value as ResumeSectionType)}
              label="Section Type"
            >
              {Object.values(ResumeSectionType).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddSectionDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddSection} 
            variant="contained" 
            disabled={!newSectionTitle.trim()}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={saveSuccess}
        autoHideDuration={3000}
        onClose={() => setSaveSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSaveSuccess(false)} severity="success">
          Resume saved successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditResume; 