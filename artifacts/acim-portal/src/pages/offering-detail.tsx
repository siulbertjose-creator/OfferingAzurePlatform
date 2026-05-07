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
  ArrowLeft, Clock, Lightbulb, Wrench, Search, Filter, Building2,
  ChevronDown, CheckCircle2, XCircle, Tag, Database, ScanSearch,
  Map, Shield, Lock, Key, TrendingDown, BarChart3,
  Layers, Globe, Bell, Zap, ArrowRight, Users, FileText,
  Monitor, Cpu, Network, HardDrive, Eye, Star, Target, Rocket,
} from "lucide-react";

/* ─── ACIM Modules ─── */
const ACIM_MODULES = [
  {
    id: "analyzer",
    icon: Database,
    title: "Azure Export Analyzer",
    subtitle: "Extracción de datos y visibilidad estructurada",
    color: "text-[#0078D4] bg-blue-50 border-blue-100",
    accent: "#0078D4",
    features: [
      "Extracción automatizada con identidad de solo lectura",
      "Captura masiva en todas las suscripciones y regiones",
      "Reportes detallados con metadata crítica",
      "Operación segura sin impacto sobre los entornos",
      "Base diagnóstica para el análisis de gobernanza",
    ],
  },
  {
    id: "auditor",
    icon: ScanSearch,
    title: "Smart Cloud Auditor",
    subtitle: "Visibilidad total y análisis de riesgos",
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    accent: "#4F46E5",
    features: [
      "Base técnica para planificación estratégica",
      "Detección de vulnerabilidades en la arquitectura",
      "Alineación con estándares de industria (WAF, ASB, MCRA)",
      "Propuestas para robustecer el entorno",
      "Guía de mejora continua del ecosistema",
    ],
  },
  {
    id: "maps",
    icon: Map,
    title: "Discovery Maps",
    subtitle: "Exploración y mapeo del ecosistema cloud",
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    accent: "#059669",
    features: [
      "Visualización multidimensional de recursos y suscripciones",
      "Identificación de distribución geográfica de activos",
      "Análisis de densidad por familia y tipo de recurso",
      "Integración con Azure Advisor para optimizaciones nativas",
      "Panorama operativo del volumen de recursos por entorno",
    ],
  },
];

const ACIM_SECURITY = [
  { icon: Shield, title: "Mínimo Privilegio (RBAC)", desc: "Rol Reader exclusivo para descubrimiento no intrusivo de metadatos." },
  { icon: Key, title: "Managed Identities", desc: "Autenticación sin secretos estáticos ni conexión directa." },
  { icon: Lock, title: "Azure Key Vault", desc: "Gestión de credenciales críticas 100% mediante Key Vault." },
  { icon: Layers, title: "Tab Guard", desc: "Aislamiento de sesiones a nivel de pestaña del navegador." },
];

const ACIM_ONBOARDING = [
  { phase: "Fase I", title: "Identidad", desc: "Creación del Service Principal en Microsoft Entra ID.", color: "bg-blue-50 border-blue-100 text-[#0078D4]" },
  { phase: "Fase II", title: "Scope", desc: "Asignación de rol Reader en el alcance definido por el cliente.", color: "bg-indigo-50 border-indigo-100 text-indigo-600" },
  { phase: "Fase III", title: "Validación", desc: "Registro y verificación de conectividad en el portal ACIM.", color: "bg-emerald-50 border-emerald-100 text-emerald-600" },
];

/* ─── FinOps Capabilities ─── */
const FINOPS_PILLARS = [
  {
    num: "01",
    title: "Informar",
    subtitle: "Visibilidad 360° del gasto",
    desc: "Dashboard dinámico en Power BI con datos históricos y proyectados. Evolución de costo vs presupuesto, distribución por tipo de recurso y conteo de recursos huérfanos en una sola vista.",
    icon: BarChart3,
    color: "text-[#0078D4]",
    bg: "bg-blue-50 border-blue-100",
    accent: "#0078D4",
  },
  {
    num: "02",
    title: "Optimizar",
    subtitle: "Quick Wins y reducción activa",
    desc: "Identificación inmediata de Quick Wins por Azure Advisor, Right Sizing de VMs y DBs según utilización real, eliminación de recursos huérfanos (IPs, discos, planes sin uso). ~30% de reducción en los primeros 30 días.",
    icon: TrendingDown,
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-100",
    accent: "#059669",
  },
  {
    num: "03",
    title: "Operar",
    subtitle: "Gobernanza continua",
    desc: "Transferencia de habilidades para una cultura de responsabilidad financiera. Roadmap de remediación priorizado, optimización de licencias y compromisos (RI/Savings Plans) y skill transfer final.",
    icon: Users,
    color: "text-purple-600",
    bg: "bg-purple-50 border-purple-100",
    accent: "#7C3AED",
  },
];

const FINOPS_PHASES = [
  {
    week: "Semana 1",
    title: "Despliegue de Base",
    subtitle: "Automatización de la ingesta de datos",
    items: [
      "Infraestructura como Código (Terraform)",
      "Azure Functions para recolección de Advisor",
      "Cost Exports con histórico de 6 meses",
      "Resolución de issues y documentación técnica",
    ],
    deliverable: "Pipeline de ingesta operativo y documentación técnica.",
    color: "text-[#0078D4]",
    bg: "bg-blue-50 border-blue-100",
    accent: "#0078D4",
  },
  {
    week: "Semanas 2–3",
    title: "Relevamiento y Remediación",
    subtitle: "Optimización activa · maximizando el ROI",
    items: [
      "Quick Wins & Advisor: ahorros inmediatos detectados por Azure",
      "Right Sizing (VM & DB): ajuste según utilización real",
      "Recursos Huérfanos: IPs, discos y planes sin uso",
      "Análisis de RI / Savings Plans",
    ],
    deliverable: "~30% reducción potencial de desperdicio en 30 días.",
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-100",
    accent: "#059669",
  },
  {
    week: "Semana 4",
    title: "Roadmap y Skill Transfer",
    subtitle: "Gobernanza continua y capacitación",
    items: [
      "Roadmap de remediación priorizado",
      "Optimización de licencias y compromisos (RI/SP)",
      "Sesiones de transferencia de conocimiento (Skill Transfer)",
      "Entrega del Dashboard FinOps en producción",
    ],
    deliverable: "Equipo capacitado y plataforma FinOps autónoma.",
    color: "text-purple-600",
    bg: "bg-purple-50 border-purple-100",
    accent: "#7C3AED",
  },
];

const FINOPS_ARCH = [
  { icon: Globe, label: "Fuente de Datos", value: "Azure Portal", sub: "Cost Management + Resource Graph", color: "text-[#0078D4] bg-blue-50 border-blue-200" },
  { icon: Database, label: "Almacenamiento", value: "Storage Parquet", sub: "Exports particionados y estructurados", color: "text-amber-600 bg-amber-50 border-amber-200" },
  { icon: BarChart3, label: "Visualización", value: "Power BI", sub: "Queries M Parametrizadas (FinOps view)", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
];

const FINOPS_DASHBOARD = [
  "Evolución de Costo vs. Presupuesto (Mensual)",
  "Distribución de gasto por Tipo de Recurso",
  "Conteo y costo de Recursos Huérfanos",
  "Recomendaciones de ahorro priorizadas",
];

/* ─── AVD Journey ─── */
const AVD_PHASES = [
  {
    phase: "Fase 1",
    weeks: "Semana 1",
    title: "Strategy & Discovery",
    subtitle: "Alineación de negocio y evaluación de viabilidad",
    color: "text-[#0078D4]",
    bg: "bg-blue-50 border-blue-100",
    accent: "#0078D4",
    desc: "Analizamos el ecosistema actual, categorizamos perfiles de usuario y mapeamos dependencias operativas para diseñar una estrategia de adopción que responda a los objetivos críticos.",
    deliverable: "Matriz de casos de uso, alcance del entorno y estrategia de adopción recomendada.",
    icon: Target,
  },
  {
    phase: "Fase 2",
    weeks: "Semanas 2–3",
    title: "Architecture & Design",
    subtitle: "Diseño de plataforma escalable y resiliente",
    color: "text-indigo-600",
    bg: "bg-indigo-50 border-indigo-100",
    accent: "#4F46E5",
    desc: "Arquitectamos la solución AVD Enterprise-Ready: topologías de red, esquemas de identidad, gestión dinámica de perfiles, políticas de seguridad y proyecciones de consumo (FinOps).",
    deliverable: "Documento HLD/LLD, modelo estimado de costos y lineamientos de gobierno.",
    icon: Layers,
  },
  {
    phase: "Fase 3",
    weeks: "Semanas 4–5",
    title: "Platform Build & Configuration",
    subtitle: "Despliegue ágil, estandarizado y automatizado",
    color: "text-cyan-600",
    bg: "bg-cyan-50 border-cyan-100",
    accent: "#0891B2",
    desc: "IaC con Terraform y PowerShell: infraestructura base modular, Host Pools, Golden Images automatizadas, FSLogix para perfiles y mecanismos de entrega de aplicaciones.",
    deliverable: "Entorno AVD aprovisionado, operativo y listo para pruebas controladas (UAT).",
    icon: Cpu,
  },
  {
    phase: "Fase 4",
    weeks: "Semanas 6–7",
    title: "Optimization, Security & Governance",
    subtitle: "Aseguramiento y eficiencia operativa",
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-100",
    accent: "#059669",
    desc: "Auto-escalado para optimización de costos, acceso condicional MFA/Zero Trust y telemetría centralizada para observabilidad y cumplimiento normativo continuo.",
    deliverable: "Plataforma optimizada, asegurada y financieramente eficiente.",
    icon: Shield,
  },
  {
    phase: "Fase 5",
    weeks: "Semana 8",
    title: "Go-Live & Enablement",
    subtitle: "Transición operativa y empoderamiento del equipo",
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-100",
    accent: "#D97706",
    desc: "Paso a producción con handover exhaustivo y sesiones de transferencia de conocimiento. El equipo IT queda autónomo para gestionar y evolucionar la plataforma en el Día 2.",
    deliverable: "Plataforma AVD en producción y equipo IT capacitado.",
    icon: Rocket,
  },
];

const AVD_STACK = [
  { icon: Key, label: "Identidad y Acceso", value: "Microsoft Entra ID" },
  { icon: Monitor, label: "Cómputo y Virtualización", value: "Azure Virtual Desktop · Azure VMs" },
  { icon: Network, label: "Networking", value: "Azure Virtual Network" },
  { icon: HardDrive, label: "Almacenamiento y Perfiles", value: "Azure Files + FSLogix" },
  { icon: Shield, label: "Seguridad y Gobernanza", value: "Azure Key Vault" },
  { icon: Eye, label: "Observabilidad", value: "Azure Monitor + Log Analytics" },
];

const AVD_VALUE_PROPS = [
  { icon: Zap, title: "Time-to-Value 8 semanas", desc: "Metodología estructurada con camino claro, sin fricciones y con resultados productivos en solo 8 semanas." },
  { icon: Target, title: "Business-Driven", desc: "Foco en resolver desafíos de negocio y mejorar productividad, no solo en implementar tecnología." },
  { icon: Shield, title: "Security by Design", desc: "Gobernanza y seguridad integradas desde la fase cero bajo modelo Zero Trust, minimizando superficies de ataque." },
  { icon: TrendingDown, title: "Cultura FinOps", desc: "Arquitecturas diseñadas y automatizadas para consumir solo lo necesario, maximizando el ROI." },
  { icon: Star, title: "Ecosistema Nativo", desc: "Alineación absoluta con el Cloud Adoption Framework de Microsoft y el Well-Architected Framework." },
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
      cases = cases.filter(c => c.projectName.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    }
    return cases;
  }, [useCasesData, industry, search]);

  const uniqueIndustries = useMemo(() => {
    const set = new Set((useCasesData?.useCases ?? []).map(c => c.industryType));
    return ["Todos", ...Array.from(set)];
  }, [useCasesData]);

  const isACIM = offering?.techPillar === "ACIM";
  const isFinOps = offering?.techPillar === "IaC + Serverless";
  const isAVD = offering?.techPillar === "VDI Escalable";
  const totalCases = useCasesData?.useCases.length ?? 0;

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
          <Link href="/" className="text-[#0078D4] mt-4 inline-block hover:underline">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <LightNavbar />

      {/* ─── Hero ─── */}
      <div className="bg-[#0078D4] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, white 0%, transparent 60%)" }} />
        <div className="absolute right-0 top-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute right-24 bottom-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />

        <div className="container mx-auto px-6 pt-8 pb-12 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-100 hover:text-white transition-colors text-sm mb-8">
            <ArrowLeft className="w-4 h-4" /> Volver a servicios
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/20 text-white px-3 py-1 rounded-full border border-white/20">
              <Tag className="w-3 h-3" /> {offering.techPillar}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-blue-100 bg-white/10 px-3 py-1 rounded-full border border-white/15">
              <Clock className="w-3 h-3" /> {offering.durationHours}
            </span>
            {totalCases > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs text-blue-100 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                <Building2 className="w-3 h-3" /> {totalCases} caso{totalCases !== 1 ? "s" : ""} de uso
              </span>
            )}
            {isACIM && (
              <span className="inline-flex items-center gap-1.5 text-xs text-blue-100 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                <Layers className="w-3 h-3" /> 3 módulos
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 max-w-3xl leading-tight">
            {offering.name}
          </h1>
          <p className="text-lg text-blue-100 font-medium max-w-2xl leading-relaxed">{offering.businessBenefit}</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">

        {/* ─── What is it / What does it solve ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
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

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
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

        {/* ══════════════════════════════════════════════════
            ACIM — 3 Módulos, Seguridad y Onboarding
        ══════════════════════════════════════════════════ */}
        {isACIM && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-16">

            {/* Modules header */}
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-[#605E5C] mb-2">Programa ACIM</p>
              <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Los 3 Módulos</h2>
              <p className="text-[#605E5C] mt-2 max-w-xl mx-auto text-sm">
                Cada módulo cubre una dimensión crítica del ecosistema Azure. Juntos forman un ciclo completo de descubrimiento, auditoría y mapeo.
              </p>
            </div>

            {/* Module cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {ACIM_MODULES.map((mod, i) => (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col"
                >
                  <div className="h-1.5" style={{ background: mod.accent }} />
                  <div className="p-6 flex flex-col flex-1">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${mod.color}`}>
                      <mod.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-[#1A1A1A] text-base mb-1">{mod.title}</h3>
                    <p className="text-xs text-[#605E5C] mb-4 font-medium">{mod.subtitle}</p>
                    <ul className="space-y-2.5 mt-auto">
                      {mod.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: mod.accent }} />
                          <span className="text-xs text-[#605E5C] leading-relaxed">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Security Operativa */}
            <div className="bg-[#1A1A2E] rounded-2xl p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                  <Shield className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Seguridad Operativa</h3>
                  <p className="text-xs text-blue-300">Least Privilege · Key Vaults · Managed Identities</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ACIM_SECURITY.map((s, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3 border border-blue-400/20">
                      <s.icon className="w-4 h-4 text-blue-300" />
                    </div>
                    <p className="text-xs font-semibold text-white mb-1">{s.title}</p>
                    <p className="text-[10px] text-blue-200 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Onboarding phases */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0078D4]/10 rounded-xl flex items-center justify-center border border-[#0078D4]/10">
                  <Zap className="w-5 h-5 text-[#0078D4]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1A1A1A]">Onboarding — Camino hacia ACIM</h3>
                  <p className="text-xs text-[#605E5C]">3 fases de activación del programa</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ACIM_ONBOARDING.map((ph, i) => (
                  <div key={i} className="relative">
                    <div className={`border rounded-xl p-5 ${ph.color}`}>
                      <div className="text-[10px] font-bold uppercase tracking-widest mb-2 opacity-70">{ph.phase}</div>
                      <div className="font-bold text-base mb-2">{ph.title}</div>
                      <p className="text-xs leading-relaxed opacity-80">{ph.desc}</p>
                    </div>
                    {i < 2 && (
                      <div className="hidden md:flex absolute top-1/2 -right-2 z-10 -translate-y-1/2">
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════
            FinOps — Dashboard Capabilities
        ══════════════════════════════════════════════════ */}
        {isFinOps && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-16">

            {/* Header */}
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-[#605E5C] mb-2">Journey to FinOps</p>
              <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Transformando Datos en Inteligencia Financiera</h2>
              <p className="text-[#605E5C] mt-2 max-w-xl mx-auto text-sm">
                De la factura sorpresa al control total. Pipeline IaC 100% automatizado en 4 semanas: ingesta, visibilidad y optimización continua.
              </p>
            </div>

            {/* 3 Pillars: Informar / Optimizar / Operar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {FINOPS_PILLARS.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 hover:shadow-md hover:border-[#0078D4]/20 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${p.bg}`}>
                      <p.icon className={`w-5 h-5 ${p.color}`} />
                    </div>
                    <span className="text-3xl font-black text-gray-100">{p.num}</span>
                  </div>
                  <h3 className={`text-xl font-extrabold mb-0.5 ${p.color}`}>{p.title}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#605E5C] mb-3">{p.subtitle}</p>
                  <p className="text-xs text-[#605E5C] leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Architecture pipeline */}
            <div className="bg-[#1A1A2E] rounded-2xl p-7 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                  <Layers className="w-4 h-4 text-blue-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Arquitectura de Visibilidad</h3>
                  <p className="text-[10px] text-blue-300">Pipeline end-to-end · Azure Functions en PowerShell 7.4</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                {FINOPS_ARCH.map((node, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`flex-1 border rounded-xl p-4 ${node.color}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <node.icon className="w-4 h-4" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">{node.label}</span>
                      </div>
                      <p className="font-bold text-sm text-[#1A1A1A]">{node.value}</p>
                      <p className="text-[10px] text-[#605E5C] mt-0.5 leading-snug">{node.sub}</p>
                    </div>
                    {i < 2 && <ArrowRight className="w-4 h-4 text-blue-300 shrink-0 hidden md:block" />}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-blue-300 text-center">
                Azure Functions (PowerShell 7.4) automatizan la ingesta de recomendaciones de Advisor y alertas de Defender hacia el Storage Account
              </p>
            </div>

            {/* 3 Phases timeline */}
            <div className="space-y-4 mb-6">
              {FINOPS_PHASES.map((ph, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.08 }}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md hover:border-[#0078D4]/20 transition-all"
                >
                  <div className="flex items-stretch">
                    <div className="w-2 shrink-0" style={{ background: ph.accent }} />
                    <div className="flex-1 p-5">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="md:w-52 shrink-0">
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${ph.color}`}>{ph.week}</span>
                          <p className="font-bold text-[#1A1A1A] text-sm leading-tight mt-0.5">{ph.title}</p>
                          <p className="text-[10px] text-[#605E5C] mt-0.5">{ph.subtitle}</p>
                        </div>
                        <div className="flex-1 flex flex-col md:flex-row gap-4">
                          <ul className="flex-1 space-y-1.5">
                            {ph.items.map((item, j) => (
                              <li key={j} className="flex items-start gap-2 text-xs text-[#605E5C]">
                                <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${ph.color}`} />
                                {item}
                              </li>
                            ))}
                          </ul>
                          <div className={`shrink-0 md:w-52 rounded-xl border p-3 ${ph.bg}`}>
                            <p className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${ph.color}`}>Entregable</p>
                            <p className="text-xs text-[#323130] leading-relaxed">{ph.deliverable}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Dashboard FinOps insights */}
            <div className="bg-gradient-to-r from-[#0078D4] to-[#005A9E] rounded-2xl p-7 text-white">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center border border-white/20">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Dashboard FinOps en Acción</h3>
                  <p className="text-[10px] text-blue-200">Del Dato al Insight · Control Presupuestario Centralizado</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {FINOPS_DASHBOARD.map((insight, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/10 border border-white/15 rounded-xl px-4 py-3">
                    <CheckCircle2 className="w-4 h-4 text-blue-200 shrink-0" />
                    <span className="text-sm text-white font-medium">{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════
            AVD — 5-Phase Journey
        ══════════════════════════════════════════════════ */}
        {isAVD && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-16">

            {/* Header */}
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-[#605E5C] mb-2">Accelerator AVD</p>
              <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Journey de 5 Fases · 8 Semanas</h2>
              <p className="text-[#605E5C] mt-2 max-w-xl mx-auto text-sm">
                De la estrategia al Go-Live en 8 semanas. Metodología end-to-end que fusiona visión de negocio, arquitectura empresarial y las mejores prácticas de Microsoft.
              </p>
            </div>

            {/* Phase cards */}
            <div className="space-y-4 mb-12">
              {AVD_PHASES.map((ph, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md hover:border-[#0078D4]/20 transition-all"
                >
                  <div className="flex items-stretch">
                    {/* Phase number sidebar */}
                    <div className="w-2 shrink-0" style={{ background: ph.accent }} />
                    <div className="flex-1 p-5">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        {/* Icon + header */}
                        <div className="flex items-center gap-4 md:w-64 shrink-0">
                          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${ph.bg}`}>
                            <ph.icon className={`w-5 h-5 ${ph.color}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className={`text-[10px] font-bold uppercase tracking-widest ${ph.color}`}>{ph.phase}</span>
                              <span className="text-[10px] text-[#605E5C] bg-gray-100 px-1.5 py-0.5 rounded-full">{ph.weeks}</span>
                            </div>
                            <p className="font-bold text-[#1A1A1A] text-sm leading-tight">{ph.title}</p>
                            <p className="text-[10px] text-[#605E5C] mt-0.5">{ph.subtitle}</p>
                          </div>
                        </div>
                        {/* Description + deliverable */}
                        <div className="flex-1 flex flex-col md:flex-row gap-4">
                          <p className="text-sm text-[#605E5C] leading-relaxed flex-1">{ph.desc}</p>
                          <div className={`shrink-0 md:w-56 rounded-xl border p-3 ${ph.bg}`}>
                            <p className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${ph.color}`}>Entregable</p>
                            <p className="text-xs text-[#323130] leading-relaxed">{ph.deliverable}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Tech Stack + Value Props */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tech Stack */}
              <div className="bg-[#1A1A2E] rounded-2xl p-7">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                    <Cpu className="w-4 h-4 text-blue-300" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Stack Tecnológico</h3>
                    <p className="text-[10px] text-blue-300">Ecosistema nativo Microsoft Azure</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {AVD_STACK.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                      <div className="w-7 h-7 bg-[#0078D4]/20 rounded-lg flex items-center justify-center shrink-0 border border-[#0078D4]/20">
                        <s.icon className="w-3.5 h-3.5 text-blue-300" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-blue-300 font-semibold uppercase tracking-wider">{s.label}</p>
                        <p className="text-xs text-white font-medium truncate">{s.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Value Props */}
              <div className="bg-gradient-to-br from-[#0078D4] to-[#005A9E] rounded-2xl p-7 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center border border-white/20">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">Valor Diferencial</h3>
                    <p className="text-[10px] text-blue-200">¿Por qué Readymind AVD?</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {AVD_VALUE_PROPS.map((vp, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center shrink-0 border border-white/20 mt-0.5">
                        <vp.icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{vp.title}</p>
                        <p className="text-[10px] text-blue-100 leading-relaxed mt-0.5">{vp.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── Use Cases ─── */}
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#605E5C] mb-1">Implementaciones reales</p>
              <h2 className="text-2xl font-bold text-[#1A1A1A] flex items-center gap-2">
                <Building2 className="w-6 h-6 text-[#0078D4]" /> Casos de Uso
              </h2>
              <p className="text-[#605E5C] text-sm mt-1">
                {filteredCases.length} caso{filteredCases.length !== 1 ? "s" : ""}{industry !== "Todos" ? ` en ${industry}` : " disponibles"}
              </p>
            </div>
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
                  {uniqueIndustries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Industry chips */}
          {uniqueIndustries.length > 2 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {uniqueIndustries.map(ind => (
                <button key={ind} onClick={() => setIndustry(ind)}
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

          {useCasesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl bg-gray-100" />)}
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">Sin casos disponibles</h3>
              <p className="text-[#605E5C] text-sm">
                {useCasesData?.useCases.length === 0 ? "Aún no hay casos de uso para este servicio." : "Prueba ajustando los filtros."}
              </p>
              {industry !== "Todos" && (
                <button onClick={() => setIndustry("Todos")} className="mt-4 text-sm text-[#0078D4] hover:underline">
                  Ver todos los sectores
                </button>
              )}
            </div>
          ) : (
            <motion.div
              initial="hidden" animate="show"
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {filteredCases.map(uc => (
                <motion.div key={uc.id} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#0078D4]/20 transition-all duration-200 overflow-hidden flex flex-col">
                  <div className="h-1 bg-gradient-to-r from-[#0078D4] to-[#50E6FF]" />
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start gap-3 mb-4">
                      {uc.companyIconUrl ? (
                        <img src={uc.companyIconUrl} alt={uc.projectName}
                          className="w-11 h-11 rounded-xl object-contain bg-gray-50 border border-gray-100 p-1.5 shrink-0" />
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
