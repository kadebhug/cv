import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { ResumeBuilder } from './components/ResumeBuilder'
import { Navbar } from './components/Navbar'
import { Font } from '@react-pdf/renderer'
import { AuthProvider } from './contexts/AuthContext'
import { SignIn } from './components/auth/SignIn'
import { SignUp } from './components/auth/SignUp'
import { Dashboard } from './pages/Dashboard'
import { ResumeEditor } from './pages/ResumeEditor'
import { ResumeViewer } from './pages/ResumeViewer'
import { PrivateRoute } from './components/auth/PrivateRoute'

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
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Protected routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/resume/edit/:resumeId" element={<ResumeEditor />} />
              <Route path="/resume/view/:resumeId" element={<ResumeViewer />} />
              <Route path="/resume/new" element={
                <main className="flex-1 w-full">
                  <ResumeBuilder />
                </main>
              } />
            </Route>
            
            {/* Public resume builder */}
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
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
