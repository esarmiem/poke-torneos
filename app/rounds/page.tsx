// ============================================
// PÁGINA DE RONDAS
// ============================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTournamentStore } from "@/lib/store/tournamentStore";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PokemonSprite, sprites } from "@/components/PokemonSprite";
import { 
  Swords, 
  Plus, 
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function RoundsPage() {
  const router = useRouter();
  const { 
    tournament, 
    createRound, 
    canStartRound,
    isRoundComplete 
  } = useTournamentStore();
  
  const [isCreating, setIsCreating] = useState(false);
  
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
        </Button>
      </div>
    );
  }
  
  const handleCreateRound = () => {
    setIsCreating(true);
    createRound();
    setIsCreating(false);
  };
  
  const canCreateRound = canStartRound() && tournament.status === "RUNNING";
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Swords className="w-6 h-6" />
            Rondas
            <PokemonSprite {...sprites.greninja} size="xs" variant="decorative" />
          </h1>
          <p className="text-slate-600 mt-1">
            {tournament.nombre}
          </p>
        </div>
        
        {canCreateRound && (
          <Button 
            onClick={handleCreateRound}
            disabled={isCreating}
          >
            <Plus className="w-4 h-4 mr-2" />
            {isCreating ? "Creando..." : `Crear Ronda ${tournament.rounds.length + 1}`}
          </Button>
        )}
      </div>
      
      {/* Info si no se puede crear ronda */}
      {!canCreateRound && tournament.status === "RUNNING" && tournament.rounds.length > 0 && (
        <div className="flex items-center gap-2 text-amber-700 text-sm bg-amber-50 p-4 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span>
            Debes completar todos los matches de la ronda anterior antes de crear una nueva ronda.
          </span>
        </div>
      )}
      
      {tournament.status === "SETUP" && (
        <div className="flex items-center gap-2 text-blue-700 text-sm bg-blue-50 p-4 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span>
            Inicia el torneo desde la página de configuración para comenzar a crear rondas.
          </span>
        </div>
      )}
      
      {/* Lista de rondas */}
      {tournament.rounds.length === 0 ? (
        <Card className="p-12 text-center">
          <Swords className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            No hay rondas creadas
          </h3>
          <p className="text-slate-500 mb-4">
            {tournament.status === "RUNNING"
              ? "Crea la primera ronda para comenzar el torneo"
              : "Inicia el torneo para poder crear rondas"}
          </p>
          {canCreateRound && (
            <Button onClick={handleCreateRound}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Primera Ronda
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {tournament.rounds.map((round) => {
            const completedMatches = round.matches.filter(m => m.status === "DONE").length;
            const totalMatches = round.matches.length;
            const isComplete = completedMatches === totalMatches;
            
            return (
              <Card 
                key={round.id}
                className={cn(
                  "p-6 hover:border-blue-300 transition-colors cursor-pointer",
                  round.number === tournament.currentRound && "border-blue-500 bg-blue-50/30"
                )}
                onClick={() => router.push(`/rounds/${round.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      isComplete ? "bg-green-100" : "bg-blue-100",
                      round.number === tournament.currentRound && "ring-2 ring-blue-500"
                    )}>
                      {isComplete ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <Swords className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Ronda {round.number}
                        {round.number === tournament.currentRound && (
                          <Badge variant="default" className="ml-2">Actual</Badge>
                        )}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                        <span>{totalMatches} matches</span>
                        <span>•</span>
                        <span className={cn(
                          isComplete ? "text-green-600" : "text-amber-600"
                        )}>
                          {completedMatches}/{totalMatches} completados
                        </span>
                        {round.startedAt && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {format(new Date(round.startedAt), "HH:mm", { locale: es })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
