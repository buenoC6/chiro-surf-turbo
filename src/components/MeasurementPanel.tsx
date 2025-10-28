import type { Measurement } from '../App';
import { Badge } from './ui/badge';

interface MeasurementPanelProps {
  measurements: Measurement;
}

export function MeasurementPanel({ measurements }: MeasurementPanelProps) {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 px-4 py-2 flex items-center gap-6">
      {measurements.duration !== undefined && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">Durée:</span>
          <Badge variant="outline" className="bg-orange-900/30 text-orange-300 border-orange-700">
            {measurements.duration.toFixed(2)} ms
          </Badge>
        </div>
      )}

      {measurements.fi !== undefined && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">FI:</span>
          <Badge variant="outline" className="bg-green-900/30 text-green-300 border-green-700">
            {measurements.fi} kHz
          </Badge>
        </div>
      )}

      {measurements.ft !== undefined && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">FT:</span>
          <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-700">
            {measurements.ft} kHz
          </Badge>
        </div>
      )}

      {measurements.lb !== undefined && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">LB:</span>
          <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-700">
            {measurements.lb} kHz
          </Badge>
        </div>
      )}

      {measurements.fme !== undefined && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">FME:</span>
          <Badge variant="outline" className="bg-yellow-900/30 text-yellow-300 border-yellow-700">
            {measurements.fme} kHz
          </Badge>
          <span className="text-xs text-gray-600 dark:text-gray-500 italic">
            (Fréquence Maximum Énergie)
          </span>
        </div>
      )}

      {Object.keys(measurements).length === 0 && (
        <span className="text-xs text-gray-600 dark:text-gray-500 italic">
          Sélectionnez un outil de mesure et tracez sur le sonagramme
        </span>
      )}
    </div>
  );
}
