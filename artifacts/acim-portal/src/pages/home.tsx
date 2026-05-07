import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  useListOfferings,
  getListOfferingsQueryKey,
} from "@workspace/api-client-react";
import { LightNavbar } from "@/components/layout/Navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  Clock,
  Code2,
  Shield,
  Activity,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Layers,
  Network,
  BarChart3,
  CheckCircle2,
  Zap,
  Globe,
} from "lucide-react";

/* ─── Design tokens ─── */
const AZ = "#0078D4";

/* ─── Pillars ─── */
const PILLARS = [
  { icon: Code2, title: "IaC y Automatización", description: "Terraform, Bicep y pipelines CI/CD", color: "bg-blue-50 text-[#0078D4] border-blue-100" },
  { icon: Network, title: "Gobernanza y Arquitectura", description: "Landing zones, Hub & Spoke y políticas", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  { icon: Activity, title: "Observabilidad y Salud", description: "Azure Monitor, alertas y dashboards", color: "bg-cyan-50 text-cyan-600 border-cyan-100" },
  { icon: TrendingUp, title: "Eficiencia Financiera", description: "FinOps, chargeback y cost management", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
];

/* ─── Stats ─── */
const STATS = [
  { value: "6", label: "Servicios especializados" },
  { value: "10+", label: "Industrias atendidas" },
  { value: "200+", label: "Recursos gestionados" },
  { value: "95%", label: "Proyectos con ROI medible" },
];

/* ─── Value props ─── */
const VALUE_PROPS = [
  {
    icon: Zap,
    title: "Velocidad de entrega",
    description: "Metodologías ágiles y herramientas de aceleración que reducen el tiempo de implementación hasta un 60%.",
    color: "text-amber-500 bg-amber-50 border-amber-100",
  },
  {
    icon: Shield,
    title: "Seguridad por diseño",
    description: "Arquitecturas Zero Trust, RBAC granular y cumplimiento normativo desde el primer día.",
    color: "text-[#0078D4] bg-blue-50 border-blue-100",
  },
  {
    icon: Globe,
    title: "Expertise certificado",
    description: "Equipo Microsoft Partner con certificaciones Azure Expert y casos de éxito documentados.",
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
];

/* ─── Impact cases ─── */
const IMPACT_CASES = [
  { title: "Spinoff Corporativo", description: "Migración de tenants y arquitectura Hub & Spoke para empresa multinacional con operaciones en 12 países. Reducción del 40% en costos de conectividad.", offering: "Landing Zone Hub & Spoke", industry: "Manufactura", metric: "40% ahorro" },
  { title: "Assessment Industrial", description: "Mapeo automático con los 3 módulos ACIM: Azure Export Analyzer, Smart Cloud Audit y Discovery Maps. Inventario de 2.400 recursos catalogados en 72 horas.", offering: "ACIM (SCA & Discovery)", industry: "Industria", metric: "2.400 recursos" },
  { title: "Control FinOps", description: "Recolección de costos vía Azure Functions y dashboard de Power BI autogestionado. Visibilidad del 100% del gasto cloud en tiempo real.", offering: "Journey to FinOps", industry: "Retail", metric: "100% visibilidad" },
  { title: "Modernización VDI", description: "Despliegue de Azure Virtual Desktop para 800 usuarios remotos con golden image automatizada y autoscaling por horario laboral.", offering: "AVD Accelerator", industry: "Servicios Financieros", metric: "800 usuarios" },
  { title: "Adopción Cloud CAF", description: "Hoja de ruta de migración cloud-first con metodología CAF para empresa con más de 150 aplicaciones legacy on-premise.", offering: "Road to Cloud (CAF)", industry: "Telecomunicaciones", metric: "150 apps" },
];

const pillarIcons: Record<string, React.ElementType> = {
  "IaC + Serverless": Cpu,
  "ACIM / Smart Cloud Audit": Shield,
  "VDI Escalable": Layers,
  "Hub & Spoke": Network,
  "Metodología CAF": BarChart3,
  "Gobernanza Híbrida": Shield,
};

const pillarColors: Record<string, string> = {
  "IaC + Serverless": "text-[#0078D4] bg-blue-50 border-blue-100",
  "ACIM / Smart Cloud Audit": "text-indigo-600 bg-indigo-50 border-indigo-100",
  "VDI Escalable": "text-cyan-600 bg-cyan-50 border-cyan-100",
  "Hub & Spoke": "text-purple-600 bg-purple-50 border-purple-100",
  "Metodología CAF": "text-amber-600 bg-amber-50 border-amber-100",
  "Gobernanza Híbrida": "text-emerald-600 bg-emerald-50 border-emerald-100",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

export default function Home() {
  const { data, isLoading } = useListOfferings({ query: { queryKey: getListOfferingsQueryKey() } });
  const offerings = data?.offerings ?? [];

  const [activeSlide, setActiveSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => setActiveSlide(prev => (prev + 1) % IMPACT_CASES.length), 5000);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const goTo = (i: number) => {
    setActiveSlide(i);
    if (timerRef.current) clearInterval(timerRef.current);
    startTimer();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#323130]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <LightNavbar />

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#EFF6FF] to-[#E0EFFE] border-b border-gray-100">
        {/* Dot grid pattern */}
        <div className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: "radial-gradient(circle, #0078D4 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        {/* Right glow */}
        <div className="absolute right-0 top-0 w-[600px] h-[600px] opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #0078D4 0%, transparent 70%)" }} />

        <div className="container mx-auto px-6 py-28 relative z-10">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-[#0078D4]/10 text-[#0078D4] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-[#0078D4]/20 mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0078D4] animate-pulse" />
              CEQ Azure Platform · Readymind
            </span>

            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-[#1A1A1A] leading-none mb-6">
              Azure{" "}
              <span className="text-[#0078D4]">Platform</span>
            </h1>

            <p className="text-xl text-[#605E5C] leading-relaxed mb-10 max-w-2xl">
              Ingeniería, Automatización y Gobierno para una nube escalable, segura y financieramente eficiente.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="#servicios">
                <button className="inline-flex items-center gap-2 bg-[#0078D4] hover:bg-[#006CBE] text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-md shadow-[#0078D4]/20">
                  Explorar servicios <ArrowRight className="w-4 h-4" />
                </button>
              </a>
              <a href="#impacto">
                <button className="inline-flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-[#323130] font-semibold px-6 py-3 rounded-xl transition-colors">
                  Ver casos de éxito
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats bar ─── */}
      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-gray-100">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="text-center px-4"
              >
                <div className="text-3xl font-extrabold text-[#0078D4]">{s.value}</div>
                <div className="text-xs text-[#605E5C] mt-0.5 font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pillars ─── */}
      <section className="bg-[#F8F9FA] border-b border-gray-100 py-10">
        <div className="container mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#605E5C] mb-6">Los Cimientos del Azure Platform</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`flex flex-col gap-3 p-4 rounded-xl border bg-white shadow-sm ${pillar.color.split(' ')[2]}`}
              >
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${pillar.color}`}>
                  <pillar.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#1A1A1A] leading-tight">{pillar.title}</p>
                  <p className="text-xs text-[#605E5C] mt-0.5 leading-relaxed">{pillar.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Value Props ─── */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-[#605E5C] mb-2">¿Por qué Azure Platform?</p>
            <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">El estándar de excelencia cloud</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUE_PROPS.map((vp, i) => (
              <motion.div
                key={vp.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#F8F9FA] border border-gray-100 rounded-2xl p-6"
              >
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${vp.color}`}>
                  <vp.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#1A1A1A] mb-2">{vp.title}</h3>
                <p className="text-sm text-[#605E5C] leading-relaxed">{vp.description}</p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-[#0078D4]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Incluido en todos los proyectos
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Products Grid ─── */}
      <section id="servicios" className="container mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-[#605E5C] mb-2">Portfolio de servicios</p>
          <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Nuestros Servicios</h2>
          <p className="text-[#605E5C] mt-2">Cada servicio incluye casos de uso reales con resultados medibles</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-56 rounded-2xl bg-gray-100" />)}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {offerings.map((offering) => {
              const Icon = pillarIcons[offering.techPillar] ?? Layers;
              const colorClass = pillarColors[offering.techPillar] ?? "text-[#0078D4] bg-blue-50 border-blue-100";
              const [textColor] = colorClass.split(" ");
              return (
                <motion.div key={offering.id} variants={itemVariants}>
                  <Link href={`/offerings/${offering.id}`}>
                    <div className="group h-full bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col">
                      <div className={`h-1 w-full ${colorClass.split(" ")[1].replace("bg-", "bg-").replace("50", "400")} transition-all`}
                        style={{ background: textColor === "text-[#0078D4]" ? AZ : undefined }} />
                      <div className="p-6 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colorClass}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="flex items-center gap-1.5 text-xs text-[#605E5C] bg-gray-50 border border-gray-100 rounded-full px-2.5 py-1">
                            <Clock className="w-3 h-3" />
                            {offering.durationHours}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-[#1A1A1A] leading-tight mb-2 group-hover:text-[#0078D4] transition-colors">
                          {offering.name}
                        </h3>

                        <span className={`inline-block self-start mb-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${colorClass}`}>
                          {offering.techPillar}
                        </span>

                        <p className="text-sm text-[#605E5C] line-clamp-2 mb-auto leading-relaxed">
                          {offering.businessBenefit}
                        </p>

                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                          <span className="text-xs font-semibold text-[#0078D4]">Explorar casos de uso</span>
                          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#0078D4] group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>

      {/* ─── Impact Carousel ─── */}
      <section id="impacto" className="bg-[#0078D4] py-20 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-2">Impacto demostrado</p>
              <h2 className="text-3xl font-bold text-white tracking-tight">Success Stories</h2>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => goTo((activeSlide - 1 + IMPACT_CASES.length) % IMPACT_CASES.length)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => goTo((activeSlide + 1) % IMPACT_CASES.length)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {[0, 1, 2].map(offset => {
                const idx = (activeSlide + offset) % IMPACT_CASES.length;
                const item = IMPACT_CASES[idx];
                const isMain = offset === 0;
                return (
                  <div key={idx} className={`bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-sm transition-all ${isMain ? "md:scale-[1.03] bg-white/15 shadow-lg" : "opacity-70"}`}>
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-xs font-semibold text-blue-200 bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
                        {item.offering}
                      </span>
                      <span className="text-xl font-extrabold text-white">{item.metric}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-blue-100 leading-relaxed mb-4">{item.description}</p>
                    <div className="text-xs text-blue-300 font-semibold uppercase tracking-wider">{item.industry}</div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-2 mt-8">
            {IMPACT_CASES.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all ${i === activeSlide ? "bg-white w-6" : "bg-white/30 w-2 hover:bg-white/50"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src="/readymind-logo.png" alt="Readymind" className="h-6 w-auto opacity-60" />
          <p className="text-sm text-[#605E5C]">© {new Date().getFullYear()} Readymind · CEQ Azure Platform</p>
        </div>
      </footer>
    </div>
  );
}
