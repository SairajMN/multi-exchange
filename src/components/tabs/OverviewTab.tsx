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
  // Remove all sample/mock data
  const portfolioData: any[] = [];
  const recentTrades: any[] = [];
  const strategies: any[] = [];

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
                <span className="text-3xl font-bold">$0.00</span>
                <Badge className="bg-success text-success-foreground">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  0%
                </Badge>
              </div>
              <div className="space-y-2">
                {portfolioData.length === 0 ? (
                  <div className="text-muted-foreground text-center">No portfolio data available.</div>
                ) : (
                  portfolioData.map((item, index) => (
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
                  ))
                )}
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
            {/* Show empty stats */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Uptime</span>
                <span className="text-sm font-medium">0h 0m</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Success Rate</span>
                <span className="text-sm font-medium">0%</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Active Strategies</span>
                <span className="text-sm font-medium">0 of 0</span>
              </div>
              <Progress value={0} className="h-2" />
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
              {recentTrades.length === 0 ? (
                <div className="text-muted-foreground text-center">No recent trades.</div>
              ) : (
                recentTrades.map((trade, index) => (
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
                ))
              )}
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
              {strategies.length === 0 ? (
                <div className="text-muted-foreground text-center">No active strategies.</div>
              ) : (
                strategies.map((strategy, index) => (
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
                ))
              )}
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
              <span className="text-sm font-medium text-destructive">0%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Daily Risk</span>
              <span className="text-sm font-medium">0%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Sharpe Ratio</span>
              <span className="text-sm font-medium text-success">0</span>
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
              <span className="text-sm font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Profitable Trades</span>
              <span className="text-sm font-medium text-success">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Daily P&L</span>
              <span className="text-sm font-medium text-success">$0.00</span>
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
              <span className="text-sm font-medium text-success">0ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Memory Usage</span>
              <span className="text-sm font-medium">0%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">CPU Usage</span>
              <span className="text-sm font-medium">0%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};