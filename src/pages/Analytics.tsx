import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  useTheme,
  Divider,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import { useJobApplications } from '../context/JobApplicationContext';
import { ApplicationStatus, ApplicationSource } from '../types/JobApplication';

const Analytics: React.FC = () => {
  const theme = useTheme();
  const { applications } = useJobApplications();

  const stats = useMemo(() => {
    if (applications.length === 0) {
      return null;
    }

    // Status breakdown
    const statusCounts = Object.values(ApplicationStatus).reduce((acc, status) => {
      acc[status] = applications.filter(app => app.status === status).length;
      return acc;
    }, {} as Record<string, number>);

    // Source breakdown
    const sourceCounts = Object.values(ApplicationSource).reduce((acc, source) => {
      acc[source] = applications.filter(app => app.source === source).length;
      return acc;
    }, {} as Record<string, number>);

    // Applications per month
    const appsByMonth: Record<string, number> = {};
    applications.forEach(app => {
      const date = new Date(app.applicationDate);
      const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      appsByMonth[monthYear] = (appsByMonth[monthYear] || 0) + 1;
    });

    // Response rate (interviews / applications)
    const interviews = statusCounts[ApplicationStatus.INTERVIEW] || 0;
    const offers = statusCounts[ApplicationStatus.OFFER] || 0;
    const responseRate = Math.round((interviews / applications.length) * 100);
    const offerRate = interviews > 0 ? Math.round((offers / interviews) * 100) : 0;

    // Average applications per week
    const oldestApp = new Date(Math.min(...applications.map(app => new Date(app.applicationDate).getTime())));
    const newestApp = new Date(Math.max(...applications.map(app => new Date(app.applicationDate).getTime())));
    const weeksDiff = Math.max(1, Math.ceil((newestApp.getTime() - oldestApp.getTime()) / (7 * 24 * 60 * 60 * 1000)));
    const appsPerWeek = Math.round((applications.length / weeksDiff) * 10) / 10;

    return {
      statusCounts,
      sourceCounts,
      appsByMonth,
      responseRate,
      offerRate,
      appsPerWeek,
      totalApplications: applications.length
    };
  }, [applications]);

  if (!stats) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Alert 
          severity="info" 
          sx={{ 
            maxWidth: 500, 
            mx: 'auto', 
            borderRadius: 2,
            bgcolor: 'rgba(52, 152, 219, 0.1)',
            color: theme.palette.info.main,
            '& .MuiAlert-icon': {
              color: theme.palette.info.main
            }
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
            No Data Available
          </Typography>
          <Typography variant="body2">
            Start tracking your job applications to see analytics and insights.
          </Typography>
        </Alert>
      </Box>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        Analytics & Insights
      </Typography>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  height: '100%'
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Application Status Breakdown
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {Object.entries(stats.statusCounts).map(([status, count]) => (
                    <Box key={status}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="body2">
                          {status}
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {count} ({Math.round((count / stats.totalApplications) * 100)}%)
                        </Typography>
                      </Box>
                      <Box 
                        sx={{ 
                          width: '100%', 
                          height: 8, 
                          bgcolor: 'rgba(0, 0, 0, 0.1)', 
                          borderRadius: 4,
                          overflow: 'hidden'
                        }}
                      >
                        <Box 
                          sx={{ 
                            width: `${(count / stats.totalApplications) * 100}%`, 
                            height: '100%', 
                            bgcolor: getStatusColor(status as ApplicationStatus, theme),
                            borderRadius: 4
                          }} 
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  height: '100%'
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Application Source Breakdown
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {Object.entries(stats.sourceCounts)
                    .sort((a, b) => b[1] - a[1]) // Sort by count descending
                    .map(([source, count]) => (
                      <Box key={source}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="body2">
                            {source}
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {count} ({Math.round((count / stats.totalApplications) * 100)}%)
                          </Typography>
                        </Box>
                        <Box 
                          sx={{ 
                            width: '100%', 
                            height: 8, 
                            bgcolor: 'rgba(0, 0, 0, 0.1)', 
                            borderRadius: 4,
                            overflow: 'hidden'
                          }}
                        >
                          <Box 
                            sx={{ 
                              width: `${(count / stats.totalApplications) * 100}%`, 
                              height: '100%', 
                              bgcolor: theme.palette.primary.main,
                              borderRadius: 4
                            }} 
                          />
                        </Box>
                      </Box>
                    ))}
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Key Metrics
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                        {stats.totalApplications}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Applications
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: theme.palette.warning.main }}>
                        {stats.responseRate}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Interview Rate
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>
                        {stats.offerRate}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Offer Rate
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: theme.palette.info.main }}>
                        {stats.appsPerWeek}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Applications per Week
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Applications by Month
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {Object.entries(stats.appsByMonth)
                    .sort((a, b) => {
                      // Sort by date (most recent first)
                      const dateA = new Date(a[0]);
                      const dateB = new Date(b[0]);
                      return dateB.getTime() - dateA.getTime();
                    })
                    .map(([month, count]) => (
                      <Box key={month}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="body2">
                            {month}
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {count} applications
                          </Typography>
                        </Box>
                        <Box 
                          sx={{ 
                            width: '100%', 
                            height: 8, 
                            bgcolor: 'rgba(0, 0, 0, 0.1)', 
                            borderRadius: 4,
                            overflow: 'hidden'
                          }}
                        >
                          <Box 
                            sx={{ 
                              width: `${(count / Math.max(...Object.values(stats.appsByMonth))) * 100}%`, 
                              height: '100%', 
                              bgcolor: theme.palette.secondary.main,
                              borderRadius: 4
                            }} 
                          />
                        </Box>
                      </Box>
                    ))}
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

// Helper function to get color based on status
const getStatusColor = (status: ApplicationStatus, theme: any) => {
  switch (status) {
    case ApplicationStatus.APPLIED:
      return theme.palette.info.main;
    case ApplicationStatus.INTERVIEW:
      return theme.palette.warning.main;
    case ApplicationStatus.OFFER:
      return theme.palette.success.main;
    case ApplicationStatus.REJECTED:
      return theme.palette.error.main;
    case ApplicationStatus.PENDING:
      return theme.palette.grey[500];
    case ApplicationStatus.WITHDRAWN:
      return theme.palette.grey[700];
    default:
      return theme.palette.primary.main;
  }
};

export default Analytics; 