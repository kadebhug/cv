import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { ResumeBuilder } from './components/ResumeBuilder'
import { Navbar } from './components/Navbar'
import { Font } from '@react-pdf/renderer'
import { AuthProvider } from './contexts/AuthContext'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { DashboardPage } from './pages/DashboardPage'
import { ProtectedRoute } from './components/ProtectedRoute'

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
      <Router>
        <div className="min-h-screen bg-gray-100 flex flex-col">
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
              <Route path="/edit/:resumeId" element={
                <main className="flex-1 w-full">
                  <ResumeBuilder />
                </main>
              } />
              <Route path="/" element={
                <main className="flex-1 w-full">
                  <ResumeBuilder />
                </main>
              } />
              {/* Redirect any other routes to the root */}
              <Route path="*" element={
                <main className="flex-1 w-full">
                  <ResumeBuilder />
                </main>
              } />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
