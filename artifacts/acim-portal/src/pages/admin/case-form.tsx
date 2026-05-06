import { useEffect } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useGetSuccessCase, 
  getGetSuccessCaseQueryKey,
  useCreateSuccessCase,
  useUpdateSuccessCase,
  getListSuccessCasesQueryKey,
  getGetSuccessCasesStatsQueryKey
} from "@workspace/api-client-react";
import { AdminLayout } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const caseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  clientName: z.string().min(1, "Client Name is required"),
  executiveSummary: z.string().min(10, "Summary must be at least 10 characters"),
  industry: z.string().optional().nullable(),
  publishedAt: z.string().optional().nullable(),
  discoveryMapUrl: z.string().url().optional().nullable().or(z.literal("")),
  azureAnalyzerKpis: z.object({
    governanceScore: z.coerce.number().min(0).max(100),
    wellArchitectedScore: z.coerce.number().min(0).max(100),
    reliabilityScore: z.coerce.number().min(0).max(100),
    securityScore: z.coerce.number().min(0).max(100),
    costOptimizationScore: z.coerce.number().min(0).max(100),
    operationalExcellenceScore: z.coerce.number().min(0).max(100),
    performanceScore: z.coerce.number().min(0).max(100),
    totalResources: z.coerce.number().min(0),
    managedResources: z.coerce.number().min(0),
    findings: z.coerce.number().min(0),
  }),
  azureAuditorFindings: z.object({
    summary: z.string().min(1, "Audit summary is required"),
    criticalIssues: z.array(z.object({ value: z.string().min(1) })).min(1, "At least one critical issue is required"),
    recommendations: z.array(z.object({ value: z.string().min(1) })).min(1, "At least one recommendation is required"),
    costSavingsEstimate: z.coerce.number().min(0),
    costSavingsCurrency: z.string().min(1).default("USD"),
    complianceStatus: z.string().min(1),
    auditDate: z.string().min(1),
  })
});

type CaseFormValues = z.infer<typeof caseSchema>;

export default function CaseForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [matchEdit, paramsEdit] = useRoute("/admin/cases/:id/edit");
  const isEditMode = matchEdit;
  const id = isEditMode && paramsEdit?.id ? parseInt(paramsEdit.id) : 0;

  const { data: existingCase, isLoading } = useGetSuccessCase(id, {
    query: { enabled: !!id, queryKey: getGetSuccessCaseQueryKey(id) }
  });

  const form = useForm<CaseFormValues>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      title: "",
      clientName: "",
      executiveSummary: "",
      industry: "",
      publishedAt: new Date().toISOString().split("T")[0],
      discoveryMapUrl: "",
      azureAnalyzerKpis: {
        governanceScore: 0, wellArchitectedScore: 0, reliabilityScore: 0, securityScore: 0,
        costOptimizationScore: 0, operationalExcellenceScore: 0, performanceScore: 0,
        totalResources: 0, managedResources: 0, findings: 0
      },
      azureAuditorFindings: {
        summary: "",
        criticalIssues: [{ value: "" }],
        recommendations: [{ value: "" }],
        costSavingsEstimate: 0,
        costSavingsCurrency: "USD",
        complianceStatus: "Compliant",
        auditDate: new Date().toISOString().split("T")[0]
      }
    }
  });

  const { fields: criticalIssueFields, append: appendIssue, remove: removeIssue } = useFieldArray({
    control: form.control,
    name: "azureAuditorFindings.criticalIssues"
  });

  const { fields: recommendationFields, append: appendRec, remove: removeRec } = useFieldArray({
    control: form.control,
    name: "azureAuditorFindings.recommendations"
  });

  useEffect(() => {
    if (existingCase && isEditMode) {
      form.reset({
        title: existingCase.title,
        clientName: existingCase.clientName,
        executiveSummary: existingCase.executiveSummary,
        industry: existingCase.industry || "",
        publishedAt: existingCase.publishedAt ? new Date(existingCase.publishedAt).toISOString().split("T")[0] : "",
        discoveryMapUrl: existingCase.discoveryMapUrl || "",
        azureAnalyzerKpis: existingCase.azureAnalyzerKpis,
        azureAuditorFindings: {
          ...existingCase.azureAuditorFindings,
          criticalIssues: existingCase.azureAuditorFindings.criticalIssues.map(i => ({ value: i })),
          recommendations: existingCase.azureAuditorFindings.recommendations.map(r => ({ value: r }))
        }
      });
    }
  }, [existingCase, isEditMode, form]);

  const createMutation = useCreateSuccessCase({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListSuccessCasesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetSuccessCasesStatsQueryKey() });
        toast({ title: "Case created successfully" });
        setLocation("/admin/dashboard");
      }
    }
  });

  const updateMutation = useUpdateSuccessCase({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetSuccessCaseQueryKey(id) });
        queryClient.invalidateQueries({ queryKey: getListSuccessCasesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetSuccessCasesStatsQueryKey() });
        toast({ title: "Case updated successfully" });
        setLocation("/admin/dashboard");
      }
    }
  });

  const onSubmit = (data: CaseFormValues) => {
    // Transform arrays back to strings
    const formattedData = {
      ...data,
      discoveryMapUrl: data.discoveryMapUrl || null,
      azureAuditorFindings: {
        ...data.azureAuditorFindings,
        criticalIssues: data.azureAuditorFindings.criticalIssues.map(i => i.value),
        recommendations: data.azureAuditorFindings.recommendations.map(r => r.value)
      }
    };

    if (isEditMode) {
      updateMutation.mutate({ id, data: formattedData });
    } else {
      createMutation.mutate({ data: formattedData });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isEditMode && isLoading) {
    return <AdminLayout><div className="container mx-auto p-8">Loading...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="icon" className="shrink-0 rounded-full border border-white/10 bg-white/5 hover:bg-white/10">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{isEditMode ? "Edit Success Case" : "New Success Case"}</h1>
            <p className="text-muted-foreground mt-1">Fill out the details below to publish a new architecture case.</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* 1. Basic Info */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-xl">1. Core Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Case Title</FormLabel>
                      <FormControl><Input placeholder="e.g. Global Financial Migration" className="bg-background/50 border-white/10" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="clientName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name</FormLabel>
                      <FormControl><Input placeholder="e.g. Acme Corp" className="bg-background/50 border-white/10" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="industry" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl><Input placeholder="e.g. Finance" className="bg-background/50 border-white/10" {...field} value={field.value || ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="publishedAt" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publish Date</FormLabel>
                      <FormControl><Input type="date" className="bg-background/50 border-white/10" {...field} value={field.value || ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="executiveSummary" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Executive Summary</FormLabel>
                    <FormControl><Textarea className="min-h-[100px] bg-background/50 border-white/10" placeholder="Brief overview of the challenge and solution..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="discoveryMapUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discovery Map Image URL (Optional)</FormLabel>
                    <FormControl><Input placeholder="https://..." className="bg-background/50 border-white/10" {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            {/* 2. Azure Analyzer Export */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-xl">2. Azure Analyzer KPI Export</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {['governanceScore', 'wellArchitectedScore', 'reliabilityScore', 'securityScore', 'costOptimizationScore', 'operationalExcellenceScore', 'performanceScore'].map((key) => (
                    <FormField key={key} control={form.control} name={`azureAnalyzerKpis.${key}` as any} render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-wider">{key.replace('Score', '')} (%)</FormLabel>
                        <FormControl><Input type="number" min="0" max="100" className="bg-background/50 border-white/10 font-mono" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  ))}
                  <div className="col-span-full border-t border-white/5 my-2"></div>
                  <FormField control={form.control} name="azureAnalyzerKpis.totalResources" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider">Total Resources</FormLabel>
                      <FormControl><Input type="number" min="0" className="bg-background/50 border-white/10 font-mono" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="azureAnalyzerKpis.managedResources" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider">Managed Resources</FormLabel>
                      <FormControl><Input type="number" min="0" className="bg-background/50 border-white/10 font-mono" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="azureAnalyzerKpis.findings" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider">Total Findings</FormLabel>
                      <FormControl><Input type="number" min="0" className="bg-background/50 border-white/10 font-mono" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>

            {/* 3. Azure Auditor Report */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-xl">3. Azure Auditor Report</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <FormField control={form.control} name="azureAuditorFindings.summary" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Audit Summary</FormLabel>
                    <FormControl><Textarea className="bg-background/50 border-white/10" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField control={form.control} name="azureAuditorFindings.costSavingsEstimate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Savings Estimate</FormLabel>
                      <FormControl><Input type="number" min="0" className="bg-background/50 border-white/10 font-mono" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="azureAuditorFindings.costSavingsCurrency" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl><Input className="bg-background/50 border-white/10 font-mono" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="azureAuditorFindings.complianceStatus" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Compliance Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50 border-white/10">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Compliant">Compliant</SelectItem>
                          <SelectItem value="Non-Compliant">Non-Compliant</SelectItem>
                          <SelectItem value="Partial">Partial</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base">Critical Issues Resolved</FormLabel>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendIssue({ value: "" })} className="h-8 border-white/10 bg-white/5">
                      <Plus className="w-3 h-3 mr-2" /> Add Issue
                    </Button>
                  </div>
                  {criticalIssueFields.map((field, index) => (
                    <FormField key={field.id} control={form.control} name={`azureAuditorFindings.criticalIssues.${index}.value`} render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormControl><Input className="bg-background/50 border-white/10" {...field} /></FormControl>
                          <Button type="button" variant="ghost" size="icon" className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeIssue(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />
                  ))}
                  {form.formState.errors.azureAuditorFindings?.criticalIssues?.root && (
                    <p className="text-sm font-medium text-destructive">{form.formState.errors.azureAuditorFindings.criticalIssues.root.message}</p>
                  )}
                </div>

                <Separator className="bg-white/5" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base">Key Recommendations</FormLabel>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendRec({ value: "" })} className="h-8 border-white/10 bg-white/5">
                      <Plus className="w-3 h-3 mr-2" /> Add Recommendation
                    </Button>
                  </div>
                  {recommendationFields.map((field, index) => (
                    <FormField key={field.id} control={form.control} name={`azureAuditorFindings.recommendations.${index}.value`} render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormControl><Input className="bg-background/50 border-white/10" {...field} /></FormControl>
                          <Button type="button" variant="ghost" size="icon" className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeRec(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />
                  ))}
                  {form.formState.errors.azureAuditorFindings?.recommendations?.root && (
                    <p className="text-sm font-medium text-destructive">{form.formState.errors.azureAuditorFindings.recommendations.root.message}</p>
                  )}
                </div>

              </CardContent>
            </Card>

            <div className="flex justify-end gap-4 pb-12">
              <Link href="/admin/dashboard">
                <Button type="button" variant="ghost" className="text-muted-foreground">Cancel</Button>
              </Link>
              <Button type="submit" className="min-w-[140px]" disabled={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Saving..." : (isEditMode ? "Save Changes" : "Publish Case")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}
