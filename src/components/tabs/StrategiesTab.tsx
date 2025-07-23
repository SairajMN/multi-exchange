import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Target, 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  TrendingUp, 
  BarChart3,
  Code,
  Zap,
  TestTube,
  Save,
  Download,
  Upload
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Strategy {
  id: string;
  name: string;
  type: string;
  status: "active" | "paused" | "stopped";
  performance: {
    totalTrades: number;
    winRate: number;
    pnl: number;
    sharpeRatio: number;
  };
  parameters: Record<string, any>;
  exchanges: string[];
  symbols: string[];
}

export const StrategiesTab = () => {
  const { toast } = useToast();
  const [strategies, setStrategies] = useState<Strategy[]>([
    {
      id: "rsi-scalping",
      name: "RSI Scalping",
      type: "Technical",
      status: "active",
      performance: {
        totalTrades: 156,
        winRate: 73.1,
        pnl: 8450.32,
        sharpeRatio: 2.14
      },
      parameters: {
        rsiPeriod: 14,
        oversoldLevel: 30,
        overboughtLevel: 70,
        positionSize: 0.02,
        stopLoss: 0.015,
        takeProfit: 0.025
      },
      exchanges: ["binance", "bybit"],
      symbols: ["BTCUSDT", "ETHUSDT", "ADAUSDT"]
    },
    {
      id: "ma-crossover",
      name: "Moving Average Crossover",
      type: "Trend Following",
      status: "active",
      performance: {
        totalTrades: 89,
        winRate: 64.2,
        pnl: 5623.18,
        sharpeRatio: 1.87
      },
      parameters: {
        fastMA: 20,
        slowMA: 50,
        positionSize: 0.03,
        stopLoss: 0.02,
        takeProfit: 0.04
      },
      exchanges: ["binance"],
      symbols: ["BTCUSDT", "ETHUSDT"]
    }
  ]);

  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [activeTab, setActiveTab] = useState("existing");

  const toggleStrategy = (strategyId: string) => {
    setStrategies(prev => prev.map(strategy => 
      strategy.id === strategyId 
        ? { ...strategy, status: strategy.status === "active" ? "paused" : "active" }
        : strategy
    ));
  };

  const createStrategy = () => {
    const newStrategy: Strategy = {
      id: `strategy-${Date.now()}`,
      name: "New Strategy",
      type: "Custom",
      status: "stopped",
      performance: {
        totalTrades: 0,
        winRate: 0,
        pnl: 0,
        sharpeRatio: 0
      },
      parameters: {},
      exchanges: [],
      symbols: []
    };
    setStrategies(prev => [...prev, newStrategy]);
    setSelectedStrategy(newStrategy);
    setActiveTab("editor");
  };

  const saveStrategy = () => {
    if (selectedStrategy) {
      setStrategies(prev => prev.map(s => s.id === selectedStrategy.id ? selectedStrategy : s));
      toast({
        title: "Strategy Saved",
        description: `${selectedStrategy.name} has been saved successfully`
      });
    }
  };

  const runBacktest = (strategyId: string) => {
    toast({
      title: "Backtest Started",
      description: "Running backtest on historical data...",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Trading Strategies</h2>
          <p className="text-muted-foreground">Create, manage and optimize your trading strategies</p>
        </div>
        <Button onClick={createStrategy} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Strategy
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="existing">Active Strategies</TabsTrigger>
          <TabsTrigger value="editor">Strategy Editor</TabsTrigger>
          <TabsTrigger value="backtest">Backtesting</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>

        <TabsContent value="existing" className="space-y-4">
          <div className="grid gap-4">
            {strategies.map((strategy) => (
              <Card key={strategy.id} className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 ${
                  strategy.status === "active" ? "bg-success" : 
                  strategy.status === "paused" ? "bg-warning" : "bg-muted"
                }`} />
                
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {strategy.name}
                        <Badge variant={strategy.status === "active" ? "default" : "secondary"}>
                          {strategy.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{strategy.type} Strategy</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedStrategy(strategy);
                          setActiveTab("editor");
                        }}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => runBacktest(strategy.id)}
                      >
                        <TestTube className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={strategy.status === "active" ? "destructive" : "default"}
                        size="sm"
                        onClick={() => toggleStrategy(strategy.id)}
                      >
                        {strategy.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{strategy.performance.totalTrades}</div>
                      <div className="text-sm text-muted-foreground">Total Trades</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">{strategy.performance.winRate}%</div>
                      <div className="text-sm text-muted-foreground">Win Rate</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${strategy.performance.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                        ${strategy.performance.pnl.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">P&L</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{strategy.performance.sharpeRatio}</div>
                      <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">Exchanges:</span>
                      {strategy.exchanges.map(exchange => (
                        <Badge key={exchange} variant="outline" className="text-xs">
                          {exchange.charAt(0).toUpperCase() + exchange.slice(1)}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">Symbols:</span>
                      {strategy.symbols.slice(0, 3).map(symbol => (
                        <Badge key={symbol} variant="outline" className="text-xs">
                          {symbol}
                        </Badge>
                      ))}
                      {strategy.symbols.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{strategy.symbols.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="editor" className="space-y-6">
          {selectedStrategy ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Strategy Configuration</CardTitle>
                    <CardDescription>Configure the basic settings for your strategy</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Strategy Name</Label>
                        <Input 
                          value={selectedStrategy.name}
                          onChange={(e) => setSelectedStrategy(prev => prev ? {...prev, name: e.target.value} : null)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Strategy Type</Label>
                        <Select value={selectedStrategy.type}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Technical">Technical Analysis</SelectItem>
                            <SelectItem value="Trend Following">Trend Following</SelectItem>
                            <SelectItem value="Mean Reversion">Mean Reversion</SelectItem>
                            <SelectItem value="Arbitrage">Arbitrage</SelectItem>
                            <SelectItem value="Custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Exchanges</Label>
                      <div className="flex gap-2">
                        {["binance", "bybit", "dhan"].map(exchange => (
                          <div key={exchange} className="flex items-center space-x-2">
                            <Switch 
                              checked={selectedStrategy.exchanges.includes(exchange)}
                              onCheckedChange={(checked) => {
                                setSelectedStrategy(prev => {
                                  if (!prev) return null;
                                  const exchanges = checked 
                                    ? [...prev.exchanges, exchange]
                                    : prev.exchanges.filter(e => e !== exchange);
                                  return {...prev, exchanges};
                                });
                              }}
                            />
                            <Label className="capitalize">{exchange}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Trading Symbols</Label>
                      <Input 
                        placeholder="BTCUSDT,ETHUSDT,ADAUSDT (comma separated)"
                        value={selectedStrategy.symbols.join(",")}
                        onChange={(e) => setSelectedStrategy(prev => prev ? {...prev, symbols: e.target.value.split(",").filter(s => s.trim())} : null)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Parameters</CardTitle>
                    <CardDescription>Fine-tune your strategy parameters</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Position Size (%)</Label>
                        <div className="px-3">
                          <Slider
                            value={[selectedStrategy.parameters.positionSize * 100 || 1]}
                            onValueChange={([value]) => setSelectedStrategy(prev => prev ? {...prev, parameters: {...prev.parameters, positionSize: value / 100}} : null)}
                            max={10}
                            min={0.1}
                            step={0.1}
                          />
                          <div className="text-sm text-muted-foreground mt-1">
                            {(selectedStrategy.parameters.positionSize * 100 || 1).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Stop Loss (%)</Label>
                        <div className="px-3">
                          <Slider
                            value={[selectedStrategy.parameters.stopLoss * 100 || 1]}
                            onValueChange={([value]) => setSelectedStrategy(prev => prev ? {...prev, parameters: {...prev.parameters, stopLoss: value / 100}} : null)}
                            max={10}
                            min={0.1}
                            step={0.1}
                          />
                          <div className="text-sm text-muted-foreground mt-1">
                            {(selectedStrategy.parameters.stopLoss * 100 || 1).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Take Profit (%)</Label>
                      <div className="px-3">
                        <Slider
                          value={[selectedStrategy.parameters.takeProfit * 100 || 2]}
                          onValueChange={([value]) => setSelectedStrategy(prev => prev ? {...prev, parameters: {...prev.parameters, takeProfit: value / 100}} : null)}
                          max={20}
                          min={0.1}
                          step={0.1}
                        />
                        <div className="text-sm text-muted-foreground mt-1">
                          {(selectedStrategy.parameters.takeProfit * 100 || 2).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Custom Logic
                    </CardTitle>
                    <CardDescription>Write custom Python code for your strategy</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder={`# Example strategy logic
def should_buy(data):
    rsi = calculate_rsi(data, period=14)
    return rsi < 30

def should_sell(data):
    rsi = calculate_rsi(data, period=14)
    return rsi > 70

# Your custom strategy code here...`}
                      className="min-h-[200px] font-mono"
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button onClick={saveStrategy} className="w-full gap-2">
                      <Save className="h-4 w-4" />
                      Save Strategy
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                      <TestTube className="h-4 w-4" />
                      Run Backtest
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                      <Download className="h-4 w-4" />
                      Export Strategy
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Risk Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Max Daily Loss</Label>
                      <Input type="number" placeholder="1000" />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Open Positions</Label>
                      <Input type="number" placeholder="5" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch />
                      <Label>Emergency Stop</Label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Strategy Selected</h3>
                  <p className="text-muted-foreground">Select a strategy to edit or create a new one</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="backtest" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Backtesting Engine
              </CardTitle>
              <CardDescription>Test your strategies against historical data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Initial Capital</Label>
                <Input type="number" placeholder="10000" />
              </div>
              <Button className="w-full gap-2">
                <TestTube className="h-4 w-4" />
                Run Backtest
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Strategy Marketplace
              </CardTitle>
              <CardDescription>Browse and import proven trading strategies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🏪</div>
                <h3 className="text-lg font-semibold mb-2">Marketplace Coming Soon</h3>
                <p className="text-muted-foreground">
                  Discover and share trading strategies with the community
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};