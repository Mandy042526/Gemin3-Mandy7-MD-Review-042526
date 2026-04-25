import React from 'react';
import { useAppStore } from '@/src/store';
import { useTranslation } from '@/src/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';

const THEMES = [
  'light', 'dark', 'starry-night', 'sunflowers', 'mona-lisa', 'scream', 
  'persistence-of-memory', 'girl-with-pearl-earring', 'birth-of-venus', 
  'creation-of-adam', 'guernica', 'kiss', 'water-lilies', 'night-watch', 
  'las-meninas', 'arnolfini-portrait', 'school-of-athens', 'wanderer', 
  'impression-sunrise', 'great-wave', 'cafe-terrace', 'american-gothic'
];

const MODELS = [
  'gemini-2.5-flash', 'gemini-3-flash-preview', 'gemini-3.1-flash-lite-preview',
  'gpt-4o-mini', 'gpt-4.1-mini', 'grok-4-fast-reasoning', 'grok-3-mini'
];

export function Settings() {
  const state = useAppStore();
  const t = useTranslation(state.language);
  
  const hasEnvKey = !!process.env.GEMINI_API_KEY;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('settings')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Language */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('language')}</label>
            <div className="flex space-x-2">
              <Button 
                variant={state.language === 'en' ? 'default' : 'outline'}
                onClick={() => state.setLanguage('en')}
              >
                English
              </Button>
              <Button 
                variant={state.language === 'zh-TW' ? 'default' : 'outline'}
                onClick={() => state.setLanguage('zh-TW')}
              >
                繁體中文
              </Button>
            </div>
          </div>

          {/* Theme */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('theme')}</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {THEMES.map(theme => (
                <Button
                  key={theme}
                  variant={state.theme === theme ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => state.setTheme(theme as any)}
                  className="capitalize text-xs"
                >
                  {theme.replace(/-/g, ' ')}
                </Button>
              ))}
            </div>
          </div>

          {/* API Key */}
          {!hasEnvKey && (
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('apiKey')}</label>
              <Input 
                type="password" 
                value={state.apiKey}
                onChange={(e) => state.setApiKey(e.target.value)}
                placeholder={t('apiKeyPlaceholder')}
              />
              <p className="text-xs text-muted-foreground">{t('apiKeyHelp')}</p>
            </div>
          )}
          {hasEnvKey && (
            <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">
              API Key loaded from environment.
            </div>
          )}

          {/* LLM Defaults */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-medium">LLM Defaults</h4>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('defaultModel')}</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={state.defaultModel}
                onChange={(e) => state.setDefaultModel(e.target.value)}
              >
                {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('maxTokens')}</label>
                <Input 
                  type="number" 
                  value={state.maxTokens}
                  onChange={(e) => state.setMaxTokens(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('temperature')}</label>
                <Input 
                  type="number" 
                  step="0.1"
                  min="0"
                  max="2"
                  value={state.temperature}
                  onChange={(e) => state.setTemperature(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
