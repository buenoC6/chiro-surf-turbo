import { useState } from 'react';
import { Play, Pause, ZoomIn, ZoomOut, Scissors, Bookmark, ChevronLeft, ChevronRight, Volume2, X } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import Spectrogram from './Spectrogram';
import Waveform from './Waveform';

interface AudioSegment {
  id: string;
  name: string;
  start: number;
  end: number;
  duration: string;
  frequency: string;
}

const mockSegments: AudioSegment[] = [
  { id: '1', name: 'Zone A', start: 1.2, end: 1.35, duration: '150 ms', frequency: '45-52 kHz' },
  { id: '2', name: 'Zone B', start: 2.8, end: 3.0, duration: '200 ms', frequency: '38-48 kHz' },
  { id: '3', name: 'Zone C', start: 3.5, end: 3.72, duration: '220 ms', frequency: '42-50 kHz' },
];

interface DerushModuleProps {
  audioFile: {
    id: string;
    name: string;
    duration: string;
    sampleRate: string;
    sourceName: string;
    importName: string;
  };
  onClose: () => void;
}

export default function DerushModule({ audioFile, onClose }: DerushModuleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [segments, setSegments] = useState<AudioSegment[]>(mockSegments);
  const [playingSegment, setPlayingSegment] = useState<string | null>(null);

  const totalDuration = parseFloat(audioFile.duration.split(':')[0]) * 60 + parseFloat(audioFile.duration.split(':')[1]);

  const handleRegionSelect = (start: number, end: number, freqStart: number, freqEnd: number) => {
    const newSegment: AudioSegment = {
      id: `zone-${Date.now()}`,
      name: `Zone ${segments.length + 1}`,
      start,
      end,
      duration: `${Math.round((end - start) * 1000)} ms`,
      frequency: `${Math.round(freqStart)}-${Math.round(freqEnd)} kHz`,
    };
    setSegments([...segments, newSegment]);
    setSelectedSegment(newSegment.id);
  };

  const handleDeleteSegment = (id: string) => {
    setSegments(segments.filter(s => s.id !== id));
    if (selectedSegment === id) {
      setSelectedSegment(null);
    }
  };

  const handlePlaySegment = (id: string) => {
    setPlayingSegment(playingSegment === id ? null : id);
    // In a real app, this would play the audio segment
    console.log('Playing segment:', id);
  };

  return (
    <div className="h-full flex">
      {/* Left Panel - Track Info & Zones List */}
      {!leftPanelCollapsed && (
        <div className="w-72 border-r border-[var(--app-border)] bg-[var(--app-panel)] flex flex-col">
          {/* Track Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm">Piste en cours</h3>
              <button 
                onClick={() => setLeftPanelCollapsed(true)} 
                className="hover:bg-gray-700 p-1 rounded"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              <p className="text-xs truncate" title={audioFile.name}>{audioFile.name}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{audioFile.duration}</span>
                <span>•</span>
                <span>{audioFile.sampleRate}</span>
              </div>
              <div className="text-xs text-gray-500">
                <p>{audioFile.sourceName}</p>
                <p>{audioFile.importName}</p>
              </div>
            </div>
          </div>

          {/* Zones List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-3 border-b border-gray-800 flex items-center justify-between">
              <h4 className="text-xs text-gray-400">Zones de derush ({segments.length})</h4>
            </div>
            <div className="p-2 space-y-2">
              {segments.map(segment => (
                <div
                  key={segment.id}
                  className={`rounded-lg border transition-all ${
                    selectedSegment === segment.id
                      ? 'border-[#00C2FF] bg-[#00C2FF]/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <button
                    onClick={() => setSelectedSegment(segment.id)}
                    className="w-full text-left p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm flex items-center gap-2">
                        <Bookmark className="w-3 h-3 text-[#FF9500]" />
                        {segment.name}
                      </h5>
                    </div>
                    <div className="space-y-1 text-xs text-gray-400">
                      <p>Temps: {segment.start.toFixed(2)}s - {segment.end.toFixed(2)}s</p>
                      <p>Durée: {segment.duration}</p>
                      <p>Fréquence: {segment.frequency}</p>
                    </div>
                  </button>
                  <div className="px-3 pb-2 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-1 h-7 text-xs border-gray-700"
                      onClick={() => handlePlaySegment(segment.id)}
                    >
                      {playingSegment === segment.id ? (
                        <Pause className="w-3 h-3" />
                      ) : (
                        <Volume2 className="w-3 h-3" />
                      )}
                      {playingSegment === segment.id ? 'Pause' : 'Écouter'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 hover:bg-red-500/20 hover:text-red-400"
                      onClick={() => handleDeleteSegment(segment.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {segments.length === 0 && (
                <div className="text-xs text-gray-500 text-center py-8">
                  Aucune zone créée.
                  <br />
                  Glissez sur le spectrogramme pour créer une zone.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-14 border-b border-[var(--app-border)] px-4 flex items-center gap-2">
          {leftPanelCollapsed && (
            <button onClick={() => setLeftPanelCollapsed(false)} className="hover:bg-gray-700 p-2 rounded">
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="gap-2 border-gray-700"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Lecture'}
          </Button>
          <div className="w-px h-6 bg-gray-700" />
          <Button variant="ghost" size="sm" onClick={() => setZoom(zoom * 1.5)} className="gap-1">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setZoom(Math.max(1, zoom / 1.5))} className="gap-1">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-gray-400">Zoom: {zoom.toFixed(1)}x</span>
          <div className="flex-1" />
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 bg-[#FF9500] hover:bg-[#E08600] text-black border-0"
          >
            <Scissors className="w-4 h-4" />
            Mode sélection
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="gap-2 border-gray-700 hover:bg-gray-800"
          >
            <X className="w-4 h-4" />
            Fermer
          </Button>
        </div>

        {/* Spectrogram Viewer */}
        <div className="flex-1 flex flex-col p-4 gap-4">
          {/* Spectrogram */}
          <div className="flex-1 bg-[var(--waveform-bg)] rounded-lg border border-[var(--app-border)] overflow-auto flex items-center justify-center p-4">
            <Spectrogram 
              width={1200 * zoom}
              height={400}
              onRegionSelect={handleRegionSelect}
            />
          </div>

          {/* Waveform Timeline */}
          <div className="bg-[var(--waveform-bg)] rounded-lg p-4">
            <div className="mb-2">
              <label className="text-xs text-muted-foreground">Vue d&apos;ensemble (waveform)</label>
            </div>
            <Waveform
              width={1200 * zoom}
              height={80}
              currentTime={currentTime}
              duration={totalDuration}
              onSeek={(time) => setCurrentTime(time)}
              regions={segments.map(seg => ({
                start: seg.start,
                end: seg.end,
                color: 'rgba(255, 149, 0, 0.2)'
              }))}
            />
          </div>

          {/* Timeline Controls */}
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              onValueChange={([value]) => setCurrentTime(value)}
              max={totalDuration}
              step={0.01}
              className="w-full"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{currentTime.toFixed(2)}s</span>
              <span>{totalDuration.toFixed(2)}s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Segment Properties */}
      {!rightPanelCollapsed && (
        <div className="w-80 border-l border-[var(--app-border)] bg-[var(--app-panel)] flex flex-col">
          <div className="p-3 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-sm">Propriétés de la zone</h3>
            <button onClick={() => setRightPanelCollapsed(true)} className="hover:bg-gray-700 p-1 rounded">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {selectedSegment ? (
              <div className="space-y-4">
                {(() => {
                  const segment = segments.find(s => s.id === selectedSegment);
                  if (!segment) return null;
                  
                  return (
                    <>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Nom de la zone</label>
                        <Input 
                          defaultValue={segment.name}
                          onChange={(e) => {
                            const updated = segments.map(s => 
                              s.id === selectedSegment ? { ...s, name: e.target.value } : s
                            );
                            setSegments(updated);
                          }}
                          className="bg-[#0D1117] border-gray-700 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Temps de début</label>
                        <p className="text-sm">{segment.start.toFixed(3)}s</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Temps de fin</label>
                        <p className="text-sm">{segment.end.toFixed(3)}s</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Durée</label>
                        <p className="text-sm">{segment.duration}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Plage de fréquence</label>
                        <p className="text-sm">{segment.frequency}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Notes</label>
                        <Textarea
                          placeholder="Ajouter des observations sur cette zone..."
                          className="bg-[#0D1117] border-gray-700 text-sm"
                          rows={4}
                        />
                      </div>
                      <div className="pt-2 space-y-2">
                        <Button className="w-full gap-2 bg-[#00C2FF] hover:bg-[#00A8E0] text-black">
                          <Play className="w-4 h-4" />
                          Analyser cette zone
                        </Button>
                        <Button 
                          variant="outline"
                          className="w-full gap-2 border-gray-700"
                          onClick={() => handlePlaySegment(selectedSegment)}
                        >
                          <Volume2 className="w-4 h-4" />
                          Écouter la zone
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="text-sm text-gray-400">
                Sélectionnez une zone pour voir ses propriétés
              </div>
            )}
          </div>
        </div>
      )}

      {rightPanelCollapsed && (
        <button
          onClick={() => setRightPanelCollapsed(false)}
          className="border-l border-gray-800 hover:bg-gray-800 px-2 flex items-center"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
