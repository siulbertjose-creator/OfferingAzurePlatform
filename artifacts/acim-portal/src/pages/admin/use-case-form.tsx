import { useEffect, useRef, useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateUseCase,
  useUpdateUseCase,
  useGetUseCase,
  useListOfferings,
  getListUseCasesQueryKey,
  getGetUseCaseQueryKey,
  getListOfferingsQueryKey,
} from "@workspace/api-client-react";
import { useUpload } from "@workspace/object-storage-web";
import { AdminLayout } from "@/components/layout/Navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Save, ChevronDown, Upload, X, Building2, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const INDUSTRY_OPTIONS = [
  "Servicios Financieros", "Manufactura", "Retail", "Salud",
  "Tecnología", "Gobierno", "Educación", "Energía", "Telecomunicaciones", "Otro",
];

const schema = z.object({
  offeringId: z.coerce.number().min(1, "Selecciona un servicio"),
  projectName: z.string().min(1, "Nombre requerido"),
  industryType: z.string().min(1, "Industria requerida"),
  companyIconUrl: z.string().nullable().optional(),
  description: z.string().min(1, "Descripción requerida"),
  previousState: z.string().min(1, "Estado anterior requerido"),
  newState: z.string().min(1, "Estado nuevo requerido"),
});

type FormValues = z.infer<typeof schema>;

const inputClass = "w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-[#323130] text-sm focus:outline-none focus:ring-2 focus:ring-[#0078D4]/30 focus:border-[#0078D4] transition-colors";
const labelClass = "text-sm font-medium text-[#323130]";

export default function AdminUseCaseForm() {
  const params = useParams<{ id: string }>();
  const id = params?.id ? parseInt(params.id) : undefined;
  const isEditing = !!id;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const { uploadFile, isUploading } = useUpload({
    onSuccess: (response) => {
      const servingUrl = `/api/storage${response.objectPath}`;
      form.setValue("companyIconUrl", servingUrl);
      setLogoPreview(servingUrl);
      toast({ title: "Logo cargado correctamente" });
    },
    onError: () => toast({ title: "Error al cargar el logo", variant: "destructive" }),
  });

  const { data: offeringsData } = useListOfferings({ query: { queryKey: getListOfferingsQueryKey() } });
  const { data: existing, isLoading } = useGetUseCase(id!, {
    query: { enabled: isEditing, queryKey: getGetUseCaseQueryKey(id!) },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      offeringId: 0, projectName: "", industryType: "Servicios Financieros",
      companyIconUrl: "", description: "", previousState: "", newState: "",
    },
  });

  useEffect(() => {
    if (existing) {
      form.reset({
        offeringId: existing.offeringId,
        projectName: existing.projectName,
        industryType: existing.industryType,
        companyIconUrl: existing.companyIconUrl ?? "",
        description: existing.description,
        previousState: existing.previousState,
        newState: existing.newState,
      });
      if (existing.companyIconUrl) setLogoPreview(existing.companyIconUrl);
    }
  }, [existing, form]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
    await uploadFile(file);
  };

  const handleRemoveLogo = () => {
    form.setValue("companyIconUrl", "");
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const createMutation = useCreateUseCase({
    mutation: {
      onSuccess: () => {
        toast({ title: "Caso de uso creado" });
        queryClient.invalidateQueries({ queryKey: getListUseCasesQueryKey() });
        setLocation("/admin/dashboard");
      },
      onError: () => toast({ title: "Error al crear", variant: "destructive" }),
    },
  });

  const updateMutation = useUpdateUseCase({
    mutation: {
      onSuccess: () => {
        toast({ title: "Caso actualizado" });
        queryClient.invalidateQueries({ queryKey: getListUseCasesQueryKey() });
        setLocation("/admin/dashboard");
      },
      onError: () => toast({ title: "Error al actualizar", variant: "destructive" }),
    },
  });

  const onSubmit = (data: FormValues) => {
    const payload = { ...data, companyIconUrl: data.companyIconUrl || null };
    if (isEditing) updateMutation.mutate({ id: id!, data: payload });
    else createMutation.mutate({ data: payload });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const offerings = offeringsData?.offerings ?? [];

  if (isEditing && isLoading) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-6 py-10 max-w-3xl">
          <div className="h-8 w-48 bg-gray-100 rounded-lg mb-8 animate-pulse" />
          <div className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-6 py-10 max-w-3xl">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm text-[#605E5C] hover:text-[#0078D4] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver al dashboard
        </Link>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-[#0078D4]/5 to-transparent">
            <div className="h-1 w-10 bg-[#0078D4] rounded-full mb-3" />
            <h1 className="text-xl font-bold text-[#1A1A1A]">
              {isEditing ? "Editar Caso de Uso" : "Nuevo Caso de Uso"}
            </h1>
            <p className="text-sm text-[#605E5C] mt-0.5">
              {isEditing ? "Modifica los datos del caso" : "Añade un nuevo caso de éxito al portal"}
            </p>
          </div>

          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                {/* Offering & Industry */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField control={form.control} name="offeringId" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Servicio Asociado</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#605E5C] pointer-events-none" />
                          <select
                            className={`${inputClass} appearance-none pr-10`}
                            value={field.value}
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          >
                            <option value={0}>Seleccionar...</option>
                            {offerings.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                          </select>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="industryType" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Industria</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#605E5C] pointer-events-none" />
                          <select
                            className={`${inputClass} appearance-none pr-10`}
                            value={field.value}
                            onChange={e => field.onChange(e.target.value)}
                          >
                            {INDUSTRY_OPTIONS.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                          </select>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="projectName" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Nombre del Proyecto / Cliente</FormLabel>
                    <FormControl>
                      <input placeholder="ej. Migración Bancaria Grupo Financiero XYZ" className={inputClass} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Logo Upload */}
                <FormField control={form.control} name="companyIconUrl" render={() => (
                  <FormItem>
                    <FormLabel className={`${labelClass} flex items-center gap-2`}>
                      <ImageIcon className="w-4 h-4 text-[#605E5C]" />
                      Logo de la Empresa (opcional)
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                        <div className="relative shrink-0">
                          {logoPreview ? (
                            <div className="relative w-16 h-16 rounded-xl border border-gray-200 bg-white overflow-hidden">
                              <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-1.5" />
                              <button
                                type="button"
                                onClick={handleRemoveLogo}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                              >
                                <X className="w-3 h-3 text-white" />
                              </button>
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 bg-white flex items-center justify-center">
                              <Building2 className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                          <button
                            type="button"
                            disabled={isUploading}
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center gap-2 border border-[#0078D4] text-[#0078D4] hover:bg-[#0078D4]/5 disabled:opacity-60 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <Upload className="w-4 h-4" />
                            {isUploading ? "Subiendo..." : logoPreview ? "Cambiar logo" : "Subir logo"}
                          </button>
                          <p className="text-xs text-[#605E5C] mt-1.5">PNG, JPG o SVG — máx. 2 MB</p>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Descripción del Proyecto</FormLabel>
                    <FormControl>
                      <textarea rows={3} placeholder="Descripción general del caso de uso..." className={`${inputClass} resize-none`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField control={form.control} name="previousState" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-red-500">Estado Anterior (Antes)</FormLabel>
                      <FormControl>
                        <textarea
                          rows={5}
                          placeholder="Situación problemática del cliente antes de la implementación..."
                          className="w-full px-3 py-2 rounded-lg border border-red-200 bg-red-50/30 text-[#323130] text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-colors resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="newState" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-[#0078D4]">Estado Nuevo (Después)</FormLabel>
                      <FormControl>
                        <textarea
                          rows={5}
                          placeholder="Resultados y mejoras obtenidas después de implementar el servicio..."
                          className="w-full px-3 py-2 rounded-lg border border-[#0078D4]/20 bg-[#0078D4]/5 text-[#323130] text-sm focus:outline-none focus:ring-2 focus:ring-[#0078D4]/30 focus:border-[#0078D4] transition-colors resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                  <Link href="/admin/dashboard">
                    <button type="button" className="px-4 py-2 text-sm text-[#605E5C] hover:text-[#323130] rounded-lg hover:bg-gray-100 transition-colors">
                      Cancelar
                    </button>
                  </Link>
                  <button
                    type="submit"
                    disabled={isPending || isUploading}
                    className="inline-flex items-center gap-2 bg-[#0078D4] hover:bg-[#006CBE] disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {isPending ? "Guardando..." : isEditing ? "Actualizar" : "Crear Caso"}
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
