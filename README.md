# Poke Torneos

Gestor de torneos de **Pokémon TCG** construido con **Next.js** + **React** + **Tailwind CSS**.

Diseñado para eventos locales y casuales donde necesitas una interfaz rápida, **soporte offline** y un **botón de reinicio** cuando el torneo termina.

> **Regla clave:** los datos del torneo **persisten** entre recargas y navegación. La app **solo limpia `localStorage`** cuando el usuario hace clic en **"Nuevo torneo"** (con confirmación).

---

## Características

### Gestión del Torneo
- Crear torneos con nombre personalizado
- Formatos: **Swiss** (todalas rondas) o **Swiss + Top Cut** (eliminación directa)
- Configuración de puntos: Victoria = 3, Empate = 1, Derrota = 0
- Timer de ronda con cuenta regresiva (configurable)

### Gestión de Jugadores
- Agregar, editar y eliminar jugadores
- Campos: nombre, ID de jugador (opcional), división ( Juniors / Seniors / Masters / Open), deck, notas
- Marcar jugadores como **Dropped** (abandono)
- Validación para prevenir nombres duplicados

### Emparejamientos Swiss
- Emparejamiento aleatorio en la primera ronda
- Emparejamiento por puntuación en rondas siguientes
- Asignación automática de **BYE** al jugador con menos puntos que no ha recibido uno
- Evita enfrentar jugadores que ya se han enfrentado

### Clasificación (Standings)
- Tabla con ranking en tiempo real
- Columnas por ronda (R1, R2, R3...) mostrando W/L/D y puntos
- Puntos totales + **Opponents' Win %** (criterio de desempate)
- Verificación de cambio de posición entre rondas (↑ ↓)

### Persistencia
- Estado guardado en `localStorage`
- Recargar la página o cambiar la URL **no** reinicia el torneo
- Solo "Nuevo torneo" limpia el almacenamiento

### Import / Export
- Exportar torneo como JSON (backup, compartir, imprimir)
- Importar torneo desde JSON

---

## Tecnologías

- **Next.js 16** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS**
- **Zustand** para estado global + persistencia
- **date-fns** para formateo de fechas

---

## Inicio Rápido

### 1. Clonar e instalar dependencias

```bash
pnpm install
```

### 2. Iniciar el servidor de desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 3. Scripts disponibles

```bash
pnpm dev       # Desarrollo local
pnpm build     # Build de producción
pnpm start     # Iniciar build de producción
pnpm lint      # Linting
```

---

## Estructura del Proyecto

```
tcg-torneos/
├── app/
│   ├── page.tsx              # Dashboard principal
│   ├── setup/page.tsx        # Configuración del torneo + jugadores
│   ├── rounds/page.tsx        # Lista de rondas
│   ├── rounds/[roundId]/page.tsx  # Emparejamientos + resultados
│   ├── standings/page.tsx     # Tabla de clasificación
│   ├── settings/page.tsx     # Export/Import + Reiniciar
│   └── guide/page.tsx        # Guía para administradores
├── components/
│   ├── ui/                   # Componentes UI base
│   ├── Navigation.tsx        # Navegación
│   └── PokemonSprite.tsx    # Sprites decorativos
└── lib/
    ├── domain/
    │   ├── types.ts          # Tipos TypeScript
    │   ├── pairings.ts       # Algoritmo de emparejamientos
    │   └── standings.ts      # Cálculo de clasificación
    └── store/
        └── tournamentStore.ts  # Zustand store
```

---

## Sistema de Puntos

| Resultado | Puntos |
|-----------|--------|
| Victoria  | 3      |
| Empate    | 1      |
| Derrota   | 0      |
| BYE       | 3      |

### Criterios de Desempate

1. **Match Points** (puntos totales)
2. **Opponents' Win %** (porcentaje de victorias de los oponentes)
3. **Head-to-head** (solo si los empatados jugaron entre sí)

---

## Reglas de Emparejamiento Swiss

### Ronda 1
- Emparejamiento aleatorio (shuffle de jugadores)
- Si hay número impar: un jugador recibe **BYE**

### Rondas Siguientes
- Ordenar por: puntos (desc) → tiebreakers (desc)
- Emparejar de arriba hacia abajo evitando:
  - Repetir oponentes
  - Cruzar grupos de puntuación (si es posible)
- Si hay número impar: **BYE** al jugador con menos puntos que no haya recibido uno

---

## Guía de Uso

### 1. Crear el Torneo
Ve a **Configuración** y crea un nuevo torneo. Elige un nombre descriptivo y configura el tiempo por ronda (normalmente 50 minutos para Pokémon TCG).

### 2. Registrar Jugadores
En la misma página, agrega todos los jugadores. Solo el nombre es obligatorio. Cuando tengas al menos 2 jugadores, haz clic en **Iniciar Torneo**.

### 3. Crear Rondas
Ve a **Rondas** y haz clic en **Crear Primera Ronda**. El sistema emparejará automáticamente.

### 4. Ingresar Resultados
Haz clic en una ronda para ver los emparejamientos. Selecciona el resultado para cada mesa. Los puntos se calculan automáticamente.

### 5. Ver Clasificación
La sección **Clasificación** muestra la tabla actualizada en tiempo real.

---

## Formato Top Cut (Opcional)

Si seleccionas el formato **Swiss + Top Cut**, después de completar las rondas Swiss:

1. Se seleccionan los mejores jugadores (4, 8, 16 según configuración)
2. El bracket de eliminación directa se genera automáticamente
3. Los emparejamientos son: 1ro vs último, 2do vs penúltimo, etc.

---

## Licencia

MIT
