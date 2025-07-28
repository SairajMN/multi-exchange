import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  BarChart3, 
  Bot, 
  DollarSign, 
  Settings, 
  TrendingUp, 
  TrendingDown,
  Zap,
  MessageSquare,
  Target,
  Shield,
  Globe
} from "lucide-react";
import { ApiConfigTab } from "./tabs/ApiConfigTab";
import { StrategiesTab } from "./tabs/StrategiesTab";
import { PatternsTab } from "./tabs/PatternsTab";
import { TelegramTab } from "./tabs/TelegramTab";
import { TradingTab } from "./tabs/TradingTab";
import { ChartsTab } from "./tabs/ChartsTab";
import { ProfileTab } from "./tabs/ProfileTab";
import { OverviewTab } from "./tabs/OverviewTab";

interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  exchange: string;
}

export const TradingDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [botStatus, setBotStatus] = useState<"running" | "stopped" | "error">("stopped");
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [connectionStatus, setConnectionStatus] = useState({
    binance: false,
    bybit: false,
    dhan: false,
    telegram: false
  });

  // Simulate real-time data updates
  // TODO: Replace with actual API calls
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData([
        {
          symbol: "BTCUSDT",
          price: 43250 + (Math.random() - 0.5) * 1000,
          change24h: (Math.random() - 0.5) * 10,
          volume: 125000000,
          exchange: "Binance"
        },
        {
          symbol: "ETHUSDT", 
          price: 2640 + (Math.random() - 0.5) * 100,
          change24h: (Math.random() - 0.5) * 8,
          volume: 95000000,
          exchange: "Bybit"
        },
        {
          symbol: "RELIANCE",
          price: 2456 + (Math.random() - 0.5) * 50,
          change24h: (Math.random() - 0.5) * 5,
          volume: 12500000,
          exchange: "Dhan"
        }
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleBotToggle = () => {
    setBotStatus(prevStatus => 
      prevStatus === "running" ? "stopped" : "running"
    );
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
            Advanced Trading Bot
          </h1>
          <p className="text-muted-foreground">
            Multi-exchange automated trading platform
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="text-sm font-medium">Connections:</span>
            <Badge variant={connectionStatus.binance ? "default" : "secondary"} className="text-xs">
              Binance
            </Badge>
            <Badge variant={connectionStatus.bybit ? "default" : "secondary"} className="text-xs">
              Bybit
            </Badge>
            <Badge variant={connectionStatus.dhan ? "default" : "secondary"} className="text-xs">
              Dhan
            </Badge>
            <Badge variant={connectionStatus.telegram ? "default" : "secondary"} className="text-xs">
              Telegram
            </Badge>
          </div>

          {/* Bot Control */}
          <Button 
            onClick={handleBotToggle}
            variant={botStatus === "running" ? "destructive" : "default"}
            className="gap-2"
          >
            <Bot className="h-4 w-4" />
            {botStatus === "running" ? "Stop Bot" : "Start Bot"}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Total P&L</p>
                <p className="text-2xl font-bold text-success">+$12,485.32</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm font-medium">Active Trades</p>
                <p className="text-2xl font-bold">47</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-info">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-info" />
              <div>
                <p className="text-sm font-medium">Win Rate</p>
                <p className="text-2xl font-bold">73.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm font-medium">Patterns Detected</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Market Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Live Market Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {marketData.map((data, index) => (
              <div key={index} className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{data.symbol}</span>
                  <Badge variant="outline">{data.exchange}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    ${data.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div className={`flex items-center gap-1 ${data.change24h >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {data.change24h >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="font-medium">
                      {data.change24h >= 0 ? '+' : ''}{data.change24h.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Vol: ${data.volume.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8 bg-muted/50">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="trading" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Trading
          </TabsTrigger>
          <TabsTrigger value="charts" className="gap-2">
            <Activity className="h-4 w-4" />
            Charts
          </TabsTrigger>
          <TabsTrigger value="strategies" className="gap-2">
            <Target className="h-4 w-4" />
            Strategies
          </TabsTrigger>
          <TabsTrigger value="patterns" className="gap-2">
            <Zap className="h-4 w-4" />
            Patterns
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            <Settings className="h-4 w-4" />
            API Config
          </TabsTrigger>
          <TabsTrigger value="telegram" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Telegram
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2">
            <Shield className="h-4 w-4" />
            Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="trading">
          <TradingTab />
        </TabsContent>

        <TabsContent value="charts">
          <ChartsTab />
        </TabsContent>

        <TabsContent value="strategies">
          <StrategiesTab />
        </TabsContent>

        <TabsContent value="patterns">
          <PatternsTab />
        </TabsContent>

        <TabsContent value="api">
          <ApiConfigTab />
        </TabsContent>

        <TabsContent value="telegram">
          <TelegramTab />
        </TabsContent>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};