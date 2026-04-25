import React from 'react';
import { useAppStore } from '@/src/store';
import { useTranslation } from '@/src/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const { language, runHistory } = useAppStore();
  const t = useTranslation(language);

  // Mock data for charts
  const data = [
    { name: 'Mon', tokens: 4000 },
    { name: 'Tue', tokens: 3000 },
    { name: 'Wed', tokens: 2000 },
    { name: 'Thu', tokens: 2780 },
    { name: 'Fri', tokens: 1890 },
    { name: 'Sat', tokens: 2390 },
    { name: 'Sun', tokens: 3490 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('activeWorkspace')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Orthopedic Guidance</div>
            <p className="text-xs text-muted-foreground mt-1">Template: FDA 510(k)</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('citationCoverage')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94%</div>
            <p className="text-xs text-muted-foreground mt-1">2 warnings for unsupported claims</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('tokenCost')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">~124k</div>
            <p className="text-xs text-muted-foreground mt-1">Est. $0.05 this session</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Token Usage History</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="tokens" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('runHistory')}</CardTitle>
        </CardHeader>
        <CardContent>
          {runHistory.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No runs yet</div>
          ) : (
            <div className="space-y-4">
              {runHistory.map((run, i) => (
                <div key={i} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{run.task}</div>
                    <div className="text-xs text-muted-foreground">{new Date(run.timestamp).toLocaleString()}</div>
                  </div>
                  <div className="text-sm bg-secondary px-2 py-1 rounded">{run.model}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
