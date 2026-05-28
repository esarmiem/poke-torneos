// ============================================
// PÁGINA DE CONFIGURACIÓN Y JUGADORES
// ============================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTournamentStore } from "@/lib/store/tournamentStore";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { PokemonSprite, sprites } from "@/components/PokemonSprite";
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit2, 
  Trophy,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Division, TournamentFormat } from "@/lib/domain/types";

export default function SetupPage() {
  const router = useRouter();
  const { 
    tournament, 
    createTournament, 
    addPlayer, 
    removePlayer, 
    updatePlayer,
    dropPlayer,
    startTournament,
    error,
    setError
  } = useTournamentStore();
  
  // Estado para creación de torneo
  const [tournamentConfig, setTournamentConfig] = useState({
    nombre: "",
    format: "SWISS" as TournamentFormat,
    roundTimeMinutes: 50,
    pointsWin: 3,
    pointsTie: 1,
    pointsLoss: 0,
  });
  
  // Estado para nuevo jugador
  const [newPlayer, setNewPlayer] = useState({
    nombre: "",
    playerId: "",
    division: "" as Division | "",
    deck: "",
    notas: "",
  });
  
  // Estado para edición
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);
  
  // Crear torneo
  const handleCreateTournament = () => {
    if (!tournamentConfig.nombre.trim()) {
      setError("El nombre del torneo es requerido");
      return;
    }
    
    createTournament({
      nombre: tournamentConfig.nombre,
      format: tournamentConfig.format,
      settings: {
        pointsWin: tournamentConfig.pointsWin,
        pointsTie: tournamentConfig.pointsTie,
        pointsLoss: tournamentConfig.pointsLoss,
        roundTimeMinutes: tournamentConfig.roundTimeMinutes,
      },
    });
  };
  
  // Agregar jugador
  const handleAddPlayer = () => {
    if (!newPlayer.nombre.trim()) {
      setError("El nombre del jugador es requerido");
      return;
    }
    
    addPlayer({
      nombre: newPlayer.nombre,
      playerId: newPlayer.playerId || undefined,
      division: newPlayer.division || undefined,
      deck: newPlayer.deck || undefined,
      notas: newPlayer.notas || undefined,
    });
    
    // Limpiar formulario
    setNewPlayer({
      nombre: "",
      playerId: "",
      division: "",
      deck: "",
      notas: "",
    });
  };
  
  // Iniciar torneo
  const handleStartTournament = () => {
    if (tournament!.players.length < 2) {
      setError("Se necesitan al menos 2 jugadores");
      return;
    }
    startTournament();
  };
  
  // Si no hay torneo, mostrar pantalla de creación
  if (!tournament) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Crear Nuevo Torneo
          </h1>
          <p className="text-slate-600">
            Configura los ajustes básicos de tu torneo Pokémon TCG
          </p>
        </div>
        
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre del Torneo *</Label>
              <Input
                id="nombre"
                value={tournamentConfig.nombre}
                onChange={(e) => setTournamentConfig(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Ej: Torneo LIGA PLAY Pokémon TCG"
              />
            </div>
            
            <div>
              <Label htmlFor="formato">Formato</Label>
              <Select
                id="formato"
                value={tournamentConfig.format}
                onChange={(e) => setTournamentConfig(prev => ({ ...prev, format: e.target.value as TournamentFormat }))}
              >
                <option value="SWISS">Suizo (Swiss)</option>
                <option value="SWISS_TOP_CUT">Suizo + Top Cut</option>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="tiempo">Tiempo por ronda (minutos)</Label>
              <Input
                id="tiempo"
                type="number"
                min={10}
                max={120}
                value={tournamentConfig.roundTimeMinutes}
                onChange={(e) => setTournamentConfig(prev => ({ ...prev, roundTimeMinutes: parseInt(e.target.value) || 50 }))}
              />
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleCreateTournament}
            >
              Crear Torneo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  
  // Pantalla de gestión de jugadores
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Jugadores
            <PokemonSprite {...sprites.lucario} size="xl" variant="decorative" />
          </h1>
          <p className="text-slate-600 mt-1">
            {tournament.nombre}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={tournament.status === "SETUP" ? "secondary" : "success"}>
            {tournament.status === "SETUP" ? "En configuración" : "En curso"}
          </Badge>
        </div>
      </div>
      
      {/* Formulario de nuevo jugador */}
      {tournament.status === "SETUP" && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Agregar Jugador
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="playerName">Nombre *</Label>
              <Input
                id="playerName"
                value={newPlayer.nombre}
                onChange={(e) => setNewPlayer(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Nombre del jugador"
              />
            </div>
            
            <div>
              <Label htmlFor="playerId">ID de Jugador</Label>
              <Input
                id="playerId"
                value={newPlayer.playerId}
                onChange={(e) => setNewPlayer(prev => ({ ...prev, playerId: e.target.value }))}
                placeholder="Ej: 1234567890"
              />
            </div>
            
            <div>
              <Label htmlFor="division">División</Label>
              <Select
                id="division"
                value={newPlayer.division}
                onChange={(e) => setNewPlayer(prev => ({ ...prev, division: e.target.value as Division }))}
              >
                <option value="">Seleccionar...</option>
                <option value="Juniors">Juniors</option>
                <option value="Seniors">Seniors</option>
                <option value="Masters">Masters</option>
                <option value="Open">Open</option>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="deck">Deck</Label>
              <Input
                id="deck"
                value={newPlayer.deck}
                onChange={(e) => setNewPlayer(prev => ({ ...prev, deck: e.target.value }))}
                placeholder="Ej: Charizard ex"
              />
            </div>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg mt-4">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          
          <div className="mt-4">
            <Button onClick={handleAddPlayer}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Jugador
            </Button>
          </div>
        </Card>
      )}
      
      {/* Lista de jugadores */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Lista de Jugadores ({tournament.players.length})
          </h2>
          
          {tournament.status === "SETUP" && tournament.players.length >= 2 && (
            <Button onClick={handleStartTournament} size="lg">
              Iniciar Torneo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
        
        {tournament.players.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No hay jugadores registrados</p>
            {tournament.status === "SETUP" && (
              <p className="text-sm mt-1">Agrega jugadores para comenzar</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Nombre</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">División</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Deck</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Estado</th>
                  {tournament.status === "SETUP" && (
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Acciones</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {tournament.players.map((player) => (
                  <tr 
                    key={player.id} 
                    className={cn(
                      "border-b border-slate-100 last:border-0",
                      player.dropped && "opacity-50 bg-slate-50"
                    )}
                  >
                    <td className="py-3 px-4">
                      <span className={cn(
                        "font-medium",
                        player.dropped ? "text-slate-500 line-through" : "text-slate-900"
                      )}>
                        {player.nombre}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-sm">
                      {player.playerId || "-"}
                    </td>
                    <td className="py-3 px-4">
                      {player.division ? (
                        <Badge variant="secondary">
                          {player.division}
                        </Badge>
                      ) : (
                        <span className="text-slate-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-sm">
                      {player.deck || "-"}
                    </td>
                    <td className="py-3 px-4">
                      {player.dropped ? (
                        <Badge variant="destructive">Drop</Badge>
                      ) : (
                        <Badge variant="success">Activo</Badge>
                      )}
                    </td>
                    {tournament.status === "SETUP" && (
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingPlayer(player.id)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removePlayer(player.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
