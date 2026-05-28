// ============================================
// PÁGINA DE GUÍA PARA ADMINISTRADORES
// ============================================

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PokemonSprite, sprites } from "@/components/PokemonSprite";
import { 
  BookOpen, 
  ChevronLeft, 
  Users, 
  Trophy, 
  Swords,
  Settings,
  Target,
  Timer,
  AlertCircle,
  CheckCircle2,
  HelpCircle
} from "lucide-react";

export default function GuidePage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/settings")}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Guía para Administradores
            <PokemonSprite {...sprites.pikachu} size="xl" variant="decorative" />
          </h1>
          <p className="text-slate-600">
            Todo lo que necesitas saber para organizar torneos como un profesional
          </p>
        </div>
      </div>

      {/* Introducción */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <h2 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
          ¿Qué es Poke Torneos?
        </h2>
        <p className="text-blue-800 leading-relaxed">
          <strong>Poke Torneos</strong> es una aplicación diseñada para organizar torneos de Pokémon TCG 
          (Trading Card Game) de forma sencilla y profesional. Utiliza el sistema de emparejamientos 
          <strong>Swiss</strong> (suizo), el estándar en competiciones de Pokémon, para garantizar 
          que todos los jugadores jueguen partidas equilibradas.
        </p>
      </Card>

      {/* Glosario de Términos */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Glosario de Términos para Principiantes
        </h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Swords className="w-4 h-4 text-blue-600" />
              Sistema Swiss (Suizo)
            </h3>
            <p className="text-slate-600 mt-1 text-sm">
              Es el formato de torneo más común en Pokémon TCG. En cada ronda, los jugadores 
              con resultados similares se enfrentan entre sí. No hay eliminación: todos juegan 
              todas las rondas, ganen o pierdan. Esto garantiza que nadie se quede sin jugar 
              después de una derrota.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-600" />
              Match Points (Puntos de Partida)
            </h3>
            <p className="text-slate-600 mt-1 text-sm">
              Son los puntos que obtienes por el resultado de cada partida:
            </p>
            <ul className="text-sm text-slate-600 mt-2 space-y-1 ml-4">
              <li><strong>Victoria:</strong> 3 puntos</li>
              <li><strong>Empate:</strong> 1 punto</li>
              <li><strong>Derrota:</strong> 0 puntos</li>
              <li><strong>BYE (descanso):</strong> 3 puntos (cuenta como victoria)</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-green-600" />
              Opponents&apos; Win % (Porcentaje de Victoria de Oponentes)
            </h3>
            <p className="text-slate-600 mt-1 text-sm">
              Es el primer criterio de desempate. Se calcula promediando el porcentaje 
              de victorias de todos los oponentes contra los que has jugado. 
              Sirve para diferenciar jugadores con los mismos puntos: si jugaste 
              contra oponentes m&aacute;s fuertes (que ganaron m&aacute;s), tendr&aacute;s un porcentaje m&aacute;s alto.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              BYE (Descanso)
            </h3>
            <p className="text-slate-600 mt-1 text-sm">
              Cuando hay un n&uacute;mero impar de jugadores, uno de ellos recibe un &quot;BYE&quot; 
              (descanso autom&aacute;tico). Esto significa que no juega esa ronda pero 
              recibe 3 puntos (como si hubiera ganado). Normalmente se asigna al 
              jugador con menos puntos que a&uacute;n no ha recibido BYE.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              Drop (Abandono)
            </h3>
            <p className="text-slate-600 mt-1 text-sm">
              Un jugador puede &quot;hacer drop&quot; (abandonar) el torneo en cualquier momento. 
              Esto significa que ya no jugar&aacute; m&aacute;s rondas. Sus resultados anteriores 
              se mantienen, pero no aparecer&aacute; en los emparejamientos futuros. 
              Esto es &uacute;til si alguien debe irse antes de que termine el torneo.
            </p>
          </div>
        </div>
      </Card>

      {/* Cómo Usar la Aplicación */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          Cómo Usar la Aplicación Paso a Paso
        </h2>
        
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">1</div>
            <div>
              <h3 className="font-semibold text-slate-900">Crear el Torneo</h3>
              <p className="text-slate-600 text-sm mt-1">
                Ve a &quot;Configuraci&oacute;n&quot; y crea un nuevo torneo. Elige un nombre descriptivo 
                (ej: &quot;Torneo Liga Play - 25 Mayo&quot;). Configura el tiempo por ronda 
                (normalmente 50 minutos para Pok&eacute;mon TCG).
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">2</div>
            <div>
              <h3 className="font-semibold text-slate-900">Registrar Jugadores</h3>
              <p className="text-slate-600 text-sm mt-1">
                En la misma p&aacute;gina de &quot;Configuraci&oacute;n&quot;, agrega todos los jugadores. 
                Solo el nombre es obligatorio, pero puedes agregar ID de jugador, 
                divisi&oacute;n (Juniors/Seniors/Masters), y el deck que van a usar. 
                Cuando tengas al menos 2 jugadores, haz clic en &quot;Iniciar Torneo&quot;.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">3</div>
            <div>
              <h3 className="font-semibold text-slate-900">Crear Rondas y Emparejamientos</h3>
              <p className="text-slate-600 text-sm mt-1">
                Ve a la secci&oacute;n &quot;Rondas&quot; y haz clic en &quot;Crear Primera Ronda&quot;. 
                El sistema autom&aacute;ticamente emparejar&aacute; a los jugadores (aleatorio en 
                la primera ronda, por puntos en las siguientes). Si hay un n&uacute;mero 
                impar de jugadores, uno recibir&aacute; BYE autom&aacute;ticamente.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">4</div>
            <div>
              <h3 className="font-semibold text-slate-900">Ingresar Resultados</h3>
              <p className="text-slate-600 text-sm mt-1">
                Haz clic en una ronda para ver los emparejamientos. Para cada mesa, 
                selecciona el resultado: P1 Gana, P2 Gana, Empate, o BYE. 
                Los puntos se calculan automáticamente (3 por victoria, 1 por empate, 
                0 por derrota). Cuando todos los resultados estén ingresados, 
                finaliza la ronda.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">5</div>
            <div>
              <h3 className="font-semibold text-slate-900">Ver Clasificación</h3>
              <p className="text-slate-600 text-sm mt-1">
                La secci&oacute;n &quot;Clasificaci&oacute;n&quot; muestra la tabla de standings actualizada 
                en tiempo real. Muestra: Rank, Jugador, Puntos, Record (Victorias-Derrotas-Empates), 
                y Opponents&apos; Win % (desempate). Puedes exportar la tabla a CSV para 
                compartir o imprimir.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">6</div>
            <div>
              <h3 className="font-semibold text-slate-900">Siguientes Rondas y Finalización</h3>
              <p className="text-slate-600 text-sm mt-1">
                Repite el proceso de crear ronda → ingresar resultados → ver clasificación 
                hasta completar todas las rondas necesarias. Como regla general, el número 
                de rondas debe ser suficiente para que solo quede un jugador invicto 
                (típicamente log₂ del número de jugadores, redondeado hacia arriba). 
                ¡Al finalizar, felicita a los ganadores!
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Consejos para Hosts */}
      <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <h2 className="text-xl font-semibold text-amber-900 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Consejos para ser un Buen Host
        </h2>
        
        <div className="space-y-3">
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-amber-800 text-sm">
              <strong>Comunica claramente:</strong> Anuncia las reglas del torneo, formato, 
              premios y horarios antes de comenzar. Asegúrate de que todos entiendan el sistema de puntos.
            </p>
          </div>
          
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-amber-800 text-sm">
              <strong>Sé puntual:</strong> Comienza las rondas a la hora anunciada. 
              Respeta el tiempo de los jugadores y mantén el torneo fluido.
            </p>
          </div>
          
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-amber-800 text-sm">
              <strong>Resuelve disputas justamente:</strong> Como host, eres el juez final. 
              Escucha ambas partes, consulta las reglas oficiales de Pokémon TCG si es necesario, 
              y toma decisiones imparciales.
            </p>
          </div>
          
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-amber-800 text-sm">
              <strong>Mantén el ambiente positivo:</strong> Fomenta el juego limpio, 
              el respeto mutuo y la diversión. Felicita a los ganadores y reconoce 
              el esfuerzo de todos los participantes.
            </p>
          </div>
        </div>
      </Card>

      {/* FAQ */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
          Preguntas Frecuentes (FAQ)
        </h2>
        
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-semibold text-slate-900 mb-2">
              ¿Cuántas rondas debo hacer para mi torneo?
            </h3>
            <p className="text-slate-600 text-sm">
              La regla general es usar log₂ del número de jugadores, redondeando hacia arriba. 
              Por ejemplo: 8 jugadores → 3 rondas, 16 jugadores → 4 rondas, 32 jugadores → 5 rondas. 
              Esto asegura que solo quede un invicto al final. Para torneos casuales, 
              3-4 rondas suele ser suficiente.
            </p>
          </div>

          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-semibold text-slate-900 mb-2">
              ¿Qué pasa si un jugador no se presenta a su partida?
            </h3>
            <p className="text-slate-600 text-sm">
              Si un jugador no aparece después de un tiempo razonable (generalmente 5-10 minutos), 
              puedes marcar la partida como victoria para el jugador presente (P1 o P2 según corresponda). 
              Si ambos faltan, marca la partida como empate (1 punto para cada uno) o decide según 
              las reglas de tu tienda/comunidad.
            </p>
          </div>

          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-semibold text-slate-900 mb-2">
              ¿Puedo editar los resultados después de ingresarlos?
            </h3>
            <p className="text-slate-600 text-sm">
              ¡Sí! Si te das cuenta de un error, simplemente vuelve a la ronda correspondiente, 
              encuentra la mesa con el resultado incorrecto y selecciona el resultado correcto. 
              Los standings se actualizarán automáticamente. Es buena práctica verificar 
              los resultados con los jugadores antes de finalizar cada ronda.
            </p>
          </div>

          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-semibold text-slate-900 mb-2">
              &iquest;Qu&eacute; significa &quot;Opp Win %&quot; y por qu&eacute; es importante?
            </h3>
            <p className="text-slate-600 text-sm">
              &quot;Opp Win %&quot; (Opponents&apos; Win Percentage) es el porcentaje de victorias de tus oponentes. 
              Es el principal criterio de desempate. Sirve para diferenciar jugadores con los mismos puntos: 
              si jugaste contra oponentes que ganaron m&aacute;s partidas, tu Opp Win % ser&aacute; m&aacute;s alto, 
              lo que indica que tuviste una ruta m&aacute;s dif&iacute;cil. Esto premia a quienes enfrentaron 
              competencia m&aacute;s fuerte.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-2">
              ¿Puedo usar esta app para otros juegos de cartas?
            </h3>
            <p className="text-slate-600 text-sm">
              ¡Absolutamente! Aunque está diseñada pensando en Pokémon TCG, la app funciona perfectamente 
              para cualquier juego de cartas que use el sistema de emparejamientos Swiss. 
              Magic: The Gathering, Yu-Gi-Oh!, Digimon, Flesh and Blood... ¡todos son compatibles! 
              Solo configura los jugadores y el sistema hará el resto.
            </p>
          </div>
        </div>
      </Card>

      {/* Recursos Adicionales */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <h2 className="text-lg font-semibold text-green-900 mb-3 flex items-center gap-2">
          <Timer className="w-5 h-5" />
          ¿Necesitas más ayuda?
        </h2>
        <p className="text-green-800 text-sm mb-4">
          Si tienes preguntas adicionales o encuentras algún problema, aquí hay algunos recursos:
        </p>
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm text-green-800">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            <span>Consulta las reglas oficiales de Pokémon TCG en el sitio de Play! Pokémon</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-green-800">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            <span>Visita comunidades locales de Pokémon TCG para consejos de organizadores experimentados</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-green-800">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            <span>¡Practica! Organiza torneos pequeños con amigos para familiarizarte con la app</span>
          </div>
        </div>
      </Card>

      {/* Botón de vuelta */}
      <div className="flex justify-center">
        <Button onClick={() => router.push("/settings")} variant="outline" size="lg">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Volver a Ajustes
        </Button>
      </div>
    </div>
  );
}
