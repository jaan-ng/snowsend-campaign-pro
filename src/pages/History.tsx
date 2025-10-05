import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, Download, TrendingUp } from "lucide-react";

export default function History() {
  const campaigns = [
    {
      id: 1,
      name: "Summer Sale 2024",
      date: "2024-01-18",
      time: "10:30 AM",
      recipients: 2543,
      sent: 2543,
      opened: 1831,
      clicked: 892,
      status: "Completed",
    },
    {
      id: 2,
      name: "Product Launch Announcement",
      date: "2024-01-17",
      time: "2:15 PM",
      recipients: 1892,
      sent: 1892,
      opened: 1230,
      clicked: 567,
      status: "Completed",
    },
    {
      id: 3,
      name: "Newsletter - May Edition",
      date: "2024-01-15",
      time: "9:00 AM",
      recipients: 2543,
      sent: 2543,
      opened: 1734,
      clicked: 821,
      status: "Completed",
    },
    {
      id: 4,
      name: "Welcome Series - Week 1",
      date: "2024-01-14",
      time: "8:00 AM",
      recipients: 180,
      sent: 180,
      opened: 156,
      clicked: 89,
      status: "Completed",
    },
  ];

  const calculateRate = (opened: number, total: number) => {
    return ((opened / total) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Campaign History</h1>
          <p className="text-muted-foreground mt-1">View your past campaign performance</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7,158</div>
            <p className="text-xs text-muted-foreground mt-1">Across all campaigns</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Open Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">68.4%</div>
            <p className="text-xs text-muted-foreground mt-1">+5.2% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Click Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">32.8%</div>
            <p className="text-xs text-muted-foreground mt-1">+3.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns List */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Recent Campaigns</CardTitle>
          <CardDescription>Detailed performance metrics for your campaigns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="border-2 hover:border-primary/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{campaign.name}</h3>
                      <Badge variant="secondary">{campaign.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {campaign.date}
                      </span>
                      <span>{campaign.time}</span>
                      <span>• {campaign.recipients} recipients</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold">{calculateRate(campaign.opened, campaign.sent)}%</div>
                      <div className="text-xs text-muted-foreground">Open Rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{calculateRate(campaign.clicked, campaign.sent)}%</div>
                      <div className="text-xs text-muted-foreground">Click Rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-secondary">{campaign.opened}</div>
                      <div className="text-xs text-muted-foreground">Opened</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Stats
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
