import { useState, useMemo } from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import {
  useGetOffering,
  getGetOfferingQueryKey,
  useListUseCases,
  getListUseCasesQueryKey,
} from "@workspace/api-client-react";
import { LightNavbar } from "@/components/layout/Navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Clock,
  Lightbulb,
  Wrench,
  Search,
  Filter,
  Building2,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Tag,
} from "lucide-react";

const INDUSTRIES = [
  "Todos", "Servicios Financieros", "Manufactura", "Retail",
  "Salud", "Tecnología", "Gobierno", "Educación", "Energía",
  "Telecomunicaciones", "Otro",
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
    if (industry !== "Todos") cases = cases.filter(c => c.industryType === industry);
    if (search.trim()) {
      const q = search.toLowerCase();
      cases = cases.filter(
        c => c.projectName.toLowerCase().includes(q) || c.description.toLowerCase().includes(q),
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
      <div className="min-h-screen bg-[#F8F9FA]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <LightNavbar />
        <div className="container mx-auto px-6 py-8">
          <Skeleton className="h-6 w-32 mb-8 bg-gray-100" />
          <Skeleton className="h-48 w-full mb-8 bg-gray-100 rounded-2xl" />
          <div className="grid grid-cols-2 gap-6">
            <Skeleton className="h-52 bg-gray-100 rounded-2xl" />
            <Skeleton className="h-52 bg-gray-100 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!offering) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <LightNavbar />
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Servicio no encontrado</h1>
          <Link href="/" className="text-[#0078D4] mt-4 inline-block hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const totalCases = useCasesData?.useCases.length ?? 0;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <LightNavbar />

      {/* ─── Hero ─── */}
      <div className="bg-[#0078D4] relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 80% 50%, white 0%, transparent 60%)" }} />
        <div className="absolute right-0 top-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute right-24 bottom-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />

        <div className="container mx-auto px-6 pt-8 pb-12 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white transition-colors text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a servicios
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/20 text-white px-3 py-1 rounded-full border border-white/20">
              <Tag className="w-3 h-3" />
              {offering.techPillar}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-blue-100 bg-white/10 px-3 py-1 rounded-full border border-white/15">
              <Clock className="w-3 h-3" />
              {offering.durationHours}
            </span>
            {totalCases > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs text-blue-100 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                <Building2 className="w-3 h-3" />
                {totalCases} caso{totalCases !== 1 ? "s" : ""} de uso
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 max-w-3xl leading-tight">
            {offering.name}
          </h1>
          <p className="text-lg text-blue-100 font-medium max-w-2xl leading-relaxed">
            {offering.businessBenefit}
          </p>
        </div>
      </div>

      {/* ─── What is it / What does it solve ─── */}
      <div className="container mx-auto px-6 -mt-1 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="h-1 bg-[#0078D4]" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-[#0078D4]/10 rounded-xl flex items-center justify-center border border-[#0078D4]/10">
                  <Lightbulb className="w-4 h-4 text-[#0078D4]" />
                </div>
                <h2 className="text-lg font-bold text-[#1A1A1A]">¿Qué es?</h2>
              </div>
              <p className="text-[#605E5C] leading-relaxed text-sm">{offering.whatIsIt}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="h-1 bg-emerald-500" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
                  <Wrench className="w-4 h-4 text-emerald-600" />
                </div>
                <h2 className="text-lg font-bold text-[#1A1A1A]">¿Qué resuelve?</h2>
              </div>
              <p className="text-[#605E5C] leading-relaxed text-sm">{offering.whatDoesItSolve}</p>
            </div>
          </motion.div>
        </div>

        {/* ─── Use Cases ─── */}
        <div>
          {/* Section header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#605E5C] mb-1">Implementaciones reales</p>
              <h2 className="text-2xl font-bold text-[#1A1A1A] flex items-center gap-2">
                <Building2 className="w-6 h-6 text-[#0078D4]" />
                Casos de Uso
              </h2>
              <p className="text-[#605E5C] text-sm mt-1">
                {filteredCases.length} caso{filteredCases.length !== 1 ? "s" : ""} {industry !== "Todos" ? `en ${industry}` : "disponibles"}
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#605E5C]" />
                <input
                  placeholder="Buscar proyecto..."
                  className="pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-white text-[#323130] focus:outline-none focus:ring-2 focus:ring-[#0078D4]/30 focus:border-[#0078D4] w-full sm:w-64 transition-colors"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#605E5C] pointer-events-none" />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#605E5C] pointer-events-none" />
                <select
                  className="appearance-none pl-10 pr-10 py-2 text-sm rounded-lg border border-gray-200 bg-white text-[#323130] focus:outline-none focus:ring-2 focus:ring-[#0078D4]/30 focus:border-[#0078D4] w-full sm:w-52 transition-colors"
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                >
                  {uniqueIndustries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Industry quick filters */}
          {uniqueIndustries.length > 2 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {uniqueIndustries.map(ind => (
                <button
                  key={ind}
                  onClick={() => setIndustry(ind)}
                  className={`text-xs font-medium px-3 py-1 rounded-full border transition-colors ${
                    industry === ind
                      ? "bg-[#0078D4] text-white border-[#0078D4]"
                      : "bg-white text-[#605E5C] border-gray-200 hover:border-[#0078D4]/40 hover:text-[#0078D4]"
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          )}

          {/* Use Case Cards */}
          {useCasesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-2xl bg-gray-100" />
              ))}
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">Sin casos disponibles</h3>
              <p className="text-[#605E5C] text-sm">
                {useCasesData?.useCases.length === 0
                  ? "Aún no hay casos de uso para este servicio."
                  : "Prueba ajustando los filtros de búsqueda."}
              </p>
              {industry !== "Todos" && (
                <button
                  onClick={() => setIndustry("Todos")}
                  className="mt-4 text-sm text-[#0078D4] hover:underline"
                >
                  Ver todos los sectores
                </button>
              )}
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {filteredCases.map(uc => (
                <motion.div
                  key={uc.id}
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#0078D4]/20 transition-all duration-200 overflow-hidden flex flex-col"
                >
                  {/* Card top accent */}
                  <div className="h-1 bg-gradient-to-r from-[#0078D4] to-[#50E6FF]" />

                  <div className="p-6 flex flex-col flex-1">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-4">
                      {uc.companyIconUrl ? (
                        <img
                          src={uc.companyIconUrl}
                          alt={uc.projectName}
                          className="w-11 h-11 rounded-xl object-contain bg-gray-50 border border-gray-100 p-1.5 shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-[#0078D4]/10 border border-[#0078D4]/15 flex items-center justify-center shrink-0">
                          <Building2 className="w-5 h-5 text-[#0078D4]" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-bold text-[#1A1A1A] leading-tight">{uc.projectName}</h3>
                        <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-[#605E5C] bg-gray-100 px-2 py-0.5 rounded-full mt-1">
                          {uc.industryType}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-[#605E5C] leading-relaxed mb-5">{uc.description}</p>

                    {/* Before / After */}
                    <div className="mt-auto grid grid-cols-2 gap-3">
                      <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 mb-2">
                          <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span className="text-[10px] uppercase tracking-widest text-red-500 font-bold">Antes</span>
                        </div>
                        <p className="text-xs text-[#605E5C] leading-relaxed">{uc.previousState}</p>
                      </div>
                      <div className="bg-[#0078D4]/5 border border-[#0078D4]/15 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 mb-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0078D4] shrink-0" />
                          <span className="text-[10px] uppercase tracking-widest text-[#0078D4] font-bold">Después</span>
                        </div>
                        <p className="text-xs text-[#605E5C] leading-relaxed">{uc.newState}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
