import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LogOut, Shield, LayoutDashboard, Home } from "lucide-react";

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
            <button className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
              <Shield className="w-4 h-4" />
              Consultant Portal
            </button>
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
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#323130]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Top navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center group gap-3">
            <img
              src="/readymind-logo.png"
              alt="Readymind"
              className="h-7 w-auto object-contain group-hover:opacity-80 transition-opacity"
            />
            <span className="text-xs font-semibold text-[#605E5C] uppercase tracking-widest border-l border-gray-200 pl-3">
              Admin Portal
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/">
              <button className="inline-flex items-center gap-1.5 text-sm text-[#605E5C] hover:text-[#0078D4] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#0078D4]/5">
                <Home className="w-4 h-4" />
                Vista pública
              </button>
            </Link>
            <Link href="/admin/dashboard">
              <button className="inline-flex items-center gap-1.5 text-sm text-[#605E5C] hover:text-[#0078D4] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#0078D4]/5">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
            </Link>
            {token && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors px-3 py-1.5 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
