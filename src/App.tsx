import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { Spectrogram } from './components/Spectrogram';
import { Waveform } from './components/Waveform';
import { MeasurementPanel } from './components/MeasurementPanel';
import { CSVPanel } from './components/CSVPanel';
import { ValidationBar } from './components/ValidationBar';
import { IdentificationPanel } from './components/IdentificationPanel';
import { Toaster } from './components/ui/sonner';

export type ViewMode = 'forme' | 'energie' | 'variations';
export type LuminosityMode = 'absolue' | 'relative';
export type MeasurementMode = 'duration' | 'frequency' | 'fme' | 'qfc' | null;

export interface Measurement {
  duration?: number;
  fi?: number;
  ft?: number;
  lb?: number;
  fme?: number;
}

export interface TaxonContact {
  id: string;
  taxon: string;
  confidence: number;
  timestamp: number;
  filename: string;
  validated?: boolean;
  corrected?: string;
}

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [currentFile, setCurrentFile] = useState<string>('example_recording.wav');
  const [viewMode, setViewMode] = useState<ViewMode>('energie');
  const [luminosityMode, setLuminosityMode] = useState<LuminosityMode>('absolue');
  const [zoomLevel, setZoomLevel] = useState(5);
  const [measurementMode, setMeasurementMode] = useState<MeasurementMode>(null);
  const [measurements, setMeasurements] = useState<Measurement>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [csvLoaded, setCsvLoaded] = useState(false);
  const [showCSVPanel, setShowCSVPanel] = useState(false);
  const [showIdentificationPanel, setShowIdentificationPanel] = useState(false);
  const [selectedContact, setSelectedContact] = useState<TaxonContact | null>(null);
  const [contacts, setContacts] = useState<TaxonContact[]>([]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden">
      <Header theme={theme} onThemeChange={setTheme} />
      
      <Toolbar
        currentFile={currentFile}
        viewMode={viewMode}
        setViewMode={setViewMode}
        luminosityMode={luminosityMode}
        setLuminosityMode={setLuminosityMode}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        measurementMode={measurementMode}
        setMeasurementMode={setMeasurementMode}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        csvLoaded={csvLoaded}
        setCsvLoaded={setCsvLoaded}
        showCSVPanel={showCSVPanel}
        setShowCSVPanel={setShowCSVPanel}
        showIdentificationPanel={showIdentificationPanel}
        setShowIdentificationPanel={setShowIdentificationPanel}
        onFileOpen={setCurrentFile}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 relative bg-black dark:bg-black">
            <Spectrogram
              viewMode={viewMode}
              luminosityMode={luminosityMode}
              zoomLevel={zoomLevel}
              measurementMode={measurementMode}
              onMeasurement={setMeasurements}
            />
          </div>

          <div className="h-24 border-t border-gray-300 dark:border-gray-700">
            <Waveform isPlaying={isPlaying} />
          </div>

          <MeasurementPanel measurements={measurements} />

          {selectedContact && (
            <ValidationBar
              contact={selectedContact}
              onValidate={(validated, corrected) => {
                setContacts(prev =>
                  prev.map(c =>
                    c.id === selectedContact.id
                      ? { ...c, validated, corrected }
                      : c
                  )
                );
                setSelectedContact(null);
              }}
              onClose={() => setSelectedContact(null)}
            />
          )}
        </div>

        {showCSVPanel && (
          <CSVPanel
            csvLoaded={csvLoaded}
            contacts={contacts}
            setContacts={setContacts}
            onContactClick={(contact) => {
              setSelectedContact(contact);
              setCurrentFile(contact.filename);
            }}
            onClose={() => setShowCSVPanel(false)}
          />
        )}

        {showIdentificationPanel && (
          <IdentificationPanel
            onClose={() => setShowIdentificationPanel(false)}
          />
        )}
      </div>

      <div className="h-6 bg-gray-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 px-4 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <span>{currentFile}</span>
        <span>FFT: 512 | Fs: 256kHz | Mode: Chiro</span>
      </div>

      <Toaster />
    </div>
  );
}
