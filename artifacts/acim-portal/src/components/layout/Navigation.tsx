import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LightNavbar() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <img
            src="/readymind-logo.png"
            alt="Readymind"
            className="h-7 w-auto object-contain group-hover:opacity-80 transition-opacity"
          />
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/admin">
            <button className="inline-flex items-center gap-1.5 text-sm font-medium text-[#605E5C] hover:text-[#0078D4] transition-colors">
              <Shield className="w-4 h-4" />
              Consultant Portal
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export function Navbar() {
  return (
    <nav className="border-b border-white/10 bg-background/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <img
            src="/readymind-logo.png"
            alt="Readymind"
            className="h-8 w-auto object-contain group-hover:opacity-90 transition-opacity"
          />
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
          <Link href="/admin/dashboard" className="flex items-center group">
            <img
              src="/readymind-logo.png"
              alt="Readymind"
              className="h-8 w-auto object-contain group-hover:opacity-90 transition-opacity"
            />
            <span className="ml-3 text-xs text-muted-foreground uppercase tracking-widest font-medium border-l border-white/10 pl-3">
              Admin Portal
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Public View
              </Button>
            </Link>
            {token && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
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
