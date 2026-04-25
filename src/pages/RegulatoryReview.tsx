import React, { useState } from 'react';
import { useAppStore } from '@/src/store';
import { useTranslation } from '@/src/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Textarea } from '@/src/components/ui/Textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/src/components/ui/Tabs';
import { generateText } from '@/src/services/llm';
import ReactMarkdown from 'react-markdown';

export function RegulatoryReview() {
  const { language, addRunHistory, defaultModel } = useAppStore();
  const t = useTranslation(language);
  
  const [activeTab, setActiveTab] = useState('ingestion');
  
  // Ingestion State
  const [guidanceInput, setGuidanceInput] = useState('');
  const [researchReport, setResearchReport] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  
  // Template State
  const [templateInput, setTemplateInput] = useState('');
  const [rewrittenReport, setRewrittenReport] = useState('');
  const [isRewriting, setIsRewriting] = useState(false);

  // Skill State
  const [skillOutput, setSkillOutput] = useState('');
  const [isGeneratingSkill, setIsGeneratingSkill] = useState(false);

  const handleGenerateResearch = async () => {
    if (!guidanceInput) return;
    setIsResearching(true);
    try {
      const prompt = `Analyze the following medical device guidance and generate a comprehensive research report (2000-3000 words). Include FDA alignment, standards landscape, risk expectations, and a traceability matrix. Output in ${language === 'zh-TW' ? 'Traditional Chinese' : 'English'}.\n\nGuidance:\n${guidanceInput}`;
      
      const result = await generateText(prompt, "You are an expert Medical Device Regulatory Reviewer.", defaultModel);
      setResearchReport(result);
      addRunHistory({ task: 'Generate Research Report', timestamp: Date.now(), model: defaultModel });
    } catch (error) {
      console.error(error);
    } finally {
      setIsResearching(false);
    }
  };

  const handleRewrite = async () => {
    if (!researchReport || !templateInput) return;
    setIsRewriting(true);
    try {
      const prompt = `Rewrite the following comprehensive research report to match the provided template structure. Maintain all citations and grounding.\n\nTemplate:\n${templateInput}\n\nReport:\n${researchReport}`;
      
      const result = await generateText(prompt, "You are an expert Medical Device Regulatory Reviewer.", defaultModel);
      setRewrittenReport(result);
      addRunHistory({ task: 'Rewrite Template Report', timestamp: Date.now(), model: defaultModel });
    } catch (error) {
      console.error(error);
    } finally {
      setIsRewriting(false);
    }
  };

  const handleGenerateSkill = async () => {
    if (!rewrittenReport || !guidanceInput) return;
    setIsGeneratingSkill(true);
    try {
      const prompt = `Create an agent skill definition (skill.md) based on the original guidance and the final template-based report. Include YAML frontmatter, workflow section, and 3 WOW features: Guidance Structure Fingerprinting, Requirement-to-Evidence Traceability Builder, and Bilingual Terminology Consistency Table. Output in ${language === 'zh-TW' ? 'Traditional Chinese' : 'English'}.\n\nOriginal Guidance:\n${guidanceInput}\n\nFinal Report:\n${rewrittenReport}`;
      
      const result = await generateText(prompt, "You are an expert AI Agent Skill Creator.", defaultModel);
      setSkillOutput(result);
      addRunHistory({ task: 'Generate Skill.md', timestamp: Date.now(), model: defaultModel });
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingSkill(false);
    }
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('regulatoryReview')}</h2>
      </div>

      <Tabs className="flex-1 flex flex-col min-h-0">
        <TabsList className="self-start">
          <TabsTrigger active={activeTab === 'ingestion'} onClick={() => setActiveTab('ingestion')}>
            1. Guidance Ingestion
          </TabsTrigger>
          <TabsTrigger active={activeTab === 'template'} onClick={() => setActiveTab('template')}>
            2. Template Rewriter
          </TabsTrigger>
          <TabsTrigger active={activeTab === 'skill'} onClick={() => setActiveTab('skill')}>
            3. Skill Generator
          </TabsTrigger>
          <TabsTrigger active={activeTab === 'wow'} onClick={() => setActiveTab('wow')}>
            ✨ WOW Features
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 mt-4 min-h-0 overflow-hidden">
          <TabsContent active={activeTab === 'ingestion'} className="h-full mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle>Source Guidance</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col space-y-4">
                  <Textarea 
                    className="flex-1 resize-none font-mono text-xs" 
                    placeholder="Paste guidance text or markdown here..."
                    value={guidanceInput}
                    onChange={(e) => setGuidanceInput(e.target.value)}
                  />
                  <Button onClick={handleGenerateResearch} disabled={isResearching}>
                    {isResearching ? 'Generating...' : 'Generate Research Report'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="flex flex-col h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Research Report (Stage 1)</CardTitle>
                  {researchReport && (
                    <Button variant="outline" size="sm" onClick={() => handleDownload(researchReport, 'research_report.md')}>
                      Download .md
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="flex-1 overflow-auto bg-muted/30 rounded-md p-4 border">
                  {researchReport ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{researchReport}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-center h-full flex items-center justify-center">
                      Report will appear here
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent active={activeTab === 'template'} className="h-full mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle>Template & Stage 1 Report</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col space-y-4">
                  <div className="flex-1 flex flex-col space-y-2">
                    <label className="text-sm font-medium">Template</label>
                    <Textarea 
                      className="flex-1 resize-none font-mono text-xs" 
                      placeholder="Paste template here..."
                      value={templateInput}
                      onChange={(e) => setTemplateInput(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleRewrite} disabled={isRewriting}>
                    {isRewriting ? 'Rewriting...' : 'Rewrite Report'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="flex flex-col h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Template-Based Report (Stage 2)</CardTitle>
                  {rewrittenReport && (
                    <Button variant="outline" size="sm" onClick={() => handleDownload(rewrittenReport, 'rewritten_report.md')}>
                      Download .md
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="flex-1 overflow-auto bg-muted/30 rounded-md p-4 border">
                  {rewrittenReport ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{rewrittenReport}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-center h-full flex items-center justify-center">
                      Rewritten report will appear here
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent active={activeTab === 'skill'} className="h-full mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle>Generate Skill</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This will generate a skill.md file based on the original guidance and the final template-based report.
                  </p>
                  <Button onClick={handleGenerateSkill} disabled={isGeneratingSkill}>
                    {isGeneratingSkill ? 'Generating...' : 'Generate skill.md'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="flex flex-col h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>skill.md Output</CardTitle>
                  {skillOutput && (
                    <Button variant="outline" size="sm" onClick={() => handleDownload(skillOutput, 'skill.md')}>
                      Download skill.md
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="flex-1 overflow-auto bg-muted/30 rounded-md p-4 border">
                  {skillOutput ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{skillOutput}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-center h-full flex items-center justify-center">
                      skill.md will appear here
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent active={activeTab === 'wow'} className="h-full mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
              <Card>
                <CardHeader>
                  <CardTitle>Regulatory Diff & Version Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Compare prompt changes, output diffs, and citation changes across agent runs.
                  </p>
                  <Button variant="outline" className="w-full">View Timeline</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Prompt Injection Shield</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Scan ingested guidance for prompt-injection patterns and accidental secrets.
                  </p>
                  <Button variant="outline" className="w-full">Run Safety Scan</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Standards Crosswalk Matrix</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Automatically generate a matrix mapping requirements to candidate standards.
                  </p>
                  <Button variant="outline" className="w-full">Generate Matrix</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
