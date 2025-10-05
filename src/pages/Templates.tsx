import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Template {
  id: string;
  name: string;
  description: string | null;
  html_content: string;
  category: string;
  created_at: string;
}

export default function Templates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    html_content: "",
    category: "custom",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("email_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast({
        title: "Error",
        description: "Failed to load templates. Please make sure you're logged in.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImportTemplate = async () => {
    if (!newTemplate.name || !newTemplate.html_content) {
      toast({
        title: "Missing Information",
        description: "Please provide a name and HTML content for the template.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to import templates.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("email_templates").insert([
        {
          user_id: user.id,
          name: newTemplate.name,
          description: newTemplate.description,
          html_content: newTemplate.html_content,
          category: newTemplate.category,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Template imported successfully!",
      });

      setNewTemplate({ name: "", description: "", html_content: "", category: "custom" });
      setIsDialogOpen(false);
      fetchTemplates();
    } catch (error) {
      console.error("Error importing template:", error);
      toast({
        title: "Error",
        description: "Failed to import template. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Email Templates</h1>
          <p className="text-muted-foreground mt-1">Browse and import HTML email templates</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              <Plus className="w-4 h-4" />
              Import HTML Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Import HTML Email Template</DialogTitle>
              <DialogDescription>
                Paste your HTML email template code below to import it into your library.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Summer Sale Newsletter"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="Brief description of the template"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., newsletter, promotional, transactional"
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="html">HTML Content</Label>
                <Textarea
                  id="html"
                  placeholder="Paste your HTML email template here..."
                  value={newTemplate.html_content}
                  onChange={(e) => setNewTemplate({ ...newTemplate, html_content: e.target.value })}
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>
              <Button onClick={handleImportTemplate} className="w-full">
                Import Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 shadow-none focus-visible:ring-0"
            />
          </div>
        </CardHeader>
      </Card>

      {/* Templates Grid */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading templates...</p>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <Card className="shadow-soft">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {searchQuery ? "No templates found matching your search." : "No templates yet. Import your first HTML email template!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="shadow-soft hover:shadow-medium transition-all overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center border-b">
                <div className="text-center p-4">
                  <div className="text-4xl mb-2">📧</div>
                  <p className="text-sm text-muted-foreground">{template.category}</p>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                {template.description && (
                  <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => setPreviewTemplate(template)}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Preview HTML
                </Button>
                <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                  Use Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{previewTemplate?.name}</DialogTitle>
            <DialogDescription>HTML Email Preview</DialogDescription>
          </DialogHeader>
          <div className="border rounded-lg overflow-auto max-h-[60vh]">
            <iframe
              srcDoc={previewTemplate?.html_content}
              className="w-full h-[500px]"
              title="Email Preview"
              sandbox="allow-same-origin"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
