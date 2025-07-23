
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Code, 
  Save, 
  Eye, 
  Camera,
  FileText,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CustomPattern {
  id: string;
  name: string;
  description: string;
  type: "bullish" | "bearish" | "neutral";
  creationMethod: "image" | "code";
  imageFile?: File;
  codeLogic?: string;
  parameters: {
    minConfidence: number;
    lookbackPeriod: number;
    sensitivity: number;
  };
}

export const CustomPatternCreator = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("image");
  const [patternData, setPatternData] = useState<Partial<CustomPattern>>({
    name: "",
    description: "",
    type: "bullish",
    creationMethod: "image",
    parameters: {
      minConfidence: 70,
      lookbackPeriod: 100,
      sensitivity: 0.8
    }
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [codeLogic, setCodeLogic] = useState(`# Custom Pattern Recognition Logic
def detect_pattern(data):
    """
    Detect custom pattern in price data
    
    Args:
        data: OHLCV data as pandas DataFrame
        
    Returns:
        dict: {
            'detected': bool,
            'confidence': float,
            'signal': 'bullish' | 'bearish' | 'neutral'
        }
    """
    
    # Example: Simple Moving Average Crossover
    fast_ma = data['close'].rolling(window=10).mean()
    slow_ma = data['close'].rolling(window=30).mean()
    
    # Check for crossover
    if fast_ma.iloc[-1] > slow_ma.iloc[-1] and fast_ma.iloc[-2] <= slow_ma.iloc[-2]:
        return {
            'detected': True,
            'confidence': 0.75,
            'signal': 'bullish'
        }
    elif fast_ma.iloc[-1] < slow_ma.iloc[-1] and fast_ma.iloc[-2] >= slow_ma.iloc[-2]:
        return {
            'detected': True,
            'confidence': 0.75,
            'signal': 'bearish'
        }
    
    return {
        'detected': False,
        'confidence': 0.0,
        'signal': 'neutral'
    }
`);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setPatternData(prev => ({ ...prev, imageFile: file, creationMethod: "image" }));
        toast({
          title: "Image Uploaded",
          description: `${file.name} has been uploaded successfully`
        });
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image file (PNG, JPG, etc.)",
          variant: "destructive"
        });
      }
    }
  };

  const handleCodeChange = (code: string) => {
    setCodeLogic(code);
    setPatternData(prev => ({ ...prev, codeLogic: code, creationMethod: "code" }));
  };

  const validatePattern = () => {
    if (!patternData.name?.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a pattern name",
        variant: "destructive"
      });
      return false;
    }

    if (activeTab === "image" && !selectedFile) {
      toast({
        title: "Validation Error",
        description: "Please upload a pattern image",
        variant: "destructive"
      });
      return false;
    }

    if (activeTab === "code" && !codeLogic.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter pattern detection code",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const savePattern = () => {
    if (!validatePattern()) return;

    const newPattern: CustomPattern = {
      id: `custom-${Date.now()}`,
      name: patternData.name!,
      description: patternData.description || "",
      type: patternData.type!,
      creationMethod: activeTab as "image" | "code",
      imageFile: activeTab === "image" ? selectedFile! : undefined,
      codeLogic: activeTab === "code" ? codeLogic : undefined,
      parameters: patternData.parameters!
    };

    // In a real app, this would save to backend
    console.log("Saving custom pattern:", newPattern);
    
    toast({
      title: "Pattern Created",
      description: `${newPattern.name} has been created successfully`
    });

    // Reset form
    setPatternData({
      name: "",
      description: "",
      type: "bullish",
      creationMethod: "image",
      parameters: {
        minConfidence: 70,
        lookbackPeriod: 100,
        sensitivity: 0.8
      }
    });
    setSelectedFile(null);
    setCodeLogic(`# Custom Pattern Recognition Logic
def detect_pattern(data):
    # Your pattern detection logic here
    return {
        'detected': False,
        'confidence': 0.0,
        'signal': 'neutral'
    }
`);
  };

  const testPattern = () => {
    if (!validatePattern()) return;

    toast({
      title: "Testing Pattern",
      description: "Running pattern detection on sample data..."
    });

    // Simulate pattern testing
    setTimeout(() => {
      toast({
        title: "Test Complete",
        description: "Pattern detected 15 matches with 78% average confidence"
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Create Custom Pattern
          </CardTitle>
          <CardDescription>
            Train the AI to recognize your custom patterns using images or code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Pattern Name</Label>
              <Input
                placeholder="e.g., Custom Wedge Pattern"
                value={patternData.name}
                onChange={(e) => setPatternData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Pattern Type</Label>
              <Select value={patternData.type} onValueChange={(value) => setPatternData(prev => ({ ...prev, type: value as "bullish" | "bearish" | "neutral" }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bullish">Bullish</SelectItem>
                  <SelectItem value="bearish">Bearish</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Describe your pattern and when it typically occurs..."
              value={patternData.description}
              onChange={(e) => setPatternData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="image" className="gap-2">
                <Camera className="h-4 w-4" />
                Image Training
              </TabsTrigger>
              <TabsTrigger value="code" className="gap-2">
                <Code className="h-4 w-4" />
                Code Logic
              </TabsTrigger>
            </TabsList>

            <TabsContent value="image" className="space-y-4">
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-8">
                  {selectedFile ? (
                    <div className="text-center">
                      <FileText className="h-12 w-12 text-success mb-4 mx-auto" />
                      <h3 className="font-semibold mb-2">Image Uploaded</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {selectedFile.name}
                      </p>
                      <Badge variant="secondary">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="font-semibold mb-2">Upload Pattern Image</h3>
                      <p className="text-sm text-muted-foreground text-center mb-4">
                        Upload a clear chart image showing your pattern
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button asChild>
                    <label htmlFor="image-upload" className="cursor-pointer">
                      {selectedFile ? "Change Image" : "Choose Image"}
                    </label>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="code" className="space-y-4">
              <div className="space-y-2">
                <Label>Pattern Detection Code</Label>
                <Textarea
                  placeholder="Enter your pattern detection logic..."
                  value={codeLogic}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Load Template
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Syntax Check
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2">
            <Button onClick={testPattern} variant="outline" className="gap-2">
              <Eye className="h-4 w-4" />
              Test Pattern
            </Button>
            <Button onClick={savePattern} className="gap-2">
              <Save className="h-4 w-4" />
              Save Pattern
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
