// ============================================
// PÁGINA DE DETALLE DE RONDA (PAIRINGS)
// ============================================

"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useTournamentStore } from "@/lib/store/tournamentStore";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PokemonSprite, sprites } from "@/components/PokemonSprite";
import { 
  Swords, 
  ChevronLeft,
  CheckCircle2,
  Circle,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MatchResult } from "@/lib/domain/types";

interface RoundDetailPageProps {
  params: Promise<{ roundId: string }>;
}

export default function RoundDetailPage({ params }: RoundDetailPageProps) {
  const { roundId } = use(params);
  const router = useRouter();
  const { 
    tournament, 
    setMatchResult, 
    updateMatchStatus,
    startRound,
    endRound,
    roundTimerStart,
    roundTimerPausedAt,
    startTimer,
    pauseTimer,
    resetTimer,
    getRemainingTime
  } = useTournamentStore();
  
  const [showTimer, setShowTimer] = useState(false);
  
  if (!tournament) {
    return (
      <div className="text-center py-12">
        <Swords className="w-12 h-12 mx-auto mb-4 text-slate-300" />
        <p className="text-slate-500">No hay un torneo activo</p>
        <Button 
          className="mt-4" 
          onClick={() => router.push("/setup")}
        >
          Crear Torneo
          <PokemonSprite {...sprites.incineroar} size="xs" className="ml-1" />
        </Button>
      </div>
    );
  }
  
  const round = tournament.rounds.find(r => r.id === roundId);
  
  if (!round) {
    return (
      <div className="text-center py-12">
        <Swords className="w-12 h-12 mx-auto mb-4 text-slate-300" />
        <p className="text-slate-500">Ronda no encontrada</p>
        <Button 
          className="mt-4" 
          onClick={() => router.push("/rounds")}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Volver a Rondas
        </Button>
      </div>
    );
  }
  
  // Obtener nombres de jugadores
  const getPlayerName = (playerId: string) => {
    const player = tournament.players.find(p => p.id === playerId);
    return player?.nombre || "Jugador desconocido";
  };
  
  // Contar matches completados
  const completedMatches = round.matches.filter(m => m.status === "DONE").length;
  const totalMatches = round.matches.length;
  const isRoundComplete = completedMatches === totalMatches;
  
  // Timer
  const remainingTime = getRemainingTime();
  const isTimerRunning = roundTimerStart !== null && roundTimerPausedAt === null;
  
  const resultOptions: { value: MatchResult; label: string; color: string }[] = [
    { value: "P1_WIN", label: "P1 Gana", color: "bg-blue-100 text-blue-700" },
    { value: "P2_WIN", label: "P2 Gana", color: "bg-green-100 text-green-700" },
    { value: "TIE", label: "Empate", color: "bg-amber-100 text-amber-700" },
    { value: "P1_BYE", label: "P1 Bye", color: "bg-purple-100 text-purple-700" },
    { value: "P2_BYE", label: "P2 Bye", color: "bg-pink-100 text-pink-700" },
  ];
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/rounds")}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Ronda {round.number}
          </h1>
          <p className="text-slate-600">
            {completedMatches}/{totalMatches} matches completados
          </p>
        </div>
      </div>
      
      {/* Timer */}
      {round.startedAt && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                isTimerRunning ? "bg-green-100" : "bg-slate-100"
              )}>
                <Timer className={cn(
                  "w-5 h-5",
                  isTimerRunning ? "text-green-600" : "text-slate-600"
                )} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Tiempo restante</p>
                <p className={cn(
                  "text-2xl font-mono font-bold",
                  remainingTime < 5 * 60 * 1000 ? "text-red-600" : "text-slate-900"
                )}>
                  {formatTime(remainingTime)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {!isTimerRunning ? (
                <Button onClick={startTimer}>
                  <Play className="w-4 h-4 mr-2" />
                  Iniciar
                </Button>
              ) : (
                <Button variant="outline" onClick={pauseTimer}>
                  <Pause className="w-4 h-4 mr-2" />
                  Pausar
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={resetTimer}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {/* Acciones de ronda */}
      {!round.startedAt && (
        <div className="flex justify-center">
          <Button size="lg" onClick={() => startRound(round.id)}>
            <Play className="w-5 h-5 mr-2" />
            Iniciar Ronda
          </Button>
        </div>
      )}
      
      {isRoundComplete && !round.endedAt && (
        <div className="flex justify-center">
          <Button size="lg" variant="secondary" onClick={() => endRound(round.id)}>
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Finalizar Ronda
          </Button>
        </div>
      )}
      
      {/* Lista de matches */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">
          Matches ({completedMatches}/{totalMatches})
        </h2>
        
        {round.matches.map((match) => (
          <Card 
            key={match.id}
            className={cn(
              "p-4",
              match.status === "DONE" && "bg-green-50/50 border-green-200"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Mesa */}
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-slate-600">
                    {match.table}
                  </span>
                </div>
                
                {/* Jugadores */}
                <div className="space-y-1">
                  <div className={cn(
                    "font-medium",
                    match.result === "P1_WIN" || match.result === "P1_BYE" 
                      ? "text-blue-700 font-bold" 
                      : "text-slate-900"
                  )}>
                    {getPlayerName(match.player1Id)}
                  </div>
                  <div className={cn(
                    "font-medium",
                    match.result === "P2_WIN" || match.result === "P2_BYE" 
                      ? "text-green-700 font-bold" 
                      : "text-slate-900"
                  )}>
                    {match.player2Id ? getPlayerName(match.player2Id) : "BYE"}
                  </div>
                </div>
              </div>
              
              {/* Resultado */}
              <div className="flex items-center gap-2">
                {match.status === "DONE" ? (
                  <Badge variant="success">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Completado
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <Circle className="w-3 h-3 mr-1" />
                    Pendiente
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Selector de resultado */}
            {match.player2Id && ( // No mostrar para byes
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex flex-wrap gap-2">
                  {resultOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setMatchResult(round.id, match.id, option.value)}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                        match.result === option.value
                          ? option.color
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                  <button
                    onClick={() => setMatchResult(round.id, match.id, null)}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                      match.result === null
                        ? "bg-slate-200 text-slate-800"
                        : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                    )}
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// Helper function for formatting time
function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
