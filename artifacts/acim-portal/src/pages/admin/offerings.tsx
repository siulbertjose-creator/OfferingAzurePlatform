import { Link } from "wouter";
import { AdminLayout } from "@/components/layout/Navigation";
import { Plus } from "lucide-react";

export default function AdminOfferings() {
  return (
    <AdminLayout>
      <div className="container mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Servicios</h2>
          <Link href="/admin/offerings/new">
            <button className="inline-flex items-center gap-2 bg-[#0078D4] hover:bg-[#006CBE] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Nuevo Servicio
            </button>
          </Link>
        </div>
        <Link href="/admin/dashboard" className="text-[#0078D4] hover:underline text-sm">
          Ver todos los servicios en el dashboard →
        </Link>
      </div>
    </AdminLayout>
  );
}
