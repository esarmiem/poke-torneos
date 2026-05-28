// ============================================
// LÓGICA DE STANDINGS Y TIEBREAKERS
// ============================================

import type { Player, Match, Round, PlayerStanding } from "./types";

// ============================================
// UTILIDADES
// ============================================

/**
 * Obtiene el oponente de un match para un jugador dado
 */
function getOpponentId(match: Match, playerId: string): string | null {
  if (match.player1Id === playerId) return match.player2Id;
  if (match.player2Id === playerId) return match.player1Id;
  return null;
}

/**
 * Determina si un jugador ganó un match
 */
function isWinner(match: Match, playerId: string): boolean {
  if (match.result === null) return false;
  if (match.player1Id === playerId) {
    return match.result === "P1_WIN" || match.result === "P1_BYE";
  }
  if (match.player2Id === playerId) {
    return match.result === "P2_WIN" || match.result === "P2_BYE";
  }
  return false;
}

/**
 * Determina si un jugador empató un match
 */
function isTie(match: Match, playerId: string): boolean {
  if (match.result !== "TIE") return false;
  return match.player1Id === playerId || match.player2Id === playerId;
}

/**
 * Determina si un jugador recibió bye
 */
function isBye(match: Match, playerId: string): boolean {
  if (match.result === null) return false;
  if (match.player1Id === playerId) {
    return match.result === "P1_BYE";
  }
  if (match.player2Id === playerId) {
    return match.result === "P2_BYE";
  }
  return false;
}

/**
 * Obtiene los puntos de un match para un jugador
 */
function getMatchPoints(match: Match, playerId: string, settings: { pointsWin: number; pointsTie: number; pointsLoss: number }): number {
  if (match.result === null) return 0;
  
  const isP1 = match.player1Id === playerId;
  const isP2 = match.player2Id === playerId;
  
  if (!isP1 && !isP2) return 0;
  
  switch (match.result) {
    case "P1_WIN":
      return isP1 ? settings.pointsWin : settings.pointsLoss;
    case "P2_WIN":
      return isP2 ? settings.pointsWin : settings.pointsLoss;
    case "TIE":
      return settings.pointsTie;
    case "P1_BYE":
      return isP1 ? settings.pointsWin : 0;
    case "P2_BYE":
      return isP2 ? settings.pointsWin : 0;
    default:
      return 0;
  }
}

// ============================================
// CÁLCULO DE STANDINGS
// ============================================

export interface StandingsOptions {
  pointsWin: number;
  pointsTie: number;
  pointsLoss: number;
}

/**
 * Calcula los standings completos de un torneo
 */
export function calculateStandings(
  players: Player[],
  rounds: Round[],
  settings: StandingsOptions,
  previousStandings?: PlayerStanding[]
): PlayerStanding[] {
  // Filtrar jugadores activos (no dropped) para standings
  const activePlayers = players.filter(p => !p.dropped);
  
  const standings: PlayerStanding[] = activePlayers.map(player => {
    let matchPoints = 0;
    let wins = 0;
    let losses = 0;
    let ties = 0;
    let byes = 0;
    const opponentsIds: string[] = [];
    const roundResults: PlayerStanding["roundResults"] = [];

    // Recorrer todas las rondas y matches
    for (const round of rounds) {
      const playerMatch = round.matches.find(
        m => m.player1Id === player.id || m.player2Id === player.id
      );

      if (!playerMatch) {
        // Jugador no tuvo match en esta ronda
        roundResults.push({
          round: round.number,
          result: "-",
          points: 0,
        });
        continue;
      }

      const points = getMatchPoints(playerMatch, player.id, settings);
      matchPoints += points;

      // Registrar oponente
      const opponentId = getOpponentId(playerMatch, player.id);
      if (opponentId) {
        opponentsIds.push(opponentId);
      }

      // Contabilizar resultado
      if (isBye(playerMatch, player.id)) {
        byes++;
        wins++; // Bye cuenta como victoria
        roundResults.push({
          round: round.number,
          result: "BYE",
          points,
          opponentId: undefined,
        });
      } else if (isWinner(playerMatch, player.id)) {
        wins++;
        roundResults.push({
          round: round.number,
          result: "W",
          points,
          opponentId: opponentId || undefined,
        });
      } else if (isTie(playerMatch, player.id)) {
        ties++;
        roundResults.push({
          round: round.number,
          result: "T",
          points,
          opponentId: opponentId || undefined,
        });
      } else {
        losses++;
        roundResults.push({
          round: round.number,
          result: "L",
          points,
          opponentId: opponentId || undefined,
        });
      }
    }

    // Calcular opponent's win percentage
    let opponentsWinPercent = 0;
    if (opponentsIds.length > 0) {
      // Calcular el win% de cada oponente
      const opponentPercentages = opponentsIds.map(oppId => {
        // Encontrar todos los matches del oponente
        let oppWins = 0;
        let oppLosses = 0;
        let oppTies = 0;
        
        for (const r of rounds) {
          const oppMatch = r.matches.find(
            m => (m.player1Id === oppId || m.player2Id === oppId) && m.status === "DONE"
          );
          
          if (oppMatch && oppMatch.result) {
            const isP1 = oppMatch.player1Id === oppId;
            
            if (oppMatch.result === "TIE") {
              oppTies++;
            } else if (oppMatch.result === "P1_WIN" || oppMatch.result === "P1_BYE") {
              if (isP1) oppWins++;
              else oppLosses++;
            } else if (oppMatch.result === "P2_WIN" || oppMatch.result === "P2_BYE") {
                  if (!isP1) oppWins++;
              else oppLosses++;
                }
          }
        }
        
        const totalMatches = oppWins + oppLosses + oppTies;
        if (totalMatches === 0) return 0;
        
        // Win% = (Wins + 0.5 * Ties) / Total Matches
        return (oppWins + 0.5 * oppTies) / totalMatches;
      });
      
      opponentsWinPercent = opponentPercentages.reduce((a, b) => a + b, 0) / opponentPercentages.length;
    }

    // Encontrar ranking anterior para mostrar cambio
    let previousRank: number | undefined;
    if (previousStandings) {
      const prev = previousStandings.find(s => s.playerId === player.id);
      if (prev) {
        previousRank = prev.rank;
      }
    }

    return {
      playerId: player.id,
      player,
      rank: 0, // Se asigna después del sort
      matchPoints,
      wins,
      losses,
      ties,
      byes,
      opponentsWinPercent,
      roundResults,
      previousRank,
    };
  });

  // Ordenar standings según criterios de desempate
  standings.sort((a, b) => {
    // 1. Match Points (descendente)
    if (b.matchPoints !== a.matchPoints) {
      return b.matchPoints - a.matchPoints;
    }

    // 2. Opponent's Win Percentage (descendente)
    if (b.opponentsWinPercent !== a.opponentsWinPercent) {
      return b.opponentsWinPercent - a.opponentsWinPercent;
    }

    // 3. Número de victorias (descendente)
    if (b.wins !== a.wins) {
      return b.wins - a.wins;
    }

    // 4. Head-to-head (solo si jugaron entre ellos)
    const h2hResult = getHeadToHeadResult(a.playerId, b.playerId, rounds);
    if (h2hResult !== 0) {
      return h2hResult;
    }

    // 5. Orden alfabético como último recurso (estable)
    return a.player.nombre.localeCompare(b.player.nombre);
  });

  // Asignar rankings
  standings.forEach((s, index) => {
    s.rank = index + 1;
  });

  return standings;
}

/**
 * Determina el resultado head-to-head entre dos jugadores
 * Retorna: 1 si player1 ganó, -1 si player2 ganó, 0 si no jugaron o empataron
 */
function getHeadToHeadResult(player1Id: string, player2Id: string, rounds: Round[]): number {
  for (const round of rounds) {
    const match = round.matches.find(
      m => (m.player1Id === player1Id && m.player2Id === player2Id) ||
           (m.player1Id === player2Id && m.player2Id === player1Id)
    );

    if (match && match.result) {
      if (match.result === "TIE") return 0;
      
      const p1Won = match.result === "P1_WIN" || match.result === "P1_BYE";
      const p2Won = match.result === "P2_WIN" || match.result === "P2_BYE";
      
      if (match.player1Id === player1Id) {
        return p1Won ? -1 : 1; // Invertimos porque el sort es descendente
      } else {
        return p2Won ? -1 : 1;
      }
    }
  }
  return 0;
}

/**
 * Calcula el porcentaje de victorias de un jugador
 */
export function calculateWinPercent(standing: PlayerStanding): number {
  const totalMatches = standing.wins + standing.losses + standing.ties;
  if (totalMatches === 0) return 0;
  return standing.wins / totalMatches;
}

/**
 * Formatea los standings para exportación/visualización
 */
export function formatStandingsForDisplay(standings: PlayerStanding[]): Array<{
  rank: number;
  name: string;
  points: number;
  record: string;
  opponentWinPercent: string;
}> {
  return standings.map(s => ({
    rank: s.rank,
    name: s.player.nombre,
    points: s.matchPoints,
    record: `${s.wins}-${s.losses}-${s.ties}`,
    opponentWinPercent: `${(s.opponentsWinPercent * 100).toFixed(2)}%`,
  }));
}
