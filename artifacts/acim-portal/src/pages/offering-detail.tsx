import { useState, useMemo } from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import {
  useGetOffering,
  getGetOfferingQueryKey,
  useListUseCases,
  getListUseCasesQueryKey,
} from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Clock,
  Lightbulb,
  Wrench,
  Search,
  Filter,
  ArrowRight,
  Building2,
  ChevronDown,
} from "lucide-react";

const INDUSTRIES = [
  "Todos",
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

export default function OfferingDetail() {
  const params = useParams<{ id: string }>();
  const id = params?.id ? parseInt(params.id) : 0;

  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("Todos");

  const { data: offering, isLoading: offeringLoading } = useGetOffering(id, {
    query: { enabled: !!id, queryKey: getGetOfferingQueryKey(id) },
  });

  const { data: useCasesData, isLoading: useCasesLoading } = useListUseCases(
    { offeringId: id },
    { query: { enabled: !!id, queryKey: getListUseCasesQueryKey({ offeringId: id }) } },
  );

  const filteredCases = useMemo(() => {
    let cases = useCasesData?.useCases ?? [];
    if (industry !== "Todos") {
      cases = cases.filter(c => c.industryType === industry);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      cases = cases.filter(
        c =>
          c.projectName.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q),
      );
    }
    return cases;
  }, [useCasesData, industry, search]);

  const uniqueIndustries = useMemo(() => {
    const set = new Set((useCasesData?.useCases ?? []).map(c => c.industryType));
    return ["Todos", ...Array.from(set)];
  }, [useCasesData]);

  if (offeringLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-8 bg-white/5" />
          <Skeleton className="h-48 w-full mb-8 bg-white/5" />
          <Skeleton className="h-64 w-full bg-white/5" />
        </div>
      </div>
    );
  }

  if (!offering) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Servicio no encontrado</h1>
          <Link href="/" className="text-primary mt-4 inline-block hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />

      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-md pt-8 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a servicios
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className="bg-primary/20 text-primary border-primary/30">
              {offering.techPillar}
            </Badge>
            <Badge variant="outline" className="border-white/10 text-muted-foreground">
              <Clock className="w-3 h-3 mr-1.5" />
              {offering.durationHours}
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 max-w-4xl">
            {offering.name}
          </h1>
          <p className="text-lg text-primary font-medium">{offering.businessBenefit}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* What is it / What does it solve */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full bg-white/5 border-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-1.5 bg-primary/20 rounded-lg">
                    <Lightbulb className="w-4 h-4 text-primary" />
                  </div>
                  ¿Qué es?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{offering.whatIsIt}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full bg-white/5 border-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-1.5 bg-primary/20 rounded-lg">
                    <Wrench className="w-4 h-4 text-primary" />
                  </div>
                  ¿Qué resuelve?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{offering.whatDoesItSolve}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Use Cases Sub-panel */}
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Building2 className="w-6 h-6 text-primary" />
                Casos de Uso
              </h2>
              <p className="text-muted-foreground mt-1">
                {filteredCases.length} caso{filteredCases.length !== 1 ? "s" : ""} disponible{filteredCases.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o descripción..."
                  className="pl-10 bg-white/5 border-white/10 focus-visible:ring-primary w-full sm:w-72"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              {/* Industry Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <select
                  className="appearance-none bg-white/5 border border-white/10 text-foreground text-sm rounded-md pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-52"
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                >
                  {uniqueIndustries.map(ind => (
                    <option key={ind} value={ind} className="bg-background">
                      {ind}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {useCasesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl bg-white/5" />
              ))}
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
              <h3 className="text-xl font-medium mb-2">Sin casos disponibles</h3>
              <p className="text-muted-foreground">
                {useCasesData?.useCases.length === 0
                  ? "Aún no hay casos de uso para este servicio."
                  : "Prueba ajustando los filtros de búsqueda."}
              </p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {filteredCases.map(uc => (
                <motion.div
                  key={uc.id}
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                >
                  <Card className="h-full bg-white/5 border-white/10 hover:border-primary/40 hover:bg-white/8 transition-all duration-300 backdrop-blur-md flex flex-col overflow-hidden">
                    <CardContent className="p-6 flex flex-col h-full">
                      {/* Header row */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {uc.companyIconUrl ? (
                            <img
                              src={uc.companyIconUrl}
                              alt={uc.projectName}
                              className="w-10 h-10 rounded-lg object-contain bg-white/10 p-1"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-primary" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-base leading-tight">{uc.projectName}</h3>
                            <Badge variant="secondary" className="text-xs mt-0.5 bg-white/10 text-muted-foreground">
                              {uc.industryType}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-5 line-clamp-2 leading-relaxed">
                        {uc.description}
                      </p>

                      {/* Before / After */}
                      <div className="grid grid-cols-2 gap-3 mt-auto">
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <div className="text-[10px] uppercase tracking-widest text-red-400 font-semibold mb-1.5">
                            Antes
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                            {uc.previousState}
                          </p>
                        </div>
                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                          <div className="text-[10px] uppercase tracking-widest text-primary font-semibold mb-1.5">
                            Después
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                            {uc.newState}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
