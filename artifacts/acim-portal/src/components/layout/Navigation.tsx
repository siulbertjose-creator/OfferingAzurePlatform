import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Cloud, Shield, BarChart3, LogOut, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="border-b border-white/10 bg-background/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors">
            <Cloud className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight leading-none text-foreground block">ACIM</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest block leading-none">Cloud Architecture</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Shield className="w-4 h-4 mr-2" />
              Consultant Portal
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const token = localStorage.getItem("admin_token");

  // Redirect if not logged in
  if (!token && location !== "/admin") {
    setLocation("/admin");
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setLocation("/admin");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-white/10 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2 group">
            <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight leading-none text-foreground block">ACIM</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest block leading-none">Admin Portal</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Public View
              </Button>
            </Link>
            {token && (
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
