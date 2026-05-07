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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Edit, Trash2, ExternalLink, Layers, Building2, Clock, TrendingUp,
} from "lucide-react";
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

  const stats = [
    { label: "Servicios", value: offerings.length, icon: Layers, color: "bg-blue-50 text-[#0078D4] border-blue-100" },
    { label: "Casos de Uso", value: useCases.length, icon: Building2, color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    { label: "Industrias", value: new Set(useCases.map(u => u.industryType)).size, icon: TrendingUp, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    {
      label: "Horas Totales",
      value: offerings.filter(o => o.durationHours !== "TBD").reduce((s, o) => s + parseInt(o.durationHours), 0) + "h",
      icon: Clock,
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
  ];

  return (
    <AdminLayout>
      <div className="container mx-auto px-6 py-10">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Dashboard</h1>
          <p className="text-[#605E5C] text-sm mt-1">Gestiona los servicios y casos de uso del portal</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={`flex items-center gap-4 p-5 bg-white rounded-xl border shadow-sm ${color.split(' ')[2]}`}>
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1A1A1A]">{value}</div>
                <div className="text-xs text-[#605E5C] font-medium">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Offerings section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-[#1A1A1A]">Servicios (Offerings)</h2>
              <p className="text-[#605E5C] text-sm mt-0.5">Gestiona los servicios de Readymind</p>
            </div>
            <Link href="/admin/offerings/new">
              <button className="inline-flex items-center gap-2 bg-[#0078D4] hover:bg-[#006CBE] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm">
                <Plus className="w-4 h-4" /> Nuevo Servicio
              </button>
            </Link>
          </div>

          {offeringsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-36 rounded-xl bg-gray-100" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offerings.map(offering => (
                <div key={offering.id} className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-[#0078D4]/20 transition-all p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0 mr-3">
                      <div className="h-1 w-8 bg-[#0078D4] rounded-full mb-2" />
                      <h3 className="font-semibold text-[#1A1A1A] truncate">{offering.name}</h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0078D4] bg-[#0078D4]/8 px-2 py-0.5 rounded-full border border-[#0078D4]/15">
                          {offering.techPillar}
                        </span>
                        <span className="text-xs text-[#605E5C] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {offering.durationHours}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Link href={`/offerings/${offering.id}`}>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#605E5C] hover:text-[#0078D4] hover:bg-[#0078D4]/5 transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                      <Link href={`/admin/offerings/${offering.id}/edit`}>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#605E5C] hover:text-[#0078D4] hover:bg-[#0078D4]/5 transition-colors">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white border border-gray-100 shadow-xl rounded-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-[#1A1A1A]">Eliminar servicio</AlertDialogTitle>
                            <AlertDialogDescription className="text-[#605E5C]">
                              Esta acción eliminará el servicio y todos sus casos de uso asociados. No se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-gray-200 text-[#605E5C]">Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 hover:bg-red-600 text-white"
                              onClick={() => deleteOffering.mutate({ id: offering.id })}
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <p className="text-xs text-[#605E5C] line-clamp-2">{offering.businessBenefit}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Use Cases section */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-[#1A1A1A]">Casos de Uso</h2>
              <p className="text-[#605E5C] text-sm mt-0.5">Casos de éxito vinculados a cada servicio</p>
            </div>
            <Link href="/admin/use-cases/new">
              <button className="inline-flex items-center gap-2 border border-[#0078D4] text-[#0078D4] hover:bg-[#0078D4]/5 text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                <Plus className="w-4 h-4" /> Nuevo Caso
              </button>
            </Link>
          </div>

          {useCasesLoading ? (
            <div className="space-y-3">
              {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl bg-gray-100" />)}
            </div>
          ) : useCases.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100 border-dashed">
              <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-[#605E5C] text-sm">No hay casos de uso todavía</p>
              <Link href="/admin/use-cases/new">
                <button className="mt-4 text-sm text-[#0078D4] hover:underline">Crear el primero →</button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {useCases.map(uc => {
                const offeringName = offerings.find(o => o.id === uc.offeringId)?.name ?? `Servicio #${uc.offeringId}`;
                return (
                  <div key={uc.id} className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-[#0078D4]/20 transition-all p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#0078D4]/10 border border-[#0078D4]/15 flex items-center justify-center shrink-0">
                        {uc.companyIconUrl ? (
                          <img src={uc.companyIconUrl} alt="" className="w-6 h-6 object-contain" />
                        ) : (
                          <Building2 className="w-5 h-5 text-[#0078D4]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-[#1A1A1A] truncate">{uc.projectName}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-[#605E5C] truncate">{offeringName}</span>
                          <span className="text-[10px] font-semibold bg-gray-100 text-[#605E5C] px-2 py-0.5 rounded-full shrink-0">
                            {uc.industryType}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Link href={`/admin/use-cases/${uc.id}/edit`}>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#605E5C] hover:text-[#0078D4] hover:bg-[#0078D4]/5 transition-colors">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white border border-gray-100 shadow-xl rounded-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-[#1A1A1A]">Eliminar caso de uso</AlertDialogTitle>
                            <AlertDialogDescription className="text-[#605E5C]">Esta acción no se puede deshacer.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-gray-200 text-[#605E5C]">Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 hover:bg-red-600 text-white"
                              onClick={() => deleteUseCase.mutate({ id: uc.id })}
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
