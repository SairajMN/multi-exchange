import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Chart,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartContainer,
  ChartStyle,
} from "@/components/ui/chart";
import {
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Settings,
  Maximize,
  Download,
  RefreshCw,
  Target,
  Zap,
  Wifi,
  WifiOff
} from "lucide-react";
import { useCryptoData } from "@/hooks/use-crypto-data";

interface ChartData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface Indicator {
  name: string;
  enabled: boolean;
  color: string;
  settings: Record<string, any>;
}

export const ChartsTab = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1h");
  const [selectedExchange, setSelectedExchange] = useState("bybit");
  const [useRealData, setUseRealData] = useState(false);
  const [indicators, setIndicators] = useState<Indicator[]>([
    { name: "SMA 20", enabled: true, color: "#3B82F6", settings: { period: 20 } },
    { name: "SMA 50", enabled: true, color: "#EF4444", settings: { period: 50 } },
    { name: "RSI", enabled: false, color: "#8B5CF6", settings: { period: 14 } },
    { name: "MACD", enabled: false, color: "#06B6D4", settings: { fast: 12, slow: 26, signal: 9 } },
    { name: "Bollinger Bands", enabled: false, color: "#10B981", settings: { period: 20, stdDev: 2 } },
  ]);

  const [patternOverlay, setPatternOverlay] = useState(true);
  const [volumeChart, setVolumeChart] = useState(true);
  const [gridLines, setGridLines] = useState(true);
  const [livePatternDetection, setLivePatternDetection] = useState(false);
  const [detectedPatterns, setDetectedPatterns] = useState<any[]>([]);

  // Use the real-time crypto data hook
  const { currentPrice, chartData: realChartData, isLoading, error, fetchRealTimeData } = useCryptoData();

  // Generate sample chart data for fallback
  const generateSampleData = () => {
    const data: ChartData[] = [];
    let basePrice = selectedExchange === "dhan" ? 2500 : 43000;
    const now = Date.now();

    for (let i = 100; i >= 0; i--) {
      const time = now - (i * 60 * 60 * 1000); // 1 hour intervals
      const volatility = selectedExchange === "dhan" ? 0.015 : 0.02;
      const change = (Math.random() - 0.5) * 2 * volatility;

      const open = basePrice;
      const close = open * (1 + change);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      const volume = selectedExchange === "dhan"
        ? Math.random() * 50000 + 25000
        : Math.random() * 1000000 + 500000;

      data.push({
        time,
        open,
        high,
        low,
        close,
        volume
      });

      basePrice = close;
    }

    return data;
  };

  // Use real data or fallback to sample data
  const chartData = useRealData && realChartData.length > 0 ? realChartData : generateSampleData();

  // Fetch real-time data when symbol or exchange changes
  useEffect(() => {
    if (useRealData && selectedExchange !== "dhan") {
      fetchRealTimeData(selectedSymbol, selectedExchange);
    }
  }, [selectedSymbol, selectedExchange, useRealData, fetchRealTimeData]);

  // Auto-refresh real-time data every 30 seconds
  useEffect(() => {
    if (!useRealData || selectedExchange === "dhan") return;

    const interval = setInterval(() => {
      fetchRealTimeData(selectedSymbol, selectedExchange);
    }, 30000);

    return () => clearInterval(interval);
  }, [useRealData, selectedSymbol, selectedExchange, fetchRealTimeData]);

  const toggleIndicator = (indicatorName: string) => {
    setIndicators(prev => prev.map(ind =>
      ind.name === indicatorName
        ? { ...ind, enabled: !ind.enabled }
        : ind
    ));
  };

  const refreshChartData = async () => {
    if (useRealData && selectedExchange !== "dhan") {
      fetchRealTimeData(selectedSymbol, selectedExchange);
    } else {
      // Simulate refresh for sample data
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Force re-render by updating state
      setSelectedSymbol(prev => prev);
    }
  };

  const toggleRealData = () => {
    setUseRealData(!useRealData);
    if (!useRealData && selectedExchange !== "dhan") {
      fetchRealTimeData(selectedSymbol, selectedExchange);
    }
  };

  const symbols = {
    binance: [
      { value: "BTCUSDT", label: "Bitcoin", type: "crypto" },
      { value: "ETHUSDT", label: "Ethereum", type: "crypto" },
      { value: "ADAUSDT", label: "Cardano", type: "crypto" },
      { value: "SOLUSDT", label: "Solana", type: "crypto" },
      { value: "BTCFDUSD", label: "Bitcoin Futures", type: "futures" },
      { value: "ETHFDUSD", label: "Ethereum Futures", type: "futures" },
    ],
    bybit: [
      { value: "BTCUSDT", label: "Bitcoin", type: "crypto" },
      { value: "ETHUSDT", label: "Ethereum", type: "crypto" },
      { value: "BTCUSD", label: "Bitcoin Perpetual", type: "derivatives" },
      { value: "ETHUSD", label: "Ethereum Perpetual", type: "derivatives" },
      { value: "10000LADYSUSDT", label: "LADYS/USDT", type: "altcoin" },
    ],
    dhan: [
      { value: "RELIANCE", label: "Reliance Industries", type: "equity" },
      { value: "TCS", label: "Tata Consultancy Services", type: "equity" },
      { value: "INFY", label: "Infosys", type: "equity" },
      { value: "HDFCBANK", label: "HDFC Bank", type: "equity" },
      { value: "RELIANCE24JULFUT", label: "Reliance July Futures", type: "futures" },
      { value: "NIFTY", label: "Nifty 50 Index", type: "index" },
      { value: "BANKNIFTY", label: "Bank Nifty Index", type: "index" },
    ]
  };

  const timeframes = {
    binance: [
      { value: "1m", label: "1 Minute" },
      { value: "3m", label: "3 Minutes" },
      { value: "5m", label: "5 Minutes" },
      { value: "15m", label: "15 Minutes" },
      { value: "30m", label: "30 Minutes" },
      { value: "1h", label: "1 Hour" },
      { value: "2h", label: "2 Hours" },
      { value: "4h", label: "4 Hours" },
      { value: "6h", label: "6 Hours" },
      { value: "8h", label: "8 Hours" },
      { value: "12h", label: "12 Hours" },
      { value: "1d", label: "1 Day" },
      { value: "3d", label: "3 Days" },
      { value: "1w", label: "1 Week" },
      { value: "1M", label: "1 Month" },
    ],
    bybit: [
      { value: "1m", label: "1 Minute" },
      { value: "3m", label: "3 Minutes" },
      { value: "5m", label: "5 Minutes" },
      { value: "15m", label: "15 Minutes" },
      { value: "30m", label: "30 Minutes" },
      { value: "1h", label: "1 Hour" },
      { value: "2h", label: "2 Hours" },
      { value: "4h", label: "4 Hours" },
      { value: "6h", label: "6 Hours" },
      { value: "12h", label: "12 Hours" },
      { value: "1d", label: "1 Day" },
      { value: "1w", label: "1 Week" },
    ],
    dhan: [
      { value: "1m", label: "1 Minute" },
      { value: "5m", label: "5 Minutes" },
      { value: "15m", label: "15 Minutes" },
      { value: "30m", label: "30 Minutes" },
      { value: "1h", label: "1 Hour" },
      { value: "1d", label: "1 Day" },
      { value: "1w", label: "1 Week" },
      { value: "1M", label: "1 Month" },
    ]
  };

  const sampleCurrentPrice = chartData.length > 0 ? chartData[chartData.length - 1].close : 0;
  const priceChange = chartData.length > 1
    ? ((chartData[chartData.length - 1].close - chartData[chartData.length - 2].close) / chartData[chartData.length - 2].close) * 100
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advanced Charts</h2>
          <p className="text-muted-foreground">Real-time price charts with technical analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={useRealData ? "default" : "outline"}
            size="sm"
            onClick={toggleRealData}
            disabled={selectedExchange === "dhan"}
          >
            {useRealData ? <Wifi className="h-4 w-4 mr-2" /> : <WifiOff className="h-4 w-4 mr-2" />}
            {useRealData ? 'Live Data' : 'Sample Data'}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={refreshChartData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button variant="outline" size="sm">
            <Maximize className="h-4 w-4 mr-2" />
            Fullscreen
          </Button>
        </div>
      </div>

      {/* Real-time Price Display */}
      {useRealData && currentPrice && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold">{currentPrice.symbol}</h3>
                  <p className="text-2xl font-bold text-green-600">
                    ${currentPrice.price.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {currentPrice.change24h >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`font-medium ${currentPrice.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {currentPrice.change24h >= 0 ? '+' : ''}{currentPrice.change24h.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div>24h High: ${currentPrice.high24h.toLocaleString()}</div>
                <div>24h Low: ${currentPrice.low24h.toLocaleString()}</div>
                <div>Volume: {currentPrice.volume.toLocaleString()}</div>
                <div>Updated: {new Date(currentPrice.lastUpdated).toLocaleTimeString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {useRealData && error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600">
              <WifiOff className="h-4 w-4" />
              <span className="font-medium">Error fetching live data: {error}</span>
            </div>
            <p className="text-sm text-red-500 mt-1">
              Falling back to sample data. Make sure the proxy server is running.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Chart Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Exchange</Label>
                <Select value={selectedExchange} onValueChange={setSelectedExchange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="binance">Binance</SelectItem>
                    <SelectItem value="bybit">Bybit</SelectItem>
                    <SelectItem value="dhan">Dhan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Symbol</Label>
                <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {symbols[selectedExchange as keyof typeof symbols]?.map(symbol => (
                      <SelectItem key={symbol.value} value={symbol.value}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {symbol.type}
                          </Badge>
                          {symbol.label} ({symbol.value})
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Timeframe</Label>
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeframes[selectedExchange as keyof typeof timeframes]?.map(tf => (
                      <SelectItem key={tf.value} value={tf.value}>
                        {tf.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Exchange-specific options */}
              {selectedExchange === "dhan" && (
                <div className="space-y-3 p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <Label className="font-medium">Dhan Live Features</Label>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Live Pattern Detection</Label>
                    <Switch
                      checked={livePatternDetection}
                      onCheckedChange={setLivePatternDetection}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Real-time Alerts</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Market Depth</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Pattern Overlay</Label>
                  <Switch
                    checked={patternOverlay}
                    onCheckedChange={setPatternOverlay}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Volume Chart</Label>
                  <Switch
                    checked={volumeChart}
                    onCheckedChange={setVolumeChart}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Grid Lines</Label>
                  <Switch
                    checked={gridLines}
                    onCheckedChange={setGridLines}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technical Indicators</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {indicators.map((indicator) => (
                <div key={indicator.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: indicator.color }}
                    />
                    <Label className="text-sm">{indicator.name}</Label>
                  </div>
                  <Switch
                    checked={indicator.enabled}
                    onCheckedChange={() => toggleIndicator(indicator.name)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Current Price</span>
                <span className="font-semibold">
                  {selectedExchange === "dhan" ? "₹" : "$"}{sampleCurrentPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">24h Change</span>
                <span className={`font-semibold ${priceChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Volume</span>
                <span className="font-semibold">1.2M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Market Cap</span>
                <span className="font-semibold">$840B</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chart Area */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CardTitle className="text-xl">{selectedSymbol}</CardTitle>
                  <Badge variant="outline">{selectedExchange.charAt(0).toUpperCase() + selectedExchange.slice(1)}</Badge>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      {selectedExchange === "dhan" ? "₹" : "$"}{sampleCurrentPrice.toLocaleString()}
                    </span>
                    <Badge variant={priceChange >= 0 ? "default" : "destructive"} className="gap-1">
                      {priceChange >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {indicators.filter(ind => ind.enabled).map(ind => (
                    <Badge key={ind.name} variant="outline" className="text-xs" style={{ borderColor: ind.color }}>
                      {ind.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div
                ref={chartRef}
                className="w-full h-96 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg border-2 border-dashed border-muted flex items-center justify-center"
              >
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Advanced Chart View</h3>
                  <p className="text-muted-foreground mb-4">
                    Real-time {selectedSymbol} chart with {indicators.filter(ind => ind.enabled).length} active indicators
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-semibold">OHLCV Data</div>
                      <div className="text-muted-foreground">{chartData.length} candles loaded</div>
                    </div>
                    <div>
                      <div className="font-semibold">Timeframe</div>
                      <div className="text-muted-foreground">
                        {timeframes[selectedExchange as keyof typeof timeframes]?.find(tf => tf.value === selectedTimeframe)?.label}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {volumeChart && (
                <div className="w-full h-24 bg-muted/20 rounded-lg mt-4 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Volume Chart</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="watchlist" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
              <TabsTrigger value="patterns">Detected Patterns</TabsTrigger>
              <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value="watchlist">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Watchlist
                  </CardTitle>
                  <CardDescription>Track multiple symbols simultaneously</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {symbols[selectedExchange as keyof typeof symbols]?.slice(0, 4).map((symbol, index) => {
                      const mockPrice = selectedExchange === "dhan"
                        ? 2500 + (index * 200) + (Math.random() - 0.5) * 100
                        : 43000 + (index * 1000) + (Math.random() - 0.5) * 500;
                      const mockChange = (Math.random() - 0.5) * 10;

                      return (
                        <div key={symbol.value} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">
                              {symbol.type}
                            </Badge>
                            <div>
                              <div className="font-semibold">{symbol.value}</div>
                              <div className="text-sm text-muted-foreground">{symbol.label}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              {selectedExchange === "dhan" ? "₹" : "$"}{mockPrice.toLocaleString()}
                            </div>
                            <div className={`text-sm ${mockChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                              {mockChange >= 0 ? '+' : ''}{mockChange.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="patterns">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Pattern Detection
                    {selectedExchange === "dhan" && livePatternDetection && (
                      <Badge className="bg-success text-success-foreground gap-1">
                        <div className="w-2 h-2 bg-success-foreground rounded-full animate-pulse" />
                        Live
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {selectedExchange === "dhan" && livePatternDetection
                      ? "Real-time AI pattern detection with Dhan live data"
                      : "AI-detected chart patterns on current timeframe"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedExchange === "dhan" && livePatternDetection ? (
                      <>
                        <div className="flex items-center justify-between p-3 rounded-lg border bg-success/10">
                          <div className="flex items-center gap-3">
                            <TrendingUp className="h-5 w-5 text-success" />
                            <div>
                              <div className="font-semibold">Ascending Triangle</div>
                              <div className="text-sm text-muted-foreground">Live detection - {selectedSymbol}</div>
                            </div>
                          </div>
                          <Badge className="bg-success text-success-foreground">92% confidence</Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border bg-primary/10">
                          <div className="flex items-center gap-3">
                            <Target className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-semibold">Support Level Break</div>
                              <div className="text-sm text-muted-foreground">Detected 2 minutes ago</div>
                            </div>
                          </div>
                          <Badge className="bg-primary text-primary-foreground">85% confidence</Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border bg-destructive/10">
                          <div className="flex items-center gap-3">
                            <TrendingDown className="h-5 w-5 text-destructive" />
                            <div>
                              <div className="font-semibold">Double Top Formation</div>
                              <div className="text-sm text-muted-foreground">Detected 5 minutes ago</div>
                            </div>
                          </div>
                          <Badge variant="destructive">78% confidence</Badge>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <TrendingUp className="h-5 w-5 text-success" />
                            <div>
                              <div className="font-semibold">Bullish Flag</div>
                              <div className="text-sm text-muted-foreground">Detected 5 minutes ago</div>
                            </div>
                          </div>
                          <Badge className="bg-success text-success-foreground">87% confidence</Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <TrendingDown className="h-5 w-5 text-destructive" />
                            <div>
                              <div className="font-semibold">Head & Shoulders</div>
                              <div className="text-sm text-muted-foreground">Detected 12 minutes ago</div>
                            </div>
                          </div>
                          <Badge variant="destructive">74% confidence</Badge>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Price Alerts
                  </CardTitle>
                  <CardDescription>Set price alerts for automated notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Active Alerts</h3>
                    <p className="text-muted-foreground mb-4">
                      Set price alerts to get notified when your targets are reached
                    </p>
                    <Button>Create Alert</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};