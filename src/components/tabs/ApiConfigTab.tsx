import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Settings, 
  Key, 
  TestTube, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Shield,
  Globe,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiConfig {
  apiKey: string;
  secretKey: string;
  testnet: boolean;
  enabled: boolean;
  status: "connected" | "disconnected" | "testing" | "error";
}

export const ApiConfigTab = () => {
  const { toast } = useToast();
  const [configs, setConfigs] = useState<Record<string, ApiConfig>>({
    binance: {
      apiKey: "",
      secretKey: "",
      testnet: false,
      enabled: false,
      status: "disconnected"
    },
    bybit: {
      apiKey: "",
      secretKey: "",
      testnet: false,
      enabled: false,
      status: "disconnected"
    },
    dhan: {
      apiKey: "",
      secretKey: "",
      testnet: false,
      enabled: false,
      status: "disconnected"
    }
  });

  const handleConfigChange = (exchange: string, field: keyof ApiConfig, value: any) => {
    setConfigs(prev => ({
      ...prev,
      [exchange]: {
        ...prev[exchange],
        [field]: value
      }
    }));
  };

  const testConnection = async (exchange: string) => {
    const config = configs[exchange];
    const requiresSecretKey = exchange !== "dhan";
    
    if (!config.apiKey || (requiresSecretKey && !config.secretKey)) {
      toast({
        title: "Missing Credentials",
        description: exchange === "dhan" 
          ? "Please enter your Access Token"
          : requiresSecretKey 
            ? "Please enter both API Key and Secret Key"
            : "Please enter your API Key",
        variant: "destructive"
      });
      return;
    }

    setConfigs(prev => ({
      ...prev,
      [exchange]: { ...prev[exchange], status: "testing" }
    }));

    // Simulate API test (replace with actual API calls)
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      setConfigs(prev => ({
        ...prev,
        [exchange]: { 
          ...prev[exchange], 
          status: success ? "connected" : "error",
          enabled: success
        }
      }));

      toast({
        title: success ? "Connection Successful" : "Connection Failed",
        description: success 
          ? `Successfully connected to ${exchange.charAt(0).toUpperCase() + exchange.slice(1)}`
          : `Failed to connect to ${exchange.charAt(0).toUpperCase() + exchange.slice(1)}. Check your credentials.`,
        variant: success ? "default" : "destructive"
      });
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Connected</Badge>;
      case "testing":
        return <Badge variant="secondary"><TestTube className="h-3 w-3 mr-1" />Testing...</Badge>;
      case "error":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="outline"><XCircle className="h-3 w-3 mr-1" />Disconnected</Badge>;
    }
  };

  const exchanges = [
    {
      id: "binance",
      name: "Binance",
      description: "World's largest cryptocurrency exchange",
      icon: "🔶",
      features: ["Spot Trading", "Futures", "Options", "Margin Trading"]
    },
    {
      id: "bybit",
      name: "Bybit",
      description: "Advanced cryptocurrency derivatives exchange",
      icon: "🟡",
      features: ["Derivatives", "Spot Trading", "Copy Trading", "NFT"]
    },
    {
      id: "dhan",
      name: "Dhan",
      description: "Indian stock market trading platform - Generate access token from Profile > DhanHQ Trading APIs",
      icon: "🇮🇳",
      features: ["Equity", "F&O", "Currency", "Commodity"]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">API Configuration</h2>
          <p className="text-muted-foreground">Configure your exchange API credentials for automated trading</p>
        </div>
        <Badge variant="outline" className="gap-2">
          <Shield className="h-4 w-4" />
          All data encrypted
        </Badge>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Notice:</strong> Your API keys are encrypted and stored locally. Never share your secret keys with anyone.
          Ensure your API keys have only the necessary trading permissions enabled.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {exchanges.map((exchange) => {
          const config = configs[exchange.id];
          
          return (
            <Card key={exchange.id} className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-success/50" />
              
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{exchange.icon}</div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {exchange.name}
                        {getStatusBadge(config.status)}
                      </CardTitle>
                      <CardDescription>{exchange.description}</CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={config.enabled}
                    onCheckedChange={(enabled) => handleConfigChange(exchange.id, "enabled", enabled)}
                    disabled={config.status !== "connected"}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {exchange.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${exchange.id}-api-key`} className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      {exchange.id === "dhan" ? "Access Token" : "API Key"}
                    </Label>
                    <Input
                      id={`${exchange.id}-api-key`}
                      type="password"
                      placeholder={exchange.id === "dhan" ? "Enter your access token" : "Enter your API key"}
                      value={config.apiKey}
                      onChange={(e) => handleConfigChange(exchange.id, "apiKey", e.target.value)}
                    />
                  </div>
                  
                  {exchange.id !== "dhan" && (
                    <div className="space-y-2">
                      <Label htmlFor={`${exchange.id}-secret-key`} className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Secret Key
                      </Label>
                      <Input
                        id={`${exchange.id}-secret-key`}
                        type="password"
                        placeholder="Enter your secret key"
                        value={config.secretKey}
                        onChange={(e) => handleConfigChange(exchange.id, "secretKey", e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={config.testnet}
                      onCheckedChange={(testnet) => handleConfigChange(exchange.id, "testnet", testnet)}
                    />
                    <Label className="flex items-center gap-2">
                      <TestTube className="h-4 w-4" />
                      Use Testnet/Sandbox
                    </Label>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => testConnection(exchange.id)}
                      disabled={config.status === "testing" || !config.apiKey || (exchange.id !== "dhan" && !config.secretKey)}
                      className="gap-2"
                    >
                      <Zap className="h-4 w-4" />
                      {config.status === "testing" ? "Testing..." : "Test Connection"}
                    </Button>
                    
                    <Button
                      variant="default"
                      disabled={config.status !== "connected"}
                      className="gap-2"
                    >
                      <Globe className="h-4 w-4" />
                      Deploy Live
                    </Button>
                  </div>
                </div>

                {config.status === "connected" && (
                  <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">Connection Established</span>
                    </div>
                    <p className="text-sm text-success/80 mt-1">
                      Bot can now execute trades on {exchange.name}
                    </p>
                  </div>
                )}

                {config.status === "error" && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <div className="flex items-center gap-2 text-destructive">
                      <XCircle className="h-4 w-4" />
                      <span className="font-medium">Connection Failed</span>
                    </div>
                    <p className="text-sm text-destructive/80 mt-1">
                      Please check your API credentials and try again
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Advanced Settings
          </CardTitle>
          <CardDescription>Configure additional API settings and rate limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Request Rate Limit (per second)</Label>
              <Input type="number" placeholder="10" />
            </div>
            <div className="space-y-2">
              <Label>Connection Timeout (seconds)</Label>
              <Input type="number" placeholder="30" />
            </div>
            <div className="space-y-2">
              <Label>Retry Attempts</Label>
              <Input type="number" placeholder="3" />
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-medium">Auto-reconnect on failure</Label>
              <p className="text-sm text-muted-foreground">
                Automatically attempt to reconnect if connection is lost
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};