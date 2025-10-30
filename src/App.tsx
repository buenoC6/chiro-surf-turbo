import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import ProjectLauncher from './components/ProjectLauncher';
import MainLayout from './components/MainLayout';
import { ThemeProvider } from './components/ThemeProvider';

function ProjectLayout() {
  const { projectName, mediaId, module } = useParams<{ projectName: string; mediaId?: string; module?: string }>();
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  if (!projectName) {
    return <Navigate to="/" replace />;
  }

  return <MainLayout projectName={decodeURIComponent(projectName)} onClose={handleClose} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Route vers le launcher de projet */}
          <Route 
            path="/" 
            element={<ProjectLauncher onProjectSelect={() => {}} />}
          />
          
          {/* Routes vers les différents modules du projet avec média */}
          <Route 
            path="/project/:projectName/:module/:mediaId" 
            element={<ProjectLayout />}
          />
          
          {/* Routes vers les différents modules du projet sans média */}
          <Route 
            path="/project/:projectName/:module" 
            element={<ProjectLayout />}
          />
          
          {/* Redirection vers media par défaut pour un projet */}
          <Route 
            path="/project/:projectName" 
            element={<Navigate to="media" replace />} 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
