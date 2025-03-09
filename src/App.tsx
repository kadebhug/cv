import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { ResumeBuilder } from './components/ResumeBuilder'
import { Navbar } from './components/Navbar'
import { Font } from '@react-pdf/renderer'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { DashboardPage } from './pages/DashboardPage'
import { Settings } from './pages/Settings'
import { ProtectedRoute } from './components/ProtectedRoute'
import { CoverLetterBuilder } from './components/CoverLetterBuilder'

// Register a web-safe font
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxP.ttf' },
  ],
});

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <Routes>
              {/* Public routes - accessible without authentication */}
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              
              {/* Protected routes - require authentication */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/edit/:resumeId" element={
                  <main className="flex-1 w-full">
                    <ResumeBuilder />
                  </main>
                } />
                <Route path="/create-resume" element={
                  <main className="flex-1 w-full">
                    <ResumeBuilder />
                  </main>
                } />
                {/* Cover Letter Routes */}
                <Route path="/create-cover-letter" element={
                  <main className="flex-1 w-full">
                    <CoverLetterBuilder />
                  </main>
                } />
                <Route path="/edit-cover-letter/:coverId" element={
                  <main className="flex-1 w-full">
                    <CoverLetterBuilder />
                  </main>
                } />
                {/* Root path redirects to dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                {/* Redirect any other routes to the dashboard */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
