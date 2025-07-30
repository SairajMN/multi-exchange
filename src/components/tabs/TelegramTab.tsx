import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Bot, 
  Send, 
  CheckCircle, 
  XCircle, 
  Settings,
  Bell,
  Users,
  Shield,
  Zap,
  Copy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TelegramConfig {
  botToken: string;
  chatId: string;
  connected: boolean;
  notifications: {
    tradeAlerts: boolean;
    patternDetection: boolean;
    profitLoss: boolean;
    systemStatus: boolean;
    dailyReports: boolean;
  };
}

interface TelegramMessage {
  id: string;
  type: "trade" | "pattern" | "system" | "report";
  message: string;
  timestamp: string;
  sent: boolean;
}

export const TelegramTab = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<TelegramConfig>({
    botToken: "",
    chatId: "",
    connected: false,
    notifications: {
      tradeAlerts: true,
      patternDetection: true,
      profitLoss: true,
      systemStatus: false,
      dailyReports: true
    }
  });

  // Remove all sample/mock messages
  const [messages] = useState<TelegramMessage[]>([]);

  const [testMessage, setTestMessage] = useState("");

  const connectTelegram = async () => {
    if (!config.botToken || !config.chatId) {
      toast({
        title: "Missing Information",
        description: "Please enter both Bot Token and Chat ID",
        variant: "destructive"
      });
      return;
    }

    // Simulate connection
    setTimeout(() => {
      setConfig(prev => ({ ...prev, connected: true }));
      toast({
        title: "Telegram Connected",
        description: "Successfully connected to Telegram bot"
      });
    }, 1500);
  };

  const disconnectTelegram = () => {
    setConfig(prev => ({ ...prev, connected: false }));
    toast({
      title: "Telegram Disconnected",
      description: "Bot has been disconnected"
    });
  };

  const sendTestMessage = async () => {
    if (!testMessage.trim()) {
      toast({
        title: "Empty Message",
        description: "Please enter a test message",
        variant: "destructive"
      });
      return;
    }

    if (!config.connected) {
      toast({
        title: "Not Connected",
        description: "Please connect to Telegram first",
        variant: "destructive"
      });
      return;
    }

    // Simulate sending message
    toast({
      title: "Test Message Sent",
      description: "Check your Telegram for the test message"
    });
    setTestMessage("");
  };

  const updateNotificationSetting = (key: keyof typeof config.notifications, value: boolean) => {
    setConfig(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case "trade":
        return "🚀";
      case "pattern":
        return "📊";
      case "system":
        return "⚠️";
      case "report":
        return "📈";
      default:
        return "💬";
    }
  };

  const copyBotToken = () => {
    navigator.clipboard.writeText(config.botToken);
    toast({
      title: "Copied",
      description: "Bot token copied to clipboard"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Telegram Integration</h2>
          <p className="text-muted-foreground">Configure Telegram bot for real-time trading alerts</p>
        </div>
        <Badge variant={config.connected ? "default" : "secondary"} className="gap-2">
          {config.connected ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          {config.connected ? "Connected" : "Disconnected"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Bot Configuration
              </CardTitle>
              <CardDescription>Set up your Telegram bot credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>How to create a Telegram bot:</strong><br />
                  1. Message @BotFather on Telegram<br />
                  2. Send /newbot and follow instructions<br />
                  3. Copy the bot token provided<br />
                  4. Add your bot to a chat and get the chat ID
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bot-token">Bot Token</Label>
                  <div className="flex gap-2">
                    <Input
                      id="bot-token"
                      type="password"
                      placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                      value={config.botToken}
                      onChange={(e) => setConfig(prev => ({ ...prev, botToken: e.target.value }))}
                    />
                    <Button variant="outline" size="icon" onClick={copyBotToken}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chat-id">Chat ID</Label>
                  <Input
                    id="chat-id"
                    placeholder="-1001234567890 or 123456789"
                    value={config.chatId}
                    onChange={(e) => setConfig(prev => ({ ...prev, chatId: e.target.value }))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Use @userinfobot to get your chat ID or group chat ID
                  </p>
                </div>

                <div className="flex gap-2">
                  {!config.connected ? (
                    <Button onClick={connectTelegram} className="gap-2">
                      <Zap className="h-4 w-4" />
                      Connect Bot
                    </Button>
                  ) : (
                    <Button variant="destructive" onClick={disconnectTelegram} className="gap-2">
                      <XCircle className="h-4 w-4" />
                      Disconnect
                    </Button>
                  )}
                  <Button variant="outline" disabled={!config.connected}>
                    <Settings className="h-4 w-4 mr-2" />
                    Test Connection
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure which events trigger Telegram notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="font-medium">Trade Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Buy/sell signals and order confirmations
                    </p>
                  </div>
                  <Switch
                    checked={config.notifications.tradeAlerts}
                    onCheckedChange={(value) => updateNotificationSetting("tradeAlerts", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="font-medium">Pattern Detection</Label>
                    <p className="text-sm text-muted-foreground">
                      Chart pattern recognition alerts
                    </p>
                  </div>
                  <Switch
                    checked={config.notifications.patternDetection}
                    onCheckedChange={(value) => updateNotificationSetting("patternDetection", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="font-medium">Profit & Loss Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Real-time P&L and position updates
                    </p>
                  </div>
                  <Switch
                    checked={config.notifications.profitLoss}
                    onCheckedChange={(value) => updateNotificationSetting("profitLoss", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="font-medium">System Status</Label>
                    <p className="text-sm text-muted-foreground">
                      API connections, errors, and system health
                    </p>
                  </div>
                  <Switch
                    checked={config.notifications.systemStatus}
                    onCheckedChange={(value) => updateNotificationSetting("systemStatus", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="font-medium">Daily Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      End-of-day performance summary
                    </p>
                  </div>
                  <Switch
                    checked={config.notifications.dailyReports}
                    onCheckedChange={(value) => updateNotificationSetting("dailyReports", value)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Label className="font-medium mb-2 block">Report Schedule</Label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Every Hour</SelectItem>
                    <SelectItem value="daily">Daily at 8:00 AM</SelectItem>
                    <SelectItem value="weekly">Weekly Summary</SelectItem>
                    <SelectItem value="custom">Custom Schedule</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Test Message
              </CardTitle>
              <CardDescription>Send a test message to verify your setup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Test Message</Label>
                <Textarea
                  placeholder="Enter your test message..."
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  rows={3}
                />
              </div>
              <Button 
                onClick={sendTestMessage} 
                disabled={!config.connected}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                Send Test Message
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Message History */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Messages
              </CardTitle>
              <CardDescription>Last 10 messages sent to Telegram</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-muted-foreground text-center">No messages sent yet.</div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className="p-3 rounded-lg border">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{getMessageIcon(message.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm break-words">{message.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                            {message.sent ? (
                              <CheckCircle className="h-3 w-3 text-success" />
                            ) : (
                              <XCircle className="h-3 w-3 text-destructive" />
                            )}
                          </div>
                        </div>
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
                <Users className="h-5 w-5" />
                Bot Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Messages Sent Today</span>
                <span className="text-sm font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total Messages</span>
                <span className="text-sm font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Success Rate</span>
                <span className="text-sm font-medium text-success">0%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Last Message</span>
                <span className="text-sm font-medium">-</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                Send Portfolio Summary
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Send Open Positions
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Send Performance Report
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Send System Status
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};