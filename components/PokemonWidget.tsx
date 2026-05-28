// ============================================
// WIDGET DE POKÉMON ALEATORIO ANIMADO
// ============================================

"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const POKEMON_COUNT = 1010;
const UPDATE_INTERVAL_MS = 5 * 60 * 1000;

const SPRITE_BASE_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown";

interface PokemonState {
  id: number;
  name: string;
  spriteUrl: string;
}

function getRandomPokemonId(): number {
  return Math.floor(Math.random() * POKEMON_COUNT) + 1;
}

function capitalizeName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

async function fetchRandomPokemon(): Promise<PokemonState | null> {
  try {
    const randomId = getRandomPokemonId();
    console.log("🎲 [PokemonWidget]: Fetching Pokemon ID:", randomId);

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon: ${response.status}`);
    }

    const data = await response.json();

    const newPokemon: PokemonState = {
      id: data.id,
      name: capitalizeName(data.name),
      spriteUrl: `${SPRITE_BASE_URL}/${data.id}.gif`,
    };

    console.log("✅ [PokemonWidget]: Loaded Pokemon:", newPokemon.name);
    return newPokemon;
  } catch (error) {
    console.error("❌ [PokemonWidget]: Error fetching Pokemon:", error);
    return null;
  }
}

export function PokemonWidget() {
  const [pokemon, setPokemon] = useState<PokemonState | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const hasInitialized = useRef(false);

  const updatePokemon = useCallback(async () => {
    setIsTransitioning(true);

    setTimeout(async () => {
      const newPokemon = await fetchRandomPokemon();
      if (newPokemon) {
        setPokemon(newPokemon);
        setIsVisible(true);
      }
      setIsTransitioning(false);
    }, 300);
  }, []);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    updatePokemon();

    const intervalId = setInterval(updatePokemon, UPDATE_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [updatePokemon]);

  if (!pokemon) {
    return null;
  }

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-50
        transition-all duration-300 ease-in-out
        ${isVisible && !isTransitioning ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
    >
      <div className="relative group">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {pokemon.name}
        </div>

        <div className="rounded-2xl p-3 hover:shadow-xl transition-shadow">
          <div className="relative">
            <img
              key={pokemon.id}
              src={pokemon.spriteUrl}
              alt={`Pokemon ${pokemon.name} animated`}
              className={`
                w-20 h-20 object-contain
                ${isTransitioning ? "scale-75 opacity-0" : "scale-100 opacity-100"}
                transition-all duration-300
              `}
              onError={(e) => {
                console.warn("⚠️ [PokemonWidget]: Failed to load sprite for Pokemon ID:", pokemon.id);
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
