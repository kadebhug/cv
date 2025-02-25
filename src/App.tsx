import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { ResumeBuilder } from './components/ResumeBuilder'
import { Navbar } from './components/Navbar'
import { Font } from '@react-pdf/renderer'

// Register a web-safe font
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxP.ttf' },
  ],
});

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/builder" element={
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <ResumeBuilder />
            </main>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
