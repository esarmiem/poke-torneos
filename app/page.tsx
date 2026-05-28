// ============================================
// PÁGINA PRINCIPAL (DASHBOARD)
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
  Users, 
  Swords, 
  Calendar,
  ArrowRight,
  Plus,
  BookOpen
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { a } from "framer-motion/client";

export default function HomePage() {
  const router = useRouter();
  const { tournament, getStandings, canStartRound } = useTournamentStore();
  
  // Si no hay torneo, mostrar pantalla de inicio
  if (!tournament) {
    return (
      <div className="relative max-w-2xl mx-auto text-center py-16">
        {/* Wallpaper de fondo */}
        <div 
          className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url(/wallpaper.jpg)',
          }}
        >
          {/* Capa de atenuación */}
          <div className="absolute inset-0 bg-white/85" />
        </div>
        
        <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
          <Trophy className="w-10 h-10 text-white" />
          <div className="absolute -top-2 -right-2">
            <PokemonSprite {...sprites.mew} size="sm" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Poke Torneos{" "}
          <PokemonSprite {...sprites.lucario} size="xl" variant="decorative" className="inline-block mx-1" />
        </h1>
        <h4 className="text-2xl font-bold text-slate-900 mb-4">
          by{" "}
          <a
            href="https://www.linkedin.com/in/elder-sarmiento/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Elder
          </a>
          </h4>
        <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
          Gestiona torneos Pokémon TCG con emparejamientos Swiss, 
          standings en tiempo real y persistencia offline.{" "}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            size="lg" 
            onClick={() => router.push("/setup")}
            className="gap-2"
          >
            <Plus className="w-5 h-5" />
            Crear Nuevo Torneo
          </Button>
          <Button 
            variant="outline"
            size="lg" 
            onClick={() => router.push("/guide")}
            className="gap-2"
          >
            <BookOpen className="w-5 h-5" />
            Guía para Administradores
          </Button>
        </div>
      </div>
    );
  }
  
  // Obtener datos para el dashboard
  const standings = getStandings();
  const topPlayers = standings.slice(0, 5);
  const currentRound = tournament.rounds.find(r => r.number === tournament.currentRound);
  const pendingMatches = currentRound?.matches.filter(m => m.status !== "DONE").length || 0;
  const canStartNewRound = canStartRound();
  
  return (
    <div className="space-y-6">
      {/* Header del torneo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {tournament.nombre}
          </h1>
          <div className="flex items-center gap-2 mt-1 text-slate-500">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              {format(new Date(tournament.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={tournament.status === "RUNNING" ? "success" : "secondary"}>
            {tournament.status === "SETUP" && "Configuración"}
            {tournament.status === "RUNNING" && "En curso"}
            {tournament.status === "FINISHED" && "Finalizado"}
          </Badge>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {tournament.players.length}
              </p>
              <p className="text-xs text-slate-500">Jugadores</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Swords className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {tournament.currentRound}
              </p>
              <p className="text-xs text-slate-500">Ronda actual</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {standings[0]?.matchPoints || 0}
              </p>
              <p className="text-xs text-slate-500">Puntos líder</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Swords className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {pendingMatches}
              </p>
              <p className="text-xs text-slate-500">Pendientes</p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Top Players */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Top 5 Clasificación
          </h2>
          <Button variant="ghost" size="sm" onClick={() => router.push("/standings")}>
            Ver completa
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        {topPlayers.length > 0 ? (
          <div className="space-y-2">
            {topPlayers.map((player, index) => (
              <div
                key={player.playerId}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                    index === 0 ? "bg-amber-100 text-amber-700" :
                    index === 1 ? "bg-slate-200 text-slate-700" :
                    index === 2 ? "bg-orange-100 text-orange-700" :
                    "bg-slate-100 text-slate-600"
                  )}>
                    {player.rank}
                  </span>
                  <span className="font-medium text-slate-900">
                    {player.player.nombre}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-500">
                    {player.wins}-{player.losses}-{player.ties}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {player.matchPoints} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No hay datos de clasificación aún</p>
            <p className="text-sm mt-1">
              {tournament.rounds.length === 0 
                ? "Crea la primera ronda para comenzar" 
                : "Los standings aparecerán después de la primera ronda"}
            </p>
          </div>
        )}
      </Card>
      
      {/* Acciones rápidas */}
      <div className="flex flex-wrap gap-3">
        {tournament.status === "SETUP" && (
          <Button onClick={() => useTournamentStore.getState().startTournament()}>
            Iniciar Torneo
          </Button>
        )}
        
        {canStartNewRound && tournament.status === "RUNNING" && (
          <Button onClick={() => useTournamentStore.getState().createRound()}>
            Crear Ronda {tournament.rounds.length + 1}
          </Button>
        )}
        
        {currentRound && pendingMatches > 0 && (
          <Button variant="secondary" onClick={() => router.push(`/rounds/${currentRound.id}`)}>
            Continuar Ronda {tournament.currentRound}
          </Button>
        )}
      </div>
    </div>
  );
}
