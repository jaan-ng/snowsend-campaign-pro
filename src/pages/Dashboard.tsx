import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Send, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Contacts",
      value: "2,543",
      change: "+12% from last month",
      icon: Users,
      gradient: "from-primary to-primary/80",
    },
    {
      title: "Email Templates",
      value: "24",
      change: "6 new this month",
      icon: FileText,
      gradient: "from-secondary to-secondary/80",
    },
    {
      title: "Campaigns Sent",
      value: "47",
      change: "+8% from last month",
      icon: Send,
      gradient: "from-primary to-secondary",
    },
    {
      title: "Open Rate",
      value: "68.4%",
      change: "+5.2% from last month",
      icon: TrendingUp,
      gradient: "from-secondary to-primary",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-secondary p-8 text-primary-foreground shadow-strong">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Welcome to SnowSend</h1>
          <p className="text-lg opacity-90 max-w-2xl">
            Manage your email campaigns with ease. Import contacts, design beautiful emails, and track your success.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full mr-12 -mb-32"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden border-0 shadow-soft hover:shadow-medium transition-all">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`}></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>Your latest email campaigns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Summer Sale 2024", sent: "2,543 contacts", date: "2 hours ago", rate: "72%" },
              { name: "Product Launch", sent: "1,892 contacts", date: "1 day ago", rate: "65%" },
              { name: "Newsletter May", sent: "2,543 contacts", date: "3 days ago", rate: "68%" },
            ].map((campaign, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{campaign.name}</p>
                  <p className="text-xs text-muted-foreground">{campaign.sent} • {campaign.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-secondary">{campaign.rate}</p>
                  <p className="text-xs text-muted-foreground">Open rate</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with your next campaign</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:shadow-medium transition-all">
              <Send className="w-5 h-5" />
              <span className="font-medium">Create New Campaign</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground hover:shadow-medium transition-all">
              <Users className="w-5 h-5" />
              <span className="font-medium">Import Contacts</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:bg-muted transition-all">
              <FileText className="w-5 h-5" />
              <span className="font-medium">Browse Templates</span>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
