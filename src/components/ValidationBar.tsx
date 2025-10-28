import { Check, X, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import type { TaxonContact } from '../App';
import { useState } from 'react';
import { toast } from 'sonner';

interface ValidationBarProps {
  contact: TaxonContact;
  onValidate: (validated: boolean, corrected?: string) => void;
  onClose: () => void;
}

const TAXA_OPTIONS = [
  'Pipistrellus pipistrellus',
  'Pipistrellus kuhlii',
  'Nyctalus noctula',
  'Eptesicus serotinus',
  'Myotis myotis',
  'Barbastella barbastellus',
  'Plecotus auritus',
  'Myotis daubentonii',
  'Non identifié',
];

export function ValidationBar({ contact, onValidate, onClose }: ValidationBarProps) {
  const [correctedTaxon, setCorrectedTaxon] = useState<string | undefined>();

  const handleValidate = () => {
    onValidate(true, correctedTaxon);
    toast.success('Contact validé et sauvegardé dans CSV_Vu');
  };

  const handleCorrect = () => {
    if (!correctedTaxon) {
      toast.error('Sélectionnez un taxon de correction');
      return;
    }
    onValidate(true, correctedTaxon);
    toast.success(`Contact corrigé: ${correctedTaxon}`);
  };

  const confidenceColor =
    contact.confidence >= 0.9
      ? 'bg-green-900/30 text-green-300 border-green-700'
      : contact.confidence >= 0.5
      ? 'bg-blue-900/30 text-blue-300 border-blue-700'
      : 'bg-red-900/30 text-red-300 border-red-700';

  return (
    <div className="bg-gradient-to-r from-blue-100/50 to-purple-100/50 dark:from-blue-900/30 dark:to-purple-900/30 border-t-2 border-blue-600 p-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center gap-4">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Taxon détecté</div>
            <div className="flex items-center gap-2">
              <span>{contact.taxon}</span>
              <Badge variant="outline" className={confidenceColor}>
                {(contact.confidence * 100).toFixed(0)}%
              </Badge>
            </div>
          </div>

          {contact.confidence < 0.5 && (
            <div className="flex items-center gap-2 text-yellow-400 text-sm">
              <AlertTriangle className="w-4 h-4" />
              Faible confiance - Vérification recommandée
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Corriger en:</span>
          <Select value={correctedTaxon} onValueChange={setCorrectedTaxon}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sélectionner taxon" />
            </SelectTrigger>
            <SelectContent>
              {TAXA_OPTIONS.map((taxon) => (
                <SelectItem key={taxon} value={taxon}>
                  {taxon}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {correctedTaxon ? (
            <Button onClick={handleCorrect} className="bg-orange-600 hover:bg-orange-700">
              <Check className="w-4 h-4 mr-2" />
              Corriger
            </Button>
          ) : (
            <Button onClick={handleValidate} className="bg-green-600 hover:bg-green-700">
              <Check className="w-4 h-4 mr-2" />
              Valider
            </Button>
          )}

          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Annuler
          </Button>
        </div>
      </div>
    </div>
  );
}
