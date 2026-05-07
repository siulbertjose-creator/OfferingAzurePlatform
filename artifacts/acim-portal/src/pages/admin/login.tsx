import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminLogin } from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Shield, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(1, "Usuario requerido"),
  password: z.string().min(1, "Contraseña requerida"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "admin", password: "acim2024" },
  });

  const loginMutation = useAdminLogin({
    mutation: {
      onSuccess: (data) => {
        localStorage.setItem("admin_token", data.token);
        toast({ title: "Acceso concedido", description: `Bienvenido, ${data.username}.` });
        setLocation("/admin/dashboard");
      },
      onError: () => {
        toast({ title: "Acceso denegado", description: "Credenciales inválidas.", variant: "destructive" });
      },
    },
  });

  const onSubmit = (data: LoginFormValues) => loginMutation.mutate({ data });

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0F6FF] via-[#F8F9FA] to-white"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Background accent */}
      <div className="absolute inset-0 opacity-40 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 60% 40%, #0078D415 0%, transparent 60%)" }} />

      <div className="w-full max-w-md px-4 relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src="/readymind-logo.png" alt="Readymind" className="h-10 w-auto" />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Blue header strip */}
          <div className="bg-[#0078D4] px-8 py-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold">Consultant Portal</h1>
            </div>
            <p className="text-blue-100 text-sm">Acceso restringido — solo personal autorizado</p>
          </div>

          {/* Form */}
          <div className="px-8 py-7">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-[#605E5C]">
                        Usuario
                      </FormLabel>
                      <FormControl>
                        <input
                          placeholder="admin"
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-[#323130] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0078D4]/30 focus:border-[#0078D4] transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-[#605E5C]">
                        Contraseña
                      </FormLabel>
                      <FormControl>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-[#323130] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0078D4]/30 focus:border-[#0078D4] transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full mt-2 bg-[#0078D4] hover:bg-[#006CBE] disabled:opacity-60 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  {loginMutation.isPending ? "Verificando..." : "Iniciar sesión"}
                </button>
              </form>
            </Form>
          </div>
        </div>

        <p className="text-center text-xs text-[#605E5C] mt-6">
          © {new Date().getFullYear()} Readymind · CEQ Azure Platform
        </p>
      </div>
    </div>
  );
}
