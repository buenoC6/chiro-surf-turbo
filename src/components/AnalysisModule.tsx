import { useState } from 'react';
import { Play, Activity, Waves, Zap, ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalysisSegment {
  id: string;
  name: string;
  duration: number;
  fi: number;
  ft: number;
  fmax: number;
  bandwidth: number;
}

const mockAnalysisSegments: AnalysisSegment[] = [
  { id: '1', name: 'Zone A', duration: 150, fi: 48.2, ft: 38.5, fmax: 52.1, bandwidth: 13.6 },
  { id: '2', name: 'Zone B', duration: 200, fi: 45.8, ft: 35.2, fmax: 48.9, bandwidth: 13.7 },
];

const mockTimeFreqData = [
  { time: 0, freq: 48 },
  { time: 20, freq: 50 },
  { time: 40, freq: 52 },
  { time: 60, freq: 49 },
  { time: 80, freq: 46 },
  { time: 100, freq: 42 },
  { time: 120, freq: 39 },
  { time: 140, freq: 38 },
];

interface AnalysisModuleProps {
  audioFile: {
    id: string;
    name: string;
    duration: string;
    sampleRate: string;
    sourceName: string;
    importName: string;
  };
}

export default function AnalysisModule({ audioFile }: AnalysisModuleProps) {
  const [selectedSegment, setSelectedSegment] = useState<string>('1');
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);

  const currentSegment = mockAnalysisSegments.find(s => s.id === selectedSegment);

  return (
    <div className="h-full flex">
      {/* Left Panel - Segments */}
      {!leftPanelCollapsed && (
        <div className="w-72 border-r border-[var(--app-border)] bg-[var(--app-panel)] flex flex-col">
          <div className="p-3 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-sm">Segments analyser</h3>
            <button onClick={() => setLeftPanelCollapsed(true)} className="hover:bg-gray-700 p-1 rounded">
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {mockAnalysisSegments.map(segment => (
              <button
                key={segment.id}
                onClick={() => setSelectedSegment(segment.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedSegment === segment.id
                    ? 'border-[#8B5CF6] bg-[#8B5CF6]/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <h4 className="text-sm mb-2">{segment.name}</h4>
                <div className="space-y-1 text-xs text-gray-400">
                  <p>Durée: {segment.duration} ms</p>
                  <p>FI: {segment.fi} kHz</p>
                  <p>FT: {segment.ft} kHz</p>
                </div>
              </button>
            ))}
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
          <Button variant="outline" size="sm" className="gap-2 border-gray-700">
            <Volume2 className="w-4 h-4" />
            Écouter zone
          </Button>
          <div className="w-px h-6 bg-gray-700" />
          <Badge variant="outline" className="gap-1.5 border-[#8B5CF6] text-[#8B5CF6]">
            <Activity className="w-3 h-3" />
            {mockAnalysisSegments.length} segments
          </Badge>
          <div className="flex-1" />
          <Button className="gap-2 bg-[#00C2FF] hover:bg-[#00A8E0] text-black">
            Exporter données
          </Button>
        </div>

        {/* Analysis View */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Spectrogram Detail */}
            <div>
              <h3 className="text-sm mb-3 flex items-center gap-2">
                <Waves className="w-4 h-4 text-[#8B5CF6]" />
                Spectrogramme détaillé
              </h3>
              <div className="bg-[#0D1117] rounded-lg border border-gray-800 h-64 flex items-center justify-center">
                <p className="text-gray-500">Canvas spectrogramme détaillé</p>
              </div>
            </div>

            {/* Measurements Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#FF9500]" />
                  Paramètres acoustiques
                </h3>
                <div className="bg-[#161B22] rounded-lg border border-gray-800 p-4 space-y-3">
                  {currentSegment && (
                    <>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                        <span className="text-sm text-gray-400">Durée totale</span>
                        <span className="text-sm">{currentSegment.duration} ms</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                        <span className="text-sm text-gray-400">FI (Fréq. initiale)</span>
                        <span className="text-sm text-[#FF9500]">{currentSegment.fi} kHz</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                        <span className="text-sm text-gray-400">FT (Fréq. terminale)</span>
                        <span className="text-sm text-[#FF9500]">{currentSegment.ft} kHz</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                        <span className="text-sm text-gray-400">Fmax (Fréq. max)</span>
                        <span className="text-sm text-[#00C2FF]">{currentSegment.fmax} kHz</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Bande passante</span>
                        <span className="text-sm">{currentSegment.bandwidth} kHz</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#00C2FF]" />
                  Évolution temporelle
                </h3>
                <div className="bg-[#161B22] rounded-lg border border-gray-800 p-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={mockTimeFreqData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis 
                        dataKey="time" 
                        stroke="#6b7280"
                        label={{ value: 'Temps (ms)', position: 'insideBottom', offset: -5, fill: '#6b7280' }}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        label={{ value: 'Fréquence (kHz)', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                        labelStyle={{ color: '#9ca3af' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="freq" 
                        stroke="#8B5CF6" 
                        strokeWidth={2}
                        dot={{ fill: '#8B5CF6', r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-end pt-4">
              <Button className="w-full bg-[#00C2FF] hover:bg-[#00A8E0] text-black">
                Valider et passer interprétation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
