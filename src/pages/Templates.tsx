import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Copy, Plus } from "lucide-react";

export default function Templates() {
  const templates = [
    {
      id: 1,
      name: "Welcome Email",
      description: "Professional welcome email for new subscribers",
      category: "Onboarding",
      thumbnail: "bg-gradient-to-br from-primary/20 to-secondary/20",
    },
    {
      id: 2,
      name: "Product Launch",
      description: "Announce new products with style",
      category: "Marketing",
      thumbnail: "bg-gradient-to-br from-secondary/20 to-primary/20",
    },
    {
      id: 3,
      name: "Newsletter",
      description: "Monthly newsletter template",
      category: "Newsletter",
      thumbnail: "bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20",
    },
    {
      id: 4,
      name: "Event Invitation",
      description: "Invite subscribers to your events",
      category: "Events",
      thumbnail: "bg-gradient-to-br from-secondary/20 to-primary/30",
    },
    {
      id: 5,
      name: "Sale Announcement",
      description: "Promote special offers and sales",
      category: "Marketing",
      thumbnail: "bg-gradient-to-br from-primary/30 to-secondary/20",
    },
    {
      id: 6,
      name: "Thank You",
      description: "Show appreciation to your customers",
      category: "Engagement",
      thumbnail: "bg-gradient-to-br from-secondary/30 to-primary/20",
    },
  ];

  const categories = ["All", "Onboarding", "Marketing", "Newsletter", "Events", "Engagement"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Email Templates</h1>
          <p className="text-muted-foreground mt-1">Choose from professionally designed templates</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
          <Plus className="w-4 h-4" />
          Create Template
        </Button>
      </div>

      {/* Category Filters */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                size="sm"
                className={category === "All" ? "bg-gradient-to-r from-primary to-secondary" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="shadow-soft hover:shadow-medium transition-all group">
            <CardHeader>
              <div className={`h-48 rounded-lg mb-4 ${template.thumbnail} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                <FileText className="w-16 h-16 text-primary/40" />
              </div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                {template.category}
              </span>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              <Button size="sm" className="flex-1 gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                <Copy className="w-4 h-4" />
                Use
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
