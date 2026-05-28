// ============================================
// NAVEGACIÓN PRINCIPAL
// ============================================

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTournamentStore } from "@/lib/store/tournamentStore";
import { 
  Home, 
  Users, 
  Swords, 
  Trophy, 
  Settings,
  CircleDot
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/setup", label: "Configuración", icon: Users },
  { href: "/rounds", label: "Rondas", icon: Swords },
  { href: "/standings", label: "Clasificación", icon: Trophy },
  { href: "/settings", label: "Ajustes", icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();
  const { tournament } = useTournamentStore();
  
  const isTournamentActive = tournament !== null;
  
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PT</span>
            </div>
            <span className="font-semibold text-slate-900 hidden sm:block">
              Poke Torneos
            </span>
          </Link>
          
          {/* Estado del torneo */}
          {isTournamentActive && (
            <div className="flex items-center gap-2 text-sm">
              <CircleDot className={cn(
                "w-4 h-4",
                tournament?.status === "RUNNING" ? "text-green-500" :
                tournament?.status === "SETUP" ? "text-amber-500" :
                "text-slate-400"
              )} />
              <span className="text-slate-600 hidden sm:inline">
                {tournament?.nombre}
              </span>
              <span className="text-slate-400 text-xs">
                ({tournament?.players.length} jugadores)
              </span>
            </div>
          )}
        </div>
        
        {/* Navegación */}
        {isTournamentActive && (
          <nav className="flex gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-t-md transition-colors whitespace-nowrap",
                    isActive
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
