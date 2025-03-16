import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { JobApplicationProvider } from './context/JobApplicationContext';
import { ResumeProvider } from './context/ResumeContext';
import darkTheme from './theme/darkTheme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import AddApplication from './pages/AddApplication';
import EditApplication from './pages/EditApplication';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Resumes from './pages/Resumes';
import EditResume from './pages/EditResume';
import CreateResume from './pages/CreateResume';
import EditResumeCopy from './pages/EditResumeCopy';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <JobApplicationProvider>
        <ResumeProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/add" element={<AddApplication />} />
                <Route path="/edit/:id" element={<EditApplication />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/resumes" element={<Resumes />} />
                <Route path="/resumes/create" element={<CreateResume />} />
                <Route path="/resumes/edit/:id" element={<EditResume />} />
                <Route path="/resumes/copy/:id" element={<EditResumeCopy />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </Router>
        </ResumeProvider>
      </JobApplicationProvider>
    </ThemeProvider>
  );
}

export default App;
