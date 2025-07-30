import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target,
  AlertTriangle,
  Zap,
  Clock,
  BarChart3,
  ShoppingCart,
  X,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Position {
  id: string;
  symbol: string;
  side: "buy" | "sell";
  size: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  exchange: string;
  timestamp: string;
}

interface OrderHistory {
  id: string;
  symbol: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  status: "filled" | "pending" | "cancelled";
  timestamp: string;
  exchange: string;
}

export const TradingTab = () => {
  const { toast } = useToast();
  const [activePositions] = useState<Position[]>([]);
  const [orderHistory] = useState<OrderHistory[]>([]);

  const [orderForm, setOrderForm] = useState({
    exchange: "binance",
    symbol: "BTCUSDT",
    type: "market",
    side: "buy",
    amount: "",
    price: "",
    stopLoss: "",
    takeProfit: ""
  });

  const [riskSettings, setRiskSettings] = useState({
    maxPositionSize: 5,
    maxDailyLoss: 1000,
    autoStopLoss: true,
    autoTakeProfit: true,
    emergencyStop: false
  });

  const placeOrder = () => {
    if (!orderForm.amount) {
      toast({
        title: "Invalid Order",
        description: "Please enter the order amount",
        variant: "destructive"
      });
      return;
    }

    if (orderForm.type === "limit" && !orderForm.price) {
      toast({
        title: "Invalid Order",
        description: "Please enter the limit price",
        variant: "destructive"
      });
      return;
    }

    // Simulate order placement
    toast({
      title: "Order Placed",
      description: `${orderForm.side.toUpperCase()} order for ${orderForm.amount} ${orderForm.symbol} has been placed`,
    });

    // Reset form
    setOrderForm(prev => ({ ...prev, amount: "", price: "" }));
  };

  const closePosition = (positionId: string) => {
    toast({
      title: "Position Closed",
      description: "Position has been closed successfully"
    });
  };

  const cancelOrder = (orderId: string) => {
    toast({
      title: "Order Cancelled",
      description: "Order has been cancelled"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "filled":
        return <Badge className="bg-success text-success-foreground">Filled</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manual Trading</h2>
          <p className="text-muted-foreground">Execute manual trades and manage positions</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={riskSettings.emergencyStop ? "destructive" : "secondary"}>
            {riskSettings.emergencyStop ? "Emergency Stop Active" : "Normal Operation"}
          </Badge>
          <Button
            variant={riskSettings.emergencyStop ? "default" : "destructive"}
            onClick={() => setRiskSettings(prev => ({ ...prev, emergencyStop: !prev.emergencyStop }))}
            className="gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            {riskSettings.emergencyStop ? "Resume Trading" : "Emergency Stop"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="positions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="positions">Open Positions</TabsTrigger>
          <TabsTrigger value="orders">Order History</TabsTrigger>
          <TabsTrigger value="manual">Manual Trade</TabsTrigger>
          <TabsTrigger value="risk">Risk Management</TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Active Positions
              </CardTitle>
              <CardDescription>Currently open trading positions across all exchanges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activePositions.length === 0 ? (
                  <div className="text-muted-foreground text-center">No open positions.</div>
                ) : (
                  activePositions.map((position) => (
                    <div key={position.id} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            position.side === "buy" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                          }`}>
                            {position.side === "buy" ? 
                              <TrendingUp className="h-4 w-4" /> : 
                              <TrendingDown className="h-4 w-4" />
                            }
                          </div>
                          <div>
                            <div className="font-semibold">{position.symbol}</div>
                            <div className="text-sm text-muted-foreground">
                              {position.exchange} • {position.timestamp}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => closePosition(position.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Close
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Size: </span>
                          <span className="font-medium">{position.size}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Entry: </span>
                          <span className="font-medium">${position.entryPrice.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Current: </span>
                          <span className="font-medium">${position.currentPrice.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">P&L: </span>
                          <span className={`font-medium ${position.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                            ${position.pnl.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">%: </span>
                          <span className={`font-medium ${position.pnlPercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Order History
              </CardTitle>
              <CardDescription>Recent trading orders and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orderHistory.length === 0 ? (
                  <div className="text-muted-foreground text-center">No order history.</div>
                ) : (
                  orderHistory.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${
                          order.type === "buy" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                        }`}>
                          {order.type === "buy" ? 
                            <TrendingUp className="h-4 w-4" /> : 
                            <TrendingDown className="h-4 w-4" />
                          }
                        </div>
                        <div>
                          <div className="font-semibold">{order.symbol}</div>
                          <div className="text-sm text-muted-foreground">
                            {order.exchange} • {order.timestamp}
                          </div>
                        </div>
                        <div className="text-sm">
                          <div>{order.type.toUpperCase()} {order.amount}</div>
                          <div className="text-muted-foreground">@ ${order.price.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(order.status)}
                        {order.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => cancelOrder(order.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Place Order
                  </CardTitle>
                  <CardDescription>Execute manual buy/sell orders</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Exchange</Label>
                      <Select value={orderForm.exchange} onValueChange={(value) => setOrderForm(prev => ({ ...prev, exchange: value }))}>
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
                      <Select value={orderForm.symbol} onValueChange={(value) => setOrderForm(prev => ({ ...prev, symbol: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BTCUSDT">BTCUSDT</SelectItem>
                          <SelectItem value="ETHUSDT">ETHUSDT</SelectItem>
                          <SelectItem value="ADAUSDT">ADAUSDT</SelectItem>
                          <SelectItem value="RELIANCE">RELIANCE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Order Type</Label>
                      <Select value={orderForm.type} onValueChange={(value) => setOrderForm(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="market">Market</SelectItem>
                          <SelectItem value="limit">Limit</SelectItem>
                          <SelectItem value="stop">Stop Loss</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Side</Label>
                      <Select value={orderForm.side} onValueChange={(value) => setOrderForm(prev => ({ ...prev, side: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="buy">Buy</SelectItem>
                          <SelectItem value="sell">Sell</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        placeholder="0.001"
                        value={orderForm.amount}
                        onChange={(e) => setOrderForm(prev => ({ ...prev, amount: e.target.value }))}
                      />
                    </div>
                    {orderForm.type === "limit" && (
                      <div className="space-y-2">
                        <Label>Price</Label>
                        <Input
                          type="number"
                          placeholder="43000"
                          value={orderForm.price}
                          onChange={(e) => setOrderForm(prev => ({ ...prev, price: e.target.value }))}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Stop Loss</Label>
                      <Input
                        type="number"
                        placeholder="Optional"
                        value={orderForm.stopLoss}
                        onChange={(e) => setOrderForm(prev => ({ ...prev, stopLoss: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Take Profit</Label>
                      <Input
                        type="number"
                        placeholder="Optional"
                        value={orderForm.takeProfit}
                        onChange={(e) => setOrderForm(prev => ({ ...prev, takeProfit: e.target.value }))}
                      />
                    </div>
                  </div>

                  <Button onClick={placeOrder} className="w-full gap-2">
                    <Zap className="h-4 w-4" />
                    Place {orderForm.side.toUpperCase()} Order
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Symbol:</span>
                    <span className="font-medium">{orderForm.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Side:</span>
                    <span className={`font-medium ${orderForm.side === "buy" ? "text-success" : "text-destructive"}`}>
                      {orderForm.side.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium">{orderForm.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium">{orderForm.amount || "0"}</span>
                  </div>
                  {orderForm.type === "limit" && (
                    <div className="flex justify-between">
                      <span>Price:</span>
                      <span className="font-medium">${orderForm.price || "0"}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Est. Total:</span>
                    <span className="font-medium">
                      ${(parseFloat(orderForm.amount || "0") * parseFloat(orderForm.price || "43000")).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Close All Positions
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Cancel All Orders
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Hedge Portfolio
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Risk Management Settings
              </CardTitle>
              <CardDescription>Configure risk parameters and safety measures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Max Position Size (%): {riskSettings.maxPositionSize}%</Label>
                    <Slider
                      value={[riskSettings.maxPositionSize]}
                      onValueChange={([value]) => setRiskSettings(prev => ({ ...prev, maxPositionSize: value }))}
                      max={20}
                      min={1}
                      step={0.5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Max Daily Loss: ${riskSettings.maxDailyLoss}</Label>
                    <Slider
                      value={[riskSettings.maxDailyLoss]}
                      onValueChange={([value]) => setRiskSettings(prev => ({ ...prev, maxDailyLoss: value }))}
                      max={10000}
                      min={100}
                      step={100}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Auto Stop Loss</Label>
                    <Switch
                      checked={riskSettings.autoStopLoss}
                      onCheckedChange={(value) => setRiskSettings(prev => ({ ...prev, autoStopLoss: value }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Auto Take Profit</Label>
                    <Switch
                      checked={riskSettings.autoTakeProfit}
                      onCheckedChange={(value) => setRiskSettings(prev => ({ ...prev, autoTakeProfit: value }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Emergency Stop</Label>
                    <Switch
                      checked={riskSettings.emergencyStop}
                      onCheckedChange={(value) => setRiskSettings(prev => ({ ...prev, emergencyStop: value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Save Risk Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};