import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  useListSuccessCases, 
  getListSuccessCasesQueryKey, 
  useGetSuccessCasesStats, 
  getGetSuccessCasesStatsQueryKey 
} from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Search, Building2, TrendingUp, ShieldCheck, Activity, Award, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function ScoreChip({ label, value }: { label: string; value: number }) {
  const color =
    value >= 90
      ? "bg-primary/20 text-primary border-primary/30"
      : value >= 75
      ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
      : "bg-red-500/15 text-red-400 border-red-500/30";
  return (
    <div className={`flex flex-col items-center px-3 py-2 rounded-lg border ${color}`}>
      <span className="font-mono font-bold text-sm leading-none">{value}</span>
      <span className="text-[10px] mt-1 uppercase tracking-wider opacity-70">{label}</span>
    </div>
  );
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: stats, isLoading: statsLoading } = useGetSuccessCasesStats({
    query: { queryKey: getGetSuccessCasesStatsQueryKey() }
  });

  const { data: casesData, isLoading: casesLoading } = useListSuccessCases(
    { search: searchTerm || undefined },
    { query: { queryKey: getListSuccessCasesQueryKey({ search: searchTerm || undefined }) } }
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.css/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
        
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
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground">
              Cloud excellence, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">quantified.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
              Explore our portfolio of elite Azure transformations by Readymind. We turn complex architectural challenges into measurable business advantages.
            </p>
          </motion.div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {statsLoading ? (
              Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl bg-white/5" />)
            ) : stats ? (
              <>
                <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                  <CardContent className="p-6">
                    <Building2 className="w-6 h-6 text-primary mb-4" />
                    <div className="text-3xl font-bold text-foreground mb-1">{stats.totalClients}</div>
                    <div className="text-sm text-muted-foreground">Enterprise Clients</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                  <CardContent className="p-6">
                    <ShieldCheck className="w-6 h-6 text-primary mb-4" />
                    <div className="text-3xl font-bold text-foreground mb-1">{stats.avgGovernanceScore.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">Avg Governance Score</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                  <CardContent className="p-6">
                    <Activity className="w-6 h-6 text-primary mb-4" />
                    <div className="text-3xl font-bold text-foreground mb-1">{stats.avgWellArchitectedScore.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">Well-Architected Index</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                  <CardContent className="p-6">
                    <TrendingUp className="w-6 h-6 text-primary mb-4" />
                    <div className="text-3xl font-bold text-foreground mb-1">${(stats.totalCostSavings / 1000000).toFixed(1)}M+</div>
                    <div className="text-sm text-muted-foreground">Optimized Spend</div>
                  </CardContent>
                </Card>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Intelligence Database</h2>
            <p className="text-muted-foreground mt-1">Search through verified success cases</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by client, industry, or keywords..." 
              className="pl-10 bg-white/5 border-white/10 focus-visible:ring-primary backdrop-blur-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {casesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl bg-white/5" />)}
          </div>
        ) : casesData?.cases.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium mb-2">No cases found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {casesData?.cases.map((c) => (
              <motion.div key={c.id} variants={itemVariants}>
                <Link href={`/cases/${c.id}`}>
                  <Card className="group h-full bg-white/5 border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-md flex flex-col">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="secondary" className="bg-primary/20 text-primary-foreground hover:bg-primary/30">
                          {c.industry || "Enterprise"}
                        </Badge>
                        <Award className="w-4 h-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
                        {c.title}
                      </CardTitle>
                      <div className="text-sm font-medium text-foreground/80 mt-2">
                        Client: {c.clientName}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between">
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-6">
                        {c.executiveSummary}
                      </p>

                      <div className="mt-auto">
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Azure Analyzer Scores</div>
                        <div className="grid grid-cols-4 gap-1.5">
                          <ScoreChip label="Gov" value={c.azureAnalyzerKpis.governanceScore} />
                          <ScoreChip label="Sec" value={c.azureAnalyzerKpis.securityScore} />
                          <ScoreChip label="Rel" value={c.azureAnalyzerKpis.reliabilityScore} />
                          <ScoreChip label="Perf" value={c.azureAnalyzerKpis.performanceScore} />
                        </div>
                        <div className="flex items-center justify-end mt-3 text-xs text-primary/60 group-hover:text-primary transition-colors">
                          Ver caso completo <ArrowRight className="w-3 h-3 ml-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
