"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Users,
  GitPullRequestArrow,
  HeartPulse,
  Stethoscope,
  DollarSign,
  Settings,
  Building2,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/agenda", label: "Agenda", icon: Calendar },
  { href: "/patients", label: "Pacientes", icon: Users },
  { href: "/commercial", label: "Comercial", icon: GitPullRequestArrow },
  { href: "/treatments", label: "Tratamentos", icon: HeartPulse },
  { href: "/services", label: "Serviços", icon: Stethoscope },
  { href: "/finance", label: "Financeiro", icon: DollarSign },
];

interface SidebarProps {
  clinicName: string;
  userName: string;
  isSuperAdmin?: boolean;
}

export function Sidebar({ clinicName, userName, isSuperAdmin }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-56 flex-col border-r bg-card">
      <div className="border-b p-4">
        <div className="text-lg font-bold text-primary">🦷 DentalHub</div>
        <div className="mt-1 text-xs text-muted-foreground truncate">{clinicName}</div>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {isSuperAdmin && (
          <>
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Admin
            </div>
            <Link
              href="/admin/clinics"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                pathname.startsWith("/admin")
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Building2 className="h-4 w-4" />
              Clínicas / Dentistas
            </Link>
            <div className="my-2 border-t" />
          </>
        )}
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-2">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
          Configurações
        </Link>
        <div className="mt-2 px-3 py-2 text-xs text-muted-foreground truncate">
          {userName}
        </div>
      </div>
    </aside>
  );
}
