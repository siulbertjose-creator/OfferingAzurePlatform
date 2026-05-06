import { Link } from "wouter";
import { AdminLayout } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AdminOfferings() {
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Servicios</h2>
          <Link href="/admin/offerings/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" /> Nuevo Servicio
            </Button>
          </Link>
        </div>
        <Link href="/admin/dashboard" className="text-primary hover:underline text-sm">
          Ver todos los servicios en el dashboard →
        </Link>
      </div>
    </AdminLayout>
  );
}
