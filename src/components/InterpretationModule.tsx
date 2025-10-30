import { useState } from 'react';
import { Check, X, Download, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface TaxonIdentification {
  id: string;
  segmentName: string;
  species: string;
  confidence: number;
  validated: boolean;
  notes: string;
}

const mockIdentifications: TaxonIdentification[] = [
  { id: '1', segmentName: 'Zone A', species: 'Pipistrellus pipistrellus', confidence: 92, validated: true, notes: 'Signal clair' },
  { id: '2', segmentName: 'Zone B', species: 'Pipistrellus kuhlii', confidence: 78, validated: false, notes: '' },
  { id: '3', segmentName: 'Zone C', species: 'Nyctalus leisleri', confidence: 65, validated: false, notes: 'À confirmer' },
  { id: '4', segmentName: 'Zone D', species: 'Pipistrellus pipistrellus', confidence: 88, validated: true, notes: '' },
];

interface InterpretationModuleProps {
  audioFile: {
    id: string;
    name: string;
    duration: string;
    sampleRate: string;
    sourceName: string;
    importName: string;
  };
}

export default function InterpretationModule({ audioFile }: InterpretationModuleProps) {
  const [selectedTaxon, setSelectedTaxon] = useState<string>('1');
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [confidenceFilter, setConfidenceFilter] = useState('all');

  const currentTaxon = mockIdentifications.find(t => t.id === selectedTaxon);

  const stats = {
    total: mockIdentifications.length,
    validated: mockIdentifications.filter(t => t.validated).length,
    pending: mockIdentifications.filter(t => !t.validated).length,
    avgConfidence: Math.round(
      mockIdentifications.reduce((sum, t) => sum + t.confidence, 0) / mockIdentifications.length
    ),
  };

  return (
    <div className="h-full flex">
      {/* Left Panel - Identifications */}
      {!leftPanelCollapsed && (
        <div className="w-80 border-r border-[var(--app-border)] bg-[var(--app-panel)] flex flex-col">
          <div className="p-3 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-sm">Identifications</h3>
            <button onClick={() => setLeftPanelCollapsed(true)} className="hover:bg-gray-700 p-1 rounded">
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Filter */}
          <div className="p-3 border-b border-gray-800">
            <select
              value={confidenceFilter}
              onChange={(e) => setConfidenceFilter(e.target.value)}
              className="w-full bg-[#0D1117] border border-gray-700 rounded px-2 py-1.5 text-sm"
            >
              <option value="all">Tous les segments</option>
              <option value="validated">Validés uniquement</option>
              <option value="pending">À vérifier</option>
            </select>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {mockIdentifications
              .filter(t => {
                if (confidenceFilter === 'validated') return t.validated;
                if (confidenceFilter === 'pending') return !t.validated;
                return true;
              })
              .map(taxon => (
                <button
                  key={taxon.id}
                  onClick={() => setSelectedTaxon(taxon.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedTaxon === taxon.id
                      ? 'border-[#00C2FF] bg-[#00C2FF]/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm italic">{taxon.species}</h4>
                    {taxon.validated ? (
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="space-y-1 text-xs text-gray-400">
                    <p>{taxon.segmentName}</p>
                    <p>Confiance: {taxon.confidence}%</p>
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
          <Badge variant="outline" className="gap-1.5">
            {stats.validated}/{stats.total} validés
          </Badge>
          <Badge variant="outline" className="gap-1.5 border-orange-500 text-orange-500">
            {stats.pending} à vérifier
          </Badge>
          <div className="flex-1" />
          <Button className="gap-2 bg-[#00C2FF] hover:bg-[#00A8E0] text-black">
            <Download className="w-4 h-4" />
            Exporter CSV
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-[#161B22] border border-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-1">Total segments</p>
                <p className="text-2xl">{stats.total}</p>
              </div>
              <div className="bg-[#161B22] border border-green-900 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-1">Validés</p>
                <p className="text-2xl text-green-500">{stats.validated}</p>
              </div>
              <div className="bg-[#161B22] border border-orange-900 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-1">En attente</p>
                <p className="text-2xl text-orange-500">{stats.pending}</p>
              </div>
              <div className="bg-[#161B22] border border-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-1">Confiance moy.</p>
                <p className="text-2xl">{stats.avgConfidence}%</p>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-[#161B22] border border-gray-800 rounded-lg p-4">
              <h3 className="text-sm mb-3">Synthèse des observations</h3>
              <div className="text-sm text-gray-300 space-y-2">
                <p>• Présence régulière de <span className="italic">P. pipistrellus</span> et <span className="italic">P. kuhlii</span></p>
                <p>• Présence régulière de <span className="italic">P. kuhlii</span> en milieu urbain</p>
                <p>• <span className="italic">Nyctalus leisleri</span> observé principalement en transit (confiance vérifier)</p>
              </div>
            </div>

            {/* Species List */}
            <div className="bg-[#161B22] border border-gray-800 rounded-lg p-4">
              <h3 className="text-sm mb-3">Espèces identifiées</h3>
              <div className="space-y-2">
                {[...new Set(mockIdentifications.map(t => t.species))].map(species => {
                  const count = mockIdentifications.filter(t => t.species === species).length;
                  const avgConf = Math.round(
                    mockIdentifications
                      .filter(t => t.species === species)
                      .reduce((sum, t) => sum + t.confidence, 0) / count
                  );
                  return (
                    <div key={species} className="flex items-center justify-between p-2 hover:bg-gray-800 rounded">
                      <span className="text-sm italic">{species}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">{count} segments</span>
                        <Badge variant="outline" className="text-xs">
                          {avgConf}% confiance
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Details */}
      {!rightPanelCollapsed && currentTaxon && (
        <div className="w-80 border-l border-[var(--app-border)] bg-[var(--app-panel)] flex flex-col">
          <div className="p-3 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-sm">Détails</h3>
            <button onClick={() => setRightPanelCollapsed(true)} className="hover:bg-gray-700 p-1 rounded">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Espèce</label>
              <Input
                value={currentTaxon.species}
                className="bg-[#0D1117] border-gray-700 text-sm italic"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Segment</label>
              <Input
                value={currentTaxon.segmentName}
                className="bg-[#0D1117] border-gray-700 text-sm"
                readOnly
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Niveau de confiance</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-800 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-[#00C2FF]"
                    style={{ width: `${currentTaxon.confidence}%` }}
                  />
                </div>
                <span className="text-sm">{currentTaxon.confidence}%</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Statut</label>
              <Badge
                variant="outline"
                className={
                  currentTaxon.validated
                    ? 'border-green-500 text-green-500'
                    : 'border-orange-500 text-orange-500'
                }
              >
                {currentTaxon.validated ? 'Validé' : 'Vérifier'}
              </Badge>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Notes</label>
              <Textarea
                defaultValue={currentTaxon.notes}
                placeholder="Ajouter des notes..."
                className="bg-[#0D1117] border-gray-700 text-sm"
                rows={3}
              />
            </div>
            <div className="space-y-2 pt-2">
              <Button variant="outline" className="w-full gap-2 border-green-700 hover:bg-green-900/20 text-green-500">
                <Check className="w-4 h-4" />
                Valider identification
              </Button>
              <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800">
                Corriger identification
              </Button>
              <Button variant="outline" className="w-full gap-2 border-red-700 hover:bg-red-900/20 text-red-500">
                <X className="w-4 h-4" />
                Rejeter
              </Button>
            </div>
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
