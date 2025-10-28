import { Settings, Moon, Sun, Monitor } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useState } from 'react';
import { SettingsPanel } from './SettingsPanel';

interface HeaderProps {
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export function Header({ theme, onThemeChange }: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <header className="relative h-16 border-b border-gray-200/20 dark:border-gray-700/50 overflow-hidden">
        {/* Liquid glass background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20" />
        <div className="absolute inset-0 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Content */}
        <div className="relative h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo with gradient */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg blur-lg opacity-50" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-6 h-6 text-white"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
                    <path d="M12 6v12M6 12h12" />
                    <path d="M8 8l8 8M16 8l-8 8" opacity="0.5" />
                  </svg>
                </div>
              </div>
              
              <div>
                <h1 className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  ChiroSurf
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400 -mt-0.5">
                  Analyse bioacoustique
                </p>
              </div>
            </div>

            {/* Platform badges */}
            <div className="hidden md:flex items-center gap-2 ml-4">
              <div className="px-2 py-1 rounded-md bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 flex items-center gap-1.5">
                <Monitor className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400">macOS</span>
              </div>
              <div className="px-2 py-1 rounded-md bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 flex items-center gap-1.5">
                <Monitor className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Windows</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-2">
                    {theme === 'dark' ? (
                      <Moon className="w-4 h-4" />
                    ) : (
                      <Sun className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">Thème</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50">
                <DropdownMenuLabel>Apparence</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onThemeChange('light')}>
                  <Sun className="w-4 h-4 mr-2" />
                  Clair
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onThemeChange('dark')}>
                  <Moon className="w-4 h-4 mr-2" />
                  Sombre
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Paramètres</span>
              </div>
            </Button>
          </div>
        </div>
      </header>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50">
          <DialogHeader>
            <DialogTitle>Paramètres</DialogTitle>
          </DialogHeader>
          <SettingsPanel theme={theme} onThemeChange={onThemeChange} />
        </DialogContent>
      </Dialog>
    </>
  );
}
