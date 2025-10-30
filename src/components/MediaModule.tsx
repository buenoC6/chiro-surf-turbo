'use client';

import { useState } from 'react';
import { Upload, File, Play, Trash2, FolderOpen, ChevronDown, ChevronRight, Calendar, HardDrive, Plus, MapPin, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Badge } from './ui/badge';
import MapView from './MapView';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MediaFile {
  id: string;
  name: string;
  duration: string;
  size: string;
  date: string;
  sampleRate: string;
}

interface ImportBatch {
  id: string;
  name: string;
  date: string;
  fileCount: number;
  totalSize: string;
  files: MediaFile[];
}

interface Source {
  id: string;
  name: string;
  location: string;
  deviceId: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
  imports: ImportBatch[];
}

// Mock data structure with hierarchical organization
const mockSources: Source[] = [
  {
    id: 'source-1',
    name: 'Forêt Nord - Site 1',
    location: 'GPS: 47.2184° N, 1.5536° W',
    deviceId: 'Sonde A - SM4BAT',
    latitude: 47.2184,
    longitude: -1.5536,
    photoUrl: 'https://images.unsplash.com/photo-1690447388072-b393055865fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXQlMjBkZXRlY3RvciUyMGFjb3VzdGljJTIwZGV2aWNlfGVufDF8fHx8MTc2MTgxNjAyOHww&ixlib=rb-4.1.0&q=80&w=1080',
    imports: [
      {
        id: 'import-1-1',
        name: 'Octobre 2024 - Semaine 4',
        date: '2024-10-28',
        fileCount: 12,
        totalSize: '342 MB',
        files: [
          { id: '1', name: 'session_2024-10-28_site1_0001.wav', duration: '5:34', size: '128 MB', date: '2024-10-28', sampleRate: '384 kHz' },
          { id: '2', name: 'session_2024-10-28_site1_0002.wav', duration: '3:12', size: '74 MB', date: '2024-10-28', sampleRate: '384 kHz' },
          { id: '3', name: 'session_2024-10-27_site1_0003.wav', duration: '4:23', size: '102 MB', date: '2024-10-27', sampleRate: '384 kHz' },
          { id: '4', name: 'session_2024-10-26_site1_0004.wav', duration: '2:45', size: '38 MB', date: '2024-10-26', sampleRate: '384 kHz' },
        ]
      },
      {
        id: 'import-1-2',
        name: 'Octobre 2024 - Semaine 3',
        date: '2024-10-21',
        fileCount: 15,
        totalSize: '428 MB',
        files: [
          { id: '5', name: 'session_2024-10-21_site1_0001.wav', duration: '6:12', size: '142 MB', date: '2024-10-21', sampleRate: '384 kHz' },
          { id: '6', name: 'session_2024-10-20_site1_0002.wav', duration: '4:56', size: '114 MB', date: '2024-10-20', sampleRate: '384 kHz' },
          { id: '7', name: 'session_2024-10-19_site1_0003.wav', duration: '5:34', size: '128 MB', date: '2024-10-19', sampleRate: '384 kHz' },
          { id: '8', name: 'session_2024-10-18_site1_0004.wav', duration: '2:12', size: '44 MB', date: '2024-10-18', sampleRate: '384 kHz' },
        ]
      },
      {
        id: 'import-1-3',
        name: 'Septembre 2024 - Semaine 4',
        date: '2024-09-30',
        fileCount: 18,
        totalSize: '512 MB',
        files: [
          { id: '9', name: 'session_2024-09-30_site1_0001.wav', duration: '7:23', size: '172 MB', date: '2024-09-30', sampleRate: '384 kHz' },
          { id: '10', name: 'session_2024-09-29_site1_0002.wav', duration: '5:12', size: '122 MB', date: '2024-09-29', sampleRate: '384 kHz' },
        ]
      }
    ]
  },
  {
    id: 'source-2',
    name: 'Rivière Sud - Site 2',
    location: 'GPS: 47.2095° N, 1.5612° W',
    deviceId: 'Sonde B - AudioMoth',
    latitude: 47.2095,
    longitude: -1.5612,
    photoUrl: 'https://images.unsplash.com/photo-1690447388072-b393055865fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXQlMjBkZXRlY3RvciUyMGFjb3VzdGljJTIwZGV2aWNlfGVufDF8fHx8MTc2MTgxNjAyOHww&ixlib=rb-4.1.0&q=80&w=1080',
    imports: [
      {
        id: 'import-2-1',
        name: 'Octobre 2024 - Semaine 4',
        date: '2024-10-28',
        fileCount: 8,
        totalSize: '256 MB',
        files: [
          { id: '11', name: 'session_2024-10-28_site2_0001.wav', duration: '4:12', size: '98 MB', date: '2024-10-28', sampleRate: '384 kHz' },
          { id: '12', name: 'session_2024-10-27_site2_0002.wav', duration: '3:45', size: '88 MB', date: '2024-10-27', sampleRate: '384 kHz' },
          { id: '13', name: 'session_2024-10-26_site2_0003.wav', duration: '2:56', size: '70 MB', date: '2024-10-26', sampleRate: '384 kHz' },
        ]
      },
      {
        id: 'import-2-2',
        name: 'Octobre 2024 - Semaine 3',
        date: '2024-10-21',
        fileCount: 10,
        totalSize: '312 MB',
        files: [
          { id: '14', name: 'session_2024-10-21_site2_0001.wav', duration: '5:23', size: '126 MB', date: '2024-10-21', sampleRate: '384 kHz' },
          { id: '15', name: 'session_2024-10-20_site2_0002.wav', duration: '4:34', size: '108 MB', date: '2024-10-20', sampleRate: '384 kHz' },
        ]
      }
    ]
  },
  {
    id: 'source-3',
    name: 'Transect Forestier - Zone Mobile',
    location: 'Parcours itinérant',
    deviceId: 'Sonde C - EM3+',
    latitude: 47.2145,
    longitude: -1.5574,
    imports: [
      {
        id: 'import-3-1',
        name: 'Octobre 2024 - Passage 2',
        date: '2024-10-25',
        fileCount: 5,
        totalSize: '184 MB',
        files: [
          { id: '16', name: 'transect_2024-10-25_0001.wav', duration: '8:45', size: '202 MB', date: '2024-10-25', sampleRate: '384 kHz' },
        ]
      }
    ]
  }
];

interface MediaModuleProps {
  onFileSelect?: (file: {
    id: string;
    name: string;
    duration: string;
    sampleRate: string;
    sourceName: string;
    importName: string;
  }) => void;
}

export default function MediaModule({ onFileSelect }: MediaModuleProps) {
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set(['source-1']));
  const [expandedImports, setExpandedImports] = useState<Set<string>>(new Set(['import-1-1']));

  const toggleFileSelection = (id: string) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedFiles(newSelection);
  };

  const toggleSource = (id: string) => {
    const newExpanded = new Set(expandedSources);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSources(newExpanded);
  };

  const handleSourceClick = (id: string, e: React.MouseEvent) => {
    // Check if we clicked on the chevron (to expand/collapse)
    const target = e.target as HTMLElement;
    if (target.closest('svg')) {
      toggleSource(id);
    } else {
      // Otherwise, select the source to show its details
      setSelectedSource(selectedSource === id ? null : id);
      setSelectedFiles(new Set()); // Clear file selection
    }
  };

  const toggleImport = (id: string) => {
    const newExpanded = new Set(expandedImports);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedImports(newExpanded);
  };

  // Get selected file details
  const getSelectedFileDetails = () => {
    for (const source of mockSources) {
      for (const importBatch of source.imports) {
        const file = importBatch.files.find(f => selectedFiles.has(f.id));
        if (file) return { file, source, importBatch };
      }
    }
    return null;
  };

  const selectedFileData = getSelectedFileDetails();
  const selectedFile = selectedFileData?.file;
  const selectedSourceData = mockSources.find(s => s.id === selectedSource);

  const handleFileDoubleClick = (fileId: string) => {
    const data = getSelectedFileDetails();
    if (data && onFileSelect) {
      onFileSelect({
        id: data.file.id,
        name: data.file.name,
        duration: data.file.duration,
        sampleRate: data.file.sampleRate,
        sourceName: data.source.name,
        importName: data.importBatch.name,
      });
    }
  };

  return (
    <div className="h-full flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-14 border-b border-[var(--app-border)] px-4 flex items-center gap-2">
          <Button className="gap-2 bg-[#00C2FF] hover:bg-[#00A8E0] text-black">
            <Upload className="w-4 h-4" />
            Importer fichiers
          </Button>
          <Button variant="outline" className="gap-2 border-gray-700 hover:bg-gray-800">
            <FolderOpen className="w-4 h-4" />
            Ouvrir dossier
          </Button>
          <Button variant="outline" className="gap-2 border-gray-700 hover:bg-gray-800">
            <Plus className="w-4 h-4" />
            Nouvelle source
          </Button>
          <div className="flex-1" />
          <Button 
            variant="outline" 
            className="gap-2 border-gray-700 hover:bg-gray-800"
            disabled={selectedFiles.size === 0}
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </Button>
        </div>

        {/* Hierarchical File Tree */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {mockSources.map(source => (
              <div 
                key={source.id} 
                className={`bg-[#161B22] border rounded-lg overflow-hidden transition-all ${
                  selectedSource === source.id ? 'border-[#00C2FF]' : 'border-gray-800'
                }`}
              >
                <button
                  onClick={(e) => handleSourceClick(source.id, e)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-gray-800/50 transition-colors"
                >
                  <span onClick={(e) => { e.stopPropagation(); toggleSource(source.id); }}>
                    {expandedSources.has(source.id) ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </span>
                  <HardDrive className="w-5 h-5 text-[#00C2FF]" />
                  <div className="flex-1 text-left">
                    <h3 className="flex items-center gap-2">
                      {source.name}
                      <Badge variant="outline" className="text-xs border-gray-700">
                        {source.imports.reduce((sum, imp) => sum + imp.fileCount, 0)} fichiers
                      </Badge>
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {source.location} • {source.deviceId}
                    </p>
                  </div>
                </button>

                {expandedSources.has(source.id) && (
                  <div className="px-4 pb-4 space-y-2">
                    {source.imports.map(importBatch => (
                      <div key={importBatch.id} className="ml-6 border-l-2 border-gray-700 pl-4">
                        <button
                          onClick={() => toggleImport(importBatch.id)}
                          className="w-full flex items-center gap-2 p-2 hover:bg-gray-800/30 rounded transition-colors"
                        >
                          {expandedImports.has(importBatch.id) ? (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          )}
                          <Calendar className="w-4 h-4 text-[#FF9500]" />
                          <div className="flex-1 text-left">
                            <h4 className="text-sm">{importBatch.name}</h4>
                            <p className="text-xs text-gray-500">
                              {importBatch.fileCount} fichiers • {importBatch.totalSize} • {new Date(importBatch.date).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </button>

                        {expandedImports.has(importBatch.id) && (
                          <div className="mt-2 ml-6 grid grid-cols-3 gap-3">
                            {importBatch.files.map(file => (
                              <button
                                key={file.id}
                                onClick={() => {
                                  toggleFileSelection(file.id);
                                  setSelectedSource(null);
                                }}
                                onDoubleClick={() => handleFileDoubleClick(file.id)}
                                className={`bg-[#0D1117] border rounded-lg p-3 text-left hover:border-gray-600 transition-all ${
                                  selectedFiles.has(file.id) ? 'border-[#00C2FF] bg-[#00C2FF]/10' : 'border-gray-800'
                                }`}
                              >
                                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded mb-2 flex items-center justify-center">
                                  <File className="w-8 h-8 text-gray-600" />
                                </div>
                                <div className="space-y-1">
                                  <h5 className="text-xs truncate">{file.name}</h5>
                                  <p className="text-xs text-gray-500">{file.duration}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Sidebar - Properties */}
      <div className="w-80 border-l border-[var(--app-border)] bg-[var(--app-panel)] flex flex-col">
        <div className="p-4 border-b border-[var(--app-border)]">
          <h3 className="text-sm">Propriétés</h3>
        </div>
        <ScrollArea className="flex-1 p-4">
          {/* Source details */}
          {selectedSourceData && !selectedFile && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500">Nom de la source</label>
                <p className="text-sm mt-1">{selectedSourceData.name}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Appareil</label>
                <p className="text-sm mt-1">{selectedSourceData.deviceId}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Localisation</label>
                <p className="text-sm mt-1">{selectedSourceData.location}</p>
              </div>
              
              {/* Map */}
              <div className="pt-2">
                <label className="text-xs text-gray-500 mb-2 block flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Position GPS
                </label>
                <MapView 
                  latitude={selectedSourceData.latitude}
                  longitude={selectedSourceData.longitude}
                  label={selectedSourceData.name}
                />
              </div>

              {/* Photo of device */}
              {selectedSourceData.photoUrl && (
                <div className="pt-2">
                  <label className="text-xs text-gray-500 mb-2 block flex items-center gap-1">
                    <Camera className="w-3 h-3" />
                    Photo de la sonde
                  </label>
                  <div className="aspect-video rounded-lg overflow-hidden border border-gray-800">
                    <ImageWithFallback
                      src={selectedSourceData.photoUrl}
                      alt={`Photo de ${selectedSourceData.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {selectedSourceData.deviceId}
                  </p>
                </div>
              )}

              <div className="pt-2">
                <label className="text-xs text-gray-500">Statistiques</label>
                <div className="mt-2 space-y-1 text-sm">
                  <p className="flex justify-between">
                    <span className="text-gray-400">Imports:</span>
                    <span>{selectedSourceData.imports.length}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-400">Fichiers totaux:</span>
                    <span>{selectedSourceData.imports.reduce((sum, imp) => sum + imp.fileCount, 0)}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* File details */}
          {selectedFiles.size === 1 && selectedFile ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500">Nom du fichier</label>
                <p className="text-sm mt-1">{selectedFile.name}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Durée</label>
                <p className="text-sm mt-1">{selectedFile.duration}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Taille</label>
                <p className="text-sm mt-1">{selectedFile.size}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Fréquence d&apos;échantillonnage</label>
                <p className="text-sm mt-1">{selectedFile.sampleRate}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Date</label>
                <p className="text-sm mt-1">{new Date(selectedFile.date).toLocaleDateString('fr-FR')}</p>
              </div>
              <Button 
                className="w-full gap-2 bg-[#00C2FF] hover:bg-[#00A8E0] text-black mt-4"
                onClick={() => handleFileDoubleClick(selectedFile.id)}
              >
                <Play className="w-4 h-4" />
                Ouvrir dans Derush
              </Button>
            </div>
          ) : selectedFiles.size > 1 ? (
            <div className="text-sm text-gray-400">
              {selectedFiles.size} fichiers sélectionnés
            </div>
          ) : !selectedSourceData ? (
            <div className="text-sm text-gray-400">
              Sélectionnez une source ou un fichier pour voir les propriétés
            </div>
          ) : null}
        </ScrollArea>
      </div>
    </div>
  );
}
