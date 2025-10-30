import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, FileAudio, Sun, Moon, FolderOpen, Save, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import MediaModule, { mockSources } from './MediaModule';
import DerushModule from './DerushModule';
import AnalysisModule from './AnalysisModule';
import InterpretationModule from './InterpretationModule';
import { useTheme } from './ThemeProvider';

interface MainLayoutProps {
  projectName: string;
  onClose: () => void;
}

interface SelectedAudioFile {
  id: string;
  name: string;
  duration: string;
  sampleRate: string;
  sourceName: string;
  importName: string;
}

// Function to find audio file by ID in mock sources
const findAudioFileById = (fileId: string): SelectedAudioFile | null => {
  for (const source of mockSources) {
    for (const importBatch of source.imports) {
      const file = importBatch.files.find(f => f.id === fileId);
      if (file) {
        return {
          id: file.id,
          name: file.name,
          duration: file.duration,
          sampleRate: file.sampleRate,
          sourceName: source.name,
          importName: importBatch.name,
        };
      }
    }
  }
  return null;
};

export default function MainLayout({ projectName, onClose }: MainLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedAudioFile, setSelectedAudioFile] = useState<SelectedAudioFile | null>(null);
  const { theme, toggleTheme } = useTheme();

  // Parse URL to extract module and mediaId
  // Expected structure: /project/:projectName/:module or /project/:projectName/:module/:mediaId
  const pathParts = location.pathname.split('/').filter(Boolean);
  let urlModule = 'media';
  let urlMediaId: string | null = null;
  
  if (pathParts.length >= 3) {
    urlModule = pathParts[2]; // /project/:projectName/:module
    if (pathParts.length >= 4) {
      urlMediaId = pathParts[3]; // /project/:projectName/:module/:mediaId
    }
  }
  
  const [activeTab, setActiveTab] = useState(urlModule);
  
  // Load audio file from URL when mediaId is present
  useEffect(() => {
    if (urlMediaId) {
      const file = findAudioFileById(urlMediaId);
      if (file) {
        // Only update if the file is different from current selection
        setSelectedAudioFile(prevFile => {
          if (!prevFile || prevFile.id !== file.id) {
            return file;
          }
          return prevFile;
        });
      }
    } else {
      // Clear selection if no mediaId in URL
      setSelectedAudioFile(null);
    }
  }, [urlMediaId]);
  
  // Synchroniser l'onglet actif avec l'URL
  useEffect(() => {
    if (urlModule) {
      setActiveTab(urlModule);
    }
  }, [urlModule]);

  // Fonction pour changer de module
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Always preserve the media ID in URL if a file is selected
    if (selectedAudioFile) {
      navigate(`/project/${encodeURIComponent(projectName)}/${value}/${selectedAudioFile.id}`);
    } else {
      navigate(`/project/${encodeURIComponent(projectName)}/${value}`);
    }
  };

  // Déterminer si on doit afficher les modules secondaires
  // Ils sont visibles si un fichier est sélectionné OU si on est sur un module non-media
  const shouldShowSecondaryTabs = selectedAudioFile || (urlModule !== 'media');

  return (
    <div className="h-screen bg-[var(--app-bg)] text-foreground flex flex-col">
      {/* Top Bar */}
      <div className="h-12 border-b border-[var(--app-border)] flex items-center justify-between px-4 bg-[var(--app-panel)]">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="gap-2 px-3 py-1.5 h-auto">
                <FolderOpen className="w-4 h-4" />
                <span className="text-sm">{projectName}</span>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem>
                <Save className="w-4 h-4 mr-2" />
                Enregistrer le projet
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Paramètres du projet
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onClose}>
                <FolderOpen className="w-4 h-4 mr-2" />
                Changer de projet
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onClose} className="text-red-500">
                Fermer le projet
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2"
            title={`Passer en mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
        <div className="border-b border-[var(--app-border)] bg-[var(--app-panel)]">
          <TabsList className="h-12 bg-transparent px-4 gap-1 flex items-center">
            {/* Primary Tab - Always visible */}
            <TabsTrigger 
              value="media" 
              className="data-[state=active]:bg-[#0D1117] data-[state=active]:text-[#00C2FF] px-4"
            >
              Media
            </TabsTrigger>
            
            {/* Secondary Tabs - Visible when a file is selected or when on a secondary module */}
            {shouldShowSecondaryTabs && (
              <>
                <div className="h-6 w-px bg-gray-700 mx-2" />
                {selectedAudioFile && (
                  <div className="flex items-center gap-1 text-xs text-gray-400 mr-2">
                    <FileAudio className="w-3 h-3" />
                    <span className="max-w-[200px] truncate">{selectedAudioFile.name}</span>
                  </div>
                )}
                <TabsTrigger 
                  value="derush" 
                  className="data-[state=active]:bg-[#0D1117] data-[state=active]:text-[#00C2FF] px-4"
                >
                  Derush
                </TabsTrigger>
                <TabsTrigger 
                  value="analyse" 
                  className="data-[state=active]:bg-[#0D1117] data-[state=active]:text-[#00C2FF] px-4"
                >
                  Analyse
                </TabsTrigger>
                <TabsTrigger 
                  value="interpretation" 
                  className="data-[state=active]:bg-[#0D1117] data-[state=active]:text-[#00C2FF] px-4"
                >
                  Interprétation
                </TabsTrigger>
                <TabsTrigger 
                  value="export" 
                  className="data-[state=active]:bg-[#0D1117] data-[state=active]:text-[#00C2FF] px-4"
                >
                  Export
                </TabsTrigger>
              </>
            )}
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="media" className="h-full m-0">
            <MediaModule 
              onFileSelect={(file) => {
                // Navigate directly with the file data
                // The useEffect will handle loading the file from URL
                navigate(`/project/${encodeURIComponent(projectName)}/derush/${file.id}`);
              }}
            />
          </TabsContent>
          
          {/* Always render secondary modules if a file is selected */}
          <TabsContent value="derush" className="h-full m-0">
            {selectedAudioFile ? (
              <DerushModule 
                audioFile={selectedAudioFile}
                onClose={() => {
                  setSelectedAudioFile(null);
                  handleTabChange('media');
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Sélectionnez un fichier audio pour accéder à ce module</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="analyse" className="h-full m-0">
            {selectedAudioFile ? (
              <AnalysisModule audioFile={selectedAudioFile} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Sélectionnez un fichier audio pour accéder à ce module</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="interpretation" className="h-full m-0">
            {selectedAudioFile ? (
              <InterpretationModule audioFile={selectedAudioFile} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Sélectionnez un fichier audio pour accéder à ce module</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="export" className="h-full m-0">
            {selectedAudioFile ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Module Export (à implémenter)</p>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Sélectionnez un fichier audio pour accéder à ce module</p>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>

      {/* Status Bar */}
      <div className="h-7 border-t border-[var(--app-border)] bg-[var(--app-panel)] px-4 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Chironium v1.0</span>
          <span className="text-gray-600">|</span>
          <span>Prêt</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Fréquence d&apos;échantillonnage: 384 kHz</span>
        </div>
      </div>
    </div>
  );
}
