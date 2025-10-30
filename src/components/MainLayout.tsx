'use client';

import React from 'react';
import { useState } from 'react';
import { ChevronDown, FileAudio, Sun, Moon, FolderOpen, Save, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import MediaModule from './MediaModule';
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

export default function MainLayout({ projectName, onClose }: MainLayoutProps) {
  const [activeTab, setActiveTab] = useState('media');
  const [selectedAudioFile, setSelectedAudioFile] = useState<SelectedAudioFile | null>(null);
  const { theme, toggleTheme } = useTheme();

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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b border-[var(--app-border)] bg-[var(--app-panel)]">
          <TabsList className="h-12 bg-transparent px-4 gap-1 flex items-center">
            {/* Primary Tab - Always visible */}
            <TabsTrigger 
              value="media" 
              className="data-[state=active]:bg-[#0D1117] data-[state=active]:text-[#00C2FF] px-4"
            >
              Media
            </TabsTrigger>
            
            {/* Secondary Tabs - Only visible when a file is selected */}
            {selectedAudioFile && (
              <>
                <div className="h-6 w-px bg-gray-700 mx-2" />
                <div className="flex items-center gap-1 text-xs text-gray-400 mr-2">
                  <FileAudio className="w-3 h-3" />
                  <span className="max-w-[200px] truncate">{selectedAudioFile.name}</span>
                </div>
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
                setSelectedAudioFile(file);
                setActiveTab('derush');
              }}
            />
          </TabsContent>
          {selectedAudioFile && (
            <>
              <TabsContent value="derush" className="h-full m-0">
                <DerushModule 
                  audioFile={selectedAudioFile}
                  onClose={() => {
                    setSelectedAudioFile(null);
                    setActiveTab('media');
                  }}
                />
              </TabsContent>
              <TabsContent value="analyse" className="h-full m-0">
                <AnalysisModule audioFile={selectedAudioFile} />
              </TabsContent>
              <TabsContent value="interpretation" className="h-full m-0">
                <InterpretationModule audioFile={selectedAudioFile} />
              </TabsContent>
              <TabsContent value="export" className="h-full m-0">
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">Module Export (à implémenter)</p>
                </div>
              </TabsContent>
            </>
          )}
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
