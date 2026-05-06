import { useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateOffering,
  useUpdateOffering,
  useGetOffering,
  getListOfferingsQueryKey,
  getGetOfferingQueryKey,
} from "@workspace/api-client-react";
import { AdminLayout } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const schema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  durationHours: z.string().min(1, "Duración requerida"),
  techPillar: z.string().min(1, "Pilar técnico requerido"),
  businessBenefit: z.string().min(1, "Beneficio requerido"),
  whatIsIt: z.string().min(1, "Descripción requerida"),
  whatDoesItSolve: z.string().min(1, "Descripción requerida"),
});

type FormValues = z.infer<typeof schema>;

export default function AdminOfferingForm() {
  const params = useParams<{ id: string }>();
  const id = params?.id ? parseInt(params.id) : undefined;
  const isEditing = !!id;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: existing, isLoading } = useGetOffering(id!, {
    query: { enabled: isEditing, queryKey: getGetOfferingQueryKey(id!) },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      durationHours: "",
      techPillar: "",
      businessBenefit: "",
      whatIsIt: "",
      whatDoesItSolve: "",
    },
  });

  useEffect(() => {
    if (existing) {
      form.reset({
        name: existing.name,
        durationHours: existing.durationHours,
        techPillar: existing.techPillar,
        businessBenefit: existing.businessBenefit,
        whatIsIt: existing.whatIsIt,
        whatDoesItSolve: existing.whatDoesItSolve,
      });
    }
  }, [existing, form]);

  const createMutation = useCreateOffering({
    mutation: {
      onSuccess: () => {
        toast({ title: "Servicio creado" });
        queryClient.invalidateQueries({ queryKey: getListOfferingsQueryKey() });
        setLocation("/admin/dashboard");
      },
      onError: () => toast({ title: "Error al crear", variant: "destructive" }),
    },
  });

  const updateMutation = useUpdateOffering({
    mutation: {
      onSuccess: () => {
        toast({ title: "Servicio actualizado" });
        queryClient.invalidateQueries({ queryKey: getListOfferingsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetOfferingQueryKey(id!) });
        setLocation("/admin/dashboard");
      },
      onError: () => toast({ title: "Error al actualizar", variant: "destructive" }),
    },
  });

  const onSubmit = (data: FormValues) => {
    if (isEditing) {
      updateMutation.mutate({ id: id!, data });
    } else {
      createMutation.mutate({ data });
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
              {isEditing ? "Editar Servicio" : "Nuevo Servicio"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Nombre del Servicio</FormLabel>
                      <FormControl>
                        <Input placeholder="ej. Journey to FinOps" className="bg-background/50 border-white/10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="durationHours" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duración</FormLabel>
                      <FormControl>
                        <Input placeholder="ej. 40 horas / TBD" className="bg-background/50 border-white/10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="techPillar" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pilar Técnico</FormLabel>
                      <FormControl>
                        <Input placeholder="ej. IaC + Serverless" className="bg-background/50 border-white/10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="businessBenefit" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beneficio de Negocio</FormLabel>
                    <FormControl>
                      <Input placeholder="ej. Control total del gasto sin esfuerzo manual." className="bg-background/50 border-white/10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="whatIsIt" render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿Qué es?</FormLabel>
                    <FormControl>
                      <Textarea rows={4} placeholder="Descripción del servicio..." className="bg-background/50 border-white/10 resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="whatDoesItSolve" render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿Qué resuelve?</FormLabel>
                    <FormControl>
                      <Textarea rows={4} placeholder="Problemas que soluciona..." className="bg-background/50 border-white/10 resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Save className="w-4 h-4 mr-2" />
                    {isPending ? "Guardando..." : isEditing ? "Actualizar" : "Crear Servicio"}
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
