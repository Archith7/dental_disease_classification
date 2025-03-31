import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GumDiseasePrediction from './com/input';
import './App.css'; // Import the CSS file

// Component for the Home/Landing Page
const Home = () => (
  <div className="container">
    <h1 className="title-large">Dental Health Analysis Platform</h1>
    <p className="subtitle">
      Advanced AI-powered tools for periodontal disease detection and analysis
    </p>
    
    <div className="card-grid">
      <div className="card">
        <h2 className="title-medium">Gum Disease Analysis</h2>
        <p className="text-paragraph mb-4">
          Upload images of oral cavity for AI-assisted periodontal disease assessment
        </p>
        <Link to="/gum-disease" className="button">
          Start Analysis
        </Link>
      </div>
      
      <div className="card">
        <h2 className="title-medium">Patient Records</h2>
        <p className="text-paragraph mb-4">
          Access and manage patient dental health records and previous analyses
        </p>
        <Link to="/records" className="button">
          View Records
        </Link>
      </div>
    </div>
    
    <div className="info-section">
      <h2 className="title-medium">About This Tool</h2>
      <p className="text-paragraph">
        This platform uses advanced image recognition algorithms to detect signs of 
        periodontal disease including gingivitis, periodontitis, and gum recession. 
        The system analyzes images of patients' oral cavity to provide preliminary 
        assessments to assist dental professionals.
      </p>
      <p className="text-paragraph mt-4">
        <strong>Note:</strong> This tool is designed to assist dental professionals 
        and is not intended to replace professional diagnosis. Always consult with 
        a qualified dentist for proper evaluation and treatment of oral conditions.
      </p>
    </div>
  </div>
);

// Component for Patient Records Page
const PatientRecords = () => (
  <div className="container">
    <h1 className="title-large">Patient Records</h1>
    <p className="text-paragraph mb-6">Access and manage dental health records</p>
    
    <div className="placeholder">
      <p className="subtitle">Patient records functionality will be implemented in future updates.</p>
      <Link to="/" className="button">
        Return to Home
      </Link>
    </div>
  </div>
);

// Component for Navigation Header
const Header = () => (
  <header>
    <div className="header-container">
      <div className="header-content">
        <Link to="/" className="logo">
          DentalAI Diagnostics
        </Link>
        
        <nav>
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/gum-disease" className="nav-link">
                Gum Analysis
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/records" className="nav-link">
                Patient Records
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
);

// Main App Component with Routes
const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gum-disease" element={<GumDiseasePrediction />} />
            <Route path="/records" element={<PatientRecords />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;