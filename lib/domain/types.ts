// ============================================
// TIPOS DEL DOMINIO - TORNEOS POKÉMON TCG
// ============================================

// Divisiones de jugadores según reglas oficiales
export type Division = "Juniors" | "Seniors" | "Masters" | "Open";

// Estado del torneo
export type TournamentStatus = "SETUP" | "RUNNING" | "FINISHED";

// Fase del torneo para formato SWISS_TOP_CUT
export type TournamentPhase = "SWISS" | "TOP_CUT";

// Formato del torneo
export type TournamentFormat = "SWISS" | "SWISS_TOP_CUT";

// Resultados posibles de un match
export type MatchResult = "P1_WIN" | "P2_WIN" | "TIE" | "P1_BYE" | "P2_BYE" | null;

// Estado de un match
export type MatchStatus = "PAIRED" | "PLAYING" | "DONE";

// Estado de un game individual (dentro de un match Bo3)
export type GameStatus = "PENDING" | "PLAYING" | "DONE";

// ============================================
// ENTIDADES PRINCIPALES
// ============================================

export interface Game {
  id: string;
  gameNumber: number; // 1, 2, o 3
  result: MatchResult; // P1_WIN, P2_WIN, TIE (no incluye BYE)
  status: GameStatus;
}

export interface Player {
  id: string;
  nombre: string;
  playerId?: string;
  division?: Division;
  deck?: string;
  notas?: string;
  dropped: boolean;
  receivedBye: boolean;
}

export interface Match {
  id: string;
  table: number;
  player1Id: string;
  player2Id: string | null; // null = bye
  result: MatchResult;
  status: MatchStatus;
  // Campos para calcular tiebreakers
  roundNumber: number;
  // Games individuales para modo Mejor de 3
  games: Game[];
}

export interface Round {
  id: string;
  number: number;
  matches: Match[];
  startedAt?: string;
  endedAt?: string;
  isComplete: boolean;
}

export interface TournamentSettings {
  pointsWin: number;
  pointsTie: number;
  pointsLoss: number;
  topCutSize?: number;
  roundTimeMinutes: number;
  isBestOfThree: boolean;
}

export interface Tournament {
  id: string;
  nombre: string;
  format: TournamentFormat;
  status: TournamentStatus;
  phase: TournamentPhase; // Para SWISS_TOP_CUT: SWISS o TOP_CUT
  players: Player[];
  rounds: Round[];
  settings: TournamentSettings;
  createdAt: string;
  updatedAt: string;
  currentRound: number;
  // Datos específicos para Top Cut
  topCutPlayers?: string[]; // IDs de jugadores que pasaron al Top Cut
  eliminatedPlayers?: string[]; // IDs de jugadores eliminados en Top Cut
}

// ============================================
// TIPOS AUXILIARES PARA STANDINGS
// ============================================

export interface PlayerStanding {
  playerId: string;
  player: Player;
  rank: number;
  matchPoints: number;
  wins: number;
  losses: number;
  ties: number;
  byes: number;
  opponentsWinPercent: number;
  gameWinPercent?: number;
  opponentsGameWinPercent?: number;
  // Historial de resultados por ronda
  roundResults: Array<{
    round: number;
    result: string; // "W", "L", "T", "BYE", "-"
    points: number;
    opponentId?: string;
  }>;
  previousRank?: number; // Para mostrar cambio de posición
}

// ============================================
// TIPOS PARA PAIRINGS
// ============================================

export interface PairingCandidate {
  player: Player;
  standing: PlayerStanding;
  potentialOpponents: Player[];
  alreadyPlayed: Set<string>;
}

export interface PairingResult {
  match: Match;
  byePlayer?: Player;
}
