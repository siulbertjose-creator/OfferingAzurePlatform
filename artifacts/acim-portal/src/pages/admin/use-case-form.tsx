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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Save, ChevronDown, Upload, X, Building2, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const INDUSTRY_OPTIONS = [
  "Servicios Financieros",
  "Manufactura",
  "Retail",
  "Salud",
  "Tecnología",
  "Gobierno",
  "Educación",
  "Energía",
  "Telecomunicaciones",
  "Otro",
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
    onError: () => {
      toast({ title: "Error al cargar el logo", variant: "destructive" });
    },
  });

  const { data: offeringsData } = useListOfferings({
    query: { queryKey: getListOfferingsQueryKey() },
  });

  const { data: existing, isLoading } = useGetUseCase(id!, {
    query: { enabled: isEditing, queryKey: getGetUseCaseQueryKey(id!) },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      offeringId: 0,
      projectName: "",
      industryType: "Servicios Financieros",
      companyIconUrl: "",
      description: "",
      previousState: "",
      newState: "",
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
      if (existing.companyIconUrl) {
        setLogoPreview(existing.companyIconUrl);
      }
    }
  }, [existing, form]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectURL = URL.createObjectURL(file);
    setLogoPreview(objectURL);

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
    const payload = {
      ...data,
      companyIconUrl: data.companyIconUrl || null,
    };
    if (isEditing) {
      updateMutation.mutate({ id: id!, data: payload });
    } else {
      createMutation.mutate({ data: payload });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isEditing && isLoading) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-10">
          <Skeleton className="h-8 w-48 mb-8 bg-white/5" />
          <Skeleton className="h-96 bg-white/5 rounded-xl" />
        </div>
      </AdminLayout>
    );
  }

  const offerings = offeringsData?.offerings ?? [];

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <Link href="/admin/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al dashboard
        </Link>

        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-xl">
              {isEditing ? "Editar Caso de Uso" : "Nuevo Caso de Uso"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Offering & Industry */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField control={form.control} name="offeringId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Servicio Asociado</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                          <select
                            className="w-full appearance-none bg-background/50 border border-white/10 text-foreground text-sm rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
                            value={field.value}
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          >
                            <option value={0} className="bg-background">Seleccionar...</option>
                            {offerings.map(o => (
                              <option key={o.id} value={o.id} className="bg-background">{o.name}</option>
                            ))}
                          </select>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="industryType" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industria</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                          <select
                            className="w-full appearance-none bg-background/50 border border-white/10 text-foreground text-sm rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
                            value={field.value}
                            onChange={e => field.onChange(e.target.value)}
                          >
                            {INDUSTRY_OPTIONS.map(ind => (
                              <option key={ind} value={ind} className="bg-background">{ind}</option>
                            ))}
                          </select>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="projectName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Proyecto / Cliente</FormLabel>
                    <FormControl>
                      <Input placeholder="ej. Migración Bancaria Grupo Financiero XYZ" className="bg-background/50 border-white/10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Logo Upload */}
                <FormField control={form.control} name="companyIconUrl" render={() => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Logo de la Empresa (opcional)
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        {/* Preview */}
                        <div className="relative flex-shrink-0">
                          {logoPreview ? (
                            <div className="relative w-16 h-16 rounded-xl border border-white/20 bg-white/10 overflow-hidden">
                              <img
                                src={logoPreview}
                                alt="Logo preview"
                                className="w-full h-full object-contain p-1.5"
                              />
                              <button
                                type="button"
                                onClick={handleRemoveLogo}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                              >
                                <X className="w-3 h-3 text-white" />
                              </button>
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-xl border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center">
                              <Building2 className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Upload button */}
                        <div className="flex-1">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isUploading}
                            onClick={() => fileInputRef.current?.click()}
                            className="border-white/20 hover:border-primary/50 hover:bg-primary/10 text-sm"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {isUploading ? "Subiendo..." : logoPreview ? "Cambiar logo" : "Subir logo"}
                          </Button>
                          <p className="text-xs text-muted-foreground mt-1.5">
                            PNG, JPG o SVG — máx. 2 MB
                          </p>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción del Proyecto</FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder="Descripción general del caso de uso..." className="bg-background/50 border-white/10 resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField control={form.control} name="previousState" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-400">Estado Anterior (Antes)</FormLabel>
                      <FormControl>
                        <Textarea rows={5} placeholder="Describe la situación problemática del cliente antes de la implementación..." className="bg-red-500/5 border-red-500/20 resize-none focus-visible:ring-red-500/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="newState" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Estado Nuevo (Después)</FormLabel>
                      <FormControl>
                        <Textarea rows={5} placeholder="Describe los resultados y mejoras obtenidas después de implementar el servicio..." className="bg-primary/5 border-primary/20 resize-none focus-visible:ring-primary/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={isPending || isUploading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Save className="w-4 h-4 mr-2" />
                    {isPending ? "Guardando..." : isEditing ? "Actualizar" : "Crear Caso"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
