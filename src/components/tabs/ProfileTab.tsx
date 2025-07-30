import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, 
  Settings, 
  Download, 
  Upload, 
  Shield,
  Bell,
  Palette,
  Database,
  Key,
  Activity,
  Award,
  Clock,
  DollarSign
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  timezone: string;
  language: string;
  bio: string;
}

interface TradingSettings {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    telegram: boolean;
  };
  preferences: {
    darkMode: boolean;
    soundAlerts: boolean;
    autoSave: boolean;
    confirmOrders: boolean;
  };
  limits: {
    dailyLoss: number;
    maxPositions: number;
    orderTimeout: number;
  };
}

export const ProfileTab = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    timezone: "UTC",
    language: "en",
    bio: ""
  });

  const [settings, setSettings] = useState<TradingSettings>({
    notifications: {
      email: false,
      sms: false,
      push: false,
      telegram: false
    },
    preferences: {
      darkMode: false,
      soundAlerts: false,
      autoSave: false,
      confirmOrders: false
    },
    limits: {
      dailyLoss: 0,
      maxPositions: 0,
      orderTimeout: 0
    }
  });

  const tradingStats = {
    totalTrades: 0,
    winRate: 0,
    totalPnL: 0,
    activeDays: 0,
    avgDailyReturn: 0,
    sharpeRatio: 0,
    maxDrawdown: 0,
    profitFactor: 0
  };

  const achievements: any[] = [];

  const updateProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully"
    });
  };

  const updateSettings = () => {
    toast({
      title: "Settings Updated",
      description: "Your trading settings have been saved"
    });
  };

  const exportData = () => {
    toast({
      title: "Export Started",
      description: "Your trading data export will be ready shortly"
    });
  };

  const importData = () => {
    toast({
      title: "Import Started",
      description: "Please select the file to import"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Profile & Settings</h2>
          <p className="text-muted-foreground">Manage your account, preferences, and trading settings</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-2">
            <Activity className="h-4 w-4" />
            Active Trader
          </Badge>
          <Badge className="gap-2">
            <Award className="h-4 w-4" />
            Verified
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="trading">Trading Settings</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Update your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input 
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input 
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input 
                        value={profile.phone}
                        onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select value={profile.timezone} onValueChange={(value) => setProfile(prev => ({ ...prev, timezone: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="EST">Eastern Time</SelectItem>
                          <SelectItem value="PST">Pacific Time</SelectItem>
                          <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                          <SelectItem value="IST">India Standard Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select value={profile.language} onValueChange={(value) => setProfile(prev => ({ ...prev, language: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea 
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <Button onClick={updateProfile} className="w-full">
                    Update Profile
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Shield className="h-4 w-4 mr-2" />
                    Enable 2FA
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Activity className="h-4 w-4 mr-2" />
                    Login History
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Member Since</span>
                    <span className="text-sm font-medium">Jan 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Trades</span>
                    <span className="text-sm font-medium">{tradingStats.totalTrades.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Win Rate</span>
                    <span className="text-sm font-medium text-success">{tradingStats.winRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total P&L</span>
                    <span className="text-sm font-medium text-success">+${tradingStats.totalPnL.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trading" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to receive trading alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Email Notifications</Label>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={(value) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, email: value }
                    }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>SMS Alerts</Label>
                  <Switch
                    checked={settings.notifications.sms}
                    onCheckedChange={(value) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, sms: value }
                    }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Push Notifications</Label>
                  <Switch
                    checked={settings.notifications.push}
                    onCheckedChange={(value) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, push: value }
                    }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Telegram Messages</Label>
                  <Switch
                    checked={settings.notifications.telegram}
                    onCheckedChange={(value) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, telegram: value }
                    }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Interface Preferences
                </CardTitle>
                <CardDescription>Customize your trading interface</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Dark Mode</Label>
                  <Switch
                    checked={settings.preferences.darkMode}
                    onCheckedChange={(value) => setSettings(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, darkMode: value }
                    }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Sound Alerts</Label>
                  <Switch
                    checked={settings.preferences.soundAlerts}
                    onCheckedChange={(value) => setSettings(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, soundAlerts: value }
                    }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Auto-save Settings</Label>
                  <Switch
                    checked={settings.preferences.autoSave}
                    onCheckedChange={(value) => setSettings(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, autoSave: value }
                    }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Confirm Orders</Label>
                  <Switch
                    checked={settings.preferences.confirmOrders}
                    onCheckedChange={(value) => setSettings(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, confirmOrders: value }
                    }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Trading Limits
                </CardTitle>
                <CardDescription>Set safety limits for automated trading</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Daily Loss Limit ($)</Label>
                    <Input
                      type="number"
                      value={settings.limits.dailyLoss}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        limits: { ...prev.limits, dailyLoss: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Open Positions</Label>
                    <Input
                      type="number"
                      value={settings.limits.maxPositions}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        limits: { ...prev.limits, maxPositions: parseInt(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Order Timeout (seconds)</Label>
                    <Input
                      type="number"
                      value={settings.limits.orderTimeout}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        limits: { ...prev.limits, orderTimeout: parseInt(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                </div>
                <Button onClick={updateSettings} className="w-full">
                  Save Trading Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-success" />
                <div className="text-2xl font-bold text-success">+${tradingStats.totalPnL.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total P&L</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Activity className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{tradingStats.totalTrades}</div>
                <div className="text-sm text-muted-foreground">Total Trades</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="h-8 w-8 mx-auto mb-2 text-warning" />
                <div className="text-2xl font-bold">{tradingStats.winRate}%</div>
                <div className="text-sm text-muted-foreground">Win Rate</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-info" />
                <div className="text-2xl font-bold">{tradingStats.activeDays}</div>
                <div className="text-sm text-muted-foreground">Active Days</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Statistics</CardTitle>
              <CardDescription>Comprehensive performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-lg font-semibold">{tradingStats.avgDailyReturn}%</div>
                  <div className="text-sm text-muted-foreground">Avg Daily Return</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{tradingStats.sharpeRatio}</div>
                  <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-destructive">-{tradingStats.maxDrawdown}%</div>
                  <div className="text-sm text-muted-foreground">Max Drawdown</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{tradingStats.profitFactor}</div>
                  <div className="text-sm text-muted-foreground">Profit Factor</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Trading Achievements
              </CardTitle>
              <CardDescription>Milestones and accomplishments in your trading journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {achievements.length === 0 ? (
                  <div className="text-muted-foreground text-center">No achievements yet.</div>
                ) : (
                  achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-lg border">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold">{achievement.name}</div>
                        <div className="text-sm text-muted-foreground">{achievement.description}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">{achievement.date}</div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export Data
                </CardTitle>
                <CardDescription>Download your trading data and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={exportData} className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  Export All Data
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    Export Trades
                  </Button>
                  <Button variant="outline" size="sm">
                    Export Settings
                  </Button>
                  <Button variant="outline" size="sm">
                    Export Strategies
                  </Button>
                  <Button variant="outline" size="sm">
                    Export Patterns
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Import Data
                </CardTitle>
                <CardDescription>Import trading data from other platforms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={importData} variant="outline" className="w-full gap-2">
                  <Upload className="h-4 w-4" />
                  Import Data File
                </Button>
                <div className="text-sm text-muted-foreground">
                  Supported formats: CSV, JSON, Excel
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Management
                </CardTitle>
                <CardDescription>Manage your stored data and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">2.4 GB</div>
                    <div className="text-sm text-muted-foreground">Total Data</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">1,247</div>
                    <div className="text-sm text-muted-foreground">Trade Records</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">89 days</div>
                    <div className="text-sm text-muted-foreground">Data Retention</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Clear Cache</Button>
                  <Button variant="outline">Optimize Database</Button>
                  <Button variant="destructive">Delete All Data</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};