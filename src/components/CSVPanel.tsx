import { useEffect } from 'react';
import { X, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
} from 'recharts';
import type { TaxonContact } from '../App';

interface CSVPanelProps {
  csvLoaded: boolean;
  contacts: TaxonContact[];
  setContacts: (contacts: TaxonContact[]) => void;
  onContactClick: (contact: TaxonContact) => void;
  onClose: () => void;
}

// Mock data for demonstration
const MOCK_TAXA = [
  { name: 'Pipistrellus pipistrellus', count: 45, avgConfidence: 0.92 },
  { name: 'Pipistrellus kuhlii', count: 23, avgConfidence: 0.78 },
  { name: 'Nyctalus noctula', count: 15, avgConfidence: 0.85 },
  { name: 'Eptesicus serotinus', count: 12, avgConfidence: 0.68 },
  { name: 'Myotis myotis', count: 8, avgConfidence: 0.55 },
  { name: 'Barbastella barbastellus', count: 5, avgConfidence: 0.43 },
];

function generateMockContacts(): TaxonContact[] {
  const contacts: TaxonContact[] = [];
  let id = 0;

  MOCK_TAXA.forEach((taxon) => {
    for (let i = 0; i < taxon.count; i++) {
      const variance = (Math.random() - 0.5) * 0.3;
      const confidence = Math.max(0.1, Math.min(1, taxon.avgConfidence + variance));
      
      contacts.push({
        id: `contact-${id++}`,
        taxon: taxon.name,
        confidence: parseFloat(confidence.toFixed(2)),
        timestamp: Math.random() * 3600,
        filename: `recording_${Math.floor(Math.random() * 100)}.wav`,
      });
    }
  });

  return contacts.sort((a, b) => a.timestamp - b.timestamp);
}

export function CSVPanel({
  csvLoaded,
  contacts,
  setContacts,
  onContactClick,
  onClose,
}: CSVPanelProps) {
  useEffect(() => {
    if (csvLoaded && contacts.length === 0) {
      setContacts(generateMockContacts());
    }
  }, [csvLoaded, contacts.length, setContacts]);

  if (!csvLoaded) {
    return null;
  }

  // Calculate statistics
  const taxaStats = MOCK_TAXA.map(taxon => {
    const taxonContacts = contacts.filter(c => c.taxon === taxon.name);
    const validated = taxonContacts.filter(c => c.validated).length;
    const high = taxonContacts.filter(c => c.confidence >= 0.9).length;
    const medium = taxonContacts.filter(c => c.confidence >= 0.5 && c.confidence < 0.9).length;
    const low = taxonContacts.filter(c => c.confidence < 0.5).length;

    return {
      name: taxon.name.split(' ')[1], // Genus name
      total: taxonContacts.length,
      validated,
      high,
      medium,
      low,
      maxConfidence: Math.max(...taxonContacts.map(c => c.confidence)),
    };
  });

  const confidenceData = [
    { range: '≥0.9 (Fiable)', count: contacts.filter(c => c.confidence >= 0.9).length },
    { range: '0.7-0.9', count: contacts.filter(c => c.confidence >= 0.7 && c.confidence < 0.9).length },
    { range: '0.5-0.7', count: contacts.filter(c => c.confidence >= 0.5 && c.confidence < 0.7).length },
    { range: '<0.5 (À vérifier)', count: contacts.filter(c => c.confidence < 0.5).length },
  ];

  return (
    <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-300 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-300 dark:border-gray-700 flex items-center justify-between">
        <h2 className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Graphiques Tadarida
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Nombre de contacts par taxon */}
          <Card className="p-4 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700">
            <h3 className="mb-4 text-sm">Contacts par Taxon</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={taxaStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                />
                <Bar dataKey="total" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Répartition par confiance */}
          <Card className="p-4 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700">
            <h3 className="mb-4 text-sm">Répartition par Confiance</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={confidenceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="range"
                  tick={{ fill: '#9ca3af', fontSize: 10 }}
                  width={100}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                />
                <Bar dataKey="count">
                  {confidenceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === 0
                          ? '#10b981'
                          : index === 1
                          ? '#3b82f6'
                          : index === 2
                          ? '#f59e0b'
                          : '#ef4444'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Contacts au cours du temps */}
          <Card className="p-4 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700">
            <h3 className="mb-4 text-sm">Contacts au cours du temps</h3>
            <ResponsiveContainer width="100%" height={200}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="timestamp"
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                  label={{ value: 'Temps (s)', position: 'bottom', fill: '#9ca3af' }}
                  domain={[0, 3600]}
                />
                <YAxis
                  dataKey="confidence"
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                  label={{ value: 'Confiance', angle: -90, position: 'left', fill: '#9ca3af' }}
                  domain={[0, 1]}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  content={({ payload }) => {
                    if (!payload?.[0]) return null;
                    const contact = payload[0].payload as TaxonContact;
                    return (
                      <div className="bg-gray-900 border border-gray-700 p-2 rounded text-xs">
                        <div>{contact.taxon.split(' ')[1]}</div>
                        <div>Confiance: {contact.confidence}</div>
                        <div className="text-gray-400">Clic pour ouvrir</div>
                      </div>
                    );
                  }}
                />
                <Scatter
                  data={contacts}
                  fill="#8b5cf6"
                  onClick={(data: TaxonContact) => onContactClick(data)}
                  cursor="pointer"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </Card>

          {/* Liste des taxons pour validation */}
          <Card className="p-4 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700">
            <h3 className="mb-4 text-sm">Workflow de Validation</h3>
            <div className="space-y-2">
              {taxaStats
                .sort((a, b) => b.maxConfidence - a.maxConfidence)
                .map((taxon) => (
                  <div
                    key={taxon.name}
                    className="p-3 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 hover:border-blue-600 cursor-pointer transition-colors"
                    onClick={() => {
                      const contact = contacts
                        .filter(c => c.taxon.includes(taxon.name))
                        .sort((a, b) => b.confidence - a.confidence)[0];
                      if (contact) onContactClick(contact);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">{taxon.name}</span>
                      <Badge
                        variant="outline"
                        className={
                          taxon.maxConfidence >= 0.9
                            ? 'bg-green-900/30 text-green-300 border-green-700'
                            : taxon.maxConfidence >= 0.5
                            ? 'bg-blue-900/30 text-blue-300 border-blue-700'
                            : 'bg-red-900/30 text-red-300 border-red-700'
                        }
                      >
                        Max: {taxon.maxConfidence.toFixed(2)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                      <span>{taxon.total} contacts</span>
                      {taxon.validated > 0 && (
                        <span className="flex items-center gap-1 text-green-400">
                          <CheckCircle2 className="w-3 h-3" />
                          {taxon.validated} validés
                        </span>
                      )}
                      {taxon.low > 0 && (
                        <span className="flex items-center gap-1 text-yellow-400">
                          <AlertCircle className="w-3 h-3" />
                          {taxon.low} à vérifier
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
