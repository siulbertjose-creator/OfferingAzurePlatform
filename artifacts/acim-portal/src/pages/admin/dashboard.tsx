import { useState } from "react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useListSuccessCases, 
  getListSuccessCasesQueryKey,
  useDeleteSuccessCase
} from "@workspace/api-client-react";
import { AdminLayout } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useListSuccessCases(
    { search: searchTerm || undefined },
    { query: { queryKey: getListSuccessCasesQueryKey({ search: searchTerm || undefined }) } }
  );

  const deleteMutation = useDeleteSuccessCase({
    mutation: {
      onSuccess: () => {
        toast({ title: "Case deleted successfully" });
        queryClient.invalidateQueries({ queryKey: getListSuccessCasesQueryKey() });
      },
      onError: () => {
        toast({ title: "Failed to delete case", variant: "destructive" });
      }
    }
  });

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Success Cases</h1>
            <p className="text-muted-foreground mt-1">Manage your portfolio of Azure transformations</p>
          </div>
          
          <div className="flex w-full md:w-auto items-center gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search cases..." 
                className="pl-10 bg-white/5 border-white/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link href="/admin/cases/new">
              <Button className="shrink-0">
                <Plus className="w-4 h-4 mr-2" />
                New Case
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="w-[300px]">Case Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead className="text-right">Governance Score</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i} className="border-white/10">
                    <TableCell><Skeleton className="h-4 w-48 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 bg-white/5" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-24 ml-auto bg-white/5" /></TableCell>
                  </TableRow>
                ))
              ) : data?.cases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No cases found.
                  </TableCell>
                </TableRow>
              ) : (
                data?.cases.map((c) => (
                  <TableRow key={c.id} className="border-white/10 hover:bg-white/5 transition-colors">
                    <TableCell className="font-medium">{c.title}</TableCell>
                    <TableCell>{c.clientName}</TableCell>
                    <TableCell>{c.industry || "-"}</TableCell>
                    <TableCell className="text-right font-mono text-primary">
                      {c.azureAnalyzerKpis.governanceScore}%
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/cases/${c.id}`}>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/cases/${c.id}/edit`}>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-background border-white/10">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the case "{c.title}" from the database. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-foreground">Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => deleteMutation.mutate({ id: c.id })}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
