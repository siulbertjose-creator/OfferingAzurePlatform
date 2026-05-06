import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListOfferings,
  getListOfferingsQueryKey,
  useDeleteOffering,
  useListUseCases,
  getListUseCasesQueryKey,
  useDeleteUseCase,
} from "@workspace/api-client-react";
import { AdminLayout } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, ExternalLink, Layers, Building2, Clock } from "lucide-react";
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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: offeringsData, isLoading: offeringsLoading } = useListOfferings({
    query: { queryKey: getListOfferingsQueryKey() },
  });

  const { data: useCasesData, isLoading: useCasesLoading } = useListUseCases(
    {},
    { query: { queryKey: getListUseCasesQueryKey() } },
  );

  const deleteOffering = useDeleteOffering({
    mutation: {
      onSuccess: () => {
        toast({ title: "Servicio eliminado" });
        queryClient.invalidateQueries({ queryKey: getListOfferingsQueryKey() });
      },
      onError: () => toast({ title: "Error al eliminar", variant: "destructive" }),
    },
  });

  const deleteUseCase = useDeleteUseCase({
    mutation: {
      onSuccess: () => {
        toast({ title: "Caso eliminado" });
        queryClient.invalidateQueries({ queryKey: getListUseCasesQueryKey() });
      },
      onError: () => toast({ title: "Error al eliminar", variant: "destructive" }),
    },
  });

  const offerings = offeringsData?.offerings ?? [];
  const useCases = useCasesData?.useCases ?? [];

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-10">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Servicios", value: offerings.length, icon: Layers },
            { label: "Casos de Uso", value: useCases.length, icon: Building2 },
            { label: "Industrias", value: new Set(useCases.map(u => u.industryType)).size, icon: Building2 },
            { label: "Horas Totales", value: offerings.filter(o => o.durationHours !== "TBD").reduce((s, o) => s + parseInt(o.durationHours), 0) + "h", icon: Clock },
          ].map(({ label, value, icon: Icon }) => (
            <Card key={label} className="bg-white/5 border-white/10">
              <CardContent className="p-5">
                <Icon className="w-5 h-5 text-primary mb-3" />
                <div className="text-2xl font-bold mb-1">{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Offerings section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Servicios (Offerings)</h2>
              <p className="text-muted-foreground text-sm mt-1">Gestiona los 6 servicios de Readymind</p>
            </div>
            <Link href="/admin/offerings/new">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" /> Nuevo Servicio
              </Button>
            </Link>
          </div>

          {offeringsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-36 bg-white/5 rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offerings.map(offering => (
                <Card key={offering.id} className="bg-white/5 border-white/10 hover:border-primary/30 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0 mr-3">
                        <h3 className="font-semibold truncate">{offering.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                            {offering.techPillar}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {offering.durationHours}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Link href={`/offerings/${offering.id}`}>
                          <Button variant="ghost" size="icon" className="w-8 h-8">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        <Link href={`/admin/offerings/${offering.id}/edit`}>
                          <Button variant="ghost" size="icon" className="w-8 h-8">
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive">
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-background border-white/10">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Eliminar servicio</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción eliminará el servicio y todos sus casos de uso asociados.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-white"
                                onClick={() => deleteOffering.mutate({ id: offering.id })}
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{offering.businessBenefit}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Use Cases section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Casos de Uso</h2>
              <p className="text-muted-foreground text-sm mt-1">Casos de éxito vinculados a cada servicio</p>
            </div>
            <Link href="/admin/use-cases/new">
              <Button variant="outline" className="border-primary/40 hover:bg-primary/10">
                <Plus className="w-4 h-4 mr-2" /> Nuevo Caso
              </Button>
            </Link>
          </div>

          {useCasesLoading ? (
            <div className="space-y-3">
              {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-20 bg-white/5 rounded-xl" />)}
            </div>
          ) : useCases.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
              <Building2 className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-muted-foreground">No hay casos de uso todavía</p>
            </div>
          ) : (
            <div className="space-y-3">
              {useCases.map(uc => {
                const offeringName = offerings.find(o => o.id === uc.offeringId)?.name ?? `Servicio #${uc.offeringId}`;
                return (
                  <Card key={uc.id} className="bg-white/5 border-white/10 hover:border-white/20 transition-colors">
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                          <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{uc.projectName}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground truncate">{offeringName}</span>
                            <Badge variant="secondary" className="text-xs bg-white/10 shrink-0">{uc.industryType}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Link href={`/admin/use-cases/${uc.id}/edit`}>
                          <Button variant="ghost" size="icon" className="w-8 h-8">
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive">
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-background border-white/10">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Eliminar caso de uso</AlertDialogTitle>
                              <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-white"
                                onClick={() => deleteUseCase.mutate({ id: uc.id })}
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
