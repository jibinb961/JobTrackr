import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Divider,
  useTheme,
  Fade,
  Stack,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useJobApplications } from '../context/JobApplicationContext';
import { ApplicationStatus, ApplicationSource, JobApplication } from '../types/JobApplication';
import JobCard from '../components/JobCard';

const Applications: React.FC = () => {
  const theme = useTheme();
  const { applications, deleteApplication, loading } = useJobApplications();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('applicationDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([]);
  
  useEffect(() => {
    if (!applications) return;
    
    let result = [...applications];
    
    // Apply search
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter(app => 
        app.companyName.toLowerCase().includes(lowerCaseSearch) ||
        app.jobTitle.toLowerCase().includes(lowerCaseSearch) ||
        app.jobDescription?.toLowerCase().includes(lowerCaseSearch) ||
        app.notes?.toLowerCase().includes(lowerCaseSearch)
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(app => app.status === statusFilter);
    }
    
    // Apply source filter
    if (sourceFilter) {
      result = result.filter(app => app.source === sourceFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let valueA: any = a[sortBy as keyof JobApplication];
      let valueB: any = b[sortBy as keyof JobApplication];
      
      // Handle dates
      if (sortBy === 'applicationDate' || sortBy === 'lastUpdated') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }
      
      // Handle strings
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortOrder === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
      
      // Handle numbers and dates
      return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
    });
    
    setFilteredApplications(result);
  }, [applications, searchTerm, statusFilter, sourceFilter, sortBy, sortOrder]);
  
  const handleDelete = async (id: string) => {
    try {
      await deleteApplication(id);
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setSourceFilter('');
    setSortBy('applicationDate');
    setSortOrder('desc');
  };
  
  const getStatusCount = (status: ApplicationStatus) => {
    return applications?.filter(app => app.status === status).length || 0;
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Job Applications
        </Typography>
        <Button
          component={Link}
          to="/add"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1,
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
          }}
        >
          Add New
        </Button>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          {Object.values(ApplicationStatus).map(status => (
            <Chip
              key={status}
              label={`${status} (${getStatusCount(status)})`}
              onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
              color={statusFilter === status ? 'primary' : 'default'}
              sx={{ 
                fontWeight: 'medium',
                px: 1,
                '&:hover': {
                  backgroundColor: statusFilter === status 
                    ? theme.palette.primary.main 
                    : theme.palette.action.hover
                }
              }}
            />
          ))}
        </Stack>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by company, job title, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Button
              fullWidth
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
              variant={showFilters ? "contained" : "outlined"}
              color="primary"
              sx={{ borderRadius: 2, py: 1.5 }}
            >
              Filters
            </Button>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="sort-label">Sort By</InputLabel>
              <Select
                labelId="sort-label"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder as 'asc' | 'desc');
                }}
                label="Sort By"
                startAdornment={
                  <InputAdornment position="start">
                    <SortIcon />
                  </InputAdornment>
                }
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="applicationDate-desc">Newest First</MenuItem>
                <MenuItem value="applicationDate-asc">Oldest First</MenuItem>
                <MenuItem value="companyName-asc">Company (A-Z)</MenuItem>
                <MenuItem value="companyName-desc">Company (Z-A)</MenuItem>
                <MenuItem value="jobTitle-asc">Job Title (A-Z)</MenuItem>
                <MenuItem value="jobTitle-desc">Job Title (Z-A)</MenuItem>
                <MenuItem value="lastUpdated-desc">Recently Updated</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Fade in={showFilters}>
          <Box sx={{ mt: 2, display: showFilters ? 'block' : 'none' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="source-filter-label">Source</InputLabel>
                  <Select
                    labelId="source-filter-label"
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    label="Source"
                  >
                    <MenuItem value="">All Sources</MenuItem>
                    {Object.values(ApplicationSource).map(source => (
                      <MenuItem key={source} value={source}>{source}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={5}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="status-filter-label">Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    {Object.values(ApplicationStatus).map(status => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  startIcon={<ClearIcon />}
                  onClick={handleClearFilters}
                  sx={{ height: '100%' }}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Box>
      
      <Divider sx={{ mb: 4 }} />
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filteredApplications.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Grid container spacing={3}>
            {filteredApplications.map((application) => (
              <Grid item xs={12} sm={6} md={4} key={application.id}>
                <JobCard 
                  application={application} 
                  onDelete={handleDelete} 
                />
              </Grid>
            ))}
          </Grid>
        </motion.div>
      ) : (
        <Box 
          sx={{ 
            py: 8, 
            textAlign: 'center',
            backgroundColor: 'rgba(0,0,0,0.02)',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No applications found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {applications?.length 
              ? 'Try adjusting your search or filters'
              : 'Start by adding your first job application'}
          </Typography>
          
          {!applications?.length && (
            <Button
              component={Link}
              to="/add"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
            >
              Add Application
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Applications; 