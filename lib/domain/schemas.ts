// ============================================
// ESQUEMAS DE VALIDACIÓN ZOD
// ============================================

import { z } from "zod";

// Divisiones permitidas
export const DivisionSchema = z.enum(["Juniors", "Seniors", "Masters", "Open"]);

// Estado del torneo
export const TournamentStatusSchema = z.enum(["SETUP", "RUNNING", "FINISHED"]);

// Formato del torneo
export const TournamentFormatSchema = z.enum(["SWISS", "SWISS_TOP_CUT"]);

// Fase del torneo (para SWISS_TOP_CUT)
export const TournamentPhaseSchema = z.enum(["SWISS", "TOP_CUT"]);

// Resultados de un match
export const MatchResultSchema = z.enum([
  "P1_WIN",
  "P2_WIN",
  "TIE",
  "P1_BYE",
  "P2_BYE",
]).nullable();

// Estado de un game individual
export const GameStatusSchema = z.enum(["PENDING", "PLAYING", "DONE"]);

// Game individual (dentro de un match Bo3)
export const GameSchema = z.object({
  id: z.string(),
  gameNumber: z.number().int().min(1).max(3),
  result: MatchResultSchema,
  status: GameStatusSchema,
});

// Estado de un match
export const MatchStatusSchema = z.enum(["PAIRED", "PLAYING", "DONE"]);

// Jugador
export const PlayerSchema = z.object({
  id: z.string(),
  nombre: z.string().min(1, "El nombre es requerido"),
  playerId: z.string().optional(),
  division: DivisionSchema.optional(),
  deck: z.string().optional(),
  notas: z.string().optional(),
  dropped: z.boolean().default(false),
  receivedBye: z.boolean().default(false),
});

// Match
export const MatchSchema = z.object({
  id: z.string(),
  table: z.number().int().positive(),
  player1Id: z.string(),
  player2Id: z.string().nullable(),
  result: MatchResultSchema,
  status: MatchStatusSchema,
  roundNumber: z.number().int().positive(),
  games: z.array(GameSchema).default([]),
});

// Ronda
export const RoundSchema = z.object({
  id: z.string(),
  number: z.number().int().positive(),
  matches: z.array(MatchSchema),
  startedAt: z.string().datetime().optional(),
  endedAt: z.string().datetime().optional(),
  isComplete: z.boolean().default(false),
});

// Configuración del torneo
export const TournamentSettingsSchema = z.object({
  pointsWin: z.number().int().default(3),
  pointsTie: z.number().int().default(1),
  pointsLoss: z.number().int().default(0),
  topCutSize: z.number().int().optional(),
  roundTimeMinutes: z.number().int().default(50),
  isBestOfThree: z.boolean().default(false),
});

// Torneo completo
export const TournamentSchema = z.object({
  id: z.string(),
  nombre: z.string().min(1, "El nombre del torneo es requerido"),
  format: TournamentFormatSchema,
  status: TournamentStatusSchema,
  phase: TournamentPhaseSchema.default("SWISS"),
  players: z.array(PlayerSchema),
  rounds: z.array(RoundSchema),
  settings: TournamentSettingsSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  currentRound: z.number().int().default(0),
  // Datos específicos para Top Cut
  topCutPlayers: z.array(z.string()).optional(), // IDs de jugadores que pasaron al Top Cut
  eliminatedPlayers: z.array(z.string()).optional(), // IDs de jugadores eliminados en Top Cut
});

// Tipos inferidos de los esquemas
export type PlayerInput = z.input<typeof PlayerSchema>;
export type MatchInput = z.input<typeof MatchSchema>;
export type RoundInput = z.input<typeof RoundSchema>;
export type TournamentInput = z.input<typeof TournamentSchema>;
