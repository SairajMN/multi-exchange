import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity,
  Target,
  Clock,
  Award,
  AlertTriangle
} from "lucide-react";

export const OverviewTab = () => {
  const portfolioData = [
    { exchange: "Binance", balance: "$45,234.56", change: "+5.2%" },
    { exchange: "Bybit", balance: "$23,890.12", change: "-1.8%" },
    { exchange: "Dhan", balance: "$12,456.78", change: "+2.4%" }
  ];

  const recentTrades = [
    { symbol: "BTCUSDT", type: "BUY", amount: "$2,500", pnl: "+$125.50", time: "2 min ago" },
    { symbol: "ETHUSDT", type: "SELL", amount: "$1,800", pnl: "-$45.20", time: "5 min ago" },
    { symbol: "RELIANCE", type: "BUY", amount: "$3,200", pnl: "+$89.10", time: "8 min ago" }
  ];

  const strategies = [
    { name: "RSI Scalping", status: "Active", trades: 15, winRate: 73.3 },
    { name: "MA Cross", status: "Active", trades: 8, winRate: 87.5 },
    { name: "Pattern Recognition", status: "Paused", trades: 12, winRate: 66.7 }
  ];

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Portfolio Performance
            </CardTitle>
            <CardDescription>Total portfolio value across all exchanges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">$81,581.46</span>
                <Badge className="bg-success text-success-foreground">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12.8%
                </Badge>
              </div>
              <div className="space-y-2">
                {portfolioData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="font-medium">{item.exchange}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{item.balance}</div>
                      <div className={`text-sm ${item.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                        {item.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Bot Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Uptime</span>
                <span className="text-sm font-medium">23h 45m</span>
              </div>
              <Progress value={98.8} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Success Rate</span>
                <span className="text-sm font-medium">73.8%</span>
              </div>
              <Progress value={73.8} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Active Strategies</span>
                <span className="text-sm font-medium">2 of 3</span>
              </div>
              <Progress value={66.7} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Trades & Active Strategies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Trades
            </CardTitle>
            <CardDescription>Latest executed trades across all exchanges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTrades.map((trade, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={trade.type === "BUY" ? "default" : "secondary"}>
                        {trade.type}
                      </Badge>
                      <span className="font-medium">{trade.symbol}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {trade.amount} • {trade.time}
                    </div>
                  </div>
                  <div className={`font-semibold ${trade.pnl.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                    {trade.pnl}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Active Strategies
            </CardTitle>
            <CardDescription>Performance of trading strategies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {strategies.map((strategy, index) => (
                <div key={index} className="p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{strategy.name}</span>
                    <Badge variant={strategy.status === "Active" ? "default" : "secondary"}>
                      {strategy.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Trades: </span>
                      <span className="font-medium">{strategy.trades}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Win Rate: </span>
                      <span className={`font-medium ${strategy.winRate > 70 ? 'text-success' : 'text-warning'}`}>
                        {strategy.winRate}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Management & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Max Drawdown</span>
              <span className="text-sm font-medium text-destructive">-3.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Daily Risk</span>
              <span className="text-sm font-medium">2.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Sharpe Ratio</span>
              <span className="text-sm font-medium text-success">2.14</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Today's Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Trades Executed</span>
              <span className="text-sm font-medium">47</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Profitable Trades</span>
              <span className="text-sm font-medium text-success">35</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Daily P&L</span>
              <span className="text-sm font-medium text-success">+$1,245.67</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">API Latency</span>
              <span className="text-sm font-medium text-success">12ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Memory Usage</span>
              <span className="text-sm font-medium">65%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">CPU Usage</span>
              <span className="text-sm font-medium">23%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};