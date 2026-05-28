// ============================================
// UTILIDADES
// ============================================

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de Tailwind con merge inteligente
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatea una fecha a string legible
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Formatea un tiempo en segundos a MM:SS
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Genera un ID único corto
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Ordena un array de forma aleatoria (Fisher-Yates)
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Calcula el número recomendado de rondas Swiss según número de jugadores
 * Fórmula: log2(n) redondeado hacia arriba, mínimo 3, máximo 9
 */
export function calculateRecommendedRounds(playerCount: number): number {
  if (playerCount <= 4) return 3;
  const rounds = Math.ceil(Math.log2(playerCount));
  return Math.min(Math.max(rounds, 3), 9);
}

/**
 * Valida que un nombre de jugador no esté duplicado
 */
export function isDuplicateName(
  name: string,
  players: { nombre: string; id?: string }[],
  excludeId?: string
): boolean {
  const normalizedName = name.trim().toLowerCase();
  return players.some(
    p => p.nombre.trim().toLowerCase() === normalizedName && p.id !== excludeId
  );
}

/**
 * Exporta datos a formato JSON para descarga
 */
export function exportToJSON(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Lee un archivo JSON desde un input file
 */
export function readJSONFile(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(new Error("El archivo no contiene JSON válido"));
      }
    };
    reader.onerror = () => reject(new Error("Error al leer el archivo"));
    reader.readAsText(file);
  });
}
