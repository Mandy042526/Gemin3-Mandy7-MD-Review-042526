import React, { useState } from 'react';
import { useAppStore } from '@/src/store';
import { useTranslation } from '@/src/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Textarea } from '@/src/components/ui/Textarea';
import { generateText } from '@/src/services/llm';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export function NoteKeeper() {
  const { language, addRunHistory } = useAppStore();
  const t = useTranslation(language);
  
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');

  const handleMagic = async (magicType: string) => {
    if (!input) return;
    setStatus('running');
    try {
      let prompt = '';
      if (magicType === 'organize') {
        prompt = `Transform the following notes into organized markdown. Highlight key terms or keywords by wrapping them in HTML span tags with style="color: coral; font-weight: bold;".\n\nNotes:\n${input}`;
      } else if (magicType === 'summarize') {
        prompt = `Summarize the following notes concisely in markdown.\n\nNotes:\n${input}`;
      }
      // Add other magics as needed

      const result = await generateText(prompt, "You are a helpful AI note organizer.");
      setOutput(result);
      setStatus('done');
      addRunHistory({ task: `Note Magic: ${magicType}`, timestamp: Date.now(), model: useAppStore.getState().defaultModel });
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('noteKeeper')}</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">{t('status')}: {t(status as any) || status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle>Input Notes</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4">
            <Textarea 
              className="flex-1 resize-none" 
              placeholder="Paste your raw notes here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => handleMagic('organize')} disabled={status === 'running'}>
                ✨ Organize & Highlight
              </Button>
              <Button variant="secondary" onClick={() => handleMagic('summarize')} disabled={status === 'running'}>
                📝 Summarize
              </Button>
              {/* Other magics */}
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle>Organized Output</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto bg-muted/30 rounded-md p-4 border">
            {output ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{output}</ReactMarkdown>
              </div>
            ) : (
              <div className="text-muted-foreground text-center h-full flex items-center justify-center">
                Output will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
