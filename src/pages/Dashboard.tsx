import React, { useMemo } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Button, 
  useTheme, 
  Divider,
  CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon, 
  TrendingUp as TrendingUpIcon,
  BusinessCenter as BusinessIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useJobApplications } from '../context/JobApplicationContext';
import { ApplicationStatus } from '../types/JobApplication';
import JobCard from '../components/JobCard';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { applications, deleteApplication, loading } = useJobApplications();
  
  const stats = useMemo(() => {
    if (!applications) return null;
    
    const totalApplications = applications.length;
    const activeApplications = applications.filter(
      app => app.status !== ApplicationStatus.REJECTED && app.status !== ApplicationStatus.WITHDRAWN
    ).length;
    const interviewsCount = applications.filter(
      app => app.status === ApplicationStatus.INTERVIEW
    ).length;
    const offersCount = applications.filter(
      app => app.status === ApplicationStatus.OFFER
    ).length;
    const rejectionCount = applications.filter(
      app => app.status === ApplicationStatus.REJECTED
    ).length;
    
    return {
      totalApplications,
      activeApplications,
      interviewsCount,
      offersCount,
      rejectionCount,
    };
  }, [applications]);
  
  const recentApplications = useMemo(() => {
    if (!applications) return [];
    
    return [...applications]
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, 3);
  }, [applications]);
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Dashboard
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
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 3,
                    height: '100%',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    color: '#fff',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BusinessIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">Total Applications</Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stats?.totalApplications || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {stats?.activeApplications || 0} active applications
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 3,
                    height: '100%',
                    background: `linear-gradient(45deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                    color: '#fff',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">Interviews</Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stats?.interviewsCount || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {((stats?.interviewsCount || 0) / (stats?.totalApplications || 1) * 100).toFixed(0)}% of applications
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 3,
                    height: '100%',
                    background: `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                    color: '#fff',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircleIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">Offers</Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stats?.offersCount || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {((stats?.offersCount || 0) / (stats?.totalApplications || 1) * 100).toFixed(0)}% success rate
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 3,
                    height: '100%',
                    background: `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                    color: '#fff',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CancelIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">Rejections</Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stats?.rejectionCount || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {((stats?.rejectionCount || 0) / (stats?.totalApplications || 1) * 100).toFixed(0)}% rejection rate
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Activity Summary */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 3,
                height: '100%',
                background: `linear-gradient(to bottom right, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6">Activity Summary</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Application Status Breakdown
                </Typography>
                
                {Object.values(ApplicationStatus).map(status => {
                  const count = applications?.filter(app => app.status === status).length || 0;
                  const percentage = ((count / (stats?.totalApplications || 1)) * 100).toFixed(0);
                  
                  return (
                    <Box key={status} sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">{status}</Typography>
                        <Typography variant="body2" fontWeight="medium">{count} ({percentage}%)</Typography>
                      </Box>
                      <Box 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3, 
                          bgcolor: 'rgba(0,0,0,0.1)',
                          overflow: 'hidden'
                        }}
                      >
                        <Box 
                          sx={{ 
                            height: '100%', 
                            width: `${percentage}%`,
                            bgcolor: (() => {
                              switch (status) {
                                case ApplicationStatus.APPLIED:
                                  return theme.palette.info.main;
                                case ApplicationStatus.INTERVIEW:
                                  return theme.palette.warning.main;
                                case ApplicationStatus.OFFER:
                                  return theme.palette.success.main;
                                case ApplicationStatus.REJECTED:
                                  return theme.palette.error.main;
                                default:
                                  return theme.palette.grey[500];
                              }
                            })(),
                            transition: 'width 1s ease-in-out'
                          }}
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
              
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                  component={Link}
                  to="/analytics"
                  variant="outlined"
                  color="primary"
                  sx={{ borderRadius: 2 }}
                >
                  View Detailed Analytics
                </Button>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
        
        {/* Recent Applications */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 3,
                background: `linear-gradient(to bottom right, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Recent Applications</Typography>
                <Button
                  component={Link}
                  to="/applications"
                  color="primary"
                >
                  View All
                </Button>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              {recentApplications.length > 0 ? (
                <Grid container spacing={3}>
                  {recentApplications.map(application => (
                    <Grid item xs={12} md={4} key={application.id}>
                      <JobCard 
                        application={application} 
                        onDelete={deleteApplication} 
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    No applications yet
                  </Typography>
                  <Button
                    component={Link}
                    to="/add"
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    sx={{ mt: 2, borderRadius: 2 }}
                  >
                    Add Your First Application
                  </Button>
                </Box>
              )}
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 