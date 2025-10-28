import { FolderOpen, Palette, Volume2, Zap, Database, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';

interface SettingsPanelProps {
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export function SettingsPanel({ theme, onThemeChange }: SettingsPanelProps) {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="general">Général</TabsTrigger>
        <TabsTrigger value="appearance">Apparence</TabsTrigger>
        <TabsTrigger value="paths">Chemins</TabsTrigger>
        <TabsTrigger value="audio">Audio</TabsTrigger>
        <TabsTrigger value="about">À propos</TabsTrigger>
      </TabsList>

      <ScrollArea className="h-[500px] mt-4">
        <TabsContent value="general" className="space-y-6 pr-4">
          <div className="space-y-4">
            <div>
              <h3 className="mb-3">Mode d'analyse</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-mode">Détection automatique mode Chiro/Auto</Label>
                  <Switch id="auto-mode" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-save">Sauvegarde automatique CSV_Vu</Label>
                  <Switch id="auto-save" defaultChecked />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3">FFT & Spectrogramme</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="fft-size">Taille FFT</Label>
                  <Select defaultValue="512">
                    <SelectTrigger id="fft-size">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="256">256</SelectItem>
                      <SelectItem value="512">512</SelectItem>
                      <SelectItem value="1024">1024</SelectItem>
                      <SelectItem value="2048">2048</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="window">Fenêtrage</Label>
                  <Select defaultValue="hamming">
                    <SelectTrigger id="window">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hamming">Hamming</SelectItem>
                      <SelectItem value="hann">Hann</SelectItem>
                      <SelectItem value="blackman">Blackman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3">Validation</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-confidence">Afficher seuil de confiance</Label>
                  <Switch id="show-confidence" defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confidence-threshold">Seuil validation automatique</Label>
                  <Select defaultValue="0.9">
                    <SelectTrigger id="confidence-threshold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.7">70%</SelectItem>
                      <SelectItem value="0.8">80%</SelectItem>
                      <SelectItem value="0.9">90%</SelectItem>
                      <SelectItem value="0.95">95%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6 pr-4">
          <div className="space-y-4">
            <div>
              <h3 className="mb-3">Thème</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onThemeChange('light')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === 'light'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="w-full h-20 bg-gradient-to-br from-white to-gray-100 rounded mb-2 border border-gray-200" />
                  <p className="text-sm">Clair</p>
                </button>
                <button
                  onClick={() => onThemeChange('dark')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === 'dark'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="w-full h-20 bg-gradient-to-br from-gray-900 to-gray-800 rounded mb-2 border border-gray-700" />
                  <p className="text-sm">Sombre</p>
                </button>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3">Spectrogramme</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="default-view">Vue par défaut</Label>
                  <Select defaultValue="energie">
                    <SelectTrigger id="default-view">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="forme">Forme</SelectItem>
                      <SelectItem value="energie">Énergie</SelectItem>
                      <SelectItem value="variations">Variations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-luminosity">Luminosité par défaut</Label>
                  <Select defaultValue="absolue">
                    <SelectTrigger id="default-luminosity">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="absolue">Absolue (signaux faibles visibles)</SelectItem>
                      <SelectItem value="relative">Relative (comparaison intensité)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color-scheme">Palette de couleurs</Label>
                  <Select defaultValue="hot">
                    <SelectTrigger id="color-scheme">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hot">Hot (rouge-jaune)</SelectItem>
                      <SelectItem value="viridis">Viridis</SelectItem>
                      <SelectItem value="plasma">Plasma</SelectItem>
                      <SelectItem value="grayscale">Niveaux de gris</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3">Interface</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-grid">Afficher la grille</Label>
                  <Switch id="show-grid" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-labels">Afficher les labels de fréquence</Label>
                  <Switch id="show-labels" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="tooltips">Infobulles détaillées</Label>
                  <Switch id="tooltips" defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="paths" className="space-y-6 pr-4">
          <div className="space-y-4">
            <div>
              <h3 className="mb-3">Dossiers de travail</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="csv-folder">Dossier CSV Tadarida</Label>
                  <div className="flex gap-2">
                    <Input
                      id="csv-folder"
                      placeholder="/chemin/vers/csv"
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon">
                      <FolderOpen className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ref-folder">Dossier référentiels CESCO</Label>
                  <div className="flex gap-2">
                    <Input
                      id="ref-folder"
                      placeholder="/chemin/vers/referentiels"
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon">
                      <FolderOpen className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes-folder">Dossier notes personnelles</Label>
                  <div className="flex gap-2">
                    <Input
                      id="notes-folder"
                      placeholder="/chemin/vers/notes"
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon">
                      <FolderOpen className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="export-folder">Dossier d'export</Label>
                  <div className="flex gap-2">
                    <Input
                      id="export-folder"
                      placeholder="/chemin/vers/exports"
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon">
                      <FolderOpen className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3">Options d'archivage</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-copy">Copie automatique WAV annotés</Label>
                  <Switch id="auto-copy" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="create-notes">Créer notes TXT automatiquement</Label>
                  <Switch id="create-notes" defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audio" className="space-y-6 pr-4">
          <div className="space-y-4">
            <div>
              <h3 className="mb-3">Lecture audio</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="heterodyne">Simulation hétérodyne activée</Label>
                  <Switch id="heterodyne" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-beat">Calcul auto battement optimal</Label>
                  <Switch id="auto-beat" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="noise-filter">Filtrage parasites</Label>
                  <Switch id="noise-filter" defaultChecked />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3">Volume et vitesse</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="volume">Volume principal</Label>
                    <span className="text-sm text-gray-500">75%</span>
                  </div>
                  <input
                    type="range"
                    id="volume"
                    min="0"
                    max="100"
                    defaultValue="75"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="playback-speed">Vitesse de lecture</Label>
                  <Select defaultValue="1">
                    <SelectTrigger id="playback-speed">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">0.5x</SelectItem>
                      <SelectItem value="0.75">0.75x</SelectItem>
                      <SelectItem value="1">1x (normal)</SelectItem>
                      <SelectItem value="1.25">1.25x</SelectItem>
                      <SelectItem value="1.5">1.5x</SelectItem>
                      <SelectItem value="2">2x</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="about" className="space-y-6 pr-4">
          <div className="space-y-4">
            <div className="text-center py-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-12 h-12 text-white"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
                  <path d="M12 6v12M6 12h12" />
                  <path d="M8 8l8 8M16 8l-8 8" opacity="0.5" />
                </svg>
              </div>
              <h2 className="text-2xl mb-1">ChiroSurf</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Version 1.0.0</p>
              <p className="text-sm text-gray-500">Application d'analyse bioacoustique</p>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Database className="w-5 h-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm mb-1">Vigie-Chiro</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Programme de sciences participatives du Muséum national d'Histoire naturelle
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-purple-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm mb-1">Technologies</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Tauri • React • TypeScript • Tailwind CSS
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm mb-1">Support</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    macOS 10.15+ • Windows 10+
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="text-center space-y-2">
              <Button variant="outline" className="w-full">
                Vérifier les mises à jour
              </Button>
              <Button variant="ghost" className="w-full" size="sm">
                Documentation en ligne
              </Button>
            </div>

            <Separator />

            <p className="text-xs text-center text-gray-500">
              © 2025 ChiroSurf • Tous droits réservés
            </p>
          </div>
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
}
