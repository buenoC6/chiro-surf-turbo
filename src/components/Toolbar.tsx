import {
  FolderOpen,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ZoomIn,
  ZoomOut,
  MousePointer,
  Ruler,
  Activity,
  FileBarChart,
  BookOpen,
  Sun,
  Moon,
  Settings,
} from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner';
import type { ViewMode, LuminosityMode, MeasurementMode } from '../App';

interface ToolbarProps {
  currentFile: string;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  luminosityMode: LuminosityMode;
  setLuminosityMode: (mode: LuminosityMode) => void;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
  measurementMode: MeasurementMode;
  setMeasurementMode: (mode: MeasurementMode) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  csvLoaded: boolean;
  setCsvLoaded: (loaded: boolean) => void;
  showCSVPanel: boolean;
  setShowCSVPanel: (show: boolean) => void;
  showIdentificationPanel: boolean;
  setShowIdentificationPanel: (show: boolean) => void;
  onFileOpen: (filename: string) => void;
}

export function Toolbar({
  viewMode,
  setViewMode,
  luminosityMode,
  setLuminosityMode,
  zoomLevel,
  setZoomLevel,
  measurementMode,
  setMeasurementMode,
  isPlaying,
  setIsPlaying,
  csvLoaded,
  setCsvLoaded,
  showCSVPanel,
  setShowCSVPanel,
  showIdentificationPanel,
  setShowIdentificationPanel,
  onFileOpen,
}: ToolbarProps) {
  const handleFileOpen = () => {
    toast.success('Fichier ouvert: example_recording.wav');
    onFileOpen('example_recording.wav');
  };

  const handleCSVOpen = () => {
    setCsvLoaded(true);
    setShowCSVPanel(true);
    toast.success('CSV Tadarida chargé avec succès');
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 p-2 flex items-center gap-2 flex-wrap">
      {/* Fichiers */}
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" onClick={handleFileOpen}>
          <FolderOpen className="w-4 h-4 mr-2" />
          Ouvrir WAV
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCSVOpen}
          className={csvLoaded ? 'bg-green-900/30' : ''}
        >
          <FileBarChart className="w-4 h-4 mr-2" />
          CSV Tadarida
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Navigation */}
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm">
          <SkipBack className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>
        <Button variant="outline" size="sm">
          <SkipForward className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Mode de vue */}
      <Select value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
        <SelectTrigger className="w-36 h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="forme">Forme</SelectItem>
          <SelectItem value="energie">Énergie</SelectItem>
          <SelectItem value="variations">Variations</SelectItem>
        </SelectContent>
      </Select>

      {/* Luminosité */}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          setLuminosityMode(luminosityMode === 'absolue' ? 'relative' : 'absolue')
        }
      >
        {luminosityMode === 'absolue' ? (
          <Sun className="w-4 h-4 mr-2" />
        ) : (
          <Moon className="w-4 h-4 mr-2" />
        )}
        {luminosityMode === 'absolue' ? 'Absolue' : 'Relative'}
      </Button>

      <Separator orientation="vertical" className="h-8" />

      {/* Zoom */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoomLevel(Math.max(1, zoomLevel - 1))}
          disabled={zoomLevel <= 1}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-xs text-gray-400 w-12 text-center">
          Zoom {zoomLevel}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoomLevel(Math.min(9, zoomLevel + 1))}
          disabled={zoomLevel >= 9}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Outils de mesure */}
      <div className="flex items-center gap-1">
        <Button
          variant={measurementMode === 'duration' ? 'default' : 'outline'}
          size="sm"
          onClick={() =>
            setMeasurementMode(measurementMode === 'duration' ? null : 'duration')
          }
        >
          <MousePointer className="w-4 h-4 mr-2" />
          Durée
        </Button>
        <Button
          variant={measurementMode === 'frequency' ? 'default' : 'outline'}
          size="sm"
          onClick={() =>
            setMeasurementMode(
              measurementMode === 'frequency' ? null : 'frequency'
            )
          }
        >
          <Ruler className="w-4 h-4 mr-2" />
          Fréquences
        </Button>
        <Button
          variant={measurementMode === 'fme' ? 'default' : 'outline'}
          size="sm"
          onClick={() =>
            setMeasurementMode(measurementMode === 'fme' ? null : 'fme')
          }
        >
          <Activity className="w-4 h-4 mr-2" />
          FME
        </Button>
        <Button
          variant={measurementMode === 'qfc' ? 'default' : 'outline'}
          size="sm"
          onClick={() =>
            setMeasurementMode(measurementMode === 'qfc' ? null : 'qfc')
          }
        >
          QFC
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Panneaux */}
      <Button
        variant={showCSVPanel ? 'default' : 'outline'}
        size="sm"
        onClick={() => setShowCSVPanel(!showCSVPanel)}
        disabled={!csvLoaded}
      >
        <FileBarChart className="w-4 h-4 mr-2" />
        Graphiques
      </Button>

      <Button
        variant={showIdentificationPanel ? 'default' : 'outline'}
        size="sm"
        onClick={() => setShowIdentificationPanel(!showIdentificationPanel)}
      >
        <BookOpen className="w-4 h-4 mr-2" />
        Identification
      </Button>

      <div className="ml-auto">
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
