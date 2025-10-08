import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Search, UserPlus, Download, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Contact {
  id: string;
  name: string;
  email: string;
  status: string;
  phone?: string;
  company?: string;
  notes?: string;
  created_at: string;
}

export default function Contacts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "active",
    notes: ""
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast({
        title: "Error",
        description: "Failed to load contacts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in",
          variant: "destructive"
        });
        return;
      }

      const contactData = {
        ...formData,
        name: formData.name.trim() || formData.email // Use email as name if name is empty
      };

      if (editingContact) {
        const { error } = await supabase
          .from("contacts")
          .update(contactData)
          .eq("id", editingContact.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Contact updated successfully"
        });
      } else {
        const { error } = await supabase
          .from("contacts")
          .insert([{ ...contactData, user_id: user.id }]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Contact added successfully"
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchContacts();
    } catch (error) {
      console.error("Error saving contact:", error);
      toast({
        title: "Error",
        description: "Failed to save contact",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    try {
      const { error } = await supabase
        .from("contacts")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Contact deleted successfully"
      });
      fetchContacts();
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone || "",
      company: contact.company || "",
      status: contact.status,
      notes: contact.notes || ""
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingContact(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "active",
      notes: ""
    });
  };

  const handleAddContact = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const parseCSV = (text: string): any[] => {
    // Handle different line endings (Windows/Mac/Unix)
    const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const parseLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"') {
          // Handle escaped quotes ("")
          if (inQuotes && nextChar === '"') {
            current += '"';
            i++; // Skip next quote
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };
    
    const headers = parseLine(lines[0]).map(h => h.toLowerCase().replace(/^["']|["']$/g, ''));
    const rows = lines.slice(1);
    
    return rows.map(row => {
      const values = parseLine(row);
      const contact: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index]?.replace(/^["']|["']$/g, '').trim();
        if (value) {
          contact[header] = value;
        }
      });
      
      return contact;
    });
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsedContacts = parseCSV(text);
      
      console.log('📊 CSV Parse Results:', {
        totalRows: parsedContacts.length,
        sample: parsedContacts.slice(0, 3)
      });
      
      if (parsedContacts.length === 0) {
        toast({
          title: "Error",
          description: "No valid rows found in CSV file",
          variant: "destructive"
        });
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in",
          variant: "destructive"
        });
        return;
      }

      // Track import results
      const importResults = {
        successful: [] as any[],
        skipped: [] as any[],
        reasons: {
          noEmail: 0,
          invalidEmail: 0,
          duplicateEmail: 0
        }
      };

      const emailsSeen = new Set<string>();

      parsedContacts.forEach((contact, index) => {
        const email = contact.email?.trim().toLowerCase();
        
        // Skip if no email
        if (!email) {
          importResults.skipped.push(contact);
          importResults.reasons.noEmail++;
          return;
        }

        // Skip if invalid email format
        if (!isValidEmail(email)) {
          importResults.skipped.push(contact);
          importResults.reasons.invalidEmail++;
          console.log(`❌ Row ${index + 2}: Invalid email format: "${email}"`);
          return;
        }

        // Skip duplicate emails in the same import
        if (emailsSeen.has(email)) {
          importResults.skipped.push(contact);
          importResults.reasons.duplicateEmail++;
          return;
        }

        emailsSeen.add(email);

        importResults.successful.push({
          user_id: user.id,
          name: contact.name?.trim() || email,
          email: email,
          phone: contact.phone?.trim() || null,
          company: contact.company?.trim() || null,
          status: contact.status?.toLowerCase() === "unsubscribed" ? "unsubscribed" : "active",
          notes: contact.notes?.trim() || null
        });
      });

      console.log('📈 Import Statistics:', {
        parsed: parsedContacts.length,
        successful: importResults.successful.length,
        skipped: importResults.skipped.length,
        reasons: importResults.reasons
      });

      if (importResults.successful.length === 0) {
        const reasons = [];
        if (importResults.reasons.noEmail > 0) reasons.push(`${importResults.reasons.noEmail} missing email`);
        if (importResults.reasons.invalidEmail > 0) reasons.push(`${importResults.reasons.invalidEmail} invalid email`);
        if (importResults.reasons.duplicateEmail > 0) reasons.push(`${importResults.reasons.duplicateEmail} duplicate`);
        
        toast({
          title: "Import Failed",
          description: `No valid contacts found. Skipped ${importResults.skipped.length} rows: ${reasons.join(', ')}`,
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from("contacts")
        .insert(importResults.successful);

      if (error) throw error;

      // Detailed success message
      const successMsg = importResults.skipped.length > 0
        ? `✓ Imported ${importResults.successful.length} contacts, ⚠ Skipped ${importResults.skipped.length} rows`
        : `Successfully imported ${importResults.successful.length} contacts`;

      toast({
        title: "Import Complete",
        description: successMsg
      });
      
      fetchContacts();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("❌ Error importing contacts:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import contacts",
        variant: "destructive"
      });
    }
  };

  const handleExport = () => {
    const csv = [
      ["Name", "Email", "Phone", "Company", "Status", "Notes", "Created At"],
      ...contacts.map(c => [
        c.name,
        c.email,
        c.phone || "",
        c.company || "",
        c.status,
        c.notes || "",
        new Date(c.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contacts.csv";
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Success",
      description: "Contacts exported to CSV"
    });
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: contacts.length,
    active: contacts.filter(c => c.status === "active").length,
    unsubscribed: contacts.filter(c => c.status === "unsubscribed").length
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
          <Button onClick={handleExport} variant="outline" className="gap-2">
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
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">All contacts</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.total > 0 ? `${((stats.active / stats.total) * 100).toFixed(1)}% of total` : "0% of total"}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unsubscribed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unsubscribed}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.total > 0 ? `${((stats.unsubscribed / stats.total) * 100).toFixed(1)}% of total` : "0% of total"}
            </p>
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
              <Button onClick={handleAddContact} variant="outline" size="icon">
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
                    <th className="px-4 py-3 text-left text-sm font-medium">Company</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Date Added</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        Loading contacts...
                      </td>
                    </tr>
                  ) : filteredContacts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        {searchQuery ? "No contacts found matching your search" : "No contacts yet. Add your first contact!"}
                      </td>
                    </tr>
                  ) : (
                    filteredContacts.map((contact) => (
                      <tr key={contact.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium">{contact.name}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{contact.email}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{contact.company || "-"}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            contact.status === "active" 
                              ? "bg-secondary/10 text-secondary" 
                              : "bg-destructive/10 text-destructive"
                          }`}>
                            {contact.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {new Date(contact.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => openEditDialog(contact)} 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button 
                              onClick={() => handleDelete(contact.id)} 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingContact ? "Edit Contact" : "Add New Contact"}</DialogTitle>
            <DialogDescription>
              {editingContact ? "Update the contact information below" : "Enter the contact details below"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe (optional - will use email if empty)"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 234 567 8900"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Acme Inc."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.email}>
              {editingContact ? "Update Contact" : "Add Contact"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hidden file input for CSV import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileUpload}
      />
    </div>
  );
}
