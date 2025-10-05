import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, Users, FileText, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Campaigns() {
  const { toast } = useToast();
  const [campaignName, setCampaignName] = useState("");
  const [subject, setSubject] = useState("");

  const handleSendCampaign = () => {
    if (!campaignName || !subject) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Campaign Scheduled",
      description: "Your campaign has been scheduled and will be sent shortly.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Create Campaign</h1>
        <p className="text-muted-foreground mt-1">Design and send your email campaign</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>Set up your campaign information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input
                  id="campaign-name"
                  placeholder="Summer Sale 2024"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                  id="subject"
                  placeholder="Don't miss our summer sale!"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preview">Preview Text</Label>
                <Input
                  id="preview"
                  placeholder="Get up to 50% off on selected items"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Select Recipients</CardTitle>
              <CardDescription>Choose who will receive this campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">All Active Subscribers</p>
                      <p className="text-sm text-muted-foreground">2,401 contacts</p>
                    </div>
                  </div>
                  <input type="radio" name="recipients" defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-secondary" />
                    <div>
                      <p className="font-medium">New Subscribers</p>
                      <p className="text-sm text-muted-foreground">180 contacts</p>
                    </div>
                  </div>
                  <input type="radio" name="recipients" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Select Template</CardTitle>
              <CardDescription>Choose an email template</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {["Welcome Email", "Product Launch", "Newsletter", "Sale Announcement"].map((template) => (
                  <div key={template} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <p className="font-medium text-sm">{template}</p>
                    </div>
                    <input type="radio" name="template" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-soft border-2 border-primary/20">
            <CardHeader>
              <CardTitle>Campaign Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Recipients:</span>
                  <span className="font-semibold ml-auto">2,401</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Template:</span>
                  <span className="font-semibold ml-auto">Selected</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Schedule:</span>
                  <span className="font-semibold ml-auto">Now</span>
                </div>
              </div>
              <div className="pt-4 border-t space-y-3">
                <Button 
                  onClick={handleSendCampaign}
                  className="w-full gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  <Send className="w-4 h-4" />
                  Send Campaign
                </Button>
                <Button variant="outline" className="w-full">
                  Save as Draft
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-sm">Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Keep subject lines under 50 characters</p>
              <p>• Test your email before sending</p>
              <p>• Personalize with recipient names</p>
              <p>• Include a clear call-to-action</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
