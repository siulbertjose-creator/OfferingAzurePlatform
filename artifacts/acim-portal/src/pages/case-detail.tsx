import { useParams } from "wouter";
import { 
  useGetSuccessCase, 
  getGetSuccessCaseQueryKey 
} from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ShieldCheck, 
  Activity, 
  Server, 
  TrendingDown, 
  Settings, 
  Zap,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Maximize2
} from "lucide-react";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// Simple Gauge Chart Component
function ScoreGauge({ score, label, icon: Icon }: { score: number, label: string, icon: any }) {
  // Calculate stroke dasharray for a half circle gauge
  const radius = 40;
  const circumference = radius * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getColor = (s: number) => {
    if (s >= 90) return "text-primary";
    if (s >= 70) return "text-yellow-400";
    return "text-red-500";
  };

  const colorClass = getColor(score);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
      <div className="relative w-24 h-14 overflow-hidden mb-2">
        <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
          {/* Background Arc */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="text-white/10"
          />
          {/* Value Arc */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center flex-col">
          <Icon className={`w-4 h-4 ${colorClass} mb-1`} />
          <span className="font-mono font-bold text-lg leading-none">{score}</span>
        </div>
      </div>
      <span className="text-xs font-medium text-muted-foreground text-center uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function CaseDetail() {
  const params = useParams<{ id: string }>();
  const id = params?.id ? parseInt(params.id) : 0;

  const { data: caseData, isLoading } = useGetSuccessCase(id, {
    query: { 
      enabled: !!id, 
      queryKey: getGetSuccessCaseQueryKey(id) 
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-8 bg-white/5" />
          <Skeleton className="h-64 w-full mb-8 bg-white/5" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full bg-white/5" />
            <Skeleton className="h-96 w-full bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Case not found</h1>
          <Link href="/" className="text-primary mt-4 inline-block hover:underline">Return to Database</Link>
        </div>
      </div>
    );
  }

  const kpis = caseData.azureAnalyzerKpis;
  const findings = caseData.azureAuditorFindings;

  return (
    <div className="min-h-screen bg-background pb-20 selection:bg-primary/30">
      <Navbar />
      
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-md pt-8 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Database
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className="bg-primary/20 text-primary-foreground border-primary/30">
              {caseData.industry || "Enterprise"}
            </Badge>
            <Badge variant="outline" className="border-white/10 text-muted-foreground">
              Client: {caseData.clientName}
            </Badge>
            {caseData.publishedAt && (
              <span className="text-xs text-muted-foreground font-mono">
                {new Date(caseData.publishedAt).toLocaleDateString()}
              </span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6 max-w-4xl">
            {caseData.title}
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {caseData.executiveSummary}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Scorecard */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-primary" />
                Azure Analyzer Scorecard
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ScoreGauge score={kpis.governanceScore} label="Governance" icon={ShieldCheck} />
                <ScoreGauge score={kpis.securityScore} label="Security" icon={ShieldCheck} />
                <ScoreGauge score={kpis.reliabilityScore} label="Reliability" icon={Server} />
                <ScoreGauge score={kpis.costOptimizationScore} label="Cost Opt." icon={TrendingDown} />
                <ScoreGauge score={kpis.operationalExcellenceScore} label="Ops Excellence" icon={Settings} />
                <ScoreGauge score={kpis.performanceScore} label="Performance" icon={Zap} />
              </div>
            </section>

            <section className="pt-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2 text-primary" />
                Azure Auditor Findings
              </h2>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md mb-6">
                <h3 className="font-semibold text-lg mb-2">Audit Summary</h3>
                <p className="text-muted-foreground leading-relaxed">{findings.summary}</p>
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1 uppercase tracking-wider">Compliance Status</div>
                    <div className="font-medium flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-primary" />
                      {findings.complianceStatus}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1 uppercase tracking-wider">Total Savings Identified</div>
                    <div className="font-mono text-xl font-bold text-green-400 flex items-center">
                      <DollarSign className="w-5 h-5 mr-1" />
                      {findings.costSavingsEstimate.toLocaleString()} {findings.costSavingsCurrency}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-lg text-red-400 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" /> Critical Issues Resolved
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {findings.criticalIssues.map((issue, i) => (
                        <li key={i} className="flex items-start text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 mr-2 shrink-0" />
                          <span className="text-muted-foreground">{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-lg text-primary flex items-center">
                      <CheckCircle2 className="w-5 h-5 mr-2" /> Key Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {findings.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2 shrink-0" />
                          <span className="text-muted-foreground">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>

          {/* Right Column - Meta & Map */}
          <div className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg">Resource Footprint</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Total Resources</span>
                    <span className="font-mono font-medium">{kpis.totalResources.toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Managed Resources</span>
                    <span className="font-mono font-medium text-primary">{kpis.managedResources.toLocaleString()}</span>
                  </div>
                  <Progress value={(kpis.managedResources / kpis.totalResources) * 100} className="h-1.5 bg-white/10 mt-2" />
                </div>
                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Audit Findings</span>
                    <span className="font-mono font-medium">{kpis.findings}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {caseData.discoveryMapUrl && (
              <Card className="bg-white/5 border-white/10 backdrop-blur-md overflow-hidden">
                <CardHeader className="pb-3 border-b border-white/10">
                  <CardTitle className="text-lg flex items-center justify-between">
                    Discovery Map
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors">
                          <Maximize2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[90vw] max-h-[90vh] w-fit p-1 bg-black/90 border-white/10 backdrop-blur-xl">
                        <img 
                          src={caseData.discoveryMapUrl} 
                          alt="Discovery Map" 
                          className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-sm"
                        />
                      </DialogContent>
                    </Dialog>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative aspect-video group bg-black/50 cursor-pointer">
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="w-full h-full relative">
                          <img 
                            src={caseData.discoveryMapUrl} 
                            alt="Discovery Map Thumbnail" 
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-background/80 backdrop-blur text-foreground px-3 py-1.5 rounded-full text-sm font-medium flex items-center">
                              <Maximize2 className="w-4 h-4 mr-2" /> View Full Map
                            </div>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-[90vw] max-h-[90vh] w-fit p-1 bg-black/90 border-white/10 backdrop-blur-xl">
                        <img 
                          src={caseData.discoveryMapUrl} 
                          alt="Discovery Map" 
                          className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-sm"
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
