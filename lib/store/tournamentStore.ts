// ============================================
// ZUSTAND STORE - TORNEOS POKÉMON TCG
// ============================================

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { nanoid } from "nanoid";

// Domain imports
import type { 
  Tournament, 
  Player, 
  Match, 
  Round, 
  MatchResult,
  TournamentStatus 
} from "@/lib/domain/types";

import { generateSwissPairings } from "@/lib/domain/pairings";
import { calculateStandings, type StandingsOptions } from "@/lib/domain/standings";

// ============================================
// ESTADO DEL STORE
// ============================================

interface TournamentState {
  // Datos del torneo
  tournament: Tournament | null;
  
  // Estado de UI
  isLoading: boolean;
  error: string | null;
  
  // Timer de ronda
  roundTimerStart: number | null; // timestamp en ms
  roundTimerPausedAt: number | null;
}

// ============================================
// ACCIONES DEL STORE
// ============================================

interface TournamentActions {
  // Gestión del torneo
  createTournament: (config: {
    nombre: string;
    format: Tournament["format"];
    settings: Tournament["settings"];
  }) => void;
  
  resetTournament: () => void;
  
  startTournament: () => void;
  
  finishTournament: () => void;
  
  // Gestión de jugadores
  addPlayer: (player: Omit<Player, "id" | "dropped" | "receivedBye">) => void;
  
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
  
  removePlayer: (playerId: string) => void;
  
  dropPlayer: (playerId: string) => void;
  
  // Gestión de rondas
  createRound: () => void;
  
  startRound: (roundId: string) => void;
  
  endRound: (roundId: string) => void;
  
  // Gestión de matches
  setMatchResult: (roundId: string, matchId: string, result: MatchResult) => void;
  
  updateMatchStatus: (roundId: string, matchId: string, status: Match["status"]) => void;
  
  // Timer de ronda
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  getRemainingTime: () => number;
  
  // Import/Export
  exportTournament: () => string;
  importTournament: (jsonData: string) => void;
  
  // UI State
  setError: (error: string | null) => void;
  
  // Getters computados
  getCurrentRound: () => Round | null;
  getStandings: () => ReturnType<typeof calculateStandings>;
  getActivePlayers: () => Player[];
  getDroppedPlayers: () => Player[];
  canStartRound: () => boolean;
  isRoundComplete: (roundId: string) => boolean;
  
  // Top Cut
  shouldStartTopCut: () => boolean;
  startTopCut: () => void;
  generateTopCutPairings: () => void;
}

// ============================================
// STORE COMPLETO
// ============================================

const STORAGE_KEY = "poke-torneos:v1";

export const useTournamentStore = create<TournamentState & TournamentActions>()(
  persist(
    (set, get) => ({
      // ============================================
      // ESTADO INICIAL
      // ============================================
      
      tournament: null,
      isLoading: false,
      error: null,
      roundTimerStart: null,
      roundTimerPausedAt: null,
      
      // ============================================
      // UI STATE
      // ============================================
      
      setError: (error) => {
        set({ error });
      },
      
      // ============================================
      // GESTIÓN DEL TORNEO
      // ============================================
      
      createTournament: (config) => {
        const now = new Date().toISOString();
        const newTournament: Tournament = {
          id: nanoid(),
          nombre: config.nombre,
          format: config.format,
          status: "SETUP",
          phase: "SWISS",
          players: [],
          rounds: [],
          settings: config.settings,
          createdAt: now,
          updatedAt: now,
          currentRound: 0,
        };
        
        set({ tournament: newTournament, error: null });
      },
      
      resetTournament: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem(STORAGE_KEY);
        }
        set({
          tournament: null,
          error: null,
          roundTimerStart: null,
          roundTimerPausedAt: null,
        });
      },
      
      startTournament: () => {
        const { tournament } = get();
        if (!tournament) return;
        if (tournament.players.length < 2) {
          set({ error: "Se necesitan al menos 2 jugadores para iniciar" });
          return;
        }
        
        set({
          tournament: {
            ...tournament,
            status: "RUNNING",
            updatedAt: new Date().toISOString(),
          },
          error: null,
        });
      },
      
      finishTournament: () => {
        const { tournament } = get();
        if (!tournament) return;
        
        set({
          tournament: {
            ...tournament,
            status: "FINISHED",
            updatedAt: new Date().toISOString(),
          },
        });
      },
      
      // ============================================
      // GESTIÓN DE JUGADORES
      // ============================================
      
      addPlayer: (playerData) => {
        const { tournament } = get();
        if (!tournament) return;
        
        // Verificar nombre duplicado
        const normalizedName = playerData.nombre.trim().toLowerCase();
        const exists = tournament.players.some(
          p => p.nombre.trim().toLowerCase() === normalizedName
        );
        if (exists) {
          set({ error: `Ya existe un jugador llamado "${playerData.nombre}"` });
          return;
        }
        
        const newPlayer: Player = {
          ...playerData,
          id: nanoid(),
          dropped: false,
          receivedBye: false,
        };
        
        set({
          tournament: {
            ...tournament,
            players: [...tournament.players, newPlayer],
            updatedAt: new Date().toISOString(),
          },
          error: null,
        });
      },
      
      updatePlayer: (playerId, updates) => {
        const { tournament } = get();
        if (!tournament) return;
        
        // Verificar duplicado si se actualiza nombre
        if (updates.nombre) {
          const normalizedName = updates.nombre.trim().toLowerCase();
          const exists = tournament.players.some(
            p => p.id !== playerId && p.nombre.trim().toLowerCase() === normalizedName
          );
          if (exists) {
            set({ error: `Ya existe un jugador llamado "${updates.nombre}"` });
            return;
          }
        }
        
        set({
          tournament: {
            ...tournament,
            players: tournament.players.map(p =>
              p.id === playerId ? { ...p, ...updates } : p
            ),
            updatedAt: new Date().toISOString(),
          },
          error: null,
        });
      },
      
      removePlayer: (playerId) => {
        const { tournament } = get();
        if (!tournament) return;
        
        // Solo permitir eliminar si no hay rondas iniciadas
        if (tournament.rounds.length > 0) {
          set({ error: "No se pueden eliminar jugadores una vez iniciado el torneo" });
          return;
        }
        
        set({
          tournament: {
            ...tournament,
            players: tournament.players.filter(p => p.id !== playerId),
            updatedAt: new Date().toISOString(),
          },
        });
      },
      
      dropPlayer: (playerId) => {
        const { tournament } = get();
        if (!tournament) return;

        set({
          tournament: {
            ...tournament,
            players: tournament.players.map(p =>
              p.id === playerId ? { ...p, dropped: !p.dropped } : p
            ),
            updatedAt: new Date().toISOString(),
          },
        });
      },
      
      // ============================================
      // GESTIÓN DE RONDAS
      // ============================================
      
      createRound: () => {
        const { tournament } = get();
        if (!tournament) return;
        
        // Verificar que se pueda crear una nueva ronda
        const nextRoundNumber = tournament.rounds.length + 1;
        
        // Verificar que la ronda anterior esté completa
        if (tournament.rounds.length > 0) {
          const lastRound = tournament.rounds[tournament.rounds.length - 1];
          const allMatchesDone = lastRound.matches.every(m => m.status === "DONE");
          if (!allMatchesDone) {
            set({ error: "Debes completar todos los matches de la ronda anterior" });
            return;
          }
        }
        
        // Generar pairings
        const activePlayers = tournament.players.filter(p => !p.dropped);
        
        const pairingsResult = generateSwissPairings({
          players: activePlayers,
          rounds: tournament.rounds,
          currentRound: nextRoundNumber,
          settings: {
            pointsWin: tournament.settings.pointsWin,
            pointsTie: tournament.settings.pointsTie,
            pointsLoss: tournament.settings.pointsLoss,
          },
          allowByes: true,
        });
        
        // Crear matches
        const matches: Match[] = pairingsResult.matches.map((pairing: { player1: Player; player2: Player | null }, index: number) => {
          const isBye = pairing.player2 === null;
          
          return {
            id: nanoid(),
            table: index + 1,
            player1Id: pairing.player1.id,
            player2Id: pairing.player2?.id || null,
            result: isBye ? "P1_BYE" : null,
            status: isBye ? "DONE" : "PAIRED",
            roundNumber: nextRoundNumber,
          };
        });
        
        // Crear la ronda
        const newRound: Round = {
          id: nanoid(),
          number: nextRoundNumber,
          matches,
          isComplete: false,
        };
        
        set({
          tournament: {
            ...tournament,
            rounds: [...tournament.rounds, newRound],
            currentRound: nextRoundNumber,
            updatedAt: new Date().toISOString(),
          },
          error: null,
        });
      },
      
      startRound: (roundId) => {
        const { tournament } = get();
        if (!tournament) return;
        
        set({
          tournament: {
            ...tournament,
            rounds: tournament.rounds.map(r =>
              r.id === roundId
                ? { ...r, startedAt: new Date().toISOString() }
                : r
            ),
            updatedAt: new Date().toISOString(),
          },
        });
        
        // Iniciar timer
        get().startTimer();
      },
      
      endRound: (roundId) => {
        const { tournament } = get();
        if (!tournament) return;
        
        // Verificar que todos los matches estén completos
        const round = tournament.rounds.find(r => r.id === roundId);
        if (!round) return;
        
        const allDone = round.matches.every(m => m.status === "DONE");
        if (!allDone) {
          set({ error: "Todos los matches deben tener un resultado" });
          return;
        }
        
        set({
          tournament: {
            ...tournament,
            rounds: tournament.rounds.map(r =>
              r.id === roundId
                ? { ...r, endedAt: new Date().toISOString(), isComplete: true }
                : r
            ),
            updatedAt: new Date().toISOString(),
          },
          error: null,
        });
        
        // Pausar timer
        get().pauseTimer();
        
        // Verificar si debemos iniciar Top Cut automáticamente
        const updatedTournament = get().tournament;
        if (updatedTournament && 
            updatedTournament.format === "SWISS_TOP_CUT" &&
            updatedTournament.phase === "SWISS") {
          
          // Verificar si es momento de iniciar Top Cut
          // Para torneos de 10+ jugadores: mínimo 6-7 rondas Swiss
          const playerCount = updatedTournament.players.length;
          let minSwissRounds: number;
          
          if (playerCount <= 8) {
            minSwissRounds = 3;
          } else if (playerCount <= 16) {
            minSwissRounds = 4;
          } else if (playerCount <= 32) {
            minSwissRounds = 5;
          } else if (playerCount <= 64) {
            minSwissRounds = 6;
          } else {
            minSwissRounds = 7;
          }
          
          // También respetar el mínimo de 6 rondas para calidad del torneo
          minSwissRounds = Math.max(minSwissRounds, 6);
          
          if (updatedTournament.rounds.length >= minSwissRounds) {
            console.log(`[Top Cut] Iniciando automáticamente después de ${updatedTournament.rounds.length} rondas`);
            // Iniciar Top Cut automáticamente
            get().startTopCut();
          }
        }
      },
      
      // ============================================
      // GESTIÓN DE MATCHES
      // ============================================
      
      setMatchResult: (roundId, matchId, result) => {
        const { tournament } = get();
        if (!tournament) return;
        
        set({
          tournament: {
            ...tournament,
            rounds: tournament.rounds.map(r => {
              if (r.id !== roundId) return r;
              
              return {
                ...r,
                matches: r.matches.map(m => {
                  if (m.id !== matchId) return m;
                  
                  return {
                    ...m,
                    result,
                    status: result ? "DONE" : "PAIRED",
                  };
                }),
              };
            }),
            updatedAt: new Date().toISOString(),
          },
          error: null,
        });
      },
      
      updateMatchStatus: (roundId, matchId, status) => {
        const { tournament } = get();
        if (!tournament) return;
        
        set({
          tournament: {
            ...tournament,
            rounds: tournament.rounds.map(r => {
              if (r.id !== roundId) return r;
              
              return {
                ...r,
                matches: r.matches.map(m =>
                  m.id === matchId ? { ...m, status } : m
                ),
              };
            }),
            updatedAt: new Date().toISOString(),
          },
        });
      },
      
      // ============================================
      // TIMER DE RONDA
      // ============================================
      
      startTimer: () => {
        set({
          roundTimerStart: Date.now(),
          roundTimerPausedAt: null,
        });
      },
      
      pauseTimer: () => {
        const { roundTimerStart } = get();
        if (!roundTimerStart) return;
        
        set({
          roundTimerPausedAt: Date.now(),
        });
      },
      
      resetTimer: () => {
        set({
          roundTimerStart: null,
          roundTimerPausedAt: null,
        });
      },
      
      getRemainingTime: () => {
        const { tournament, roundTimerStart, roundTimerPausedAt } = get();
        if (!tournament || !roundTimerStart) return 0;
        
        const roundTimeMs = tournament.settings.roundTimeMinutes * 60 * 1000;
        const elapsed = roundTimerPausedAt 
          ? roundTimerPausedAt - roundTimerStart
          : Date.now() - roundTimerStart;
        
        return Math.max(0, roundTimeMs - elapsed);
      },
      
      // ============================================
      // IMPORT/EXPORT
      // ============================================
      
      exportTournament: () => {
        const { tournament } = get();
        return tournament ? JSON.stringify(tournament, null, 2) : "";
      },
      
      importTournament: (jsonData) => {
        try {
          const data = JSON.parse(jsonData);
          // Validación básica
          if (!data.id || !data.nombre || !Array.isArray(data.players)) {
            throw new Error("Formato de torneo inválido");
          }
          
          set({
            tournament: data,
            error: null,
          });
        } catch (error) {
          set({ error: "Error al importar torneo: " + (error as Error).message });
        }
      },
      
      // ============================================
      // GETTERS COMPUTADOS
      // ============================================
      
      getCurrentRound: () => {
        const { tournament } = get();
        if (!tournament) return null;
        return tournament.rounds.find(r => r.number === tournament.currentRound) || null;
      },
      
      getStandings: () => {
        const { tournament } = get();
        if (!tournament) return [];
        
        return calculateStandings(
          tournament.players,
          tournament.rounds,
          {
            pointsWin: tournament.settings.pointsWin,
            pointsTie: tournament.settings.pointsTie,
            pointsLoss: tournament.settings.pointsLoss,
          }
        );
      },
      
      getActivePlayers: () => {
        const { tournament } = get();
        if (!tournament) return [];
        return tournament.players.filter(p => !p.dropped);
      },
      
      getDroppedPlayers: () => {
        const { tournament } = get();
        if (!tournament) return [];
        return tournament.players.filter(p => p.dropped);
      },
      
      canStartRound: () => {
        const { tournament } = get();
        if (!tournament) return false;
        
        // Si no hay rondas, podemos empezar
        if (tournament.rounds.length === 0) return true;
        
        // Verificar que la última ronda esté completa
        const lastRound = tournament.rounds[tournament.rounds.length - 1];
        return lastRound.matches.every(m => m.status === "DONE");
      },
      
      isRoundComplete: (roundId) => {
        const { tournament } = get();
        if (!tournament) return false;
        
        const round = tournament.rounds.find(r => r.id === roundId);
        if (!round) return false;
        
        return round.matches.every(m => m.status === "DONE");
      },
      
      // ============================================
      // TOP CUT
      // ============================================
      
      shouldStartTopCut: () => {
        const { tournament } = get();
        if (!tournament) return false;
        
        // Solo para formato SWISS_TOP_CUT
        if (tournament.format !== "SWISS_TOP_CUT") return false;
        
        // Ya estamos en Top Cut
        if (tournament.phase === "TOP_CUT") return false;
        
        // Verificar si tenemos suficientes rondas Swiss
        // Normalmente: 6-7 rondas para 10+ jugadores
        const minSwissRounds = Math.min(6, Math.ceil(Math.log2(tournament.players.length)) + 1);
        
        if (tournament.rounds.length < minSwissRounds) return false;
        
        // La última ronda debe estar completa
        const lastRound = tournament.rounds[tournament.rounds.length - 1];
        if (!lastRound.isComplete) return false;
        
        return true;
      },
      
      startTopCut: () => {
        const { tournament, getStandings } = get();
        if (!tournament) return;
        
        const topCutSize = tournament.settings.topCutSize || 4;
        
        // Obtener standings actuales
        const standings = getStandings();
        
        // Seleccionar los mejores jugadores para el Top Cut
        const topCutPlayerIds = standings
          .slice(0, topCutSize)
          .map(s => s.playerId);
        
        // Marcar jugadores que no pasaron como dropped
        const updatedPlayers = tournament.players.map(p => {
          if (!topCutPlayerIds.includes(p.id)) {
            return { ...p, dropped: true };
          }
          return p;
        });
        
        set({
          tournament: {
            ...tournament,
            phase: "TOP_CUT",
            players: updatedPlayers,
            topCutPlayers: topCutPlayerIds,
            eliminatedPlayers: tournament.players
              .filter(p => !topCutPlayerIds.includes(p.id))
              .map(p => p.id),
            updatedAt: new Date().toISOString(),
          },
          error: null,
        });
      },
      
      generateTopCutPairings: () => {
        const { tournament, getStandings } = get();
        if (!tournament || tournament.phase !== "TOP_CUT") return;
        
        const nextRoundNumber = tournament.rounds.length + 1;
        const topCutPlayers = tournament.topCutPlayers || [];
        
        if (topCutPlayers.length <= 1) {
          // Solo queda un jugador, torneo terminado
          get().finishTournament();
          return;
        }
        
        // Obtener standings para ordenar
        const standings = getStandings();
        const sortedTopCutPlayers = standings
          .filter(s => topCutPlayers.includes(s.playerId))
          .map(s => tournament.players.find(p => p.id === s.playerId)!)
          .filter(Boolean);
        
        // Generar pairings de eliminación directa
        // 1ro vs último, 2do vs penúltimo, etc.
        const matches: Match[] = [];
        const numPlayers = sortedTopCutPlayers.length;
        
        for (let i = 0; i < Math.floor(numPlayers / 2); i++) {
          const player1 = sortedTopCutPlayers[i];
          const player2 = sortedTopCutPlayers[numPlayers - 1 - i];
          
          matches.push({
            id: nanoid(),
            table: i + 1,
            player1Id: player1.id,
            player2Id: player2.id,
            result: null,
            status: "PAIRED",
            roundNumber: nextRoundNumber,
          });
        }
        
        // Si hay número impar, el del medio pasa automáticamente (bye)
        if (numPlayers % 2 === 1) {
          const middlePlayer = sortedTopCutPlayers[Math.floor(numPlayers / 2)];
          matches.push({
            id: nanoid(),
            table: matches.length + 1,
            player1Id: middlePlayer.id,
            player2Id: null,
            result: "P1_BYE",
            status: "DONE",
            roundNumber: nextRoundNumber,
          });
        }
        
        // Crear la ronda
        const newRound: Round = {
          id: nanoid(),
          number: nextRoundNumber,
          matches,
          isComplete: false,
        };
        
        set({
          tournament: {
            ...tournament,
            rounds: [...tournament.rounds, newRound],
            currentRound: nextRoundNumber,
            updatedAt: new Date().toISOString(),
          },
          error: null,
        });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tournament: state.tournament,
        roundTimerStart: state.roundTimerStart,
        roundTimerPausedAt: state.roundTimerPausedAt,
      }),
    }
  )
);
