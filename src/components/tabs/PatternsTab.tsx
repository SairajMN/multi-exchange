
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Zap, 
  Plus, 
  Eye, 
  TrendingUp, 
  TrendingDown,
  Target,
  AlertCircle,
  CheckCircle,
  Upload,
  Download,
  Settings,
  Brain,
  Camera
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CustomPatternCreator } from "@/components/patterns/CustomPatternCreator";
import { PatternLibrary } from "@/components/patterns/PatternLibrary";

interface Pattern {
  id: string;
  name: string;
  type: "bullish" | "bearish" | "neutral";
  enabled: boolean;
  confidence: number;
  detectedCount: number;
  successRate: number;
  description: string;
  isCustom?: boolean;
  parameters: {
    minConfidence: number;
    lookbackPeriod: number;
    sensitivity: number;
  };
}

interface DetectedPattern {
  id: string;
  symbol: string;
  pattern: string;
  confidence: number;
  timestamp: string;
  price: number;
  direction: "bullish" | "bearish";
  status: "active" | "completed" | "failed";
}

export const PatternsTab = () => {
  const { toast } = useToast();
  const [patterns, setPatterns] = useState<Pattern[]>([
    {
      id: "head-shoulders",
      name: "Head and Shoulders",
      type: "bearish",
      enabled: true,
      confidence: 78,
      detectedCount: 24,
      successRate: 73.5,
      description: "Classic reversal pattern indicating potential bearish trend",
      parameters: {
        minConfidence: 70,
        lookbackPeriod: 100,
        sensitivity: 0.8
      }
    },
    {
      id: "double-bottom",
      name: "Double Bottom",
      type: "bullish",
      enabled: true,
      confidence: 82,
      detectedCount: 31,
      successRate: 68.2,
      description: "Bullish reversal pattern with two equal lows",
      parameters: {
        minConfidence: 75,
        lookbackPeriod: 80,
        sensitivity: 0.7
      }
    },
    {
      id: "ascending-triangle",
      name: "Ascending Triangle",
      type: "bullish",
      enabled: false,
      confidence: 65,
      detectedCount: 18,
      successRate: 61.1,
      description: "Continuation pattern with rising support and horizontal resistance",
      parameters: {
        minConfidence: 60,
        lookbackPeriod: 120,
        sensitivity: 0.6
      }
    },
    {
      id: "flag-pattern",
      name: "Flag Pattern",
      type: "neutral",
      enabled: true,
      confidence: 88,
      detectedCount: 42,
      successRate: 79.8,
      description: "Short-term continuation pattern following strong price movement",
      parameters: {
        minConfidence: 80,
        lookbackPeriod: 50,
        sensitivity: 0.9
      }
    }
  ]);

  const [detectedPatterns] = useState<DetectedPattern[]>([
    {
      id: "1",
      symbol: "BTCUSDT",
      pattern: "Head and Shoulders",
      confidence: 84,
      timestamp: "2 min ago",
      price: 43250,
      direction: "bearish",
      status: "active"
    },
    {
      id: "2",
      symbol: "ETHUSDT",
      pattern: "Double Bottom",
      confidence: 91,
      timestamp: "5 min ago",
      price: 2640,
      direction: "bullish",
      status: "completed"
    },
    {
      id: "3",
      symbol: "ADAUSDT",
      pattern: "Flag Pattern",
      confidence: 76,
      timestamp: "8 min ago",
      price: 0.485,
      direction: "bullish",
      status: "active"
    }
  ]);

  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);

  const updatePattern = (patternId: string, updates: Partial<Pattern>) => {
    setPatterns(prev => prev.map(pattern => 
      pattern.id === patternId ? { ...pattern, ...updates } : pattern
    ));
  };

  const deletePattern = (patternId: string) => {
    setPatterns(prev => prev.filter(pattern => pattern.id !== patternId));
    if (selectedPattern?.id === patternId) {
      setSelectedPattern(null);
    }
  };

  const trainAIModel = () => {
    toast({
      title: "AI Training Started",
      description: "Training the AI model with updated patterns and data..."
    });
  };

  const exportSettings = () => {
    const settings = {
      patterns: patterns.filter(p => p.enabled),
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pattern-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Settings Exported",
      description: "Pattern settings have been exported successfully"
    });
  };

  const importSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const settings = JSON.parse(e.target?.result as string);
            if (settings.patterns) {
              setPatterns(settings.patterns);
              toast({
                title: "Settings Imported",
                description: "Pattern settings have been imported successfully"
              });
            }
          } catch (error) {
            toast({
              title: "Import Error",
              description: "Failed to import settings. Please check the file format.",
              variant: "destructive"
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const resetToDefaults = () => {
    // Reset to original patterns
    setPatterns([
      {
        id: "head-shoulders",
        name: "Head and Shoulders",
        type: "bearish",
        enabled: true,
        confidence: 78,
        detectedCount: 24,
        successRate: 73.5,
        description: "Classic reversal pattern indicating potential bearish trend",
        parameters: {
          minConfidence: 70,
          lookbackPeriod: 100,
          sensitivity: 0.8
        }
      },
      {
        id: "double-bottom",
        name: "Double Bottom",
        type: "bullish",
        enabled: true,
        confidence: 82,
        detectedCount: 31,
        successRate: 68.2,
        description: "Bullish reversal pattern with two equal lows",
        parameters: {
          minConfidence: 75,
          lookbackPeriod: 80,
          sensitivity: 0.7
        }
      }
    ]);
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-info text-info-foreground">Active</Badge>;
      case "completed":
        return <Badge className="bg-success text-success-foreground">Completed</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pattern Detection</h2>
          <p className="text-muted-foreground">AI-powered technical pattern recognition and alerts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Pattern
          </Button>
          <Button onClick={trainAIModel} className="gap-2">
            <Brain className="h-4 w-4" />
            Train AI Model
          </Button>
        </div>
      </div>

      <Tabs defaultValue="patterns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="patterns">Pattern Library</TabsTrigger>
          <TabsTrigger value="detected">Live Detection</TabsTrigger>
          <TabsTrigger value="custom">Custom Patterns</TabsTrigger>
          <TabsTrigger value="settings">AI Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-4">
          <PatternLibrary
            patterns={patterns}
            onUpdatePattern={updatePattern}
            onDeletePattern={deletePattern}
            selectedPattern={selectedPattern}
            onSelectPattern={setSelectedPattern}
          />
        </TabsContent>

        <TabsContent value="detected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Live Pattern Detection
              </CardTitle>
              <CardDescription>Real-time pattern detection across all monitored symbols</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {detectedPatterns.map((detection) => (
                  <div key={detection.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        detection.direction === "bullish" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                      }`}>
                        {detection.direction === "bullish" ? 
                          <TrendingUp className="h-4 w-4" /> : 
                          <TrendingDown className="h-4 w-4" />
                        }
                      </div>
                      <div>
                        <div className="font-semibold">{detection.pattern}</div>
                        <div className="text-sm text-muted-foreground">
                          {detection.symbol} • ${detection.price.toLocaleString()} • {detection.timestamp}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right mr-4">
                        <div className="font-semibold">{detection.confidence}% confidence</div>
                        {getStatusBadge(detection.status)}
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <CustomPatternCreator />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Model Settings
              </CardTitle>
              <CardDescription>Configure the AI pattern recognition engine</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Detection Sensitivity</Label>
                    <Slider defaultValue={[75]} max={100} step={1} />
                    <p className="text-sm text-muted-foreground">
                      Higher values detect more patterns but may increase false positives
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Minimum Pattern Duration (candles)</Label>
                    <Input type="number" defaultValue="10" />
                  </div>

                  <div className="space-y-2">
                    <Label>Maximum Pattern Duration (candles)</Label>
                    <Input type="number" defaultValue="200" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Real-time Detection</Label>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Auto-trade on Patterns</Label>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Send Telegram Alerts</Label>
                    <Switch defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label>AI Model Version</Label>
                    <select className="w-full p-2 border rounded">
                      <option>v2.1 (Latest)</option>
                      <option>v2.0 (Stable)</option>
                      <option>v1.9 (Legacy)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={exportSettings}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Settings
                </Button>
                <Button variant="outline" onClick={importSettings}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Settings
                </Button>
                <Button variant="outline" onClick={resetToDefaults}>
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
