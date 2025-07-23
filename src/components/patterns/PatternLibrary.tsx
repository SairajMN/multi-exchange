
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  TrendingUp, 
  TrendingDown, 
  Target,
  Settings,
  Trash2,
  Eye,
  Copy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface PatternLibraryProps {
  patterns: Pattern[];
  onUpdatePattern: (patternId: string, updates: Partial<Pattern>) => void;
  onDeletePattern: (patternId: string) => void;
  selectedPattern: Pattern | null;
  onSelectPattern: (pattern: Pattern | null) => void;
}

export const PatternLibrary = ({
  patterns,
  onUpdatePattern,
  onDeletePattern,
  selectedPattern,
  onSelectPattern
}: PatternLibraryProps) => {
  const { toast } = useToast();

  const togglePattern = (patternId: string) => {
    const pattern = patterns.find(p => p.id === patternId);
    if (pattern) {
      onUpdatePattern(patternId, { enabled: !pattern.enabled });
      toast({
        title: `Pattern ${pattern.enabled ? 'Disabled' : 'Enabled'}`,
        description: `${pattern.name} is now ${pattern.enabled ? 'disabled' : 'enabled'}`
      });
    }
  };

  const updatePatternParameter = (patternId: string, param: string, value: number) => {
    onUpdatePattern(patternId, {
      parameters: {
        ...patterns.find(p => p.id === patternId)?.parameters!,
        [param]: value
      }
    });
  };

  const deletePattern = (patternId: string) => {
    const pattern = patterns.find(p => p.id === patternId);
    if (pattern) {
      onDeletePattern(patternId);
      toast({
        title: "Pattern Deleted",
        description: `${pattern.name} has been removed`
      });
    }
  };

  const duplicatePattern = (patternId: string) => {
    const pattern = patterns.find(p => p.id === patternId);
    if (pattern) {
      const duplicatedPattern = {
        ...pattern,
        id: `${pattern.id}-copy-${Date.now()}`,
        name: `${pattern.name} (Copy)`,
        enabled: false
      };
      toast({
        title: "Pattern Duplicated",
        description: `${pattern.name} has been duplicated`
      });
    }
  };

  const getPatternIcon = (type: string) => {
    switch (type) {
      case "bullish":
        return <TrendingUp className="h-4 w-4 text-success" />;
      case "bearish":
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Target className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-4">
      {patterns.map((pattern) => (
        <Card key={pattern.id} className="relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-1 ${
            pattern.enabled ? "bg-success" : "bg-muted"
          }`} />
          
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getPatternIcon(pattern.type)}
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {pattern.name}
                    <Badge variant={pattern.enabled ? "default" : "secondary"}>
                      {pattern.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                    {pattern.isCustom && (
                      <Badge variant="outline">Custom</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{pattern.description}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectPattern(pattern)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                {pattern.isCustom && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => duplicatePattern(pattern.id)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deletePattern(pattern.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Switch
                  checked={pattern.enabled}
                  onCheckedChange={() => togglePattern(pattern.id)}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{pattern.confidence}%</div>
                <div className="text-sm text-muted-foreground">Avg Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{pattern.detectedCount}</div>
                <div className="text-sm text-muted-foreground">Detected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{pattern.successRate}%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  pattern.type === "bullish" ? "text-success" : 
                  pattern.type === "bearish" ? "text-destructive" : "text-muted-foreground"
                }`}>
                  {pattern.type.charAt(0).toUpperCase() + pattern.type.slice(1)}
                </div>
                <div className="text-sm text-muted-foreground">Bias</div>
              </div>
            </div>

            {selectedPattern?.id === pattern.id && (
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-semibold">Pattern Parameters</h4>
                
                <div className="space-y-3">
                  <div>
                    <Label>Minimum Confidence: {pattern.parameters.minConfidence}%</Label>
                    <Slider
                      value={[pattern.parameters.minConfidence]}
                      onValueChange={([value]) => updatePatternParameter(pattern.id, "minConfidence", value)}
                      max={100}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label>Lookback Period: {pattern.parameters.lookbackPeriod} candles</Label>
                    <Slider
                      value={[pattern.parameters.lookbackPeriod]}
                      onValueChange={([value]) => updatePatternParameter(pattern.id, "lookbackPeriod", value)}
                      max={200}
                      min={20}
                      step={10}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label>Sensitivity: {(pattern.parameters.sensitivity * 100).toFixed(0)}%</Label>
                    <Slider
                      value={[pattern.parameters.sensitivity * 100]}
                      onValueChange={([value]) => updatePatternParameter(pattern.id, "sensitivity", value / 100)}
                      max={100}
                      min={10}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Test Pattern
                  </Button>
                  <Button variant="outline" size="sm">
                    View Examples
                  </Button>
                  <Button size="sm" onClick={() => onSelectPattern(null)}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
