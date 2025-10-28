import { X, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface IdentificationPanelProps {
  onClose: () => void;
}

const FME_KEY = [
  {
    range: '20-30 kHz',
    species: ['Nyctalus noctula', 'Nyctalus leisleri'],
    notes: 'Grande taille, vol haut, recherche en espace ouvert',
  },
  {
    range: '27-35 kHz',
    species: ['Eptesicus serotinus'],
    notes: 'Signaux puissants, FM prononcée, activité crépusculaire',
  },
  {
    range: '35-42 kHz',
    species: ['Pipistrellus nathusii'],
    notes: 'Signal assez fort, proche de P. kuhlii',
  },
  {
    range: '40-47 kHz',
    species: ['Pipistrellus kuhlii'],
    notes: 'FME légèrement plus basse que P. pipistrellus',
  },
  {
    range: '45-52 kHz',
    species: ['Pipistrellus pipistrellus'],
    notes: 'Espèce la plus commune, signaux réguliers',
  },
  {
    range: '50-60 kHz',
    species: ['Myotis daubentonii', 'Myotis myotis'],
    notes: 'Chasse près de l\'eau (daubentonii) ou au sol (myotis)',
  },
  {
    range: '32-37 kHz',
    species: ['Barbastella barbastellus'],
    notes: 'Signaux très faibles, difficile à détecter',
  },
  {
    range: '25-35 kHz',
    species: ['Plecotus auritus', 'Plecotus austriacus'],
    notes: 'Signaux extrêmement faibles, oreillons caractéristiques',
  },
];

const SPECIES_INFO = [
  {
    name: 'Pipistrellus pipistrellus',
    common: 'Pipistrelle commune',
    fme: '45-52 kHz',
    characteristics: [
      'Signal FM modulé typique',
      'Durée 3-7 ms',
      'QFC courte en fin de signal',
      'Très commun en milieu urbain',
    ],
  },
  {
    name: 'Pipistrellus kuhlii',
    common: 'Pipistrelle de Kuhl',
    fme: '40-47 kHz',
    characteristics: [
      'FME légèrement plus basse que P. pip',
      'Signal similaire mais plus grave',
      'Espèce méditerranéenne en expansion',
      'Souvent en ville',
    ],
  },
  {
    name: 'Nyctalus noctula',
    common: 'Noctule commune',
    fme: '20-30 kHz',
    characteristics: [
      'Grande taille (envergure 35-40cm)',
      'Vol rapide et haut',
      'Signaux puissants et graves',
      'Chasse insectes en altitude',
    ],
  },
  {
    name: 'Eptesicus serotinus',
    common: 'Sérotine commune',
    fme: '27-35 kHz',
    characteristics: [
      'Signaux très puissants',
      'FM prononcée',
      'Vol lent et papillonnant',
      'Sortie crépusculaire précoce',
    ],
  },
  {
    name: 'Myotis daubentonii',
    common: 'Murin de Daubenton',
    fme: '50-60 kHz',
    characteristics: [
      'Spécialiste de la chasse sur l\'eau',
      'Signaux moyennement puissants',
      'FM courte',
      'Activité toute la nuit',
    ],
  },
  {
    name: 'Barbastella barbastellus',
    common: 'Barbastelle d\'Europe',
    fme: '32-37 kHz',
    characteristics: [
      'Signaux extrêmement faibles',
      'Difficile à détecter',
      'FM très prononcée',
      'Espèce forestière rare',
    ],
  },
];

export function IdentificationPanel({ onClose }: IdentificationPanelProps) {
  return (
    <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-300 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-300 dark:border-gray-700 flex items-center justify-between">
        <h2 className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Aide à l'Identification
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Tabs defaultValue="key" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="key">Clé FME</TabsTrigger>
          <TabsTrigger value="species">Fiches Espèces</TabsTrigger>
          <TabsTrigger value="notes">Mes Notes</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="key" className="p-4 space-y-3 m-0">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Clé simplifiée basée sur la Fréquence Maximum d'Énergie (FME) pour les
              chiroptères français
            </p>

            {FME_KEY.map((item, index) => (
              <Card key={index} className="p-3 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                <div className="flex items-start justify-between mb-2">
                  <span className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-sm">
                    {item.range}
                  </span>
                </div>
                <div className="space-y-1">
                  {item.species.map((species, idx) => (
                    <div key={idx} className="text-sm">
                      {species}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-500 mt-2 italic">{item.notes}</p>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="species" className="p-4 space-y-3 m-0">
            {SPECIES_INFO.map((species, index) => (
              <Card key={index} className="p-4 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                <div className="mb-3">
                  <h3 className="text-sm mb-1">{species.name}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{species.common}</p>
                </div>

                <div className="mb-3">
                  <span className="text-xs text-gray-600 dark:text-gray-500">FME typique:</span>
                  <div className="mt-1 px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-sm inline-block">
                    {species.fme}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-gray-600 dark:text-gray-500 mb-2 block">
                    Caractéristiques:
                  </span>
                  <ul className="space-y-1">
                    {species.characteristics.map((char, idx) => (
                      <li key={idx} className="text-xs text-gray-700 dark:text-gray-300 flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        {char}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="notes" className="p-4 m-0">
            <Card className="p-4 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 border-dashed">
              <p className="text-sm text-gray-600 dark:text-gray-500 text-center">
                Ajoutez vos notes personnalisées, critères d'identification ou photos
                depuis les paramètres de l'application.
              </p>
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm">
                  Configurer dossier de notes
                </Button>
              </div>
            </Card>

            <div className="mt-4 space-y-3">
              <Card className="p-3 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                <h4 className="text-sm mb-2">Formation Vigie-Chiro 2024</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Notes sur les critères spécifiques pour différencier P. pipistrellus
                  de P. kuhlii en zone de chevauchement...
                </p>
              </Card>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
