import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Search, UserPlus, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contacts() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const contacts = [
    { id: 1, name: "John Doe", email: "john@example.com", status: "Active", added: "2024-01-15" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Active", added: "2024-01-14" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "Unsubscribed", added: "2024-01-13" },
    { id: 4, name: "Alice Williams", email: "alice@example.com", status: "Active", added: "2024-01-12" },
    { id: 5, name: "Charlie Brown", email: "charlie@example.com", status: "Active", added: "2024-01-11" },
  ];

  const handleImport = () => {
    toast({
      title: "CSV Import",
      description: "Contact import feature will be available soon.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Contacts</h1>
          <p className="text-muted-foreground mt-1">Manage your email contact lists</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button onClick={handleImport} className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
            <Upload className="w-4 h-4" />
            Import CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,543</div>
            <p className="text-xs text-muted-foreground mt-1">+180 this month</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,401</div>
            <p className="text-xs text-muted-foreground mt-1">94.4% of total</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unsubscribed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground mt-1">5.6% of total</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Contact List</CardTitle>
              <CardDescription>View and manage all your contacts</CardDescription>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full md:w-[300px]"
                />
              </div>
              <Button variant="outline" size="icon">
                <UserPlus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Date Added</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium">{contact.name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{contact.email}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          contact.status === "Active" 
                            ? "bg-secondary/10 text-secondary" 
                            : "bg-destructive/10 text-destructive"
                        }`}>
                          {contact.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{contact.added}</td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
