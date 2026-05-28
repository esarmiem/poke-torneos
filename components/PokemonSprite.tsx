// ============================================
// COMPONENTE SPRITE DE POKÉMON
// ============================================

interface PokemonSpriteProps {
  name: string;
  src: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "decorative" | "floating";
  className?: string;
  showLink?: boolean;
}

const sizeClasses = {
  xs: "w-4 h-4",
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
  xl: "w-12 h-12",
};

const variantClasses = {
  default: "transition-transform hover:scale-110",
  decorative: "opacity-80 grayscale-[0.3] hover:grayscale-0 hover:opacity-100 transition-all",
  floating: "animate-bounce-slow hover:animate-none",
};

export function PokemonSprite({
  name,
  src,
  size = "sm",
  variant = "default",
  className = "",
  showLink = true,
}: PokemonSpriteProps) {
  const sprite = (
    <span
      className={`inline-block ${variantClasses[variant]} ${className}`}
      title={name}
    >
      <img
        src={src}
        alt={name}
        className={`${sizeClasses[size]} object-contain`}
        loading="lazy"
      />
    </span>
  );

  if (showLink) {
    return (
      <a
        href={`https://pokemondb.net/pokedex/${name.toLowerCase().replace(/\s+/g, '-')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block"
      >
        {sprite}
      </a>
    );
  }

  return sprite;
}

// Sprites predefinidos para uso rápido
export const sprites = {
  // Legendarios y especiales
  mew: {
    name: "Mew",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/mew.png",
  },
  mewtwo: {
    name: "Mewtwo",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/mewtwo.png",
  },
  lugia: {
    name: "Lugia",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/lugia.png",
  },
  hoOh: {
    name: "Ho-Oh",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/ho-oh.png",
  },
  rayquaza: {
    name: "Rayquaza",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/rayquaza.png",
  },
  dialga: {
    name: "Dialga",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/dialga.png",
  },
  palkia: {
    name: "Palkia",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/palkia.png",
  },
  giratina: {
    name: "Giratina",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/giratina.png",
  },
  zekrom: {
    name: "Zekrom",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/zekrom.png",
  },
  reshiram: {
    name: "Reshiram",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/reshiram.png",
  },
  kyurem: {
    name: "Kyurem",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/kyurem.png",
  },
  xerneas: {
    name: "Xerneas",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/xerneas.png",
  },
  yveltal: {
    name: "Yveltal",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/yveltal.png",
  },
  zygarde: {
    name: "Zygarde",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/zygarde.png",
  },
  solgaleo: {
    name: "Solgaleo",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/solgaleo.png",
  },
  lunala: {
    name: "Lunala",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/lunala.png",
  },
  necrozma: {
    name: "Necrozma",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/necrozma.png",
  },
  zacian: {
    name: "Zacian",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/zacian.png",
  },
  zamazenta: {
    name: "Zamazenta",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/zamazenta.png",
  },
  eternatus: {
    name: "Eternatus",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/eternatus.png",
  },
  koraidon: {
    name: "Koraidon",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/koraidon.png",
  },
  miraidon: {
    name: "Miraidon",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/miraidon.png",
  },

  // Iniciales populares
  pikachu: {
    name: "Pikachu",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/pikachu.png",
  },
  eevee: {
    name: "Eevee",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/eevee.png",
  },
  charizard: {
    name: "Charizard",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/charizard.png",
  },
  blastoise: {
    name: "Blastoise",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/blastoise.png",
  },
  venusaur: {
    name: "Venusaur",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/venusaur.png",
  },

  // Más Pokémon populares
  lucario: {
    name: "Lucario",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/lucario.png",
  },
  greninja: {
    name: "Greninja",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/greninja.png",
  },
  incineroar: {
    name: "Incineroar",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/incineroar.png",
  },
  garchomp: {
    name: "Garchomp",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/garchomp.png",
  },
  metagross: {
    name: "Metagross",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/metagross.png",
  },
  dragonite: {
    name: "Dragonite",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/dragonite.png",
  },
  salamence: {
    name: "Salamence",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/salamence.png",
  },
  hydreigon: {
    name: "Hydreigon",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/hydreigon.png",
  },
  goodra: {
    name: "Goodra",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/goodra.png",
  },

  // TCG specific
  snorlax: {
    name: "Snorlax",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/snorlax.png",
  },
  lapras: {
    name: "Lapras",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/lapras.png",
  },
  scizor: {
    name: "Scizor",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/scizor.png",
  },
  kingdra: {
    name: "Kingdra",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/kingdra.png",
  },
  tyranitar: {
    name: "Tyranitar",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/tyranitar.png",
  },
  lugiaVStar: {
    name: "Lugia",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/lugia.png",
  },
  palkiaVStar: {
    name: "Palkia",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/palkia.png",
  },
  arceusVStar: {
    name: "Arceus",
    src: "https://img.pokemondb.net/sprites/scarlet-violet/normal/arceus.png",
  },
};

// Helpers para usar sprites aleatorios
export function getRandomSprite(): { name: string; src: string } {
  const keys = Object.keys(sprites);
  const randomKey = keys[Math.floor(Math.random() * keys.length)] as keyof typeof sprites;
  return sprites[randomKey];
}

export function getRandomLegendary(): { name: string; src: string } {
  const legendaryKeys = [
    "mew", "mewtwo", "lugia", "hoOh", "rayquaza", "dialga", "palkia",
    "giratina", "zekrom", "reshiram", "kyurem", "xerneas", "yveltal",
    "zygarde", "solgaleo", "lunala", "necrozma", "zacian", "zamazenta",
    "eternatus", "koraidon", "miraidon"
  ] as const;
  const randomKey = legendaryKeys[Math.floor(Math.random() * legendaryKeys.length)];
  return sprites[randomKey];
}
