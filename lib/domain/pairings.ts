// ============================================
// ALGORITMO DE PAIRINGS SWISS
// ============================================

import type { Player, Match, Round, PlayerStanding } from "./types";
import { calculateStandings, type StandingsOptions } from "./standings";

// ============================================
// TIPOS AUXILIARES
// ============================================

interface ScoreGroup {
  points: number;
  players: Player[];
}

interface PairingAttempt {
  success: boolean;
  pairings: Array<[Player, Player] | [Player, null]>; // null = bye
  conflicts: number;
}

// ============================================
// ALGORITMO PRINCIPAL
// ============================================

export interface GeneratePairingsOptions {
  players: Player[];
  rounds: Round[];
  currentRound: number;
  settings: StandingsOptions;
  allowByes?: boolean;
}

export interface GeneratedPairings {
  matches: Array<{
    player1: Player;
    player2: Player | null; // null = bye
  }>;
  byePlayer: Player | null;
}

/**
 * Genera los pairings para una ronda Swiss
 */
export function generateSwissPairings({
  players,
  rounds,
  currentRound,
  settings,
  allowByes = true,
}: GeneratePairingsOptions): GeneratedPairings {
  // Filtrar jugadores que no han hecho drop
  const activePlayers = players.filter(p => !p.dropped);

  // Round 1: Pairing aleatorio
  if (currentRound === 1) {
    return generateRandomPairings(activePlayers, allowByes);
  }

  // Ronda 2+: Power pairing basado en standings
  return generatePowerPairings(activePlayers, rounds, settings, allowByes);
}

/**
 * Genera pairings aleatorios (para Round 1)
 */
function generateRandomPairings(players: Player[], allowByes: boolean): GeneratedPairings {
  // Shuffle jugadores
  const shuffled = [...players].sort(() => Math.random() - 0.5);
  
  const matches: Array<{ player1: Player; player2: Player | null }> = [];
  let byePlayer: Player | null = null;

  // Si hay número impar y permitimos byes
  if (shuffled.length % 2 === 1 && allowByes) {
    // El último recibe bye
    byePlayer = shuffled.pop()!;
    // Marcar que recibió bye
    byePlayer.receivedBye = true;
  }

  // Crear pairings
  for (let i = 0; i < shuffled.length; i += 2) {
    if (i + 1 < shuffled.length) {
      matches.push({
        player1: shuffled[i],
        player2: shuffled[i + 1],
      });
    }
    // Si queda uno solo sin pareja (no debería pasar con la lógica de bye)
  }

  return { matches, byePlayer };
}

/**
 * Genera power pairings basados en standings
 */
function generatePowerPairings(
  players: Player[],
  rounds: Round[],
  settings: StandingsOptions,
  allowByes: boolean
): GeneratedPairings {
  // Calcular standings actuales
  const standings = calculateStandings(players, rounds, settings);
  
  // Crear mapa de jugadores jugados entre sí
  const playedAgainst = buildPlayedAgainstMap(rounds);
  
  // Agrupar jugadores por puntos
  const scoreGroups = groupByScore(standings);
  
  // Intentar crear pairings
  const result = attemptPairings(scoreGroups, playedAgainst, allowByes);
  
  if (!result.success) {
    // Fallback: pairing aleatorio si no se pudo hacer power pairing
    console.warn("No se pudo generar power pairing óptimo, usando aleatorio");
    return generateRandomPairings(players, allowByes);
  }
  
  // Convertir resultado a formato de matches
  const matches: Array<{ player1: Player; player2: Player | null }> = [];
  let byePlayer: Player | null = null;
  
  for (const pairing of result.pairings) {
    if (pairing[1] === null) {
      // Bye
      byePlayer = pairing[0];
      byePlayer.receivedBye = true;
      matches.push({ player1: pairing[0], player2: null });
    } else {
      matches.push({ player1: pairing[0], player2: pairing[1] });
    }
  }
  
  return { matches, byePlayer };
}

/**
 * Construye un mapa de quién jugó contra quién
 */
function buildPlayedAgainstMap(rounds: Round[]): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  
  for (const round of rounds) {
    for (const match of round.matches) {
      if (match.player1Id && match.player2Id) {
        // Ambos jugadores son reales (no bye)
        if (!map.has(match.player1Id)) {
          map.set(match.player1Id, new Set());
        }
        if (!map.has(match.player2Id)) {
          map.set(match.player2Id, new Set());
        }
        map.get(match.player1Id)!.add(match.player2Id);
        map.get(match.player2Id)!.add(match.player1Id);
      }
    }
  }
  
  return map;
}

/**
 * Agrupa jugadores por puntos
 */
function groupByScore(standings: PlayerStanding[]): ScoreGroup[] {
  const groups = new Map<number, Player[]>();
  
  for (const standing of standings) {
    const points = standing.matchPoints;
    if (!groups.has(points)) {
      groups.set(points, []);
    }
    groups.get(points)!.push(standing.player);
  }
  
  // Ordenar por puntos (descendente) y convertir a array
  return Array.from(groups.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([points, players]) => ({ points, players }));
}

/**
 * Intenta crear pairings dentro de los grupos de puntos
 */
function attemptPairings(
  scoreGroups: ScoreGroup[],
  playedAgainst: Map<string, Set<string>>,
  allowByes: boolean
): PairingAttempt {
  const allPairings: Array<[Player, Player] | [Player, null]> = [];
  const unpairedPlayers: Player[] = [];
  
  // Primero, intentar pairings dentro de cada grupo
  for (const group of scoreGroups) {
    const players = [...group.players];
    const groupPairings = pairGroup(players, playedAgainst);
    
    allPairings.push(...groupPairings.paired);
    unpairedPlayers.push(...groupPairings.unpaired);
  }
  
  // Ahora manejar jugadores no emparejados
  // Intentar emparejar entre grupos cercanos
  if (unpairedPlayers.length > 0) {
    const crossPairings = pairCrossGroups(unpairedPlayers, playedAgainst);
    allPairings.push(...crossPairings.paired);
    
    // Si aún quedan jugadores sin emparejar
    if (crossPairings.unpaired.length > 0) {
      if (allowByes && crossPairings.unpaired.length === 1) {
        // Un solo jugador sin emparejar = bye
        allPairings.push([crossPairings.unpaired[0], null]);
      } else {
        // Más de uno sin emparejar = forzar pairings aunque se repitan
        const forced = forcePairings(crossPairings.unpaired);
        allPairings.push(...forced);
      }
    }
  }
  
  return {
    success: true,
    pairings: allPairings,
    conflicts: 0, // TODO: contar repeticiones
  };
}

/**
 * Empareja jugadores dentro de un grupo
 */
function pairGroup(
  players: Player[],
  playedAgainst: Map<string, Set<string>>
): { paired: Array<[Player, Player]>; unpaired: Player[] } {
  const paired: Array<[Player, Player]> = [];
  const unpaired: Player[] = [];
  const used = new Set<string>();
  
  // Ordenar jugadores por número de oponentes disponibles (menos opciones primero)
  const sorted = [...players].sort((a, b) => {
    const aPlayed = playedAgainst.get(a.id)?.size || 0;
    const bPlayed = playedAgainst.get(b.id)?.size || 0;
    return bPlayed - aPlayed;
  });
  
  for (const player of sorted) {
    if (used.has(player.id)) continue;
    
    // Encontrar oponente que no haya jugado antes
    const played = playedAgainst.get(player.id) || new Set();
    let opponent: Player | null = null;
    
    for (const candidate of sorted) {
      if (candidate.id === player.id) continue;
      if (used.has(candidate.id)) continue;
      if (!played.has(candidate.id)) {
        opponent = candidate;
        break;
      }
    }
    
    if (opponent) {
      paired.push([player, opponent]);
      used.add(player.id);
      used.add(opponent.id);
    } else {
      unpaired.push(player);
    }
  }
  
  return { paired, unpaired };
}

/**
 * Empareja jugadores entre diferentes grupos de puntos
 */
function pairCrossGroups(
  players: Player[],
  playedAgainst: Map<string, Set<string>>
): { paired: Array<[Player, Player]>; unpaired: Player[] } {
  const result = pairGroup(players, playedAgainst);
  return {
    paired: result.paired,
    unpaired: result.unpaired,
  };
}

/**
 * Fuerza pairings para jugadores restantes (permite repeticiones)
 */
function forcePairings(players: Player[]): Array<[Player, Player]> {
  const pairings: Array<[Player, Player]> = [];
  
  for (let i = 0; i < players.length - 1; i += 2) {
    pairings.push([players[i], players[i + 1]]);
  }
  
  return pairings;
}
