import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  useListOfferings,
  getListOfferingsQueryKey,
} from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Clock, Cpu, TrendingUp, Layers } from "lucide-react";

const pillarIcons: Record<string, React.ElementType> = {
  "IaC + Serverless": Cpu,
  "Azure Auditor / SCA": Layers,
  "VDI Escalable": Layers,
  "Hub & Spoke": Layers,
  "Metodología CAF": TrendingUp,
  "Gobernanza Híbrida": Layers,
};

const pillarColors = [
  "from-primary/20 to-primary/5 border-primary/30",
  "from-blue-500/20 to-blue-500/5 border-blue-500/30",
  "from-violet-500/20 to-violet-500/5 border-violet-500/30",
  "from-amber-500/20 to-amber-500/5 border-amber-500/30",
  "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30",
  "from-rose-500/20 to-rose-500/5 border-rose-500/30",
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 22 } },
};

export default function Home() {
  const { data, isLoading } = useListOfferings({
    query: { queryKey: getListOfferingsQueryKey() },
  });

  const offerings = data?.offerings ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <Badge variant="outline" className="mb-6 border-primary/50 text-primary bg-primary/10 backdrop-blur-sm px-3 py-1">
              CEQ Azure Platform · Readymind
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Cloud excellence,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                quantified.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-4 max-w-2xl leading-relaxed">
              Soluciones especializadas de Readymind para transformar tu infraestructura Azure. Selecciona un servicio para explorar casos de éxito reales.
            </p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {offerings.length} servicios disponibles
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Offerings Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight">Nuestros Servicios</h2>
          <p className="text-muted-foreground mt-2">Cada servicio incluye casos de uso reales con resultados medibles</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl bg-white/5" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {offerings.map((offering, i) => {
              const Icon = pillarIcons[offering.techPillar] ?? Layers;
              const colors = pillarColors[i % pillarColors.length];
              return (
                <motion.div key={offering.id} variants={itemVariants}>
                  <Link href={`/offerings/${offering.id}`}>
                    <Card className={`group h-full bg-gradient-to-br ${colors} border hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-md flex flex-col`}>
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-2.5 bg-white/10 rounded-xl border border-white/10">
                            <Icon className="w-5 h-5 text-foreground" />
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-black/20 rounded-full px-2.5 py-1">
                            <Clock className="w-3 h-3" />
                            {offering.durationHours}
                          </div>
                        </div>

                        <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors">
                          {offering.name}
                        </h3>

                        <Badge variant="outline" className="self-start mb-3 text-xs border-white/20 text-muted-foreground">
                          {offering.techPillar}
                        </Badge>

                        <p className="text-sm text-muted-foreground line-clamp-2 mb-auto leading-relaxed">
                          {offering.businessBenefit}
                        </p>

                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
                          <div className="flex items-center gap-1.5 text-xs text-primary/70">
                            <TrendingUp className="w-3.5 h-3.5" />
                            Ver casos de uso
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
