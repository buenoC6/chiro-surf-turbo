import { useState } from 'react';
import ProjectLauncher from './components/ProjectLauncher';
import MainLayout from './components/MainLayout';
import { ThemeProvider } from './components/ThemeProvider';

export default function App() {
  const [currentProject, setCurrentProject] = useState<string | null>(null);

  return (
    <ThemeProvider>
      {!currentProject ? (
        <ProjectLauncher onProjectSelect={setCurrentProject} />
      ) : (
        <MainLayout 
          projectName={currentProject} 
          onClose={() => setCurrentProject(null)} 
        />
      )}
    </ThemeProvider>
  );
}
