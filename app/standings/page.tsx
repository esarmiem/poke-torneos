// ============================================
// PÁGINA DE STANDINGS/CLASIFICACIÓN
// ============================================

"use client";

import { useRouter } from "next/navigation";
import { useTournamentStore } from "@/lib/store/tournamentStore";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PokemonSprite, sprites } from "@/components/PokemonSprite";
import { 
  Trophy, 
  Download,
  ArrowUp,
  ArrowDown,
  Minus,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function StandingsPage() {
  const router = useRouter();
  const { tournament, getStandings } = useTournamentStore();
  
  if (!tournament) {
    return (
      <div className="text-center py-12">
        <Trophy className="w-12 h-12 mx-auto mb-4 text-slate-300" />
        <p className="text-slate-500">No hay un torneo activo</p>
        <Button 
          className="mt-4" 
          onClick={() => router.push("/setup")}
        >
          Crear Torneo
        </Button>
      </div>
    );
  }
  
  const standings = getStandings();
  
  if (standings.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            Clasificación
            <PokemonSprite {...sprites.palkia} size="xl" variant="decorative" />
          </h1>
        </div>
        
        <Card className="p-12 text-center">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            No hay datos de clasificación
          </h3>
          <p className="text-slate-500 mb-4">
            Los standings aparecerán después de completar al menos una ronda
          </p>
          {tournament.rounds.length === 0 && (
            <Button onClick={() => router.push("/rounds")}>
              Crear Primera Ronda
            </Button>
          )}
        </Card>
      </div>
    );
  }
  
  // Función para mostrar el cambio de posición
  const renderRankChange = (current: number, previous?: number) => {
    if (previous === undefined) return null;
    
    const diff = previous - current;
    
    if (diff > 0) {
      return (
        <span className="flex items-center gap-0.5 text-green-600 text-xs">
          <ArrowUp className="w-3 h-3" />
          {diff}
        </span>
      );
    } else if (diff < 0) {
      return (
        <span className="flex items-center gap-0.5 text-red-600 text-xs">
          <ArrowDown className="w-3 h-3" />
          {Math.abs(diff)}
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-0.5 text-slate-400 text-xs">
          <Minus className="w-3 h-3" />
        </span>
      );
    }
  };
  
  // Función para formatear porcentaje
  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };
  
  // Exportar standings a CSV
  const exportStandings = () => {
    const headers = ["Rank", "Nombre", "Puntos", "W", "L", "T", "Opp Win%"];
    const rows = standings.map(s => [
      s.rank,
      s.player.nombre,
      s.matchPoints,
      s.wins,
      s.losses,
      s.ties,
      formatPercent(s.opponentsWinPercent)
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tournament.nombre.replace(/\s+/g, "_")}_standings.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            Clasificación
          </h1>
          <p className="text-slate-600 mt-1">
            {tournament.nombre}
          </p>
        </div>
        
        <Button variant="outline" onClick={exportStandings}>
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </div>
      
      {/* Tabla de standings */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Jugador
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Puntos
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Record
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Opp Win%
                </th>
              </tr>
            </thead>
            <tbody>
              {standings.map((standing, index) => (
                <tr 
                  key={standing.playerId}
                  className={cn(
                    "border-b border-slate-100 last:border-0",
                    index % 2 === 0 ? "bg-white" : "bg-slate-50/50",
                    standing.player.dropped && "opacity-50"
                  )}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold",
                        standing.rank === 1 ? "bg-amber-100 text-amber-700" :
                        standing.rank === 2 ? "bg-slate-200 text-slate-700" :
                        standing.rank === 3 ? "bg-orange-100 text-orange-700" :
                        "bg-slate-100 text-slate-600"
                      )}>
                        {standing.rank}
                      </span>
                      {renderRankChange(standing.rank, standing.previousRank)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <span className={cn(
                        "font-medium",
                        standing.player.dropped ? "text-slate-500 line-through" : "text-slate-900"
                      )}>
                        {standing.player.nombre}
                      </span>
                      {standing.player.dropped && (
                        <Badge variant="destructive" className="ml-2">Drop</Badge>
                      )}
                      {standing.player.division && (
                        <Badge variant="secondary" className="ml-2">
                          {standing.player.division}
                        </Badge>
                      )}
                    </div>
                    {standing.player.deck && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {standing.player.deck}
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-lg font-bold text-slate-900">
                      {standing.matchPoints}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-sm font-medium text-slate-600">
                      {standing.wins}-{standing.losses}-{standing.ties}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-sm text-slate-600">
                      {formatPercent(standing.opponentsWinPercent)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
