import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, Plus, Clock, Search, Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useTheme } from './ThemeProvider';

interface Project {
  id: string;
  name: string;
  path: string;
  lastOpened: string;
}

const recentProjects: Project[] = [
  { id: '1', name: 'Étude_Parc_Naturel_2024', path: '/projects/parc-naturel-2024', lastOpened: '2025-10-28' },
  { id: '2', name: 'Inventaire_Chiroptères_Loire', path: '/projects/loire-inventory', lastOpened: '2025-10-25' },
  { id: '3', name: 'Suivi_Migration_Automne', path: '/projects/migration-automne', lastOpened: '2025-10-20' },
];

interface ProjectLauncherProps {
  onProjectSelect: (projectName: string) => void;
}

export default function ProjectLauncher({ onProjectSelect }: ProjectLauncherProps) {
  const navigate = useNavigate();
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme } = useTheme();

  const handleProjectSelection = (projectName: string) => {
    navigate(`/project/${encodeURIComponent(projectName)}/media`);
  };

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      handleProjectSelection(newProjectName);
    }
  };

  const filteredProjects = recentProjects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-foreground flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12 relative">
          <h1 className="text-2xl tracking-tight">Chironium</h1>
          <p className="text-sm text-muted-foreground">Analyse d&apos;ultrasons de chiroptères</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="absolute top-0 right-0 p-2"
            title={`Passer en mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        </div>

        {!showNewProject ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Rechercher un projet..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[var(--app-panel)] border-[var(--app-border)]"
                />
              </div>
              <Button 
                onClick={() => setShowNewProject(true)}
                className="gap-2 bg-[#00C2FF] hover:bg-[#00A8E0] text-black"
              >
                <Plus className="w-4 h-4" />
                Nouveau projet
              </Button>
            </div>

            <div className="space-y-2">
              <h2 className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Projets récents
              </h2>
              <div className="grid gap-2">
                {filteredProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleProjectSelection(project.name)}
                    className="bg-[var(--app-panel)] border border-[var(--app-border)] rounded-lg p-4 text-left hover:border-[var(--ring)] transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <Folder className="w-5 h-5 text-[#00C2FF] mt-0.5" />
                      <div className="flex-1">
                        <h3 className="group-hover:text-[#00C2FF] transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{project.path}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Dernière ouverture: {new Date(project.lastOpened).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[var(--app-panel)] border border-[var(--app-border)] rounded-lg p-6">
            <h2 className="text-lg mb-4">Créer un nouveau projet</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  Nom du projet
                </label>
                <Input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Mon projet d&apos;analyse"
                  className="bg-[var(--app-bg)] border-[var(--app-border)]"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNewProject(false);
                    setNewProjectName('');
                  }}
                  className="border-[var(--app-border)]"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleCreateProject}
                  disabled={!newProjectName.trim()}
                  className="bg-[#00C2FF] hover:bg-[#00A8E0] text-black"
                >
                  Créer le projet
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
